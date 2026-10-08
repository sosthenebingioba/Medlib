import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const MALIPO_API_URL = "https://api.malipo.dev/v1";

function getAdminSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Configuration Supabase serveur manquante."
    );
  }

  return createClient(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

function verifyMalipoSignature(
  rawBody: string,
  timestamp: string,
  signature: string,
  secret: string
) {
  const timestampMs = Date.parse(timestamp);

  if (Number.isNaN(timestampMs)) {
    return false;
  }

  const difference = Math.abs(
    Date.now() - timestampMs
  );

  if (difference > 5 * 60 * 1000) {
    return false;
  }

  const signedPayload =
    `${timestamp}.${rawBody}`;

  const expectedSignature =
    createHmac("sha256", secret)
      .update(signedPayload)
      .digest("hex");

  const expectedBuffer =
    Buffer.from(
      expectedSignature,
      "utf8"
    );

  const receivedBuffer =
    Buffer.from(
      signature,
      "utf8"
    );

  if (
    expectedBuffer.length !==
    receivedBuffer.length
  ) {
    return false;
  }

  return timingSafeEqual(
    expectedBuffer,
    receivedBuffer
  );
}

function mapPaymentStatus(
  eventType: string,
  chargeStatus: string
) {
  if (
    eventType === "charge.succeeded" ||
    chargeStatus === "succeeded"
  ) {
    return "success";
  }

  if (
    eventType === "charge.refunded" ||
    chargeStatus === "refunded"
  ) {
    return "refunded";
  }

  if (
    eventType === "charge.failed" ||
    eventType === "charge.declined" ||
    eventType === "charge.expired" ||
    chargeStatus === "failed" ||
    chargeStatus === "declined"
  ) {
    return "failed";
  }

  return "pending";
}

export async function POST(
  request: Request
) {
  try {
    const rawBody =
      await request.text();

    const timestamp =
      request.headers.get(
        "X-Webhook-Timestamp"
      );

    const signature =
      request.headers.get(
        "X-Webhook-Signature"
      );

    const webhookSecret =
      process.env.MALIPO_WEBHOOK_SECRET;

    if (
      !timestamp ||
      !signature ||
      !webhookSecret
    ) {
      return NextResponse.json(
        {
          error:
            "Configuration du webhook Malipo incomplète.",
        },
        { status: 401 }
      );
    }

    const validSignature =
      verifyMalipoSignature(
        rawBody,
        timestamp,
        signature,
        webhookSecret
      );

    if (!validSignature) {
      return NextResponse.json(
        {
          error:
            "Signature du webhook invalide.",
        },
        { status: 401 }
      );
    }

    let event: any;

    try {
      event = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        {
          error:
            "Corps du webhook invalide.",
        },
        { status: 400 }
      );
    }

    const eventType =
      event?.type;

    const webhookCharge =
      event?.data?.object;

    const chargeId =
      webhookCharge?.id;

    if (!chargeId) {
      return NextResponse.json(
        {
          error:
            "Identifiant de transaction manquant.",
        },
        { status: 400 }
      );
    }

    const malipoApiKey =
      process.env.MALIPO_API_KEY;

    if (!malipoApiKey) {
      throw new Error(
        "MALIPO_API_KEY manquante."
      );
    }

    let charge =
      webhookCharge;

    const chargeResponse =
      await fetch(
        `${MALIPO_API_URL}/charges/${chargeId}`,
        {
          method: "GET",
          headers: {
            Authorization:
              `Bearer ${malipoApiKey}`,
            "Content-Type":
              "application/json",
          },
          cache: "no-store",
        }
      );

    if (chargeResponse.ok) {
      const completeCharge =
        await chargeResponse.json();

      charge =
        completeCharge?.data ||
        completeCharge;
    }

    const chargeStatus =
      String(
        charge?.status || ""
      );

    const metadata =
      charge?.metadata || {};

    const userId =
      metadata?.user_id;

    const planId =
      metadata?.plan_id;

    if (!userId || !planId) {
      return NextResponse.json(
        {
          error:
            "Métadonnées MedLib manquantes dans la transaction.",
        },
        { status: 400 }
      );
    }

    const supabase =
      getAdminSupabase();

    const {
      data: plan,
      error: planError,
    } = await supabase
      .from("plans")
      .select(
        "id, name, price, duration_days, currency"
      )
      .eq("id", planId)
      .maybeSingle();

    if (planError || !plan) {
      console.error(
        "Plan introuvable:",
        planError
      );

      return NextResponse.json(
        {
          error:
            "Plan MedLib introuvable.",
        },
        { status: 404 }
      );
    }

    const paymentStatus =
      mapPaymentStatus(
        eventType,
        chargeStatus
      );

    const {
      data: existingPayment,
      error:
        existingPaymentError,
    } = await supabase
      .from("payments")
      .select("id, status")
      .eq(
        "transaction_reference",
        chargeId
      )
      .maybeSingle();

    if (existingPaymentError) {
      console.error(
        "Erreur recherche paiement:",
        existingPaymentError
      );

      return NextResponse.json(
        {
          error:
            "Impossible de vérifier le paiement.",
        },
        { status: 500 }
      );
    }

    if (
      existingPayment?.status ===
        "success" &&
      paymentStatus !==
        "refunded"
    ) {
      return NextResponse.json({
        success: true,
        message:
          "Paiement déjà confirmé.",
      });
    }

    let paymentId =
      existingPayment?.id;

    const paymentData = {
      user_id: userId,
      amount: Number(
        plan.price
      ),
      currency:
        plan.currency || "USD",
      provider: "malipo",
      transaction_reference:
        chargeId,
      status: paymentStatus,
      paid_at:
        paymentStatus ===
        "success"
          ? new Date().toISOString()
          : null,
    };

    if (existingPayment) {
      const {
        error:
          updatePaymentError,
      } = await supabase
        .from("payments")
        .update(paymentData)
        .eq(
          "id",
          existingPayment.id
        );

      if (updatePaymentError) {
        console.error(
          "Erreur mise à jour paiement:",
          updatePaymentError
        );

        return NextResponse.json(
          {
            error:
              "Impossible de mettre à jour le paiement.",
          },
          { status: 500 }
        );
      }
    } else {
      const {
        data: newPayment,
        error:
          insertPaymentError,
      } = await supabase
        .from("payments")
        .insert(paymentData)
        .select("id")
        .single();

      if (insertPaymentError) {
        console.error(
          "Erreur création paiement:",
          insertPaymentError
        );

        return NextResponse.json(
          {
            error:
              "Impossible d'enregistrer le paiement.",
          },
          { status: 500 }
        );
      }

      paymentId =
        newPayment.id;
    }

    if (
      paymentStatus !==
      "success"
    ) {
      return NextResponse.json({
        success: true,
        message:
          "Événement de paiement enregistré.",
        status: paymentStatus,
      });
    }

    const {
      data: existingSubscription,
      error:
        subscriptionSearchError,
    } = await supabase
      .from("subscriptions")
      .select(
        "id, status, starts_at, expires_at"
      )
      .eq("user_id", userId)
      .eq("status", "active")
      .order(
        "expires_at",
        {
          ascending: false,
        }
      )
      .limit(1)
      .maybeSingle();

    if (subscriptionSearchError) {
      console.error(
        "Erreur recherche abonnement:",
        subscriptionSearchError
      );

      return NextResponse.json(
        {
          error:
            "Impossible de vérifier l'abonnement.",
        },
        { status: 500 }
      );
    }

    const now =
      new Date();

    let startsAt =
      now;

    let expiresAt =
      new Date(now);

    if (
      existingSubscription?.expires_at
    ) {
      const currentExpiry =
        new Date(
          existingSubscription
            .expires_at
        );

      if (
        currentExpiry.getTime() >
        now.getTime()
      ) {
        startsAt =
          currentExpiry;

        expiresAt =
          new Date(
            currentExpiry
          );
      }
    }

    expiresAt.setDate(
      expiresAt.getDate() +
        Number(
          plan.duration_days
        )
    );

    if (existingSubscription) {
      const {
        error:
          updateSubscriptionError,
      } = await supabase
        .from("subscriptions")
        .update({
          plan_id: plan.id,
          payment_id:
            paymentId,
          status: "active",
          expires_at:
            expiresAt.toISOString(),
        })
        .eq(
          "id",
          existingSubscription.id
        );

      if (
        updateSubscriptionError
      ) {
        console.error(
          "Erreur activation abonnement:",
          updateSubscriptionError
        );

        return NextResponse.json(
          {
            error:
              "Paiement confirmé mais activation de l'abonnement impossible.",
          },
          { status: 500 }
        );
      }
    } else {
      const {
        error:
          insertSubscriptionError,
      } = await supabase
        .from("subscriptions")
        .insert({
          user_id: userId,
          plan_id: plan.id,
          payment_id:
            paymentId,
          status: "active",
          starts_at:
            startsAt.toISOString(),
          expires_at:
            expiresAt.toISOString(),
        });

      if (
        insertSubscriptionError
      ) {
        console.error(
          "Erreur création abonnement:",
          insertSubscriptionError
        );

        return NextResponse.json(
          {
            error:
              "Paiement confirmé mais création de l'abonnement impossible.",
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message:
        "Paiement confirmé et abonnement activé.",
      transaction_reference:
        chargeId,
      subscription_status:
        "active",
    });
  } catch (error) {
    console.error(
      "Malipo webhook error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Erreur interne du webhook MedLib.",
      },
      { status: 500 }
    );
  }
  }

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const PLAN_MAP = {
  monthly: "Mensuel",
  semester: "Semestriel",
  annual: "Annuel",
} as const;

const NETWORKS = {
  orange: "ORANGE_MONEY",
  airtel: "AIRTEL_MONEY",
  mpesa: "VODACOM_MPESA",
} as const;

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Vous devez être connecté." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const planCode = body.plan as keyof typeof PLAN_MAP;
    const paymentMethod = body.paymentMethod as
      | "mobile_money"
      | "card";

    const networkCode = body.network as keyof typeof NETWORKS;
    const phone = String(body.phone || "").trim();

    if (!PLAN_MAP[planCode]) {
      return NextResponse.json(
        { error: "Formule d'abonnement invalide." },
        { status: 400 }
      );
    }

    if (
      paymentMethod !== "mobile_money" &&
      paymentMethod !== "card"
    ) {
      return NextResponse.json(
        { error: "Méthode de paiement invalide." },
        { status: 400 }
      );
    }

    if (paymentMethod === "mobile_money") {
      if (!NETWORKS[networkCode]) {
        return NextResponse.json(
          { error: "Moyen de paiement invalide." },
          { status: 400 }
        );
      }

      if (!phone) {
        return NextResponse.json(
          { error: "Numéro de téléphone requis." },
          { status: 400 }
        );
      }

      if (!phone.startsWith("+243")) {
        return NextResponse.json(
          {
            error:
              "Veuillez utiliser le format international, par exemple : +243812345678.",
          },
          { status: 400 }
        );
      }
    }

    const { data: plan, error: planError } = await supabase
      .from("plans")
      .select("id, name, price, duration_days")
      .eq("name", PLAN_MAP[planCode])
      .single();

    if (planError || !plan) {
      return NextResponse.json(
        { error: "Formule introuvable." },
        { status: 404 }
      );
    }

    const apiKey = process.env.MALIPO_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Configuration du paiement indisponible." },
        { status: 500 }
      );
    }

    const amount =
      paymentMethod === "card"
        ? Math.round(Number(plan.price))
        : Math.round(Number(plan.price) * 100);

    const paymentBody: Record<string, unknown> = {
      amount,
      currency: "USD",
      payment_method: paymentMethod,
      description: `Abonnement MedLib - ${plan.name}`,
      metadata: {
        user_id: user.id,
        plan_id: plan.id,
        plan_code: planCode,
      },
    };

    if (paymentMethod === "mobile_money") {
      paymentBody.phone = phone;
      paymentBody.network = NETWORKS[networkCode];
    }

    const response = await fetch(
      "https://api.malipo.dev/v1/charges",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "Idempotency-Key": `medlib-${user.id}-${plan.id}-${Date.now()}`,
        },
        body: JSON.stringify(paymentBody),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            result?.error?.message ||
            result?.message ||
            "Le paiement n'a pas pu être initié.",
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      charge: result,
    });
  } catch (error) {
    console.error("Malipo payment error:", error);

    return NextResponse.json(
      {
        error:
          "Une erreur est survenue lors de l'initialisation du paiement.",
      },
      { status: 500 }
    );
  }
  }

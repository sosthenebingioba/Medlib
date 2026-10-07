"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { FormEvent } from "react";

const plans = {
  monthly: {
    name: "Mensuel",
    price: 5,
    duration: "30 jours",
  },
  semester: {
    name: "Semestriel",
    price: 25,
    duration: "6 mois",
  },
  annual: {
    name: "Annuel",
    price: 45,
    duration: "12 mois",
  },
};

const networks = [
  {
    id: "orange",
    name: "Orange Money",
    logo:
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Logo_Orange_Money.svg",
  },
  {
    id: "airtel",
    name: "Airtel Money",
    logo:
      "https://i0.wp.com/amref.org/wp-content/uploads/2017/10/airtel-money.png?fit=696%2C385&ssl=1",
  },
  {
    id: "mpesa",
    name: "M-Pesa",
    logo:
      "https://www.digicard.co.tz/images/payments/mpesa.png",
  },
];

function PaymentContent() {
  const searchParams = useSearchParams();

  const planCode = searchParams.get("plan") || "monthly";

  const selectedPlan =
    plans[planCode as keyof typeof plans] || plans.monthly;

  const [paymentMethod, setPaymentMethod] = useState<
    "mobile_money" | "card"
  >("mobile_money");

  const [network, setNetwork] = useState("");

  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState(false);

  const [chargeId, setChargeId] = useState("");

  async function handlePayment(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess(false);
    setChargeId("");

    if (paymentMethod === "mobile_money") {
      if (!network) {
        setError(
          "Veuillez sélectionner un moyen de paiement."
        );
        return;
      }

      if (!phone.trim()) {
        setError(
          "Veuillez saisir votre numéro de téléphone."
        );
        return;
      }

      if (!phone.startsWith("+243")) {
        setError(
          "Veuillez utiliser le format international, par exemple : +243812345678."
        );
        return;
      }
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/payments/malipo",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            plan: planCode,
            paymentMethod,
            network:
              paymentMethod === "mobile_money"
                ? network
                : undefined,
            phone:
              paymentMethod === "mobile_money"
                ? phone.trim()
                : undefined,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error ||
            "Impossible d'initialiser le paiement."
        );
      }

      const charge =
        result?.charge ||
        result?.charge?.data ||
        result;

      const id =
        charge?.id ||
        charge?.charge_id ||
        "";

      setChargeId(id);

      if (paymentMethod === "card") {
        const nextAction = charge?.next_action;

        const paymentUrl =
          nextAction?.payment_url;

        const params =
          nextAction?.params;

        if (!paymentUrl || !params) {
          throw new Error(
            "La page sécurisée de paiement par carte n'a pas été générée."
          );
        }

        const form =
          document.createElement("form");

        form.method = "POST";
        form.action = paymentUrl;

        Object.entries(params).forEach(
          ([key, value]) => {
            const input =
              document.createElement("input");

            input.type = "hidden";
            input.name = key;
            input.value = String(value);

            form.appendChild(input);
          }
        );

        document.body.appendChild(form);

        form.submit();

        return;
      }

      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue pendant le paiement."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "680px",
          margin: "0 auto",
          background: "#ffffff",
          borderRadius: "24px",
          padding: "32px",
          boxShadow:
            "0 15px 45px rgba(15, 23, 42, 0.08)",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          <p
            style={{
              color: "#0f766e",
              fontWeight: 800,
              letterSpacing: "2px",
              marginBottom: "8px",
            }}
          >
            MEDLIB
          </p>

          <h1
            style={{
              color: "#0f172a",
              fontSize: "32px",
              marginBottom: "8px",
            }}
          >
            Paiement sécurisé
          </h1>

          <p
            style={{
              color: "#64748b",
              margin: 0,
            }}
          >
            Activez votre abonnement MedLib
            en quelques secondes.
          </p>
        </div>

        <div
          style={{
            background: "#f1f5f9",
            borderRadius: "16px",
            padding: "20px",
            marginBottom: "30px",
          }}
        >
          <p>
            <strong>Formule :</strong>{" "}
            {selectedPlan.name}
          </p>

          <p>
            <strong>Montant :</strong> $
            {selectedPlan.price}
          </p>

          <p
            style={{
              marginBottom: 0,
            }}
          >
            <strong>Durée :</strong>{" "}
            {selectedPlan.duration}
          </p>
        </div>

        <form onSubmit={handlePayment}>
          <h2
            style={{
              fontSize: "18px",
              color: "#17345f",
              marginBottom: "16px",
            }}
          >
            1. Choisissez votre moyen de paiement
          </h2>

          <div
            style={{
              display: "grid",
              gap: "12px",
              marginBottom: "30px",
            }}
          >
            <button
              type="button"
              onClick={() =>
                setPaymentMethod("mobile_money")
              }
              style={{
                width: "100%",
                padding: "18px",
                borderRadius: "14px",
                border:
                  paymentMethod === "mobile_money"
                    ? "2px solid #1760b8"
                    : "1px solid #d7deea",
                background:
                  paymentMethod === "mobile_money"
                    ? "#eff6ff"
                    : "#ffffff",
                color: "#17345f",
                fontWeight: 700,
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              📱 Mobile Money

              <span
                style={{
                  display: "block",
                  color: "#64748b",
                  fontSize: "13px",
                  marginTop: "5px",
                }}
              >
                Orange Money · Airtel Money · M-Pesa
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                setPaymentMethod("card")
              }
              style={{
                width: "100%",
                padding: "18px",
                borderRadius: "14px",
                border:
                  paymentMethod === "card"
                    ? "2px solid #1760b8"
                    : "1px solid #d7deea",
                background:
                  paymentMethod === "card"
                    ? "#eff6ff"
                    : "#ffffff",
                color: "#17345f",
                fontWeight: 700,
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              💳 Visa / Carte bancaire

              <span
                style={{
                  display: "block",
                  color: "#64748b",
                  fontSize: "13px",
                  marginTop: "5px",
                }}
              >
                Paiement sécurisé par carte
              </span>
            </button>
          </div>

          {paymentMethod === "mobile_money" && (
            <>
              <h2
                style={{
                  fontSize: "18px",
                  color: "#17345f",
                  marginBottom: "16px",
                }}
              >
                2. Choisissez votre opérateur
              </h2>

              <div
                style={{
                  display: "grid",
                  gap: "12px",
                  marginBottom: "24px",
                }}
              >
                {networks.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      setNetwork(item.id)
                    }
                    style={{
                      width: "100%",
                      minHeight: "74px",
                      display: "flex",
                      alignItems: "center",
                      gap: "18px",
                      padding: "12px 18px",
                      borderRadius: "14px",
                      border:
                        network === item.id
                          ? "2px solid #1760b8"
                          : "1px solid #d7deea",
                      background:
                        network === item.id
                          ? "#eff6ff"
                          : "#ffffff",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <img
                      src={item.logo}
                      alt={item.name}
                      style={{
                        width: "105px",
                        height: "42px",
                        objectFit: "contain",
                      }}
                    />

                    <span
                      style={{
                        fontWeight: 700,
                        color: "#17345f",
                      }}
                    >
                      {item.name}
                    </span>

                    {network === item.id && (
                      <span
                        style={{
                          marginLeft: "auto",
                          color: "#1760b8",
                          fontSize: "24px",
                        }}
                      >
                        ✓
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <h2
                style={{
                  fontSize: "18px",
                  color: "#17345f",
                  marginBottom: "16px",
                }}
              >
                3. Votre numéro Mobile Money
              </h2>

              <input
                type="tel"
                value={phone}
                onChange={(event) =>
                  setPhone(event.target.value)
                }
                placeholder="+243812345678"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "16px",
                  borderRadius: "12px",
                  border: "1px solid #cbd5e1",
                  fontSize: "16px",
                  marginBottom: "8px",
                }}
              />

              <p
                style={{
                  color: "#64748b",
                  fontSize: "13px",
                  marginBottom: "24px",
                }}
              >
                Utilisez le format international avec
                <strong> +243</strong>.
              </p>
            </>
          )}

          {paymentMethod === "card" && (
            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "16px",
                padding: "20px",
                marginBottom: "24px",
              }}
            >
              <h2
                style={{
                  fontSize: "18px",
                  color: "#17345f",
                  marginTop: 0,
                }}
              >
                Paiement par carte
              </h2>

              <p
                style={{
                  color: "#64748b",
                  lineHeight: 1.6,
                  marginBottom: 0,
                }}
              >
                Après avoir cliqué sur le bouton
                ci-dessous, vous serez redirigé vers
                une page de paiement sécurisée pour
                saisir les informations de votre carte.
              </p>

              <p
                style={{
                  color: "#475569",
                  fontSize: "13px",
                  marginBottom: 0,
                }}
              >
                🔒 MedLib ne stocke pas les informations
                de votre carte.
              </p>
            </div>
          )}

          {error && (
            <div
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#dc2626",
                padding: "14px",
                borderRadius: "12px",
                marginBottom: "18px",
              }}
            >
              {error}
            </div>
          )}

          {success && (
            <div
              style={{
                background: "#ecfdf5",
                border: "1px solid #a7f3d0",
                color: "#047857",
                padding: "16px",
                borderRadius: "12px",
                marginBottom: "18px",
              }}
            >
              <strong>
                Paiement initié avec succès.
              </strong>

              <p
                style={{
                  marginBottom: 0,
                }}
              >
                Votre abonnement sera activé après
                confirmation du paiement.
              </p>

              {chargeId && (
                <small>
                  Transaction : {chargeId}
                </small>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              border: "none",
              borderRadius: "12px",
              padding: "17px",
              background: loading
                ? "#94a3b8"
                : "#1760b8",
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: 800,
              cursor: loading
                ? "not-allowed"
                : "pointer",
            }}
          >
            {loading
              ? "Traitement en cours..."
              : paymentMethod === "card"
              ? `Payer $${selectedPlan.price} par carte`
              : `Payer $${selectedPlan.price}`}
          </button>
        </form>

        <div
          style={{
            textAlign: "center",
            marginTop: "24px",
          }}
        >
          <a
            href="/dashboard/subscription/checkout"
            style={{
              color: "#1760b8",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            ← Retour
          </a>
        </div>
      </div>
    </main>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <main
          style={{
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            background: "#f5f7fb",
          }}
        >
          Chargement du paiement...
        </main>
      }
    >
      <PaymentContent />
    </Suspense>
  );
      }

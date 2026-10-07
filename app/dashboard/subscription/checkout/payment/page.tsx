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
      "https://www.itnewsafrica.com/wp-content/uploads/2024/03/befunky_2024-2-3_11-53-13.png",
  },
];

function PaymentContent() {
  const searchParams = useSearchParams();

  const planCode = searchParams.get("plan") || "monthly";

  const selectedPlan =
    plans[planCode as keyof typeof plans] || plans.monthly;

  const [network, setNetwork] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [chargeId, setChargeId] = useState("");

  async function handlePayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess(false);
    setChargeId("");

    if (!network) {
      setError("Veuillez sélectionner un moyen de paiement.");
      return;
    }

    if (!phone.trim()) {
      setError("Veuillez saisir votre numéro de téléphone.");
      return;
    }

    if (!phone.startsWith("+243")) {
      setError(
        "Veuillez utiliser le format international, par exemple : +243812345678."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/payments/malipo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan: planCode,
          network,
          phone: phone.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error || "Impossible d'initialiser le paiement."
        );
      }

      const id =
        result?.charge?.id ||
        result?.charge?.data?.id ||
        result?.charge?.charge_id ||
        "";

      setChargeId(id);
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
          maxWidth: "720px",
          margin: "0 auto",
          background: "#ffffff",
          padding: "40px",
          borderRadius: "20px",
          color: "#10284a",
          boxShadow: "0 10px 30px rgba(25,45,80,0.08)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              color: "#3973b9",
              fontWeight: 800,
              letterSpacing: "0.1em",
              margin: 0,
            }}
          >
            MEDLIB PREMIUM
          </p>

          <h1
            style={{
              marginTop: "10px",
              marginBottom: "10px",
              fontSize: "28px",
            }}
          >
            Paiement sécurisé
          </h1>

          <p
            style={{
              color: "#667085",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            Activez votre abonnement MedLib en quelques secondes.
          </p>
        </div>

        {/* RÉCAPITULATIF */}
        <div
          style={{
            marginTop: "30px",
            padding: "22px",
            background: "#f5f7fb",
            borderRadius: "15px",
          }}
        >
          <p style={{ margin: 0 }}>
            <strong>Formule :</strong> {selectedPlan.name}
          </p>

          <p style={{ marginTop: "10px" }}>
            <strong>Montant :</strong> ${selectedPlan.price}
          </p>

          <p style={{ marginTop: "10px", marginBottom: 0 }}>
            <strong>Durée :</strong> {selectedPlan.duration}
          </p>
        </div>

        {!success ? (
          <form onSubmit={handlePayment}>
            {/* MOYENS DE PAIEMENT */}
            <div style={{ marginTop: "30px" }}>
              <h2
                style={{
                  fontSize: "18px",
                  marginBottom: "15px",
                }}
              >
                1. Choisissez votre moyen de paiement
              </h2>

              <div
                style={{
                  display: "grid",
                  gap: "12px",
                }}
              >
                {networks.map((item) => {
                  const selected = network === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setNetwork(item.id)}
                      style={{
                        width: "100%",
                        minHeight: "76px",
                        padding: "10px 18px",
                        borderRadius: "14px",
                        border: selected
                          ? "2px solid #1557a6"
                          : "1px solid #d9e1ec",
                        background: selected ? "#eef5ff" : "#ffffff",
                        color: "#10284a",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "18px",
                        fontSize: "15px",
                        fontWeight: 700,
                        textAlign: "left",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <div
                        style={{
                          width: "105px",
                          height: "52px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          background: "#ffffff",
                          borderRadius: "8px",
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={item.logo}
                          alt={`${item.name} logo`}
                          style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            width: "auto",
                            height: "auto",
                            objectFit: "contain",
                            display: "block",
                          }}
                        />
                      </div>

                      <span
                        style={{
                          flex: 1,
                        }}
                      >
                        {item.name}
                      </span>

                      {selected && (
                        <span
                          style={{
                            color: "#1557a6",
                            fontSize: "22px",
                            fontWeight: 900,
                          }}
                        >
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* NUMÉRO */}
            <div style={{ marginTop: "30px" }}>
              <h2
                style={{
                  fontSize: "18px",
                  marginBottom: "15px",
                }}
              >
                2. Votre numéro Mobile Money
              </h2>

              <input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="+243812345678"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  minHeight: "54px",
                  padding: "0 16px",
                  borderRadius: "12px",
                  border: "1px solid #d9e1ec",
                  outline: "none",
                  fontSize: "16px",
                  color: "#10284a",
                }}
              />

              <p
                style={{
                  marginTop: "8px",
                  color: "#667085",
                  fontSize: "13px",
                  lineHeight: 1.5,
                }}
              >
                Utilisez le format international avec{" "}
                <strong>+243</strong>.
              </p>
            </div>

            {/* ERREUR */}
            {error && (
              <div
                style={{
                  marginTop: "20px",
                  padding: "14px 16px",
                  borderRadius: "10px",
                  background: "#fff1f1",
                  border: "1px solid #f3caca",
                  color: "#b42318",
                  fontSize: "14px",
                  lineHeight: 1.5,
                }}
              >
                {error}
              </div>
            )}

            {/* BOUTON */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                minHeight: "54px",
                marginTop: "25px",
                border: "none",
                borderRadius: "12px",
                background: loading ? "#8aa9cc" : "#1557a6",
                color: "#ffffff",
                fontSize: "16px",
                fontWeight: 800,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading
                ? "Initialisation du paiement..."
                : `Payer $${selectedPlan.price}`}
            </button>
          </form>
        ) : (
          /* SUCCÈS */
          <div
            style={{
              marginTop: "30px",
              padding: "25px",
              borderRadius: "15px",
              background: "#effaf3",
              border: "1px solid #b7e1c3",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "42px",
                marginBottom: "10px",
              }}
            >
              ✓
            </div>

            <h2
              style={{
                margin: 0,
                color: "#16794a",
              }}
            >
              Paiement initié
            </h2>

            <p
              style={{
                marginTop: "12px",
                color: "#35634b",
                lineHeight: 1.6,
              }}
            >
              Votre demande de paiement a bien été envoyée.
              <br />
              Suivez les instructions de votre opérateur Mobile Money.
            </p>

            {chargeId && (
              <p
                style={{
                  marginTop: "15px",
                  fontSize: "13px",
                  color: "#667085",
                  wordBreak: "break-all",
                }}
              >
                Référence : <strong>{chargeId}</strong>
              </p>
            )}

            <p
              style={{
                marginTop: "18px",
                fontSize: "13px",
                color: "#667085",
              }}
            >
              L'abonnement sera activé après confirmation du paiement.
            </p>
          </div>
        )}

        <a
          href={`/dashboard/subscription/checkout?plan=${planCode}`}
          style={{
            display: "block",
            marginTop: "22px",
            textAlign: "center",
            color: "#3973b9",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: 700,
          }}
        >
          ← Retour
        </a>
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
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f5f7fb",
            color: "#10284a",
            fontFamily: "Arial, sans-serif",
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

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type PageProps = {
  searchParams: Promise<{
    plan?: string;
  }>;
};

const planMap: Record<string, string> = {
  monthly: "Mensuel",
  semester: "Semestriel",
  annual: "Annuel",
};

export default async function CheckoutPage({
  searchParams,
}: PageProps) {
  const { plan } = await searchParams;

  if (!plan || !planMap[plan]) {
    redirect("/dashboard/subscription");
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: selectedPlan, error } = await supabase
    .from("plans")
    .select("id, name, price, duration_days")
    .eq("name", planMap[plan])
    .single();

  if (error || !selectedPlan) {
    notFound();
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
          width: "min(700px, 100%)",
          margin: "0 auto",
        }}
      >
        <Link
          href="/dashboard/subscription"
          style={{
            color: "#315f9b",
            textDecoration: "none",
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          ← Retour aux abonnements
        </Link>

        <section
          style={{
            marginTop: 30,
            background: "#ffffff",
            border: "1px solid #e1e7ef",
            borderRadius: 22,
            padding: "35px 28px",
            boxShadow: "0 15px 40px rgba(25,45,80,.08)",
          }}
        >
          <p
            style={{
              margin: "0 0 10px",
              color: "#3973b9",
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: ".12em",
            }}
          >
            MEDLIB PREMIUM
          </p>

          <h1
            style={{
              margin: "0 0 12px",
              color: "#10284a",
              fontSize: 34,
            }}
          >
            Confirmer votre abonnement
          </h1>

          <p
            style={{
              color: "#667085",
              lineHeight: 1.7,
            }}
          >
            Vérifiez votre formule avant de continuer vers le paiement.
          </p>

          <div
            style={{
              marginTop: 28,
              padding: 24,
              background: "#f7f9fc",
              borderRadius: 16,
              border: "1px solid #e5eaf1",
            }}
          >
            <span
              style={{
                color: "#3973b9",
                fontSize: 12,
                fontWeight: 800,
              }}
            >
              FORMULE SÉLECTIONNÉE
            </span>

            <h2
              style={{
                margin: "8px 0",
                color: "#10284a",
                fontSize: 26,
              }}
            >
              {selectedPlan.name}
            </h2>

            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 8,
                marginTop: 15,
              }}
            >
              <strong
                style={{
                  color: "#10284a",
                  fontSize: 42,
                }}
              >
                {selectedPlan.price}$
              </strong>

              <span style={{ color: "#7a8495" }}>
                / {selectedPlan.duration_days} jours
              </span>
            </div>
          </div>

          <div
            style={{
              marginTop: 24,
              padding: 20,
              background: "#eef6ff",
              borderRadius: 14,
              color: "#315f9b",
              lineHeight: 1.7,
              fontSize: 14,
            }}
          >
            ✓ Accès aux cours médicaux Premium
            <br />
            ✓ Lecture des PDF en ligne
            <br />
            ✓ Bibliothèque médicale complète
            <br />
            ✓ Accès depuis téléphone, tablette et ordinateur
          </div>

          <div
            style={{
              marginTop: 28,
              padding: 18,
              background: "#fff8e8",
              border: "1px solid #f1dfaa",
              borderRadius: 14,
              color: "#795b12",
              fontSize: 13,
              lineHeight: 1.6,
            }}
          >
            <strong>Étape suivante</strong>
            <br />
            Vous serez dirigé vers le système de paiement sécurisé
            pour finaliser votre abonnement.
          </div>

          <button
            type="button"
            disabled
            style={{
              width: "100%",
              marginTop: 28,
              minHeight: 52,
              border: "none",
              borderRadius: 12,
              background: "#1557a6",
              color: "#ffffff",
              fontSize: 15,
              fontWeight: 800,
              cursor: "not-allowed",
              opacity: 0.7,
            }}
          >
            Continuer vers le paiement
          </button>

          <p
            style={{
              marginTop: 14,
              textAlign: "center",
              color: "#8a94a5",
              fontSize: 12,
            }}
          >
            Le paiement sera activé à l'étape suivante.
          </p>
        </section>
      </div>
    </main>
  );
                }

import Link from "next/link";
import { redirect } from "next/navigation";
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

  const selectedPlanName = planMap[plan];

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
          }}
        >
          ← Retour aux abonnements
        </Link>

        <section
          style={{
            marginTop: 30,
            background: "#fff",
            borderRadius: 20,
            padding: 35,
            boxShadow: "0 15px 40px rgba(25,45,80,.08)",
          }}
        >
          <p
            style={{
              color: "#3973b9",
              fontWeight: 800,
              letterSpacing: ".1em",
            }}
          >
            MEDLIB PREMIUM
          </p>

          <h1
            style={{
              color: "#10284a",
              fontSize: 34,
            }}
          >
            Confirmer votre abonnement
          </h1>

          <div
            style={{
              marginTop: 25,
              padding: 24,
              background: "#f7f9fc",
              borderRadius: 15,
            }}
          >
            <p
              style={{
                color: "#3973b9",
                fontWeight: 800,
                fontSize: 12,
              }}
            >
              FORMULE SÉLECTIONNÉE
            </p>

            <h2
              style={{
                color: "#10284a",
                fontSize: 26,
              }}
            >
              {selectedPlanName}
            </h2>

            <p
              style={{
                color: "#667085",
              }}
            >
              Vous avez sélectionné la formule{" "}
              <strong>{selectedPlanName}</strong>.
            </p>
          </div>

          <div
            style={{
              marginTop: 25,
              padding: 20,
              background: "#eef6ff",
              borderRadius: 14,
              color: "#315f9b",
            }}
          >
            ✓ Accès aux cours Premium
            <br />
            ✓ Lecture des PDF en ligne
            <br />
            ✓ Bibliothèque médicale complète
          </div>

          <button
            type="button"
            disabled
            style={{
              width: "100%",
              marginTop: 25,
              padding: 15,
              border: "none",
              borderRadius: 10,
              background: "#1557a6",
              color: "#fff",
              fontWeight: 800,
              opacity: 0.7,
            }}
          >
            Continuer vers le paiement
          </button>
        </section>
      </div>
    </main>
  );
}

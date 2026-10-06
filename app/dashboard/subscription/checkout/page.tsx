import Link from "next/link";

type PageProps = {
  searchParams: Promise<{
    plan?: string;
  }>;
};

const plans = {
  monthly: {
    name: "Mensuel",
    price: "5$",
    duration: "30 jours",
  },
  semester: {
    name: "Semestriel",
    price: "25$",
    duration: "6 mois",
  },
  annual: {
    name: "Annuel",
    price: "45$",
    duration: "12 mois",
  },
};

export default async function CheckoutPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;

  const selectedPlan =
    plans[params.plan as keyof typeof plans] || plans.monthly;

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
          maxWidth: "700px",
          margin: "0 auto",
          background: "#ffffff",
          padding: "40px",
          borderRadius: "20px",
          color: "#10284a",
          boxShadow: "0 10px 30px rgba(25,45,80,0.08)",
        }}
      >
        <p
          style={{
            color: "#3973b9",
            fontWeight: 800,
            letterSpacing: "0.1em",
            textAlign: "center",
          }}
        >
          MEDLIB PREMIUM
        </p>

        <h1
          style={{
            textAlign: "center",
            marginTop: "10px",
          }}
        >
          Paiement de votre abonnement
        </h1>

        <div
          style={{
            marginTop: "30px",
            padding: "25px",
            background: "#f5f7fb",
            borderRadius: "15px",
          }}
        >
          <p>
            <strong>Formule :</strong> {selectedPlan.name}
          </p>

          <p style={{ marginTop: "10px" }}>
            <strong>Prix :</strong> {selectedPlan.price}
          </p>

          <p style={{ marginTop: "10px" }}>
            <strong>Durée :</strong> {selectedPlan.duration}
          </p>
        </div>

        <p
          style={{
            marginTop: "25px",
            textAlign: "center",
            color: "#667085",
            lineHeight: 1.6,
          }}
        >
          Sélectionnez votre moyen de paiement pour activer votre abonnement
          MedLib.
        </p>

        <Link
          href={`/dashboard/subscription/checkout/payment?plan=${params.plan || "monthly"}`}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            minHeight: "52px",
            marginTop: "25px",
            borderRadius: "12px",
            background: "#1557a6",
            color: "#ffffff",
            textDecoration: "none",
            fontSize: "15px",
            fontWeight: 800,
          }}
        >
          Continuer vers le paiement
        </Link>

        <Link
          href="/dashboard/subscription"
          style={{
            display: "block",
            marginTop: "18px",
            textAlign: "center",
            color: "#3973b9",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: 700,
          }}
        >
          ← Retour aux abonnements
        </Link>
      </div>
    </main>
  );
}

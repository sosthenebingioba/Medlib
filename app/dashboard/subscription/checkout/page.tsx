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
          Confirmation de l'abonnement
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
          Vous êtes sur le point de souscrire à cet abonnement MedLib.
        </p>

        <button
          type="button"
          style={{
            width: "100%",
            marginTop: "25px",
            minHeight: "52px",
            border: "none",
            borderRadius: "12px",
            background: "#1557a6",
            color: "#ffffff",
            fontSize: "15px",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          Continuer vers le paiement
        </button>
      </div>
    </main>
  );
}

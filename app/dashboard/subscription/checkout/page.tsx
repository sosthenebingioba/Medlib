import Link from "next/link";

export default function CheckoutPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "40px 20px",
        color: "#10284a",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          background: "#ffffff",
          padding: "40px",
          borderRadius: "20px",
          textAlign: "center",
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

        <h1>Confirmation de l'abonnement</h1>

        <p>
          La page de paiement MedLib est prête.
        </p>

        <p>
          Si tu vois cette page, le routage fonctionne correctement.
        </p>

        <Link
          href="/dashboard/subscription"
          style={{
            display: "inline-block",
            marginTop: "25px",
            padding: "14px 24px",
            background: "#1557a6",
            color: "#ffffff",
            borderRadius: "10px",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          ← Retour aux abonnements
        </Link>
      </div>
    </main>
  );
}

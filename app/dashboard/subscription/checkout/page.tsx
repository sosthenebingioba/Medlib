export default function CheckoutPage() {
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
          textAlign: "center",
          color: "#10284a",
        }}
      >
        <p
          style={{
            color: "#3973b9",
            fontWeight: 800,
            letterSpacing: "0.1em",
          }}
        >
          MEDLIB PREMIUM
        </p>

        <h1>Confirmation de l'abonnement</h1>

        <p style={{ marginTop: "20px", color: "#667085" }}>
          La page de paiement MedLib fonctionne.
        </p>

        <p style={{ marginTop: "15px", color: "#667085" }}>
          Formule sélectionnée : <strong>Mensuel</strong>
        </p>
      </div>
    </main>
  );
}

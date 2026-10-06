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

        <h1>PAGE CHECKOUT</h1>

        <p style={{ marginTop: "20px", color: "#667085" }}>
          Cette page est bien la page de paiement MedLib.
        </p>

        <p style={{ marginTop: "15px", fontWeight: 700 }}>
          Si tu vois ce message, le routage fonctionne.
        </p>
      </div>
    </main>
  );
}

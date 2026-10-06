import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type PageProps = {
  searchParams: Promise<{
    plan?: string;
  }>;
};

export default async function CheckoutPage({
  searchParams,
}: PageProps) {
  const { plan } = await searchParams;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

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

        <h1>TEST DE CONNEXION</h1>

        <p style={{ marginTop: "20px" }}>
          Connexion Supabase réussie.
        </p>

        <p style={{ marginTop: "15px", color: "#667085" }}>
          Utilisateur connecté :
        </p>

        <p
          style={{
            marginTop: "8px",
            fontWeight: 700,
            color: "#1557a6",
          }}
        >
          {user.email}
        </p>

        <p style={{ marginTop: "20px", color: "#667085" }}>
          Formule demandée :{" "}
          <strong>{plan || "aucune"}</strong>
        </p>
      </div>
    </main>
  );
}

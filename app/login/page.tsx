"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
});

if (error) {
  setError("E-mail ou mot de passe incorrect.");
  setLoading(false);
  return;
}

if (!data.session) {
  setError("Connexion réussie, mais aucune session n'a été créée.");
  setLoading(false);
  return;
}

window.location.href = "/dashboard";
      setError("E-mail ou mot de passe incorrect.");
      setLoading(false);
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
        background: "#f6f8fb",
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#fff",
          padding: "32px",
          borderRadius: "20px",
          boxShadow: "0 10px 40px rgba(15, 23, 42, 0.08)",
        }}
      >
        <p
          style={{
            color: "#0f766e",
            fontWeight: 800,
            fontSize: "13px",
          }}
        >
          MEDLIB
        </p>

        <h1 style={{ marginBottom: "8px" }}>
          Connexion
        </h1>

        <p style={{ color: "#64748b", marginBottom: "24px" }}>
          Accédez à votre bibliothèque médicale.
        </p>

        <label>
          E-mail
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "13px",
              marginTop: "7px",
              marginBottom: "16px",
              border: "1px solid #dbe3ea",
              borderRadius: "10px",
            }}
          />
        </label>

        <label>
          Mot de passe
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "13px",
              marginTop: "7px",
              marginBottom: "18px",
              border: "1px solid #dbe3ea",
              borderRadius: "10px",
            }}
          />
        </label>

        {error && (
          <p style={{ color: "#dc2626", marginBottom: "16px" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            border: "none",
            borderRadius: "10px",
            background: "#0f766e",
            color: "#fff",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </main>
  );
}

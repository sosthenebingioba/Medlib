"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const supabase = createClient();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    if (password.length < 6) {
      setMessage("Le mot de passe doit contenir au moins 6 caractères.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      window.location.href = "/";
      return;
    }

    setMessage(
      "Compte créé. Vérifiez votre adresse e-mail pour confirmer votre compte."
    );

    setLoading(false);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "#f8fafc",
      }}
    >
      <form
        onSubmit={handleRegister}
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "32px",
          borderRadius: "20px",
          background: "#ffffff",
          boxShadow: "0 10px 35px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ marginBottom: "8px" }}>Créer un compte MedLib</h1>

        <p style={{ color: "#64748b", marginBottom: "24px" }}>
          Créez votre compte étudiant pour accéder à MedLib.
        </p>

        <label>Nom complet</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "12px",
            margin: "8px 0 18px",
            border: "1px solid #cbd5e1",
            borderRadius: "10px",
          }}
        />

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "12px",
            margin: "8px 0 18px",
            border: "1px solid #cbd5e1",
            borderRadius: "10px",
          }}
        />

        <label>Mot de passe</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
          style={{
            width: "100%",
            padding: "12px",
            margin: "8px 0 18px",
            border: "1px solid #cbd5e1",
            borderRadius: "10px",
          }}
        />

        {message && (
          <p style={{ color: "#0f766e", marginBottom: "16px" }}>
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "13px",
            border: 0,
            borderRadius: "10px",
            background: "#0f766e",
            color: "#ffffff",
            cursor: "pointer",
          }}
        >
          {loading ? "Création..." : "Créer mon compte"}
        </button>
      </form>
    </main>
  );
}

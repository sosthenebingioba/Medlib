"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);

    const supabase = createClient();

    await supabase.auth.signOut();

    window.location.href = "/login";
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="logout-button"
    >
      {loading ? "Déconnexion..." : "Se déconnecter"}
    </button>
  );
}

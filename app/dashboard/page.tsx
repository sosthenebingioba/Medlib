import Link from "next/link";
import "./dashboard.css";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "./logout-button";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  // Récupérer l'abonnement le plus récent de l'utilisateur.
  const { data: subscriptions } = await supabase
    .from("subscriptions")
    .select("status, starts_at, expires_at, plan_id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  const now = Date.now();

  // Chercher un abonnement réellement actif et non expiré.
  const subscription =
    subscriptions?.find((item) => {
      const startsAt = item.starts_at
        ? new Date(item.starts_at).getTime()
        : 0;

      const expiresAt = item.expires_at
        ? new Date(item.expires_at).getTime()
        : null;

      return (
        item.status === "active" &&
        startsAt <= now &&
        (expiresAt === null || expiresAt > now)
      );
    }) ?? null;

  let planName = "Aucun abonnement";

  if (subscription?.plan_id) {
    const { data: plan } = await supabase
      .from("plans")
      .select("name")
      .eq("id", subscription.plan_id)
      .maybeSingle();

    if (plan?.name) {
      planName = plan.name;
    }
  }

  const fullName =
    profile?.full_name ||
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "Étudiant";

  const isActive = Boolean(subscription);

  const expirationDate = subscription?.expires_at
    ? new Date(subscription.expires_at).toLocaleDateString(
        "fr-FR"
      )
    : null;

  return (
    <main className="dashboard-shell">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">MEDLIB</p>

            <h1>Bonjour, {fullName} 👋</h1>

            <p className="dashboard-subtitle">
              Bienvenue dans votre espace étudiant.
            </p>
          </div>

          <LogoutButton />
        </header>

        <section className="dashboard-grid">
          <article className="dashboard-card dashboard-card-main">
            <div>
              <span className="card-label">
                Mon abonnement
              </span>

              <h2>
                {isActive
                  ? planName
                  : "Aucun abonnement actif"}
              </h2>

              <p>
                {isActive
                  ? `Accès premium actif${
                      expirationDate
                        ? ` jusqu’au ${expirationDate}`
                        : ""
                    }.`
                  : "Abonnez-vous pour accéder aux cours premium."}
              </p>
            </div>

            <span
              className={
                isActive
                  ? "status-badge active"
                  : "status-badge"
              }
            >
              {isActive ? "Actif" : "Inactif"}
            </span>
          </article>

          <article className="dashboard-card">
            <span className="card-icon">📚</span>

            <h3>Bibliothèque</h3>

            <p>
              Explorez les cours médicaux disponibles.
            </p>

            <Link
              href="/dashboard/library"
              className="dashboard-link"
            >
              Voir la bibliothèque →
            </Link>
          </article>

          <article className="dashboard-card">
            <span className="card-icon">❤️</span>

            <h3>Favoris</h3>

            <p>
              Retrouvez vos cours enregistrés.
            </p>

            <span className="dashboard-link muted">
              Bientôt disponible
            </span>
          </article>

          <article className="dashboard-card">
            <span className="card-icon">🕘</span>

            <h3>Historique</h3>

            <p>
              Reprenez vos dernières lectures.
            </p>

            <span className="dashboard-link muted">
              Bientôt disponible
            </span>
          </article>

          <article className="dashboard-card">
            <span className="card-icon">👤</span>

            <h3>Mon profil</h3>

            <p>{user.email}</p>

            <span className="dashboard-link muted">
              Statut : Actif
            </span>
          </article>
        </section>

        {!isActive && (
          <section className="upgrade-card">
            <div>
              <span className="eyebrow">
                MEDLIB PREMIUM
              </span>

              <h2>
                Accédez à toute la bibliothèque médicale
              </h2>

              <p>
                Choisissez une formule d’abonnement pour
                débloquer les cours premium.
              </p>
            </div>

            <Link
              href="/dashboard/subscription"
              className="primary-button"
            >
              Voir les abonnements
            </Link>
          </section>
        )}
      </div>
    </main>
  );
}

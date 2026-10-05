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
    .select("full_name, role, status")
    .eq("id", user.id)
    .maybeSingle();

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("status, starts_at, ends_at, plan_id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

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

  const isActive =
    subscription?.status === "active" &&
    (!subscription.ends_at ||
      new Date(subscription.ends_at).getTime() > Date.now());

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
              <span className="card-label">Mon abonnement</span>

              <h2>
                {isActive ? planName : "Aucun abonnement actif"}
              </h2>

              <p>
                {isActive
                  ? `Accès premium actif${
                      subscription?.ends_at
                        ? ` jusqu’au ${new Date(
                            subscription.ends_at
                          ).toLocaleDateString("fr-FR")}`
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
            <p>Explorez les cours médicaux disponibles.</p>
            <a href="/" className="dashboard-link">
              Voir la bibliothèque →
            </a>
          </article>

          <article className="dashboard-card">
            <span className="card-icon">❤️</span>
            <h3>Favoris</h3>
            <p>Retrouvez vos cours enregistrés.</p>
            <span className="dashboard-link muted">
              Bientôt disponible
            </span>
          </article>

          <article className="dashboard-card">
            <span className="card-icon">🕘</span>
            <h3>Historique</h3>
            <p>Reprenez vos dernières lectures.</p>
            <span className="dashboard-link muted">
              Bientôt disponible
            </span>
          </article>

          <article className="dashboard-card">
            <span className="card-icon">👤</span>
            <h3>Mon profil</h3>
            <p>{user.email}</p>
            <span className="dashboard-link muted">
              Statut :{" "}
              {profile?.status === "active"
                ? "Actif"
                : profile?.status || "Actif"}
            </span>
          </article>
        </section>

        {!isActive && (
          <section className="upgrade-card">
            <div>
              <span className="eyebrow">MEDLIB PREMIUM</span>

              <h2>
                Accédez à toute la bibliothèque médicale
              </h2>

              <p>
                Choisissez une formule d’abonnement pour
                débloquer les cours premium.
              </p>
            </div>

            <a href="/" className="primary-button">
              Voir les abonnements
            </a>
          </section>
        )}
      </div>
    </main>
  );
                    }

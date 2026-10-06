import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import "./admin.css";

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }
const { data: profile } = await supabase
  .from("profiles")
  .select("role, full_name")
  .eq("id", user.id)
  .single();

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  const { count: coursesCount } = await supabase
    .from("courses")
    .select("*", { count: "exact", head: true });

  const { count: usersCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  const { count: subscriptionsCount } = await supabase
    .from("subscriptions")
    .select("*", { count: "exact", head: true });

  return (
    <main className="admin-page">
      <div className="admin-container">

        <header className="admin-header">
          <div>
            <p className="admin-eyebrow">MEDLIB ADMIN</p>

            <h1>Tableau de bord</h1>

            <p>
              Bienvenue, {profile?.full_name || user.email}.
              Gérez votre plateforme médicale depuis cet espace.
            </p>
          </div>

          <Link href="/dashboard" className="admin-back">
            ← Espace étudiant
          </Link>
        </header>

        <section className="admin-stats">

          <div className="admin-stat">
            <span className="admin-stat-icon">📚</span>
            <span className="admin-stat-label">Cours</span>
            <strong>{coursesCount ?? 0}</strong>
          </div>

          <div className="admin-stat">
            <span className="admin-stat-icon">👥</span>
            <span className="admin-stat-label">Utilisateurs</span>
            <strong>{usersCount ?? 0}</strong>
          </div>

          <div className="admin-stat">
            <span className="admin-stat-icon">💳</span>
            <span className="admin-stat-label">Abonnements</span>
            <strong>{subscriptionsCount ?? 0}</strong>
          </div>

        </section>

        <section className="admin-actions">

          <Link href="/dashboard/admin/courses/new" className="admin-action primary">
            <span>➕</span>
            <div>
              <strong>Ajouter un cours</strong>
              <small>
                Créer et publier un nouveau cours médical
              </small>
            </div>
          </Link>

          <Link href="/dashboard/library" className="admin-action">
            <span>📚</span>
            <div>
              <strong>Bibliothèque</strong>
              <small>
                Voir les cours actuellement disponibles
              </small>
            </div>
          </Link>

          <div className="admin-action disabled">
            <span>👥</span>
            <div>
              <strong>Utilisateurs</strong>
              <small>
                Gestion des utilisateurs — prochaine étape
              </small>
            </div>
          </div>

          <div className="admin-action disabled">
            <span>💳</span>
            <div>
              <strong>Abonnements</strong>
              <small>
                Gestion des abonnements — prochaine étape
              </small>
            </div>
          </div>

        </section>

        <div className="admin-security">
          🔐 <strong>Espace sécurisé :</strong> seuls les comptes
          administrateurs autorisés peuvent accéder à cette interface.
        </div>

      </div>
    </main>
  );
      }

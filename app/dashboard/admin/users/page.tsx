
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import "./users.css";

export default async function AdminUsersPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Vérifier que le compte est administrateur.
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (
    user.id !== "99bb7b97-6e94-4dff-b859-edbdafa69844" &&
    profile?.role !== "admin"
  ) {
    redirect("/dashboard");
  }

  const { data: users, error } = await supabase
    .from("profiles")
    .select("id, full_name, role, status, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="users-page">
        <h1>Gestion des utilisateurs</h1>
        <p>Impossible de charger les utilisateurs.</p>
        <Link href="/dashboard/admin">Retour à l'administration</Link>
      </main>
    );
  }

  return (
    <main className="users-page">
      <div className="users-container">
        <header className="users-header">
          <div>
            <p className="users-eyebrow">MEDLIB ADMIN</p>
            <h1>Gestion des utilisateurs</h1>
            <p>Consulte les comptes enregistrés sur MedLib.</p>
          </div>

          <Link
            href="/dashboard/admin"
            className="users-back"
          >
            ← Administration
          </Link>
        </header>

        <section className="users-summary">
          <span>Nombre de comptes</span>
          <strong>{users?.length ?? 0}</strong>
        </section>

        <section className="users-table-card">
          <h2>Liste des utilisateurs</h2>

          {users && users.length > 0 ? (
            <div className="users-table-scroll">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Rôle</th>
                    <th>Statut</th>
                    <th>Inscription</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <strong>
                          {item.full_name || "Nom non renseigné"}
                        </strong>
                        <small className="users-id">
                          {item.id}
                        </small>
                      </td>

                      <td>
                        {item.role === "admin"
                          ? "Administrateur"
                          : "Étudiant"}
                      </td>

                      <td>
                        <span
                          className={
                            item.status === "active"
                              ? "users-status active"
                              : "users-status"
                          }
                        >
                          {item.status || "Non défini"}
                        </span>
                      </td>

                      <td>
                        {item.created_at
                          ? new Date(
                              item.created_at
                            ).toLocaleDateString("fr-FR")
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>Aucun utilisateur trouvé.</p>
          )}
        </section>
      </div>
    </main>
  );
          }
                            

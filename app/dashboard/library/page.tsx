import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import "./library.css";

export default async function LibraryPage() {
  const supabase = await createClient();

  const { data: courses } = await supabase
    .from("courses")
    .select(`
      id,
      title,
      slug,
      description,
      access_type,
      status,
      pages_count,
      level,
      categories (
        name
      )
    `)
    .eq("status", "published")
    .order("created_at", { ascending: false });

  return (
    <main className="library-page">
      <div className="library-container">

        <header className="library-header">
          <div>
            <p className="library-eyebrow">MEDLIB</p>

            <h1>Bibliothèque médicale</h1>

            <p>
              Explorez nos cours médicaux et trouvez les ressources
              dont vous avez besoin pour vos études.
            </p>
          </div>

          <Link href="/dashboard" className="back-button">
            ← Tableau de bord
          </Link>
        </header>

        <div className="library-search">
          <input
            type="search"
            placeholder="Rechercher un cours..."
          />
        </div>

        <div className="library-filters">
          <button className="filter active">Tous</button>
          <button className="filter">Anatomie</button>
          <button className="filter">Physiologie</button>
          <button className="filter">Pharmacologie</button>
          <button className="filter">Pathologie</button>
        </div>

        <section className="courses-section">

          <div className="section-heading">
            <h2>Cours disponibles</h2>
            <span>
              {courses?.length ?? 0} cours
            </span>
          </div>

          {courses && courses.length > 0 ? (
            <div className="courses-grid">

              {courses.map((course) => (
                <article
                  key={course.id}
                  className="course-card"
                >
                  <div className="course-cover">
                    <span>📚</span>

                    {course.access_type === "free" ? (
                      <strong className="free-badge">
                        Gratuit
                      </strong>
                    ) : (
                      <strong className="premium-badge">
                        Premium
                      </strong>
                    )}
                  </div>

                  <div className="course-content">

                    <p className="course-category">
                      {course.categories?.[0]?.name ?? "Médecine"}
                    </p>

                    <h3>{course.title}</h3>

                    <p className="course-description">
                      {course.description ||
                        "Cours médical disponible dans la bibliothèque MedLib."}
                    </p>

                    <div className="course-meta">
                      <span>
                        📄 {course.pages_count ?? 0} pages
                      </span>

                      <span>
                        🎓 {course.level ?? "Tous niveaux"}
                      </span>
                    </div>

                    <Link
                      href={`/library/${course.slug}`}
                      className="course-button"
                    >
                      Voir le cours →
                    </Link>

                  </div>
                </article>
              ))}

            </div>
          ) : (
            <div className="empty-library">
              <div>📚</div>

              <h3>Aucun cours disponible pour le moment</h3>

              <p>
                Les cours publiés par l'administrateur
                apparaîtront ici.
              </p>
            </div>
          )}

        </section>

      </div>
    </main>
  );
}

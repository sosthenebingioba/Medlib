import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import "./course.css";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CoursePage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }
console.log("MEDLIB COURSE PAGE CHARGÉE", slug);
  const { data: course, error } = await supabase
    .from("courses")
    .select(`
      id,
      title,
      slug,
      description,
      author,
      level,
      access_type,
      status,
      pages_count,
      objectives,
      categories (
        name
      )
    `)
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !course) {
    notFound();
  }

  const category =
    Array.isArray(course.categories) && course.categories.length > 0
      ? course.categories[0].name
      : "Médecine";

  const isFree = course.access_type === "free";

  return (
    <main className="course-page">
      <div className="course-container">

        <Link href="/dashboard/library" className="course-back">
          ← Retour à la bibliothèque
        </Link>

        <section className="course-hero">

          <div className="course-cover-large">
            <span>📚</span>

            {isFree ? (
              <strong className="course-free">
                🟢 Gratuit
              </strong>
            ) : (
              <strong className="course-premium">
                🔒 Premium
              </strong>
            )}
          </div>

          <div className="course-main">

            <p className="course-category">
              {category}
            </p>

            <h1>{course.title}</h1>

            <p className="course-description">
              {course.description ||
                "Découvrez ce cours médical sur MedLib."}
            </p>

            <div className="course-information">

              <div>
                <span>Auteur</span>
                <strong>
                  {course.author || "MedLib"}
                </strong>
              </div>

              <div>
                <span>Niveau</span>
                <strong>
                  {course.level || "Tous niveaux"}
                </strong>
              </div>

              <div>
                <span>Pages</span>
                <strong>
                  {course.pages_count || 0}
                </strong>
              </div>

              <div>
                <span>Accès</span>
                <strong>
                  {isFree ? "Gratuit" : "Premium"}
                </strong>
              </div>

            </div>

            <div className="course-access">

              {isFree ? (
                <Link
                  href={`/dashboard/library/${course.slug}/reader`}
                  className="read-course-button"
                >
                  📖 Lire le cours →
                </Link>
              ) : (
                <div className="locked-course">

                  <div className="locked-icon">
                    🔒
                  </div>

                  <div>
                    <strong>
                      Contenu premium
                    </strong>

                    <p>
                      Ce cours est réservé aux étudiants
                      disposant d'un abonnement actif.
                    </p>
                  </div>

                  <Link
                    href="/dashboard/subscription"
                    className="subscribe-button"
                  >
                    S'abonner
                  </Link>

                </div>
              )}

            </div>

          </div>
        </section>

        <section className="course-details">

          <div className="details-card">

            <h2>
              À propos de ce cours
            </h2>

            <p>
              {course.description ||
                "Ce cours est disponible dans la bibliothèque médicale MedLib."}
            </p>

          </div>

          {course.objectives && (
            <div className="details-card">

              <h2>
                Objectifs pédagogiques
              </h2>

              <p>
                {course.objectives}
              </p>

            </div>
          )}

          <div className="details-card">

            <h2>
              Informations
            </h2>

            <div className="detail-row">
              <span>Catégorie</span>
              <strong>{category}</strong>
            </div>

            <div className="detail-row">
              <span>Niveau</span>
              <strong>
                {course.level || "Tous niveaux"}
              </strong>
            </div>

            <div className="detail-row">
              <span>Auteur</span>
              <strong>
                {course.author || "MedLib"}
              </strong>
            </div>

            <div className="detail-row">
              <span>Nombre de pages</span>
              <strong>
                {course.pages_count || 0}
              </strong>
            </div>

            <div className="detail-row">
              <span>Type d'accès</span>
              <strong>
                {isFree ? "🟢 Gratuit" : "🔒 Premium"}
              </strong>
            </div>

          </div>

        </section>

      </div>
    </main>
  );
    }

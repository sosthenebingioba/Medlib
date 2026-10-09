import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ReaderPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // Vérification de l'utilisateur
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Récupération du cours
  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select(`
      id,
      title,
      slug,
      access_type,
      status
    `)
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (courseError || !course) {
    notFound();
  }

  
  // Vérification de l'accès
  let hasAccess = course.access_type === "free";

  if (!hasAccess) {
    const now = new Date().toISOString();

    const { data: subscriptions, error: subscriptionError } =
      await supabase
        .from("subscriptions")
        .select("id, status, starts_at, expires_at")
        .eq("user_id", user.id)
        .eq("status", "active")
        .lte("starts_at", now)
        .gt("expires_at", now)
        .order("expires_at", { ascending: false })
        .limit(1);

    if (subscriptionError) {
      console.error(
        "Erreur de vérification de l'abonnement :",
        subscriptionError.message
      );
    }

    hasAccess = Boolean(subscriptions?.length);
  }
  

  // Si le cours est premium et que l'utilisateur
  // n'a pas d'abonnement actif
  if (!hasAccess) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          background: "#f5f7fb",
        }}
      >
        <section
          style={{
            width: "100%",
            maxWidth: "560px",
            background: "#ffffff",
            borderRadius: "20px",
            padding: "40px 28px",
            textAlign: "center",
            boxShadow: "0 12px 35px rgba(25, 45, 80, 0.08)",
          }}
        >
          <div style={{ fontSize: "52px", marginBottom: "16px" }}>
            🔒
          </div>

          <h1
            style={{
              margin: "0 0 12px",
              color: "#10284a",
              fontSize: "28px",
            }}
          >
            Contenu premium
          </h1>

          <p
            style={{
              margin: "0 auto 24px",
              maxWidth: "450px",
              color: "#667085",
              lineHeight: "1.7",
            }}
          >
            Ce cours est réservé aux étudiants disposant
            d'un abonnement MedLib actif.
          </p>

          <Link
            href="/dashboard/library"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "46px",
              padding: "0 20px",
              borderRadius: "10px",
              background: "#eef3f9",
              color: "#17345f",
              textDecoration: "none",
              fontWeight: 700,
              marginRight: "8px",
            }}
          >
            ← Bibliothèque
          </Link>

          <Link
            href="/dashboard/subscription"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "46px",
              padding: "0 20px",
              borderRadius: "10px",
              background: "#1557a6",
              color: "#ffffff",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            S'abonner
          </Link>
        </section>
      </main>
    );
  }

  // Récupération du document PDF
  const { data: document, error: documentError } = await supabase
    .from("course_documents")
    .select(`
      storage_key,
      file_name,
      file_size,
      mime_type
    `)
    .eq("course_id", course.id)
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (documentError || !document) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          background: "#f5f7fb",
        }}
      >
        <section
          style={{
            width: "100%",
            maxWidth: "560px",
            background: "#ffffff",
            borderRadius: "20px",
            padding: "40px 28px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>
            📄
          </div>

          <h1
            style={{
              color: "#10284a",
              marginBottom: "12px",
            }}
          >
            Document indisponible
          </h1>

          <p
            style={{
              color: "#667085",
              lineHeight: "1.7",
            }}
          >
            Le document PDF de ce cours n'est pas encore
            disponible.
          </p>

          <Link
            href={`/dashboard/library/${course.slug}`}
            style={{
              display: "inline-block",
              marginTop: "20px",
              color: "#1557a6",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            ← Retour au cours
          </Link>
        </section>
      </main>
    );
  }

  // Création d'une URL temporaire sécurisée
  const { data: signedUrlData, error: signedUrlError } =
    await supabase.storage
      .from("course-pdfs")
      .createSignedUrl(document.storage_key, 60 * 60);

  if (signedUrlError || !signedUrlData?.signedUrl) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          background: "#f5f7fb",
        }}
      >
        <section
          style={{
            width: "100%",
            maxWidth: "560px",
            background: "#ffffff",
            borderRadius: "20px",
            padding: "40px 28px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>
            ⚠️
          </div>

          <h1
            style={{
              color: "#10284a",
              marginBottom: "12px",
            }}
          >
            Impossible d'ouvrir le document
          </h1>

          <p
            style={{
              color: "#667085",
              lineHeight: "1.7",
            }}
          >
            Une erreur est survenue lors de la préparation
            sécurisée du document.
          </p>

          <Link
            href={`/dashboard/library/${course.slug}`}
            style={{
              display: "inline-block",
              marginTop: "20px",
              color: "#1557a6",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            ← Retour au cours
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#101827",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Barre supérieure */}
      <header
        style={{
          minHeight: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          padding: "10px 18px",
          background: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <Link
          href={`/dashboard/library/${course.slug}`}
          style={{
            color: "#17345f",
            textDecoration: "none",
            fontWeight: 700,
            whiteSpace: "nowrap",
          }}
        >
          ← Retour au cours
        </Link>

        <div
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            color: "#172033",
            fontWeight: 700,
          }}
        >
          {course.title}
        </div>
      </header>

      {/* Lecteur PDF */}
      <div
        style={{
          flex: 1,
          minHeight: "calc(100vh - 64px)",
          padding: "12px",
        }}
      >
        <iframe
          src={signedUrlData.signedUrl}
          title={`Lecture de ${course.title}`}
          style={{
            width: "100%",
            height: "calc(100vh - 88px)",
            minHeight: "600px",
            border: "none",
            borderRadius: "10px",
            background: "#ffffff",
          }}
        />
      </div>
    </main>
  );
              }

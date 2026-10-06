"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import "./new-course.css";

function createSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function createSafeFileName(fileName: string) {
  return fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-");
}

export default function NewCoursePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [level, setLevel] = useState("Tous niveaux");
  const [category, setCategory] = useState("Anatomie");
  const [accessType, setAccessType] = useState("premium");
  const [pages, setPages] = useState("");
  const [objectives, setObjectives] = useState("");
  const [status, setStatus] = useState("draft");

  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handlePdfChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    setError("");
    setMessage("");

    if (!file) {
      setPdfFile(null);
      return;
    }

    if (file.type !== "application/pdf") {
      setPdfFile(null);
      event.target.value = "";
      setError("Veuillez sélectionner uniquement un fichier PDF.");
      return;
    }

    const maxSize = 50 * 1024 * 1024;

    if (file.size > maxSize) {
      setPdfFile(null);
      event.target.value = "";
      setError("Le PDF ne doit pas dépasser 50 Mo.");
      return;
    }

    setPdfFile(file);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    const supabase = createClient();

    try {
      // 1. Vérifier la session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setError(
          "Votre session a expiré. Veuillez vous reconnecter."
        );
        return;
      }

      // 2. Vérifier le titre
      const slug = createSlug(title);

      if (!slug) {
        setError("Veuillez saisir un titre valide.");
        return;
      }

      // 3. Vérifier le PDF
      if (!pdfFile) {
        setError("Veuillez sélectionner le PDF du cours.");
        return;
      }

      if (pdfFile.type !== "application/pdf") {
        setError("Le document doit être au format PDF.");
        return;
      }

      // 4. Vérifier si le slug existe déjà
      const { data: existingCourse, error: slugError } =
        await supabase
          .from("courses")
          .select("id")
          .eq("slug", slug)
          .maybeSingle();

      if (slugError) {
        throw new Error(slugError.message);
      }

      if (existingCourse) {
        setError(
          "Un cours avec ce titre existe déjà. Choisissez un autre titre."
        );
        return;
      }

      // 5. Chercher la catégorie
      const { data: categoryData, error: categoryError } =
        await supabase
          .from("categories")
          .select("id")
          .eq("name", category)
          .maybeSingle();

      if (categoryError) {
        throw new Error(categoryError.message);
      }

      if (!categoryData) {
        setError(
          `La catégorie "${category}" n'existe pas encore dans MedLib.`
        );
        return;
      }

      // 6. Créer le cours
      const { data: courseData, error: insertError } =
        await supabase
          .from("courses")
          .insert({
            title,
            slug,
            description,
            objectives,
            author,
            level,
            pages_count: pages ? Number(pages) : 0,
            category_id: categoryData.id,
            access_type: accessType,
            status,
          })
          .select("id")
          .single();

      if (insertError) {
        throw new Error(insertError.message);
      }

      if (!courseData) {
        throw new Error(
          "Le cours a été créé mais son identifiant n'a pas été récupéré."
        );
      }

      // 7. Préparer le nom du fichier
      const safeFileName = createSafeFileName(pdfFile.name);

      const storageKey =
        `${session.user.id}/${courseData.id}/${Date.now()}-${safeFileName}`;

      // 8. Envoyer le PDF dans Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("course-pdfs")
        .upload(storageKey, pdfFile, {
          contentType: "application/pdf",
          upsert: false,
        });

      if (uploadError) {
        // Si l'upload échoue, on tente de supprimer le cours créé.
        await supabase
          .from("courses")
          .delete()
          .eq("id", courseData.id);

        throw new Error(
          `Le PDF n'a pas pu être envoyé : ${uploadError.message}`
        );
      }

      // 9. Enregistrer le document dans course_documents
      const { error: documentError } = await supabase
        .from("course_documents")
        .insert({
          course_id: courseData.id,
          storage_key: storageKey,
          file_name: pdfFile.name,
          file_size: pdfFile.size,
          mime_type: "application/pdf",
          version: 1,
        });

      if (documentError) {
        // Si l'enregistrement échoue, supprimer le PDF.
        await supabase.storage
          .from("course-pdfs")
          .remove([storageKey]);

        // Puis supprimer le cours.
        await supabase
          .from("courses")
          .delete()
          .eq("id", courseData.id);

        throw new Error(
          `Le PDF a été envoyé mais n'a pas pu être associé au cours : ${documentError.message}`
        );
      }

      // 10. Succès
      setMessage(
        "✓ Cours et PDF enregistrés avec succès dans MedLib."
      );

      // 11. Réinitialiser le formulaire
      setTitle("");
      setDescription("");
      setAuthor("");
      setPages("");
      setObjectives("");
      setCategory("Anatomie");
      setLevel("Tous niveaux");
      setAccessType("premium");
      setStatus("draft");
      setPdfFile(null);

      const fileInput = document.getElementById(
        "pdf"
      ) as HTMLInputElement | null;

      if (fileInput) {
        fileInput.value = "";
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue lors de la création du cours."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="new-course-page">
      <div className="new-course-container">

        <header className="new-course-header">
          <div>
            <p className="new-course-eyebrow">
              MEDLIB ADMIN
            </p>

            <h1>Ajouter un cours</h1>

            <p>
              Créez un nouveau contenu médical pour la
              bibliothèque MedLib.
            </p>
          </div>

          <Link
            href="/dashboard/admin"
            className="new-course-back"
          >
            ← Retour à l'administration
          </Link>
        </header>

        <form
          onSubmit={handleSubmit}
          className="course-form"
        >

          {message && (
            <div className="form-message success">
              {message}
            </div>
          )}

          {error && (
            <div className="form-message error">
              ⚠ {error}
            </div>
          )}

          {/* INFORMATIONS GÉNÉRALES */}

          <section className="form-card">

            <div className="form-card-header">
              <h2>Informations générales</h2>

              <p>
                Les informations principales du cours.
              </p>
            </div>

            <div className="form-grid">

              <div className="form-field full">
                <label htmlFor="title">
                  Titre du cours *
                </label>

                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
                  placeholder="Ex. Anatomie générale"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="category">
                  Catégorie *
                </label>

                <select
                  id="category"
                  value={category}
                  onChange={(event) =>
                    setCategory(event.target.value)
                  }
                >
                  <option>Anatomie</option>
                  <option>Physiologie</option>
                  <option>Biochimie</option>
                  <option>Histologie</option>
                  <option>Pharmacologie</option>
                  <option>Pathologie</option>
                  <option>Cardiologie</option>
                  <option>Pneumologie</option>
                  <option>Neurologie</option>
                  <option>Infectiologie</option>
                  <option>Néphrologie</option>
                  <option>Pédiatrie</option>
                  <option>Gynécologie-obstétrique</option>
                  <option>Chirurgie</option>
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="level">
                  Niveau
                </label>

                <select
                  id="level"
                  value={level}
                  onChange={(event) =>
                    setLevel(event.target.value)
                  }
                >
                  <option>Tous niveaux</option>
                  <option>Débutant</option>
                  <option>Intermédiaire</option>
                  <option>Avancé</option>
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="author">
                  Auteur
                </label>

                <input
                  id="author"
                  type="text"
                  value={author}
                  onChange={(event) =>
                    setAuthor(event.target.value)
                  }
                  placeholder="Nom de l'auteur"
                />
              </div>

              <div className="form-field">
                <label htmlFor="pages">
                  Nombre de pages
                </label>

                <input
                  id="pages"
                  type="number"
                  min="0"
                  value={pages}
                  onChange={(event) =>
                    setPages(event.target.value)
                  }
                  placeholder="Ex. 120"
                />
              </div>

              <div className="form-field full">
                <label htmlFor="description">
                  Description *
                </label>

                <textarea
                  id="description"
                  rows={5}
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  placeholder="Présentez brièvement le contenu et l'intérêt pédagogique de ce cours..."
                  required
                />
              </div>

              <div className="form-field full">
                <label htmlFor="objectives">
                  Objectifs pédagogiques
                </label>

                <textarea
                  id="objectives"
                  rows={5}
                  value={objectives}
                  onChange={(event) =>
                    setObjectives(event.target.value)
                  }
                  placeholder="Ex. Comprendre les principales fonctions du sang..."
                />
              </div>

            </div>
          </section>

          {/* DOCUMENT PDF */}

          <section className="form-card">

            <div className="form-card-header">
              <h2>Document du cours</h2>

              <p>
                Importez le PDF qui sera associé à ce cours.
              </p>
            </div>

            <div className="form-field full">

              <label htmlFor="pdf">
                Fichier PDF *
              </label>

              <input
                id="pdf"
                type="file"
                accept="application/pdf,.pdf"
                onChange={handlePdfChange}
                required
              />

              <small>
                Format accepté : PDF — taille maximale : 50 Mo.
              </small>

              {pdfFile && (
                <div
                  style={{
                    marginTop: "12px",
                    padding: "12px 14px",
                    borderRadius: "12px",
                    background: "#ecfdf5",
                    border: "1px solid #a7f3d0",
                  }}
                >
                  <strong>
                    📄 {pdfFile.name}
                  </strong>

                  <br />

                  <small>
                    {(pdfFile.size / (1024 * 1024)).toFixed(2)} Mo
                  </small>
                </div>
              )}

            </div>
          </section>

          {/* ACCÈS */}

          <section className="form-card">

            <div className="form-card-header">
              <h2>Accès au contenu</h2>

              <p>
                Définissez qui pourra accéder à ce cours.
              </p>
            </div>

            <div className="access-options">

              <label
                className={`access-option ${
                  accessType === "free"
                    ? "selected"
                    : ""
                }`}
              >
                <input
                  type="radio"
                  name="accessType"
                  value="free"
                  checked={accessType === "free"}
                  onChange={(event) =>
                    setAccessType(event.target.value)
                  }
                />

                <span>
                  <strong>🟢 Gratuit</strong>

                  <small>
                    Accessible sans abonnement.
                  </small>
                </span>
              </label>

              <label
                className={`access-option ${
                  accessType === "premium"
                    ? "selected"
                    : ""
                }`}
              >
                <input
                  type="radio"
                  name="accessType"
                  value="premium"
                  checked={accessType === "premium"}
                  onChange={(event) =>
                    setAccessType(event.target.value)
                  }
                />

                <span>
                  <strong>🔒 Premium</strong>

                  <small>
                    Accessible uniquement aux abonnés.
                  </small>
                </span>
              </label>

            </div>
          </section>

          {/* PUBLICATION */}

          <section className="form-card">

            <div className="form-card-header">
              <h2>Publication</h2>

              <p>
                Choisissez l'état du cours.
              </p>
            </div>

            <div className="form-grid">

              <div className="form-field">

                <label htmlFor="status">
                  Statut
                </label>

                <select
                  id="status"
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value)
                  }
                >
                  <option value="draft">
                    Brouillon
                  </option>

                  <option value="published">
                    Publié
                  </option>
                </select>

              </div>

            </div>
          </section>

          {/* ACTIONS */}

          <div className="form-actions">

            <Link
              href="/dashboard/admin"
              className="cancel-button"
            >
              Annuler
            </Link>

            <button
              type="submit"
              className="create-button"
              disabled={loading}
            >
              {loading
                ? "Enregistrement du cours et du PDF..."
                : "Créer le cours →"}
            </button>

          </div>

        </form>
      </div>
    </main>
  );
                              }

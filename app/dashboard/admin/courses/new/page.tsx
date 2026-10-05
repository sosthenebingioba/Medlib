"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import "./new-course.css";

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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    alert(
      "Le formulaire est prêt. La connexion à Supabase sera ajoutée à l'étape suivante."
    );
  }

  return (
    <main className="new-course-page">
      <div className="new-course-container">
        <header className="new-course-header">
          <div>
            <p className="new-course-eyebrow">MEDLIB ADMIN</p>

            <h1>Ajouter un cours</h1>

            <p>
              Créez un nouveau contenu médical pour la bibliothèque MedLib.
            </p>
          </div>

          <Link href="/dashboard/admin" className="new-course-back">
            ← Retour à l'administration
          </Link>
        </header>

        <form onSubmit={handleSubmit} className="course-form">
          <section className="form-card">
            <div className="form-card-header">
              <h2>Informations générales</h2>
              <p>Les informations principales du cours.</p>
            </div>

            <div className="form-grid">
              <div className="form-field full">
                <label htmlFor="title">Titre du cours *</label>

                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Ex. Anatomie générale"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="category">Catégorie *</label>

                <select
                  id="category"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
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
                <label htmlFor="level">Niveau</label>

                <select
                  id="level"
                  value={level}
                  onChange={(event) => setLevel(event.target.value)}
                >
                  <option>Tous niveaux</option>
                  <option>Débutant</option>
                  <option>Intermédiaire</option>
                  <option>Avancé</option>
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="author">Auteur</label>

                <input
                  id="author"
                  type="text"
                  value={author}
                  onChange={(event) => setAuthor(event.target.value)}
                  placeholder="Nom de l'auteur"
                />
              </div>

              <div className="form-field">
                <label htmlFor="pages">Nombre de pages</label>

                <input
                  id="pages"
                  type="number"
                  min="0"
                  value={pages}
                  onChange={(event) => setPages(event.target.value)}
                  placeholder="Ex. 120"
                />
              </div>

              <div className="form-field full">
                <label htmlFor="description">Description *</label>

                <textarea
                  id="description"
                  rows={5}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
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
                  onChange={(event) => setObjectives(event.target.value)}
                  placeholder="Ex. Comprendre l'organisation anatomique du cœur..."
                />
              </div>
            </div>
          </section>

          <section className="form-card">
            <div className="form-card-header">
              <h2>Accès au contenu</h2>

              <p>Définissez qui pourra accéder à ce cours.</p>
            </div>

            <div className="access-options">
              <label
                className={`access-option ${
                  accessType === "free" ? "selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name="accessType"
                  value="free"
                  checked={accessType === "free"}
                  onChange={(event) => setAccessType(event.target.value)}
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
                  accessType === "premium" ? "selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name="accessType"
                  value="premium"
                  checked={accessType === "premium"}
                  onChange={(event) => setAccessType(event.target.value)}
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

          <section className="form-card">
            <div className="form-card-header">
              <h2>Publication</h2>

              <p>Choisissez l'état du cours.</p>
            </div>

            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="status">Statut</label>

                <select
                  id="status"
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                >
                  <option value="draft">Brouillon</option>
                  <option value="published">Publié</option>
                </select>
              </div>
            </div>
          </section>

          <div className="form-actions">
            <Link href="/dashboard/admin" className="cancel-button">
              Annuler
            </Link>

            <button type="submit" className="create-button">
              Créer le cours →
            </button>
          </div>
        </form>
      </div>
    </main>
  );
                }

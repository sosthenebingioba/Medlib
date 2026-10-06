import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import "./subscription.css";

export default async function SubscriptionPage() {
    console.log("MEDLIB SUBSCRIPTION PAGE");
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select(`
      id,
      status,
      starts_at,
      ends_at,
      plan_id,
      plans (
        name,
        price,
        duration_days
      )
    `)
    .eq("user_id", user.id)
    .eq("status", "active")
    .gt("ends_at", new Date().toISOString())
    .order("ends_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const activePlan = subscription?.plans
    ? Array.isArray(subscription.plans)
      ? subscription.plans[0]
      : subscription.plans
    : null;

  return (
    <main className="subscription-page">
      <div className="subscription-container">

        <Link
          href="/dashboard"
          className="subscription-back"
        >
          ← Retour au tableau de bord
        </Link>

        <section className="subscription-header">
          <span className="subscription-eyebrow">
            MEDLIB PREMIUM
          </span>

          <h1>
            Choisissez votre abonnement
          </h1>

          <p>
            Accédez à la bibliothèque médicale premium
            et étudiez vos cours où que vous soyez.
          </p>
        </section>

        {subscription && (
          <section className="current-subscription">

            <div className="current-icon">
              ✓
            </div>

            <div>
              <span>
                Votre abonnement actuel
              </span>

              <strong>
                {activePlan?.name || "MedLib Premium"}
              </strong>

              <p>
                Actif jusqu'au{" "}
                {subscription.ends_at
                  ? new Date(subscription.ends_at).toLocaleDateString(
                      "fr-FR"
                    )
                  : "—"}
              </p>
            </div>

          </section>
        )}

        <section className="plans-grid">

          {/* PLAN MENSUEL */}
          <article className="plan-card">

            <div className="plan-top">
              <span className="plan-duration">
                30 JOURS
              </span>

              <h2>
                Mensuel
              </h2>

              <p>
                Idéal pour commencer
              </p>
            </div>

            <div className="plan-price">
              <strong>
                5$
              </strong>

              <span>
                / mois
              </span>
            </div>

            <ul className="plan-features">
              <li>✓ Accès aux cours premium</li>
              <li>✓ Lecture des PDF en ligne</li>
              <li>✓ Bibliothèque complète</li>
              <li>✓ Accès depuis mobile et ordinateur</li>
            </ul>

            <Link
              href="/dashboard/subscription/checkout?plan=monthly"
              className="plan-button"
            >
              Choisir ce plan
            </Link>

          </article>

          {/* PLAN 6 MOIS */}
          <article className="plan-card plan-featured">

            <div className="popular-badge">
              LE PLUS POPULAIRE
            </div>

            <div className="plan-top">
              <span className="plan-duration">
                6 MOIS
              </span>

              <h2>
                Semestriel
              </h2>

              <p>
                Pour une année universitaire
              </p>
            </div>

            <div className="plan-price">
              <strong>
                25$
              </strong>

              <span>
                / 6 mois
              </span>
            </div>

            <ul className="plan-features">
              <li>✓ Accès aux cours premium</li>
              <li>✓ Lecture des PDF en ligne</li>
              <li>✓ Bibliothèque complète</li>
              <li>✓ Accès depuis mobile et ordinateur</li>
              <li>✓ Meilleur rapport qualité/prix</li>
            </ul>

            <Link
              href="/dashboard/subscription/checkout?plan=semester"
              className="plan-button"
            >
              Choisir ce plan
            </Link>

          </article>

          {/* PLAN ANNUEL */}
          <article className="plan-card">

            <div className="plan-top">
              <span className="plan-duration">
                12 MOIS
              </span>

              <h2>
                Annuel
              </h2>

              <p>
                Pour étudier toute l'année
              </p>
            </div>

            <div className="plan-price">
              <strong>
                45$
              </strong>

              <span>
                / an
              </span>
            </div>

            <ul className="plan-features">
              <li>✓ Accès aux cours premium</li>
              <li>✓ Lecture des PDF en ligne</li>
              <li>✓ Bibliothèque complète</li>
              <li>✓ Accès depuis mobile et ordinateur</li>
              <li>✓ Accès pendant 12 mois</li>
            </ul>

            <Link
              href="/dashboard/subscription/checkout?plan=annual"
              className="plan-button"
            >
              Choisir ce plan
            </Link>

          </article>

        </section>

        <section className="subscription-note">

          <strong>
            🔐 Paiement sécurisé
          </strong>

          <p>
            Votre abonnement sera activé automatiquement
            après confirmation du paiement.
          </p>

        </section>

      </div>
    </main>
  );
      }

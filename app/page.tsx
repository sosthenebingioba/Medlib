
import Link from "next/link";

export default function Home() {
  return (
    <main className="medlib">
      <header className="header">
        <Link href="/" className="brand">
          <span className="brand-icon">M+</span>
          <span>MedLib</span>
        </Link>

        <nav>
          <a href="#accueil">Accueil</a>
          <a href="#avantages">À propos</a>
          <Link href="/login">Espace étudiant</Link>
          <Link href="/dashboard/admin" className="admin-link">
            Administration
          </Link>
        </nav>
      </header>

      <section className="hero" id="accueil">
        <div className="hero-content">
          <span className="eyebrow">
            BIBLIOTHÈQUE MÉDICALE NUMÉRIQUE
          </span>

          <h1>
            Apprenez la médecine.
            <br />
            <span>Progressez chaque jour.</span>
          </h1>

          <p>
            Retrouvez vos cours médicaux, organisez vos révisions
            et accédez à vos ressources pédagogiques depuis
            votre téléphone ou votre ordinateur.
          </p>

          <div className="actions">
            <Link href="/login" className="primary-btn">
              Accéder à mon espace étudiant →
            </Link>
            <a href="#avantages" className="secondary-btn">
              Découvrir MedLib
            </a>
          </div>

          <div className="benefits">
            <span>✓ Cours organisés</span>
            <span>✓ Lecture en ligne</span>
            <span>✓ Accès sécurisé</span>
          </div>
        </div>

        <div className="visual">
          <div className="book book-back">ANATOMIE</div>
          <div className="book book-front">
            <div className="medical-cross">✚</div>
            <span>MEDLIB</span>
            <strong>LA MÉDECINE<br />À PORTÉE DE MAIN</strong>
            <small>APPRENDRE · COMPRENDRE · PROGRESSER</small>
          </div>
          <div className="floating-note">
            <span>📚</span>
            <div>
              <strong>Votre bibliothèque</strong>
              <small>Vos cours au même endroit</small>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="avantages">
        <div className="section-heading">
          <span className="eyebrow">POUR VOS ÉTUDES</span>
          <h2>Tout pour mieux réviser</h2>
          <p>
            Une plateforme conçue pour faciliter l'accès
            aux ressources médicales.
          </p>
        </div>

        <div className="features">
          <article className="feature">
            <div className="feature-icon">📚</div>
            <h3>Bibliothèque médicale</h3>
            <p>
              Retrouvez les cours classés par matières
              et spécialités.
            </p>
          </article>

          <article className="feature">
            <div className="feature-icon">📖</div>
            <h3>Lecture en ligne</h3>
            <p>
              Consultez vos documents pédagogiques
              depuis vos appareils.
            </p>
          </article>

          <article className="feature">
            <div className="feature-icon">🔐</div>
            <h3>Accès personnalisé</h3>
            <p>
              Retrouvez votre espace étudiant et vos
              contenus selon vos droits d'accès.
            </p>
          </article>
        </div>
      </section>

      <section className="student-cta">
        <div>
          <h2>Prêt à commencer vos révisions ?</h2>
          <p>
            Connectez-vous ou créez votre compte étudiant
            pour découvrir votre espace personnel.
          </p>
        </div>
        <Link href="/login" className="primary-btn">
          Espace étudiant →
        </Link>
      </section>

      <footer className="footer">
        <Link href="/" className="brand">
          <span className="brand-icon">M+</span>
          <span>MedLib</span>
        </Link>

        <p>
          © {new Date().getFullYear()} MedLib.
          Votre bibliothèque médicale numérique.
        </p>

        <Link href="/dashboard/admin" className="footer-admin">
          Administration
        </Link>
      </footer>

      <style>{`
        * { box-sizing: border-box; }

        .medlib {
          min-height: 100vh;
          color: #14243a;
          background: #ffffff;
          font-family: Arial, Helvetica, sans-serif;
        }

        .header {
          min-height: 78px;
          padding: 16px 6%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          border-bottom: 1px solid #edf0f5;
        }

        .brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: #14243a;
          text-decoration: none;
          font-size: 23px;
          font-weight: 800;
        }

        .brand-icon {
          display: grid;
          place-items: center;
          width: 40px;
          height: 40px;
          border-radius: 12px;
          color: white;
          background: #087f8c;
          font-size: 18px;
        }

        nav {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          flex-wrap: wrap;
          gap: 22px;
        }

        nav a, .footer-admin {
          color: #475569;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
        }

        nav a:hover, .footer-admin:hover {
          color: #087f8c;
        }

        nav .admin-link {
          padding: 12px 16px;
          border: 1px solid #dbe4ed;
          border-radius: 10px;
          color: #14243a;
        }

        .hero {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          align-items: center;
          gap: 40px;
          padding: 75px 8%;
          background: linear-gradient(135deg, #f3fbfb, #f8faff);
          overflow: hidden;
        }

        .hero-content { max-width: 650px; }

        .eyebrow {
          color: #087f8c;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1.8px;
        }

        h1 {
          margin: 22px 0;
          font-size: clamp(36px, 4.5vw, 58px);
          line-height: 1.12;
          letter-spacing: -1.8px;
        }

        h1 span { color: #087f8c; }

        .hero-content > p, .section-heading > p,
        .student-cta p {
          color: #64748b;
          font-size: 16px;
          line-height: 1.8;
        }

        .actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 28px;
        }

        .primary-btn, .secondary-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 15px 19px;
          border-radius: 10px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 700;
        }

        .primary-btn {
          color: white;
          background: #087f8c;
        }

        .primary-btn:hover { background: #066874; }

        .secondary-btn {
          color: #14243a;
          background: white;
          border: 1px solid #dbe4ed;
        }

        .benefits {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          margin-top: 25px;
          color: #536579;
          font-size: 12px;
        }

        .visual {
          position: relative;
          min-height: 340px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 28px;
          background: #e0f1f0;
        }

        .book {
          position: absolute;
          width: 210px;
          height: 270px;
          border-radius: 5px 14px 14px 5px;
          box-shadow: 0 22px 40px #173c4b2b;
        }

        .book-back {
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding: 25px;
          transform: translate(35px, -5px) rotate(9deg);
          background: #d2e0ed;
          color: #31536c;
          font-weight: 800;
        }

        .book-front {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 20px;
          padding: 20px;
          color: white;
          text-align: center;
          transform: translate(-20px, 5px) rotate(-5deg);
          background: linear-gradient(150deg, #087f8c, #12334d);
        }

        .medical-cross { font-size: 43px; }
        .book-front > span { font-size: 12px; letter-spacing: 3px; }
        .book-front strong { font-size: 20px; line-height: 1.5; }
        .book-front small { font-size: 8px; letter-spacing: 1px; }

        .floating-note {
          position: absolute;
          right: 8px;
          bottom: 24px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px;
          border-radius: 13px;
          background: white;
          box-shadow: 0 10px 35px #173c4b18;
        }

        .floating-note > span { font-size: 26px; }
        .floating-note strong, .floating-note small { display: block; }
        .floating-note strong { font-size: 12px; }
        .floating-note small { margin-top: 5px; color: #64748b; font-size: 10px; }

        .section { padding: 70px 8%; }

        .section-heading { text-align: center; }
        .section-heading h2, .student-cta h2 {
          margin: 14px 0;
          font-size: 32px;
          letter-spacing: -0.7px;
        }

        .features {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 22px;
          margin-top: 38px;
        }

        .feature {
          padding: 27px;
          border: 1px solid #e7edf3;
          border-radius: 17px;
          background: white;
        }

        .feature-icon {
          display: grid;
          place-items: center;
          width: 48px;
          height: 48px;
          border-radius: 13px;
          background: #e8f7f6;
          font-size: 23px;
        }

        .feature h3 { margin: 20px 0 10px; font-size: 18px; }
        .feature p { color: #64748b; font-size: 14px; line-height: 1.8; }

        .student-cta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
          margin: 0 8% 60px;
          padding: 35px;
          border-radius: 20px;
          background: #f0f8f8;
        }

        .student-cta h2 { font-size: 25px; }
        .student-cta p { margin-bottom: 0; }

        .footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 20px;
          padding: 25px 6%;
          border-top: 1px solid #edf0f5;
        }

        .footer p { color: #64748b; font-size: 12px; }

        @media (max-width: 760px) {
          .header { align-items: flex-start; flex-direction: column; }
          nav { justify-content: flex-start; gap: 14px; }
          nav a { font-size: 12px; }
          .hero { grid-template-columns: 1fr; padding: 48px 6%; }
          .visual { min-height: 330px; }
          .features { grid-template-columns: 1fr; }
          .section { padding: 50px 6%; }
          .student-cta { align-items: flex-start; flex-direction: column; margin: 0 6% 40px; padding: 25px; }
          .footer { align-items: flex-start; flex-direction: column; }
          h1 { letter-spacing: -1px; }
        }
      `}</style>
    </main>
  );
      }


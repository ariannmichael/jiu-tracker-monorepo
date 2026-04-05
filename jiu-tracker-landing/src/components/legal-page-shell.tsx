import Image from "next/image";
import Link from "next/link";

type LegalPageShellProps = {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
};

export function LegalPageShell({
  title,
  lastUpdated,
  children,
}: LegalPageShellProps) {
  return (
    <main className="landing-shell">
      <header
        className="section-container"
        style={{ paddingTop: "2rem", paddingBottom: "1rem" }}
      >
        <Link href="/" className="brand-lockup" style={{ textDecoration: "none" }}>
          <div className="brand-mark brand-mark-small">
            <Image
              src="/jiu-tracker-logo.png"
              alt="Logo do Jiu Tracker"
              width={1024}
              height={1024}
              className="brand-logo-image"
            />
          </div>
          <span className="brand-name">Jiu Tracker</span>
        </Link>
      </header>

      <section
        className="section-container section-block"
        style={{ maxWidth: "720px" }}
      >
        <h1>{title}</h1>
        <p className="hero-description" style={{ marginTop: "0.5rem" }}>
          {lastUpdated}
        </p>
        <div className="privacy-content">{children}</div>
      </section>

      <footer className="section-container footer">
        <div>
          <div className="brand-lockup">
            <div className="brand-mark brand-mark-small">
              <Image
                src="/jiu-tracker-logo.png"
                alt="Logo do Jiu Tracker"
                width={1024}
                height={1024}
                className="brand-logo-image"
              />
            </div>
            <span className="brand-name">Jiu Tracker</span>
          </div>
          <p className="footer-copy">
            Registro de treinos, estatísticas e técnicas para praticantes que
            querem evoluir com mais intenção.
          </p>
        </div>

        <div className="footer-links">
          <a href="mailto:ariannmichael@gmail.com">Contato</a>
          <Link href="/">Início</Link>
          <Link href="/privacy">Privacidade</Link>
          <Link href="/terms">Termos de uso</Link>
          <Link href="/account-deletion">Exclusão de conta</Link>
          <Link href="/#recursos">Recursos</Link>
        </div>
      </footer>
    </main>
  );
}

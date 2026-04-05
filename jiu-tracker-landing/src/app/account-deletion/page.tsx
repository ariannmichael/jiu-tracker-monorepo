import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const CONTACT_EMAIL = "ariannmichael@gmail.com";

export const metadata: Metadata = {
  title: "Exclusão de conta e dados | Jiu Tracker",
  description:
    "Como solicitar a exclusão da sua conta e dos seus dados no Jiu Tracker (402 Software).",
};

export default function AccountDeletionPage() {
  return (
    <main className="landing-shell">
      <header
        className="section-container"
        style={{ paddingTop: "2rem", paddingBottom: "1rem" }}
      >
        <Link
          href="/"
          className="brand-lockup"
          style={{ textDecoration: "none" }}
        >
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
        <h1>Exclusão de conta e dados</h1>
        <p className="hero-description" style={{ marginTop: "0.5rem" }}>
          Última atualização: março de 2026
        </p>

        <div className="privacy-content">
          <p>
            Este documento descreve como solicitar a exclusão da sua conta e dos
            seus dados no aplicativo <strong>Jiu Tracker</strong>, desenvolvido
            por <strong>402 Software</strong> (nome do desenvolvedor na Google
            Play).
          </p>

          <h2>1. Como solicitar a exclusão (passo a passo)</h2>
          <ol style={{ paddingLeft: "1.25rem", lineHeight: 1.6 }}>
            <li>
              Envie um e-mail para{" "}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </li>
            <li>
              Use o assunto:{" "}
              <strong>Solicitação de exclusão de conta – Jiu Tracker</strong>.
            </li>
            <li>
              No corpo da mensagem, informe o <strong>endereço de e-mail</strong>{" "}
              da conta cadastrada no app e, se possível, o seu{" "}
              <strong>nome de usuário</strong>.
            </li>
            <li>
              Enviaremos uma confirmação de recebimento. Após processar o pedido,
              confirmaremos quando a exclusão tiver sido concluída.
            </li>
          </ol>
          <p>
            Alternativa: se você estiver autenticado no aplicativo, também é
            possível excluir a conta pelas configurações do app (quando
            disponível), o que remove os dados associados à sua conta nos nossos
            servidores.
          </p>

          <h2>2. O que é excluído</h2>
          <p>Ao concluir a exclusão da conta, removemos, em geral:</p>
          <ul>
            <li>
              <strong>Dados de conta e perfil:</strong> nome, e-mail, nome de
              usuário, senha (hash) e avatar armazenados no serviço.
            </li>
            <li>
              <strong>Dados de treino:</strong> sessões, técnicas associadas,
              notas e registros vinculados à sua conta.
            </li>
            <li>
              <strong>Progresso de faixa:</strong> histórico de faixa/listras no
              app.
            </li>
            <li>
              <strong>Estatísticas e insights:</strong> agregados e insights
              gerados a partir dos seus treinos no Jiu Tracker.
            </li>
          </ul>

          <h2>3. O que pode ser mantido ou tratado separadamente</h2>
          <ul>
            <li>
              <strong>Assinaturas via Google Play:</strong> pagamentos e
              assinaturas são gerenciados pela Google. A exclusão da conta no
              Jiu Tracker <strong>não cancela automaticamente</strong> uma
              assinatura ativa. Para cancelar cobranças, use{" "}
              <strong>Google Play → Perfil → Pagamentos e assinaturas</strong>{" "}
              no dispositivo Android.
            </li>
            <li>
              <strong>Provedores de terceiros</strong> (por exemplo, plataforma
              de assinaturas ou analytics): podemos solicitar exclusão ou
              anonimização conforme as políticas desses serviços. Dados retidos
              por terceiros seguem as regras de cada provedor.
            </li>
            <li>
              <strong>Obrigações legais:</strong> informações mínimas poderão ser
              conservadas pelo tempo exigido por lei ou ordem judicial, quando
              aplicável.
            </li>
          </ul>

          <h2>4. Prazo</h2>
          <p>
            Após o seu pedido válido, buscamos concluir a exclusão dos dados
            pessoais nos nossos sistemas em até <strong>30 dias</strong>, salvo
            obrigação legal de retenção por período maior. Esse prazo está
            alinhado à nossa{" "}
            <Link href="/privacy">Política de Privacidade</Link>.
          </p>

          <h2>5. Contato</h2>
          <p>
            Dúvidas sobre este processo ou sobre seus dados:{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </p>
        </div>
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
          <a href={`mailto:${CONTACT_EMAIL}`}>Contato</a>
          <Link href="/">Início</Link>
          <Link href="/privacy">Privacidade</Link>
          <Link href="/terms">Termos de uso</Link>
          <Link href="/#recursos">Recursos</Link>
        </div>
      </footer>
    </main>
  );
}

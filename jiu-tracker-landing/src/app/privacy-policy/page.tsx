import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidade | Jiu Tracker",
  description:
    "Saiba como o Jiu Tracker coleta, usa e protege seus dados pessoais.",
};

export default function PrivacyPolicy() {
  return (
    <main className="landing-shell">
      <header className="section-container" style={{ paddingTop: "2rem", paddingBottom: "1rem" }}>
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

      <section className="section-container section-block" style={{ maxWidth: "720px" }}>
        <h1>Política de Privacidade</h1>
        <p className="hero-description" style={{ marginTop: "0.5rem" }}>
          Última atualização: março de 2026
        </p>

        <div className="privacy-content">
          <h2>1. Informações que coletamos</h2>
          <p>
            O Jiu Tracker coleta as informações que você fornece diretamente ao
            usar o aplicativo, incluindo:
          </p>
          <ul>
            <li>Dados de conta: nome e endereço de e-mail ao se cadastrar.</li>
            <li>
              Dados de treino: sessões registradas, técnicas, estatísticas e
              anotações que você insere no app.
            </li>
            <li>
              Dados de uso: informações sobre como você interage com o
              aplicativo, como telas acessadas e funcionalidades utilizadas.
            </li>
          </ul>

          <h2>2. Como usamos suas informações</h2>
          <p>Usamos as informações coletadas para:</p>
          <ul>
            <li>Fornecer, manter e melhorar o aplicativo.</li>
            <li>Sincronizar seus dados entre dispositivos.</li>
            <li>Enviar comunicações sobre atualizações e novidades, quando autorizado.</li>
            <li>Responder a dúvidas e solicitações de suporte.</li>
            <li>Analisar padrões de uso para aprimorar a experiência.</li>
          </ul>

          <h2>3. Compartilhamento de informações</h2>
          <p>
            Não vendemos nem alugamos seus dados pessoais a terceiros. Podemos
            compartilhar informações apenas nas seguintes situações:
          </p>
          <ul>
            <li>
              <strong>Provedores de serviço:</strong> parceiros que nos ajudam a
              operar o app (hospedagem, analytics, autenticação), sujeitos a
              obrigações de confidencialidade.
            </li>
            <li>
              <strong>Requisitos legais:</strong> quando exigido por lei,
              regulamento ou ordem judicial.
            </li>
            <li>
              <strong>Proteção de direitos:</strong> quando necessário para
              proteger a segurança de usuários ou do aplicativo.
            </li>
          </ul>

          <h2>4. Armazenamento e segurança</h2>
          <p>
            Seus dados são armazenados em servidores seguros. Adotamos medidas
            técnicas e organizacionais adequadas para proteger suas informações
            contra acesso não autorizado, alteração, divulgação ou destruição.
            Nenhum sistema é 100% seguro, mas nos comprometemos a tratar seus
            dados com o máximo cuidado.
          </p>

          <h2>5. Seus direitos</h2>
          <p>Você tem o direito de:</p>
          <ul>
            <li>Acessar os dados que temos sobre você.</li>
            <li>Corrigir informações incorretas ou desatualizadas.</li>
            <li>Solicitar a exclusão da sua conta e dos seus dados.</li>
            <li>Revogar consentimentos concedidos anteriormente.</li>
          </ul>
          <p>
            Para exercer qualquer um desses direitos, entre em contato pelo
            e-mail abaixo.
          </p>

          <h2>6. Retenção de dados</h2>
          <p>
            Mantemos seus dados enquanto sua conta estiver ativa ou conforme
            necessário para fornecer o serviço. Ao solicitar a exclusão da
            conta, removeremos seus dados pessoais em até 30 dias, salvo
            obrigação legal de retenção.
          </p>

          <h2>7. Serviços de terceiros</h2>
          <p>
            O Jiu Tracker utiliza serviços de terceiros que podem coletar
            informações de acordo com suas próprias políticas, incluindo:
          </p>
          <ul>
            <li>Google Firebase (autenticação e banco de dados)</li>
            <li>Vercel Analytics (análise de uso anônima)</li>
            <li>RevenueCat (gerenciamento de assinaturas)</li>
          </ul>

          <h2>8. Crianças</h2>
          <p>
            O Jiu Tracker não é direcionado a crianças menores de 13 anos e não
            coletamos intencionalmente dados pessoais desse público. Se você
            acredita que coletamos informações de uma criança, entre em contato
            para que possamos removê-las.
          </p>

          <h2>9. Alterações nesta política</h2>
          <p>
            Podemos atualizar esta Política de Privacidade periodicamente.
            Notificaremos sobre mudanças relevantes por meio do aplicativo ou
            por e-mail. O uso continuado do app após as alterações constitui
            aceitação da nova política.
          </p>

          <h2>10. Contato</h2>
          <p>
            Em caso de dúvidas sobre esta política ou sobre seus dados, entre em
            contato:
          </p>
          <p>
            <a href="mailto:ariannmichael@gmail.com">ariannmichael@gmail.com</a>
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
          <a href="mailto:ariannmichael@gmail.com">Contato</a>
          <Link href="/">Inicio</Link>
          <Link href="/#recursos">Recursos</Link>
        </div>
      </footer>
    </main>
  );
}

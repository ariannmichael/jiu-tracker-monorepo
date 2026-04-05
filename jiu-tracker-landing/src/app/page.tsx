import Image from "next/image";
import Link from "next/link";

type ProofCard = {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  metrics: string[];
};

type FeatureCard = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

const proofCards: ProofCard[] = [
  {
    eyebrow: "Registro de Treinos",
    title: "Anote cada rola, técnica e finalização sem perder o contexto.",
    description:
      "Centralize sessões, volume total, posições e padrões que aparecem com frequência na sua rotina.",
    image: "/hero-dashboard.png",
    alt: "Tela inicial do Jiu Tracker com estatísticas de sessões, horas treinadas e taxa de vitória.",
    metrics: ["Sessões por período", "Horas totais", "Consistência semanal"],
  },
  {
    eyebrow: "Análise Estatística",
    title: "Transforme treino acumulado em decisões melhores no tatame.",
    description:
      "Veja relações entre vitória, tipo de jogo, Gi vs NoGi e técnicas mais eficientes para corrigir a preparação.",
    image: "/analytics-screen.png",
    alt: "Tela de analytics do Jiu Tracker mostrando taxa de finalização e técnicas mais vitoriosas.",
    metrics: ["Gi vs NoGi", "Taxa de finalização", "Técnicas mais usadas"],
  },
  {
    eyebrow: "Biblioteca de Técnicas",
    title: "Monte um repertório vivo com as técnicas que você está estudando.",
    description:
      "Organize posições, níveis de domínio e referências para revisar antes do treino ou da competição.",
    image: "/techniques-screen.png",
    alt: "Tela de técnicas do Jiu Tracker com cards de golpes organizados por categoria.",
    metrics: ["Categorias por posição", "Nível de domínio", "Revisão rápida"],
  },
];

const featureCards: FeatureCard[] = [
  {
    title: "Treinos em segundos",
    description:
      "Registre sessões rápido o suficiente para usar logo depois do treino, não no dia seguinte.",
    icon: <PulseIcon />,
  },
  {
    title: "Estatísticas úteis",
    description:
      "Leia vitórias, derrotas, consistência, volume e tendências sem navegar por planilhas.",
    icon: <BarsIcon />,
  },
  {
    title: "Evolução visível",
    description:
      "Descubra o que está funcionando, o que está travando seu jogo e onde focar na próxima fase.",
    icon: <TrendIcon />,
  },
  {
    title: "Técnicas organizadas",
    description:
      "Mantenha uma biblioteca prática para revisar raspagens, passagens, guardas e finalizações.",
    icon: <LibraryIcon />,
  },
];

const insightItems = [
  "Compare frequência de treino com resultados e identifique períodos de queda de consistência.",
  "Entenda quais técnicas geram mais vitórias e quais posições ainda estão desperdiçando rounds.",
  "Chegue no próximo treino com uma intenção clara em vez de repetir sempre o mesmo padrão.",
];

const credibilityItems = [
  "Feito para praticantes de Jiu-Jitsu",
  "Interface pensada para celular",
  "Pronto para evolução contínua",
  "Base ideal para coaches e atletas",
];

const storeBadges = [
  {
    title: "Google Play",
    subtitle: "Disponível em breve",
  },
  {
    title: "App Store",
    subtitle: "Disponível em breve",
  },
];

export default function Home() {
  return (
    <main className="landing-shell">
      <section className="hero-section">
        <div className="section-container hero-grid">
          <div className="hero-copy">
            <div className="brand-lockup">
              <div className="brand-mark">
                <Image
                  src="/jiu-tracker-logo.png"
                  alt="Logo do Jiu Tracker"
                  width={1024}
                  height={1024}
                  className="brand-logo-image"
                  priority
                />
              </div>
              <span className="brand-name">Jiu Tracker</span>
            </div>

            <p className="eyebrow-label">Tracker para atletas de Jiu-Jitsu</p>
            <h1>Acompanhe sua evolução no Jiu-Jitsu com clareza real.</h1>
            <p className="hero-description">
              Registre treinos, acompanhe estatísticas, organize técnicas e
              descubra padrões que ajudam você a treinar com mais intenção.
            </p>

            <div className="hero-actions">
              <a className="button-primary" href="#download">
                Baixar app
              </a>
              <a className="button-secondary" href="#recursos">
                Ver recursos
              </a>
            </div>

            <div className="store-badge-row" aria-label="Plataformas previstas">
              {storeBadges.map((badge) => (
                <div className="store-badge" key={badge.title}>
                  <span className="store-badge-kicker">{badge.subtitle}</span>
                  <strong>{badge.title}</strong>
                </div>
              ))}
            </div>

            <ul className="hero-points" aria-label="Diferenciais principais">
              <li>Treinos, métricas e técnicas no mesmo fluxo.</li>
              <li>Visual premium com leitura rápida no celular.</li>
              <li>Estrutura ideal para praticantes, competidores e coaches.</li>
            </ul>
          </div>

          <div className="hero-visual" id="hero-showcase">
            <div className="phone-glow" aria-hidden="true" />
            <div className="phone-frame">
              <div className="phone-notch" aria-hidden="true" />
              <Image
                src="/hero-dashboard.png"
                alt="Tela inicial do aplicativo Jiu Tracker com painel de estatísticas e gráficos."
                width={678}
                height={1462}
                priority
                className="phone-screen"
              />
            </div>

            <div className="floating-card floating-card-top">
              <span className="floating-label">Consistência</span>
              <strong>8 sessões</strong>
              <p>em 11h30 no ciclo atual</p>
            </div>

            <div className="floating-card floating-card-bottom">
              <span className="floating-label">Foco recomendado</span>
              <strong>Revisar finalizações</strong>
              <p>com base na taxa de conversão recente</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-container section-block">
        <div className="section-heading">
          <p className="section-kicker">Visão completa</p>
          <h2>Cada detalhe do treino em uma interface feita para ser usada.</h2>
        </div>

        <div className="proof-grid">
          {proofCards.map((card) => (
            <article className="proof-card" key={card.eyebrow}>
              <div className="proof-copy">
                <p className="section-kicker">{card.eyebrow}</p>
                <h3>{card.title}</h3>
                <p>{card.description}</p>

                <ul className="metric-list">
                  {card.metrics.map((metric) => (
                    <li key={metric}>{metric}</li>
                  ))}
                </ul>
              </div>

              <div className="proof-image-shell">
                <Image
                  src={card.image}
                  alt={card.alt}
                  width={678}
                  height={1468}
                  className="proof-image"
                />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-container section-block" id="recursos">
        <div className="section-heading section-heading-centered">
          <p className="section-kicker">Principais recursos</p>
          <h2>O que você precisa para sair do treino genérico.</h2>
        </div>

        <div className="feature-grid">
          {featureCards.map((feature) => (
            <article className="feature-card" key={feature.title}>
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-container section-block insight-layout">
        <div className="insight-copy">
          <p className="section-kicker">Treine com intenção</p>
          <h2>Dados úteis para ajustar seu jogo antes que o hábito esconda o problema.</h2>
          <p>
            O Jiu Tracker não serve apenas para guardar informação. Ele ajuda a
            enxergar relação entre frequência, desempenho e repertório técnico
            para orientar a próxima semana de treino.
          </p>

          <ul className="insight-list">
            {insightItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <aside className="insight-panel" aria-label="Resumo de benefícios">
          <div className="insight-stat">
            <span className="insight-stat-value">57%</span>
            <span className="insight-stat-label">Taxa de finalização atual</span>
          </div>
          <div className="insight-bar-group">
            <div>
              <span>Gi vs NoGi</span>
              <strong>100% Gi</strong>
            </div>
            <div className="progress-track">
              <span className="progress-fill progress-fill-blue" />
            </div>
          </div>
          <div className="insight-bar-group">
            <div>
              <span>Técnicas com melhor retorno</span>
              <strong>Triângulo, Mata-Leão</strong>
            </div>
            <div className="tag-row">
              <span className="stat-tag">Raspagem</span>
              <span className="stat-tag">Finalização</span>
              <span className="stat-tag">Intermediário</span>
            </div>
          </div>
        </aside>
      </section>

      <section className="section-container section-block">
        <div className="credibility-strip" aria-label="Pontos de credibilidade">
          {credibilityItems.map((item) => (
            <div className="credibility-chip" key={item}>
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="section-container section-block">
        <div className="cta-panel" id="download">
          <p className="section-kicker">Pronto para o próximo nível</p>
          <h2>Baixe o Jiu Tracker e transforme treino solto em progresso visível.</h2>
          <p>
            A base da página já está pronta para receber os links finais das
            lojas. Até lá, o posicionamento e a experiência visual já trabalham
            a conversão.
          </p>

          <div className="hero-actions">
            <a className="button-primary" href="#hero-showcase">
              Ver o app em ação
            </a>
            <a className="button-secondary" href="mailto:contato@jiutracker.app">
              Falar com a equipe
            </a>
          </div>

          <div className="store-badge-row" aria-label="Lojas planejadas">
            {storeBadges.map((badge) => (
              <div className="store-badge" key={badge.title}>
                <span className="store-badge-kicker">{badge.subtitle}</span>
                <strong>{badge.title}</strong>
              </div>
            ))}
          </div>
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
          <a href="mailto:contato@jiutracker.app">Contato</a>
          <a href="#download">Download</a>
          <a href="#recursos">Recursos</a>
          <Link href="/privacy">Privacidade</Link>
          <Link href="/terms">Termos de uso</Link>
          <Link href="/account-deletion">Exclusão de conta</Link>
        </div>
      </footer>
    </main>
  );
}

function PulseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M3 12h4l2-5 4 10 2-5h6"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function BarsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 20V11" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M10 20V4" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 20v-8" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M22 20V7" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function TrendIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 16l6-6 4 4 6-6"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M16 8h4v4"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function LibraryIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M5 4h5v16H5zM14 4h5v16h-5z"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

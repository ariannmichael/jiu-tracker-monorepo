import Link from "next/link";

export function TermsOfUseDocument() {
  return (
    <>
      <h2>1. Aceitação dos termos</h2>
      <p>
        Ao instalar, acessar ou usar o aplicativo <strong>Jiu Tracker</strong>{" "}
        (“Serviço”), desenvolvido pela 402 Software, você concorda com estes
        Termos de Uso. Se não concordar, não utilize o Serviço.
      </p>

      <h2>2. Descrição do serviço</h2>
      <p>
        O Jiu Tracker oferece ferramentas para registro de treinos de Jiu-Jitsu,
        estatísticas, organização de técnicas e funcionalidades associadas. O
        conteúdo e os recursos podem ser atualizados ou alterados ao longo do
        tempo.
      </p>

      <h2>3. Conta e elegibilidade</h2>
      <p>
        Você declara ter idade legal para celebrar um contrato vinculante na sua
        jurisdição e fornecer informações verdadeiras ao criar uma conta. Você é
        responsável por manter a confidencialidade das credenciais e por todas as
        atividades realizadas na sua conta.
      </p>

      <h2>4. Assinaturas e pagamentos</h2>
      <p>
        Algumas funcionalidades podem exigir assinatura paga (“Premium”). Os
        preços, a duração do período de cobrança e as condições específicas são
        apresentados na loja de aplicativos (Apple App Store ou Google Play) no
        momento da compra.
      </p>
      <ul>
        <li>
          As assinaturas são gerenciadas pela Apple ou pelo Google, conforme a
          plataforma que você utilizar. O pagamento será cobrado na sua conta da
          loja na confirmação da compra.
        </li>
        <li>
          A menos que você cancele com antecedência, as assinaturas renovam
          automaticamente ao final de cada período, nas condições vigentes na
          loja.
        </li>
        <li>
          Cancelamento e reembolsos seguem as políticas da Apple ou do Google. Você
          pode gerenciar ou cancelar assinaturas nas configurações da sua conta
          Apple ID ou Google Play.
        </li>
      </ul>
      <p>
        Estes Termos complementam (e não substituem) os termos da loja de
        aplicativos aplicável. Em caso de conflito sobre cobrança ou assinatura,
        prevalecem os termos e processos da respectiva loja.
      </p>

      <h2>5. Uso aceitável</h2>
      <p>Você concorda em não:</p>
      <ul>
        <li>Usar o Serviço de forma ilegal, abusiva ou que prejudique terceiros.</li>
        <li>
          Tentar obter acesso não autorizado a sistemas, dados de outros
          usuários ou à infraestrutura do Serviço.
        </li>
        <li>
          Fazer engenharia reversa, descompilar ou extrair o código-fonte do
          aplicativo, salvo quando permitido por lei imperativa.
        </li>
        <li>Utilizar o Serviço para distribuir malware ou conteúdo nocivo.</li>
      </ul>

      <h2>6. Propriedade intelectual</h2>
      <p>
        O aplicativo, marcas, textos, gráficos e demais materiais são de
        propriedade da 402 Software ou de licenciadores, salvo indicação em
        contrário. Nenhum direito de propriedade intelectual é transferido a
        você além da licença limitada de uso do Serviço conforme estes Termos.
      </p>

      <h2>7. Isenção de garantias</h2>
      <p>
        O Serviço é fornecido “no estado em que se encontra”. Na medida máxima
        permitida pela lei aplicável, não garantimos que o Serviço será
        ininterrupto, livre de erros ou adequado a um propósito específico. O uso
        é por sua conta e risco.
      </p>

      <h2>8. Limitação de responsabilidade</h2>
      <p>
        Na medida permitida pela lei, a 402 Software não será responsável por
        danos indiretos, incidentais, especiais, consequenciais ou lucros
        cessantes decorrentes do uso ou da impossibilidade de uso do Serviço.
        A responsabilidade total por qualquer reclamação relacionada ao Serviço
        não excederá o valor que você tiver pago ao Serviço nos doze (12)
        meses anteriores ao evento (ou, se não houver pagamento, um valor
        simbólico mínimo permitido pela lei).
      </p>

      <h2>9. Suspensão e encerramento</h2>
      <p>
        Podemos suspender ou encerrar o acesso ao Serviço em caso de violação
        destes Termos ou por motivos legais ou de segurança. Você pode parar de
        usar o Serviço a qualquer momento e solicitar exclusão de conta
        conforme descrito na nossa{" "}
        <Link href="/privacy">Política de Privacidade</Link> e na página{" "}
        <Link href="/account-deletion">Exclusão de conta e dados</Link>.
      </p>

      <h2>10. Alterações</h2>
      <p>
        Podemos modificar estes Termos periodicamente. Publicaremos a versão
        atualizada nesta página e indicaremos a data da última atualização. O
        uso continuado após a publicação constitui aceitação dos novos termos,
        quando permitido pela lei.
      </p>

      <h2>11. Lei aplicável</h2>
      <p>
        Estes Termos são regidos pelas leis aplicáveis do Brasil, sem considerar
        conflitos de normas. Foro competente: o da comarca de domicílio do
        consumidor, quando a legislação consumerista assim exigir.
      </p>

      <h2>12. Contato</h2>
      <p>Dúvidas sobre estes Termos de Uso:</p>
      <p>
        <a href="mailto:ariannmichael@gmail.com">ariannmichael@gmail.com</a>
      </p>
    </>
  );
}

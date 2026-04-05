import type { TranslationKeys } from "./en";

const pt: Record<TranslationKeys, string> = {
  // Common
  appName: "Jiu Tracker",
  footer: "402 Software",
  submit: "ENVIAR",
  cancel: "Cancelar",
  save: "Salvar",
  yes: "Sim",
  no: "Não",
  error: "Erro",
  retry: "Tentar novamente",

  // Language
  language: "Idioma",

  // Start Screen
  name: "Nome",
  email: "Email",
  password: "Senha",
  confirmPassword: "Confirmar Senha",
  loggingIn: "ENTRANDO...",
  loginButton: "ENTRAR",
  signUpButton: "CADASTRAR",

  // Signup
  whereWereYouBorn: "Onde você nasceu?",
  imFrom: "SOU DO",
  whatIsYourRank: "Qual é a sua faixa no jiu-jitsu?",
  stripes: "Graus",
  imA: "SOU",
  stripe: "GRAU",
  stripesPlural: "GRAUS",
  whenWereYouBorn: "Quando você nasceu?",
  im: "TENHO",
  chooseUsername: "Escolha um nome de usuário.",
  enterUsername: "Digite seu usuário",
  selectCountry: "Selecionar País",
  select: "Selecionar",

  // Dashboard
  dayStreak: "dias seguidos",
  sessions: "Sessões",
  totalHours: "Horas Totais",
  winRatio: "Taxa de Vitória",
  giVsNogiRatio: "Razão Gi vs NoGi",
  submissionRate: "Taxa de Finalização",
  submissionsVsTapped: "Finalizações vs finalizado",
  mostWinTechniques: "Técnicas mais vitoriosas",
  lostTechniques: "Técnicas perdidas",
  noDataYet: "Sem dados ainda",
  daysTrained: "Dias treinados",
  mostHoursInOneDay: "Mais horas em um dia",
  milestones: "Conquistas",
  openMat: "Open mat",
  newTechniques: "Novas técnicas",
  techniqueBreakdown: "Técnicas por categoria",
  nextMilestone: "Próxima conquista:",

  // Logs
  editLog: "EDITAR TREINO",
  newLog: "NOVO TREINO",
  date: "DATA",
  duration: "DURAÇÃO",
  openMatLabel: "OPEN MAT",
  giNogi: "GI / NOGI",
  submitUsing: "FINALIZOU COM",
  wasTappedBy: "FOI FINALIZADO POR",
  notes: "NOTAS",
  gi: "Gi",
  nogi: "NoGi",
  selectTechniques: "Selecionar técnicas",
  enterNotesHere: "Digite suas notas aqui",
  couldNotUpdateLog: "Não foi possível atualizar o treino",
  couldNotSaveLog: "Não foi possível salvar o treino",
  pleaseTryAgain: "Por favor, tente novamente.",
  trainingLogs: "Registro de Treinos",
  addLog: "+ NOVO TREINO",
  loadingLogs: "Carregando treinos…",
  sessionsAppearHere: "Seus treinos aparecerão aqui",
  loadingMore: "Carregando mais…",
  selectTime: "Selecionar horário",

  // Techniques
  techniques: "Técnicas",
  technique: "técnica",
  techniquesPlural: "técnicas",
  searchTechniques: "Buscar técnicas...",
  all: "Todas",
  submission: "Finalização",
  guard: "Guarda",
  pass: "Passagem",
  sweep: "Raspagem",
  takedown: "Queda",
  defend: "Defesa",
  escape: "Escape",
  noTechniquesFound: "Nenhuma técnica encontrada",
  tryDifferentSearch: "Tente um termo de busca diferente",
  techniquesAppearHere: "Técnicas aparecerão aqui quando disponíveis",

  // Profile / Modals
  updateAvatar: "Atualizar Avatar",
  updateUser: "Atualizar Usuário",
  updateBelt: "Atualizar Faixa",
  deleteAccount: "Excluir conta",
  deleteAccountConfirmTitle: "Excluir sua conta?",
  deleteAccountConfirmMessage:
    "Isso remove permanentemente seu perfil, treinos e outros dados do Jiu Tracker. Assinaturas ativas são gerenciadas pela Apple ou Google—cancele na loja se não quiser mais cobranças. Esta ação não pode ser desfeita.",
  deleteAccountLearnMore: "Saiba mais",
  deleteAccountFailed: "Não foi possível excluir a conta. Tente novamente.",
  logout: "Sair",
  username: "Usuário",
  newPasswordMin6: "Nova senha (mín. 6 caracteres)",
  validation: "Validação",
  passwordMinChars: "A senha deve ter pelo menos 6 caracteres.",
  updateFailed: "Falha na atualização",
  couldNotUpdateUser: "Não foi possível atualizar o usuário.",
  belt: "Faixa",
  stripesRange: "Graus (0–{max})",

  // LogCard
  totalTime: "Tempo Total",
  submitted: "Finalizou",
  tapped: "Finalizado",
  mostEfficient: "Mais Eficiente",
  riskArea: "Área de Risco",
  defense: "Defesa",

  // TechniqueDetail
  description: "Descrição",

  // UploadImage
  permissionRequired: "Permissão necessária",
  permissionPhotoAccess: "É necessário acesso às suas fotos para escolher um avatar.",
  cameraAccessNeeded: "É necessário acesso à câmera para tirar uma foto.",
  couldNotOpenImageLibrary: "Não foi possível abrir a galeria de imagens.",
  couldNotOpenCamera: "Não foi possível abrir a câmera.",
  uploadFailed: "Falha no envio",
  couldNotUploadImage: "Não foi possível enviar a imagem.",
  choosePhoto: "Escolher foto",
  takePhoto: "Tirar foto",
  uploading: "Enviando…",
  uploadImage: "Enviar imagem",

  // BottomNavigation
  home: "Início",
  logs: "Treinos",
  techniquesNav: "Técnicas",

  // Difficulty
  beginner: "Iniciante",
  intermediate: "Intermediário",
  advanced: "Avançado",

  // Premium
  subscriptionPage: "Assinatura",
  unlockPerformanceAnalytics: "Desbloqueie análises de performance",
  unlockTechniqueBreakdown: "Desbloqueie o gráfico por categoria",
  upgradeToPremium: "Assinar Premium",
  premiumBenefits: "Proporção de vitórias/derrotas, taxa de finalização, melhores técnicas e gráfico por categoria.",
  premiumWhatYouGet: "Com o Premium você tem:",
  premiumBenefit1: "Proporção de vitórias/derrotas e Gi vs NoGi",
  premiumBenefit2: "Taxa de finalização (finalizações vs finalizado)",
  premiumBenefit3: "Principais técnicas de vitória e derrota",
  premiumBenefit4: "Gráfico de técnicas por categoria",
  premiumComingSoonCompetitions: "No futuro, assinantes terão acompanhamento de competições.",
  restorePurchases: "Restaurar compras",
  alreadyHavePremium: "Você já tem acesso premium.",
  premiumUntil: "Premium até",
  backToDashboard: "Voltar ao Início",
  cancelPremium: "Cancelar Premium",
  noPreviousPurchase: "Nenhuma compra anterior encontrada para restaurar.",
  iapProductUnavailable:
    "Esta assinatura não está disponível na loja. No App Store Connect (ou Play Console), crie uma assinatura cujo ID do produto seja exatamente o mesmo que EXPO_PUBLIC_PREMIUM_PRODUCT_ID para este app, depois gere o build de novo.",
  iapMobileOnly:
    "As assinaturas estão disponíveis na app iOS e Android, não no browser.",
  iapProductIdUsedByApp:
    "Este build pede o Product ID (tem de coincidir com a App Store Connect):",

  // Subscription disclosure (App Store Guideline 3.1.2)
  privacyPolicyLink: "Política de privacidade",
  termsOfUseLink: "Termos de uso",
  subscriptionBillingPeriodLabel: "Período de cobrança",
  subscriptionPriceLabel: "Preço",
  subscriptionDuringPeriodHeading: "Conteúdo e serviços em cada período de assinatura",
  subscriptionStoreTitleFallback: "Jiu Tracker Premium",
  subscriptionDetailsOnMobile:
    "O preço e o período de cobrança aparecem na app iOS ou Android, conforme a loja.",
  subscriptionPeriodDay: "Diária",
  subscriptionPeriodWeek: "Semanal",
  subscriptionPeriodMonth: "Mensal",
  subscriptionPeriodThreeMonths: "A cada 3 meses",
  subscriptionPeriodYear: "Anual",
  subscriptionPeriodSeeStore: "Veja na loja no momento da compra o período e o preço atuais.",
  subscriptionPricesByCountryTitle: "Preços por país",
  subscriptionPricesByCountryDisclaimer:
    "Preços de referência por assinatura mensal; podem aplicar-se impostos e conversão cambial. O valor exato aparece na loja no momento da compra.",
  subscriptionAutoRenewNote:
    "A assinatura renova automaticamente, salvo se cancelar com pelo menos 24 horas de antecedência ao fim do período. Gerencie ou cancele nas definições da sua conta Apple ID ou Google Play.",
};

export default pt;

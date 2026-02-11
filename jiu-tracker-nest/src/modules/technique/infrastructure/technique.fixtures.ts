import { Technique, Category, Difficulty } from '../domain/technique.entity';

export const techniqueFixtures: Partial<Technique>[] = [
  // ─────────────────────────────────────────────
  //  SUBMISSIONS
  // ─────────────────────────────────────────────

  // Beginner
  {
    id: 'sub-beg-001',
    name: 'Rear Naked Choke',
    namePortuguese: 'Mata Leão',
    description:
      'A blood choke applied from the back by wrapping one arm around the opponent\'s neck and locking it with the other arm behind the head.',
    descriptionPortuguese:
      'Um estrangulamento sanguíneo aplicado pelas costas, envolvendo um braço ao redor do pescoço do oponente e travando com o outro braço atrás da cabeça.',
    category: Category.Submission,
    difficulty: Difficulty.Beginner,
  },
  {
    id: 'sub-beg-002',
    name: 'Cross Collar Choke',
    namePortuguese: 'Estrangulamento de Gola Cruzada',
    description:
      'A gi choke performed from mount or closed guard by gripping both sides of the collar and applying cross-pressure to the neck.',
    descriptionPortuguese:
      'Um estrangulamento de gi realizado da montada ou guarda fechada, segurando ambos os lados da gola e aplicando pressão cruzada no pescoço.',
    category: Category.Submission,
    difficulty: Difficulty.Beginner,
  },
  {
    id: 'sub-beg-003',
    name: 'Straight Armbar from Guard',
    namePortuguese: 'Chave de Braço da Guarda',
    description:
      'A joint lock applied from closed guard by controlling the opponent\'s arm, pivoting the hips, and hyperextending the elbow.',
    descriptionPortuguese:
      'Uma chave articular aplicada da guarda fechada, controlando o braço do oponente, pivotando os quadris e hiperestendendo o cotovelo.',
    category: Category.Submission,
    difficulty: Difficulty.Beginner,
  },
  {
    id: 'sub-beg-004',
    name: 'Americana (Keylock)',
    namePortuguese: 'Americana',
    description:
      'A shoulder lock applied from mount or side control by isolating the arm and rotating the wrist towards the hip in a figure-four grip.',
    descriptionPortuguese:
      'Uma chave de ombro aplicada da montada ou controle lateral, isolando o braço e rotacionando o pulso em direção ao quadril com pegada em figura de quatro.',
    category: Category.Submission,
    difficulty: Difficulty.Beginner,
  },

  // Intermediate
  {
    id: 'sub-int-001',
    name: 'Triangle Choke',
    namePortuguese: 'Triângulo',
    description:
      'A choke applied from guard by enclosing the opponent\'s head and one arm between the legs in a figure-four leg configuration, cutting off blood flow to the brain.',
    descriptionPortuguese:
      'Um estrangulamento aplicado da guarda, encerrando a cabeça e um braço do oponente entre as pernas em configuração de triângulo, cortando o fluxo sanguíneo para o cérebro.',
    category: Category.Submission,
    difficulty: Difficulty.Intermediate,
  },
  {
    id: 'sub-int-002',
    name: 'Kimura',
    namePortuguese: 'Kimura',
    description:
      'A double-joint shoulder lock using a figure-four grip to rotate the opponent\'s arm behind their back, attacking the shoulder joint.',
    descriptionPortuguese:
      'Uma chave dupla de ombro usando pegada em figura de quatro para rotacionar o braço do oponente atrás das costas, atacando a articulação do ombro.',
    category: Category.Submission,
    difficulty: Difficulty.Intermediate,
  },
  {
    id: 'sub-int-003',
    name: 'Guillotine Choke',
    namePortuguese: 'Guilhotina',
    description:
      'A front headlock choke applied by wrapping one arm around the opponent\'s neck from the front and squeezing upward while controlling posture.',
    descriptionPortuguese:
      'Um estrangulamento frontal aplicado envolvendo um braço ao redor do pescoço do oponente pela frente e apertando para cima enquanto controla a postura.',
    category: Category.Submission,
    difficulty: Difficulty.Intermediate,
  },
  {
    id: 'sub-int-004',
    name: 'Omoplata',
    namePortuguese: 'Omoplata',
    description:
      'A shoulder lock performed with the legs by isolating the opponent\'s arm and using hip rotation to apply pressure on the shoulder joint.',
    descriptionPortuguese:
      'Uma chave de ombro realizada com as pernas, isolando o braço do oponente e usando rotação dos quadris para aplicar pressão na articulação do ombro.',
    category: Category.Submission,
    difficulty: Difficulty.Intermediate,
  },

  // Advanced
  {
    id: 'sub-adv-001',
    name: 'Gogoplata',
    namePortuguese: 'Gogoplata',
    description:
      'An advanced choke from rubber guard or mount where the shin is placed across the opponent\'s throat and pressure is applied by pulling the head down.',
    descriptionPortuguese:
      'Um estrangulamento avançado da guarda de borracha ou montada onde a canela é colocada sobre a garganta do oponente e a pressão é aplicada puxando a cabeça para baixo.',
    category: Category.Submission,
    difficulty: Difficulty.Advanced,
  },
  {
    id: 'sub-adv-002',
    name: 'Flying Armbar',
    namePortuguese: 'Chave de Braço Voadora',
    description:
      'A dynamic submission where the attacker jumps and wraps their legs around the opponent\'s arm while standing, transitioning into an armbar mid-air.',
    descriptionPortuguese:
      'Uma finalização dinâmica onde o atacante pula e envolve as pernas ao redor do braço do oponente em pé, transicionando para uma chave de braço no ar.',
    category: Category.Submission,
    difficulty: Difficulty.Advanced,
  },
  {
    id: 'sub-adv-003',
    name: 'Heel Hook',
    namePortuguese: 'Heel Hook',
    description:
      'A devastating leg lock that attacks the knee by controlling the foot and rotating the heel, applying torque to the knee ligaments.',
    descriptionPortuguese:
      'Uma chave de perna devastadora que ataca o joelho controlando o pé e rotacionando o calcanhar, aplicando torque nos ligamentos do joelho.',
    category: Category.Submission,
    difficulty: Difficulty.Advanced,
  },

  // ─────────────────────────────────────────────
  //  SWEEPS
  // ─────────────────────────────────────────────

  // Beginner
  {
    id: 'swp-beg-001',
    name: 'Scissor Sweep',
    namePortuguese: 'Raspagem Tesoura',
    description:
      'A fundamental sweep from closed guard using a cross-collar grip and a knee shield to unbalance and roll the opponent over.',
    descriptionPortuguese:
      'Uma raspagem fundamental da guarda fechada usando pegada na gola cruzada e um escudo de joelho para desequilibrar e rolar o oponente.',
    category: Category.Sweep,
    difficulty: Difficulty.Beginner,
  },
  {
    id: 'swp-beg-002',
    name: 'Hip Bump Sweep',
    namePortuguese: 'Raspagem de Quadril',
    description:
      'A sweep from closed guard where the bottom player sits up explosively, bumping the opponent with the hips to off-balance and reverse position.',
    descriptionPortuguese:
      'Uma raspagem da guarda fechada onde o jogador de baixo senta explosivamente, empurrando o oponente com os quadris para desequilibrar e reverter a posição.',
    category: Category.Sweep,
    difficulty: Difficulty.Beginner,
  },
  {
    id: 'swp-beg-003',
    name: 'Pendulum Sweep',
    namePortuguese: 'Raspagem Pêndulo',
    description:
      'A closed guard sweep where the bottom player swings their legs in a pendulum motion to generate momentum and topple the opponent.',
    descriptionPortuguese:
      'Uma raspagem da guarda fechada onde o jogador de baixo balança as pernas em movimento de pêndulo para gerar impulso e derrubar o oponente.',
    category: Category.Sweep,
    difficulty: Difficulty.Beginner,
  },

  // Intermediate
  {
    id: 'swp-int-001',
    name: 'Butterfly Sweep',
    namePortuguese: 'Raspagem Borboleta',
    description:
      'A sweep from butterfly guard using an underhook and butterfly hook to elevate and topple the opponent to the side.',
    descriptionPortuguese:
      'Uma raspagem da guarda borboleta usando um underhook e gancho borboleta para elevar e derrubar o oponente para o lado.',
    category: Category.Sweep,
    difficulty: Difficulty.Intermediate,
  },
  {
    id: 'swp-int-002',
    name: 'Lumberjack Sweep',
    namePortuguese: 'Raspagem Lenhador',
    description:
      'A sweep from closed guard that uses a sleeve and collar grip to break posture and sweep the opponent laterally like felling a tree.',
    descriptionPortuguese:
      'Uma raspagem da guarda fechada que usa pegada na manga e gola para quebrar postura e raspar o oponente lateralmente como derrubando uma árvore.',
    category: Category.Sweep,
    difficulty: Difficulty.Intermediate,
  },
  {
    id: 'swp-int-003',
    name: 'Hook Sweep',
    namePortuguese: 'Raspagem de Gancho',
    description:
      'A sweep from open guard using a foot hook on the opponent\'s thigh combined with upper body control to reverse position.',
    descriptionPortuguese:
      'Uma raspagem da guarda aberta usando um gancho de pé na coxa do oponente combinado com controle do tronco para reverter a posição.',
    category: Category.Sweep,
    difficulty: Difficulty.Intermediate,
  },

  // Advanced
  {
    id: 'swp-adv-001',
    name: 'Berimbolo',
    namePortuguese: 'Berimbolo',
    description:
      'An advanced inversion-based sweep from de la Riva guard that uses an upside-down rotation to take the back or arrive on top.',
    descriptionPortuguese:
      'Uma raspagem avançada baseada em inversão da guarda de la Riva que usa uma rotação invertida para pegar as costas ou chegar por cima.',
    category: Category.Sweep,
    difficulty: Difficulty.Advanced,
  },
  {
    id: 'swp-adv-002',
    name: 'Waiter Sweep',
    namePortuguese: 'Raspagem Garçom',
    description:
      'An advanced sweep from half guard where the bottom player uses an underhook on the far leg while elevating it like holding a tray, off-balancing the opponent.',
    descriptionPortuguese:
      'Uma raspagem avançada da meia guarda onde o jogador de baixo usa um underhook na perna distante enquanto a eleva como segurando uma bandeja, desequilibrando o oponente.',
    category: Category.Sweep,
    difficulty: Difficulty.Advanced,
  },

  // ─────────────────────────────────────────────
  //  PASSES
  // ─────────────────────────────────────────────

  // Beginner
  {
    id: 'pas-beg-001',
    name: 'Double Under Pass',
    namePortuguese: 'Passagem por Baixo Dupla',
    description:
      'A guard pass where the passer secures both underhooks beneath the opponent\'s legs, stacks them, and drives through to side control.',
    descriptionPortuguese:
      'Uma passagem de guarda onde o passador assegura ambos os underhooks sob as pernas do oponente, empilha e avança até o controle lateral.',
    category: Category.Pass,
    difficulty: Difficulty.Beginner,
  },
  {
    id: 'pas-beg-002',
    name: 'Knee Slice Pass',
    namePortuguese: 'Passagem com Joelho',
    description:
      'A fundamental guard pass where the passer slides the knee across the opponent\'s thigh while controlling the upper body to achieve side control.',
    descriptionPortuguese:
      'Uma passagem de guarda fundamental onde o passador desliza o joelho pela coxa do oponente enquanto controla o tronco para alcançar controle lateral.',
    category: Category.Pass,
    difficulty: Difficulty.Beginner,
  },
  {
    id: 'pas-beg-003',
    name: 'Toreando Pass',
    namePortuguese: 'Passagem Toreando',
    description:
      'A bullfighter-style pass where the passer grips both legs, pushes them to one side, and steps around to side control.',
    descriptionPortuguese:
      'Uma passagem estilo toureiro onde o passador segura ambas as pernas, empurra para um lado e contorna até o controle lateral.',
    category: Category.Pass,
    difficulty: Difficulty.Beginner,
  },

  // Intermediate
  {
    id: 'pas-int-001',
    name: 'Over-Under Pass',
    namePortuguese: 'Passagem Over-Under',
    description:
      'A pressure pass combining one underhook and one overhook on the opponent\'s legs to flatten them and work around the guard.',
    descriptionPortuguese:
      'Uma passagem com pressão combinando um underhook e um overhook nas pernas do oponente para achatá-lo e contornar a guarda.',
    category: Category.Pass,
    difficulty: Difficulty.Intermediate,
  },
  {
    id: 'pas-int-002',
    name: 'X-Pass',
    namePortuguese: 'Passagem X',
    description:
      'A quick pass from standing where the passer pushes one leg across, steps laterally, and drops to side control in one fluid motion.',
    descriptionPortuguese:
      'Uma passagem rápida em pé onde o passador empurra uma perna cruzada, se move lateralmente e cai no controle lateral em um movimento fluido.',
    category: Category.Pass,
    difficulty: Difficulty.Intermediate,
  },
  {
    id: 'pas-int-003',
    name: 'Smash Pass',
    namePortuguese: 'Passagem Esmagamento',
    description:
      'A heavy pressure pass from half guard where the passer flattens the opponent\'s legs using hip pressure and cross-face to complete the pass.',
    descriptionPortuguese:
      'Uma passagem com pressão pesada da meia guarda onde o passador achata as pernas do oponente usando pressão de quadril e cross-face para completar a passagem.',
    category: Category.Pass,
    difficulty: Difficulty.Intermediate,
  },

  // Advanced
  {
    id: 'pas-adv-001',
    name: 'Leg Drag Pass',
    namePortuguese: 'Passagem Leg Drag',
    description:
      'An advanced passing technique where the passer controls one leg, dragging it across the opponent\'s body to expose the back or achieve side control.',
    descriptionPortuguese:
      'Uma técnica de passagem avançada onde o passador controla uma perna, arrastando-a pelo corpo do oponente para expor as costas ou alcançar controle lateral.',
    category: Category.Pass,
    difficulty: Difficulty.Advanced,
  },
  {
    id: 'pas-adv-002',
    name: 'Long Step Pass',
    namePortuguese: 'Passagem Passo Longo',
    description:
      'An advanced passing technique where the passer takes a long backstep to clear the legs entirely, transitioning directly to a dominant position.',
    descriptionPortuguese:
      'Uma técnica de passagem avançada onde o passador dá um passo longo para trás para livrar as pernas inteiramente, transicionando diretamente para posição dominante.',
    category: Category.Pass,
    difficulty: Difficulty.Advanced,
  },

  // ─────────────────────────────────────────────
  //  GUARDS
  // ─────────────────────────────────────────────

  // Beginner
  {
    id: 'grd-beg-001',
    name: 'Closed Guard',
    namePortuguese: 'Guarda Fechada',
    description:
      'The most fundamental guard position where the bottom player locks their legs around the opponent\'s waist, controlling distance and posture.',
    descriptionPortuguese:
      'A posição de guarda mais fundamental onde o jogador de baixo trava as pernas ao redor da cintura do oponente, controlando distância e postura.',
    category: Category.Guard,
    difficulty: Difficulty.Beginner,
  },
  {
    id: 'grd-beg-002',
    name: 'Half Guard',
    namePortuguese: 'Meia Guarda',
    description:
      'A guard position where the bottom player controls one of the opponent\'s legs between their own legs, preventing the pass while creating sweeping opportunities.',
    descriptionPortuguese:
      'Uma posição de guarda onde o jogador de baixo controla uma das pernas do oponente entre suas próprias pernas, prevenindo a passagem enquanto cria oportunidades de raspagem.',
    category: Category.Guard,
    difficulty: Difficulty.Beginner,
  },

  // Intermediate
  {
    id: 'grd-int-001',
    name: 'Butterfly Guard',
    namePortuguese: 'Guarda Borboleta',
    description:
      'An open guard where the bottom player places both feet as hooks on the inside of the opponent\'s thighs, using them to elevate and sweep.',
    descriptionPortuguese:
      'Uma guarda aberta onde o jogador de baixo coloca ambos os pés como ganchos no interior das coxas do oponente, usando-os para elevar e raspar.',
    category: Category.Guard,
    difficulty: Difficulty.Intermediate,
  },
  {
    id: 'grd-int-002',
    name: 'Spider Guard',
    namePortuguese: 'Guarda Aranha',
    description:
      'A gi-based open guard where the bottom player controls both sleeves while placing feet on the opponent\'s biceps, creating distance and leverage.',
    descriptionPortuguese:
      'Uma guarda aberta baseada em gi onde o jogador de baixo controla ambas as mangas enquanto coloca os pés nos bíceps do oponente, criando distância e alavancagem.',
    category: Category.Guard,
    difficulty: Difficulty.Intermediate,
  },
  {
    id: 'grd-int-003',
    name: 'De La Riva Guard',
    namePortuguese: 'Guarda De La Riva',
    description:
      'An open guard where the bottom player hooks the outside of the opponent\'s lead leg with their leg while controlling the far ankle with a grip.',
    descriptionPortuguese:
      'Uma guarda aberta onde o jogador de baixo engancha o exterior da perna dianteira do oponente com sua perna enquanto controla o tornozelo distante com uma pegada.',
    category: Category.Guard,
    difficulty: Difficulty.Intermediate,
  },

  // Advanced
  {
    id: 'grd-adv-001',
    name: 'Rubber Guard',
    namePortuguese: 'Guarda de Borracha',
    description:
      'An advanced closed guard variation requiring extreme flexibility, where the bottom player controls the opponent\'s posture by pulling their own shin behind the opponent\'s head.',
    descriptionPortuguese:
      'Uma variação avançada da guarda fechada que requer extrema flexibilidade, onde o jogador de baixo controla a postura do oponente puxando sua própria canela atrás da cabeça do oponente.',
    category: Category.Guard,
    difficulty: Difficulty.Advanced,
  },
  {
    id: 'grd-adv-002',
    name: 'Worm Guard',
    namePortuguese: 'Guarda Minhoca',
    description:
      'A modern lapel-based guard where the bottom player threads the opponent\'s lapel around their leg and grips it to create powerful off-balancing leverage.',
    descriptionPortuguese:
      'Uma guarda moderna baseada em lapela onde o jogador de baixo passa a lapela do oponente ao redor de sua perna e a segura para criar poderosa alavancagem de desequilíbrio.',
    category: Category.Guard,
    difficulty: Difficulty.Advanced,
  },
  {
    id: 'grd-adv-003',
    name: 'X-Guard',
    namePortuguese: 'Guarda X',
    description:
      'An advanced open guard played from underneath, using both legs to form an X-shape around the opponent\'s leg, creating powerful lifting and sweeping mechanics.',
    descriptionPortuguese:
      'Uma guarda aberta avançada jogada por baixo, usando ambas as pernas para formar um X ao redor da perna do oponente, criando mecânicas poderosas de elevação e raspagem.',
    category: Category.Guard,
    difficulty: Difficulty.Advanced,
  },

  // ─────────────────────────────────────────────
  //  TAKEDOWNS
  // ─────────────────────────────────────────────

  // Beginner
  {
    id: 'tkd-beg-001',
    name: 'Double Leg Takedown',
    namePortuguese: 'Queda Dupla',
    description:
      'A fundamental wrestling takedown where the attacker shoots in, grabs both of the opponent\'s legs, and drives them to the ground.',
    descriptionPortuguese:
      'Uma queda fundamental de luta onde o atacante avança, agarra ambas as pernas do oponente e o leva ao chão.',
    category: Category.Takedown,
    difficulty: Difficulty.Beginner,
  },
  {
    id: 'tkd-beg-002',
    name: 'Single Leg Takedown',
    namePortuguese: 'Queda Simples',
    description:
      'A takedown where the attacker captures one of the opponent\'s legs and uses various finishes to bring them down.',
    descriptionPortuguese:
      'Uma queda onde o atacante captura uma das pernas do oponente e usa vários acabamentos para derrubá-lo.',
    category: Category.Takedown,
    difficulty: Difficulty.Beginner,
  },
  {
    id: 'tkd-beg-003',
    name: 'O-Soto Gari (Major Outer Reap)',
    namePortuguese: 'O-Soto Gari',
    description:
      'A judo throw where the attacker reaps the opponent\'s far leg from behind with their own leg while pushing the upper body backward.',
    descriptionPortuguese:
      'Uma projeção de judô onde o atacante ceifa a perna distante do oponente por trás com sua própria perna enquanto empurra o tronco para trás.',
    category: Category.Takedown,
    difficulty: Difficulty.Beginner,
  },

  // Intermediate
  {
    id: 'tkd-int-001',
    name: 'Ankle Pick',
    namePortuguese: 'Pegada de Tornozelo',
    description:
      'A takedown where the attacker uses a collar tie to pull the opponent forward while reaching down to grab and lift the lead ankle.',
    descriptionPortuguese:
      'Uma queda onde o atacante usa um controle de nuca para puxar o oponente para frente enquanto alcança e levanta o tornozelo dianteiro.',
    category: Category.Takedown,
    difficulty: Difficulty.Intermediate,
  },
  {
    id: 'tkd-int-002',
    name: 'Arm Drag to Back Take',
    namePortuguese: 'Arraste de Braço para Pegada de Costas',
    description:
      'A setup where the attacker pulls the opponent\'s arm across their body to off-balance them and circle to the back for a takedown.',
    descriptionPortuguese:
      'Um setup onde o atacante puxa o braço do oponente pelo corpo para desequilibrá-lo e circular para as costas para uma queda.',
    category: Category.Takedown,
    difficulty: Difficulty.Intermediate,
  },
  {
    id: 'tkd-int-003',
    name: 'Uchi Mata (Inner Thigh Throw)',
    namePortuguese: 'Uchi Mata',
    description:
      'A powerful judo throw where the attacker sweeps the opponent\'s inner thigh with their leg while pulling them forward and over.',
    descriptionPortuguese:
      'Uma projeção poderosa de judô onde o atacante varre a coxa interna do oponente com sua perna enquanto o puxa para frente e por cima.',
    category: Category.Takedown,
    difficulty: Difficulty.Intermediate,
  },

  // Advanced
  {
    id: 'tkd-adv-001',
    name: 'Flying Triangle',
    namePortuguese: 'Triângulo Voador',
    description:
      'An advanced takedown-to-submission where the attacker jumps from standing, locks a triangle choke around the opponent\'s head and arm mid-air, and pulls them to the ground.',
    descriptionPortuguese:
      'Uma queda-para-finalização avançada onde o atacante pula em pé, trava um triângulo ao redor da cabeça e braço do oponente no ar e o puxa ao chão.',
    category: Category.Takedown,
    difficulty: Difficulty.Advanced,
  },
  {
    id: 'tkd-adv-002',
    name: 'Sumi Gaeshi (Corner Reversal)',
    namePortuguese: 'Sumi Gaeshi',
    description:
      'A sacrifice throw where the attacker falls backward, placing a butterfly hook on the opponent\'s inner thigh and lifting them overhead.',
    descriptionPortuguese:
      'Uma projeção de sacrifício onde o atacante cai para trás, colocando um gancho borboleta na coxa interna do oponente e elevando-o sobre a cabeça.',
    category: Category.Takedown,
    difficulty: Difficulty.Advanced,
  },

  // ─────────────────────────────────────────────
  //  DEFENSES
  // ─────────────────────────────────────────────

  // Beginner
  {
    id: 'def-beg-001',
    name: 'Elbow-Knee Escape (Shrimping)',
    namePortuguese: 'Fuga Camarão',
    description:
      'The most fundamental escape from bottom positions using a hip escape (shrimp) to create space and recover guard by framing with the elbow and bringing the knee inside.',
    descriptionPortuguese:
      'A fuga mais fundamental de posições por baixo usando fuga de quadril (camarão) para criar espaço e recuperar a guarda enquadrando com o cotovelo e trazendo o joelho para dentro.',
    category: Category.Defend,
    difficulty: Difficulty.Beginner,
  },
  {
    id: 'def-beg-002',
    name: 'Bridge and Roll (Upa)',
    namePortuguese: 'Upa',
    description:
      'A mount escape where the bottom player traps one arm and the same-side foot, then bridges explosively to roll the opponent over and land in guard.',
    descriptionPortuguese:
      'Uma fuga da montada onde o jogador de baixo prende um braço e o pé do mesmo lado, depois faz ponte explosiva para rolar o oponente e cair na guarda.',
    category: Category.Defend,
    difficulty: Difficulty.Beginner,
  },
  {
    id: 'def-beg-003',
    name: 'Posture in Guard',
    namePortuguese: 'Postura na Guarda',
    description:
      'A defensive posture when trapped in the opponent\'s closed guard, keeping a straight back, gripping the hips, and preventing the bottom player from breaking posture.',
    descriptionPortuguese:
      'Uma postura defensiva quando preso na guarda fechada do oponente, mantendo as costas retas, segurando os quadris e prevenindo o jogador de baixo de quebrar a postura.',
    category: Category.Defend,
    difficulty: Difficulty.Beginner,
  },

  // Intermediate
  {
    id: 'def-int-001',
    name: 'Guard Recovery from Side Control',
    namePortuguese: 'Recuperação de Guarda do Controle Lateral',
    description:
      'A defensive technique to escape side control by framing against the opponent, hip escaping, and reinserting the knee to recover half guard or full guard.',
    descriptionPortuguese:
      'Uma técnica defensiva para escapar do controle lateral enquadrando contra o oponente, escapando de quadril e reinserindo o joelho para recuperar meia guarda ou guarda completa.',
    category: Category.Defend,
    difficulty: Difficulty.Intermediate,
  },
  {
    id: 'def-int-002',
    name: 'Back Escape (Shoulder Walk)',
    namePortuguese: 'Fuga das Costas',
    description:
      'An escape from back control by fighting the hands, walking the shoulders to the mat, and sliding the hips out over the opponent\'s hook to reach side control.',
    descriptionPortuguese:
      'Uma fuga do controle das costas lutando as mãos, caminhando os ombros até o tatame e deslizando os quadris sobre o gancho do oponente para alcançar controle lateral.',
    category: Category.Defend,
    difficulty: Difficulty.Intermediate,
  },
  {
    id: 'def-int-003',
    name: 'Knee-Elbow Escape from Mount',
    namePortuguese: 'Fuga Joelho-Cotovelo da Montada',
    description:
      'An escape from mount using frames and hip escapes to create space and slide a knee between yourself and the opponent to recover half guard.',
    descriptionPortuguese:
      'Uma fuga da montada usando enquadramentos e fugas de quadril para criar espaço e deslizar um joelho entre você e o oponente para recuperar meia guarda.',
    category: Category.Defend,
    difficulty: Difficulty.Intermediate,
  },

  // Advanced
  {
    id: 'def-adv-001',
    name: 'Granby Roll Escape',
    namePortuguese: 'Fuga com Rolamento Granby',
    description:
      'An advanced scramble escape using an inverted shoulder roll to spin out of turtle or bad positions and recover guard in one fluid motion.',
    descriptionPortuguese:
      'Uma fuga avançada de scramble usando um rolamento de ombro invertido para girar para fora da posição tartaruga ou posições ruins e recuperar guarda em um movimento fluido.',
    category: Category.Defend,
    difficulty: Difficulty.Advanced,
  },
  {
    id: 'def-adv-002',
    name: 'Kiss of the Dragon',
    namePortuguese: 'Beijo do Dragão',
    description:
      'An advanced defensive inversion from bottom where the player threads their head under the opponent while inverted to take the back from a seemingly bad position.',
    descriptionPortuguese:
      'Uma inversão defensiva avançada de baixo onde o jogador passa a cabeça por baixo do oponente enquanto invertido para pegar as costas de uma posição aparentemente ruim.',
    category: Category.Defend,
    difficulty: Difficulty.Advanced,
  },

  // ─────────────────────────────────────────────
  //  SUBMISSION ESCAPES
  // ─────────────────────────────────────────────

  // Beginner
  {
    id: 'esc-beg-001',
    name: 'Armbar Defense (Stacking)',
    namePortuguese: 'Defesa de Chave de Braço (Empilhamento)',
    description:
      'A defense against the armbar by clasping the hands together, stacking the opponent by driving forward, and working to free the trapped arm.',
    descriptionPortuguese:
      'Uma defesa contra a chave de braço unindo as mãos, empilhando o oponente avançando para frente e trabalhando para liberar o braço preso.',
    category: Category.SubmissionEscape,
    difficulty: Difficulty.Beginner,
  },
  {
    id: 'esc-beg-002',
    name: 'RNC Defense (Hand Fighting)',
    namePortuguese: 'Defesa do Mata Leão (Luta de Mãos)',
    description:
      'A defense against the rear naked choke by fighting the choking hand with both hands, tucking the chin, and working to peel the arm away from the neck.',
    descriptionPortuguese:
      'Uma defesa contra o mata leão lutando a mão do estrangulamento com ambas as mãos, encaixando o queixo e trabalhando para descolar o braço do pescoço.',
    category: Category.SubmissionEscape,
    difficulty: Difficulty.Beginner,
  },
  {
    id: 'esc-beg-003',
    name: 'Guillotine Defense (Von Flue)',
    namePortuguese: 'Defesa de Guilhotina (Von Flue)',
    description:
      'A defense against the guillotine choke by passing to the side of the choking arm and applying shoulder pressure to the neck to counter-choke the opponent.',
    descriptionPortuguese:
      'Uma defesa contra a guilhotina passando para o lado do braço do estrangulamento e aplicando pressão de ombro no pescoço para contra-estrangular o oponente.',
    category: Category.SubmissionEscape,
    difficulty: Difficulty.Beginner,
  },

  // Intermediate
  {
    id: 'esc-int-001',
    name: 'Triangle Escape (Posture and Stack)',
    namePortuguese: 'Fuga do Triângulo (Postura e Empilhamento)',
    description:
      'An escape from the triangle choke by posturing up, stacking the opponent, and working the trapped arm free while keeping posture to relieve the choke.',
    descriptionPortuguese:
      'Uma fuga do triângulo postulando, empilhando o oponente e trabalhando o braço preso para fora enquanto mantém postura para aliviar o estrangulamento.',
    category: Category.SubmissionEscape,
    difficulty: Difficulty.Intermediate,
  },
  {
    id: 'esc-int-002',
    name: 'Kimura Defense (Sit-Up Escape)',
    namePortuguese: 'Defesa de Kimura (Fuga Sentando)',
    description:
      'An escape from the kimura by grabbing the belt or pants to anchor the arm, then sitting up and rotating towards the opponent to relieve the shoulder lock.',
    descriptionPortuguese:
      'Uma fuga da kimura segurando o cinturão ou calça para ancorar o braço, depois sentando e rotacionando em direção ao oponente para aliviar a chave de ombro.',
    category: Category.SubmissionEscape,
    difficulty: Difficulty.Intermediate,
  },
  {
    id: 'esc-int-003',
    name: 'Omoplata Escape (Forward Roll)',
    namePortuguese: 'Fuga de Omoplata (Rolamento Frontal)',
    description:
      'An escape from the omoplata by rolling forward over the trapped shoulder to relieve pressure and reset to a neutral position.',
    descriptionPortuguese:
      'Uma fuga da omoplata rolando para frente sobre o ombro preso para aliviar a pressão e resetar para posição neutra.',
    category: Category.SubmissionEscape,
    difficulty: Difficulty.Intermediate,
  },

  // Advanced
  {
    id: 'esc-adv-001',
    name: 'Heel Hook Defense (Boot and Rotate)',
    namePortuguese: 'Defesa de Heel Hook (Bota e Rotação)',
    description:
      'An advanced escape from a heel hook by immediately straightening the trapped leg (booting), rotating the body in the direction of the lock, and working to free the foot.',
    descriptionPortuguese:
      'Uma fuga avançada do heel hook esticando imediatamente a perna presa (bota), rotacionando o corpo na direção da chave e trabalhando para liberar o pé.',
    category: Category.SubmissionEscape,
    difficulty: Difficulty.Advanced,
  },
  {
    id: 'esc-adv-002',
    name: 'Back Escape to Leg Lock',
    namePortuguese: 'Fuga das Costas para Chave de Perna',
    description:
      'An advanced counter-escape from back control where the defender slips out while trapping the opponent\'s leg, transitioning directly into a leg lock attack.',
    descriptionPortuguese:
      'Uma contra-fuga avançada do controle das costas onde o defensor escorrega para fora enquanto prende a perna do oponente, transicionando diretamente para um ataque de chave de perna.',
    category: Category.SubmissionEscape,
    difficulty: Difficulty.Advanced,
  },
];

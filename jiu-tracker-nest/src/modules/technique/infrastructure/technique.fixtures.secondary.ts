import { Technique, Category, Difficulty } from '../domain/technique.entity';

export const secondaryTechniqueFixtures: Partial<Technique>[] = [
  // ─────────────────────────────────────────────
  //  SUBMISSIONS
  // ─────────────────────────────────────────────

  // Beginner
  {
    id: 'sub-beg-101',
    name: 'Ezekiel Choke',
    namePortuguese: 'Ezequiel',
    description:
      "A choke often applied from mount or inside the opponent's guard by feeding one sleeve deep across the neck and using the opposite forearm to compress the throat.",
    descriptionPortuguese:
      'Um estrangulamento frequentemente aplicado da montada ou dentro da guarda do oponente, alimentando a manga profundamente através do pescoço e usando o antebraço oposto para comprimir a garganta.',
    category: Category.Submission,
    difficulty: Difficulty.Beginner,
  },
  {
    id: 'sub-beg-102',
    name: 'Paper Cutter Choke',
    namePortuguese: 'Estrangulamento Faca de Papel',
    description:
      'A collar choke from side control where one hand grips the far collar deep while the other hand chops across the neck, creating a scissor-like pressure.',
    descriptionPortuguese:
      'Um estrangulamento de gola a partir do controle lateral, onde uma mão segura a gola distante profundamente enquanto a outra mão corta o pescoço, criando uma pressão em formato de tesoura.',
    category: Category.Submission,
    difficulty: Difficulty.Beginner,
  },

  // Intermediate
  {
    id: 'sub-int-101',
    name: 'Bow and Arrow Choke',
    namePortuguese: 'Estrangulamento Arco e Flecha',
    description:
      'A powerful back choke using the collar where the attacker extends the opponent like a bow by pulling the collar and controlling the leg or hip.',
    descriptionPortuguese:
      'Um estrangulamento poderoso das costas usando a gola, onde o atacante estende o oponente como um arco puxando a gola e controlando a perna ou o quadril.',
    category: Category.Submission,
    difficulty: Difficulty.Intermediate,
  },
  {
    id: 'sub-int-102',
    name: 'Loop Choke',
    namePortuguese: 'Loop Choke',
    description:
      'A gi choke typically set up from a collar grip in front headlock or seated position, looping the arm around the neck and using a twisting motion to finish.',
    descriptionPortuguese:
      'Um estrangulamento de gi geralmente preparado a partir de uma pegada na gola em posição de front headlock ou sentado, laçando o braço ao redor do pescoço e usando um giro para finalizar.',
    category: Category.Submission,
    difficulty: Difficulty.Intermediate,
  },

  // Advanced
  {
    id: 'sub-adv-101',
    name: 'Truck to Twister',
    namePortuguese: 'Truck para Twister',
    description:
      'An advanced spinal lock from back-side control, transitioning from the truck position to a powerful twisting submission on the torso and neck.',
    descriptionPortuguese:
      'Uma chave avançada de coluna a partir do controle lateral das costas, transicionando da posição truck para uma torção poderosa no tronco e pescoço.',
    category: Category.Submission,
    difficulty: Difficulty.Advanced,
  },
  {
    id: 'sub-adv-102',
    name: 'Inside Heel Hook from Saddle',
    namePortuguese: 'Heel Hook Interno da Posição Saddle',
    description:
      'An advanced leg lock from the saddle position isolating the inside leg, using tight control of the knee line and heel rotation to attack the knee joint.',
    descriptionPortuguese:
      'Uma chave de perna avançada a partir da posição saddle isolando a perna interna, usando controle apertado da linha do joelho e rotação do calcanhar para atacar a articulação do joelho.',
    category: Category.Submission,
    difficulty: Difficulty.Advanced,
  },

  // ─────────────────────────────────────────────
  //  SWEEPS
  // ─────────────────────────────────────────────

  // Beginner
  {
    id: 'swp-beg-101',
    name: 'Flower Sweep',
    namePortuguese: 'Raspagem Flor',
    description:
      'A closed guard sweep where the bottom player underhooks the leg, swings the opposite leg in a big arc, and uses momentum to flip the opponent.',
    descriptionPortuguese:
      'Uma raspagem da guarda fechada onde o jogador por baixo faz um underhook na perna, balança a perna oposta em um grande arco e usa o impulso para virar o oponente.',
    category: Category.Sweep,
    difficulty: Difficulty.Beginner,
  },

  // Intermediate
  {
    id: 'swp-int-101',
    name: 'Tripod Sweep',
    namePortuguese: 'Raspagem Tripé',
    description:
      "An open guard sweep using grips on the ankle and sleeve with one foot behind the opponent's ankle and the other on the hip to knock them backward.",
    descriptionPortuguese:
      'Uma raspagem de guarda aberta usando pegadas no tornozelo e na manga com um pé atrás do tornozelo do oponente e o outro no quadril para derrubá-lo para trás.',
    category: Category.Sweep,
    difficulty: Difficulty.Intermediate,
  },

  // Advanced
  {
    id: 'swp-adv-101',
    name: 'Kiss of the Dragon Sweep',
    namePortuguese: 'Raspagem Beijo do Dragão',
    description:
      'An advanced inversion-based sweep from de la Riva, rolling underneath the opponent to off-balance them and come up on top or to the back.',
    descriptionPortuguese:
      'Uma raspagem avançada baseada em inversão a partir da guarda de la Riva, rolando por baixo do oponente para desequilibrá-lo e subir por cima ou nas costas.',
    category: Category.Sweep,
    difficulty: Difficulty.Advanced,
  },

  // ─────────────────────────────────────────────
  //  PASSES
  // ─────────────────────────────────────────────

  // Beginner
  {
    id: 'pas-beg-101',
    name: 'Leg Weave Pass',
    namePortuguese: 'Passagem Leg Weave',
    description:
      "A basic pass where the top player weaves their arm between the opponent's legs, pinning them together and walking around to side control.",
    descriptionPortuguese:
      'Uma passagem básica onde o jogador por cima entrelaça o braço entre as pernas do oponente, prendendo-as juntas e caminhando ao redor para o controle lateral.',
    category: Category.Pass,
    difficulty: Difficulty.Beginner,
  },

  // Intermediate
  {
    id: 'pas-int-101',
    name: 'Headquarters Pass',
    namePortuguese: 'Passagem Headquarters',
    description:
      'A versatile open guard passing position where the passer pins one leg while stepping the other foot between the legs, transitioning into multiple passing directions.',
    descriptionPortuguese:
      'Uma posição versátil de passagem de guarda aberta onde o passador prende uma perna enquanto coloca o outro pé entre as pernas, transicionando para múltiplas direções de passagem.',
    category: Category.Pass,
    difficulty: Difficulty.Intermediate,
  },

  // Advanced
  {
    id: 'pas-adv-101',
    name: 'Reverse De La Riva Back Step Pass',
    namePortuguese: 'Passagem Back Step da Reverse De La Riva',
    description:
      'An advanced pass where the top player back steps over the entangling leg from reverse de la Riva to clear the hooks and take side control or the back.',
    descriptionPortuguese:
      'Uma passagem avançada onde o jogador por cima dá um back step sobre a perna que está enroscando na reverse de la Riva para limpar os ganchos e chegar ao controle lateral ou às costas.',
    category: Category.Pass,
    difficulty: Difficulty.Advanced,
  },

  // ─────────────────────────────────────────────
  //  GUARDS
  // ─────────────────────────────────────────────

  // Beginner
  {
    id: 'grd-beg-101',
    name: 'Open Guard with Collar and Sleeve',
    namePortuguese: 'Guarda Aberta com Gola e Manga',
    description:
      'A fundamental open guard configuration using grips on the collar and sleeve with the feet on the hips or biceps to control distance and angles.',
    descriptionPortuguese:
      'Uma configuração fundamental de guarda aberta usando pegadas na gola e na manga com os pés nos quadris ou bíceps para controlar distância e ângulos.',
    category: Category.Guard,
    difficulty: Difficulty.Beginner,
  },

  // Intermediate
  {
    id: 'grd-int-101',
    name: 'Lasso Guard',
    namePortuguese: 'Guarda Laço',
    description:
      "An open guard variation where the bottom player threads a leg deep around the opponent's arm, creating a lasso that controls posture and movement.",
    descriptionPortuguese:
      'Uma variação de guarda aberta onde o jogador por baixo passa a perna profundamente ao redor do braço do oponente, criando um laço que controla a postura e o movimento.',
    category: Category.Guard,
    difficulty: Difficulty.Intermediate,
  },

  // Advanced
  {
    id: 'grd-adv-101',
    name: '50/50 Guard',
    namePortuguese: 'Guarda 50/50',
    description:
      'A modern guard where both players have their legs intertwined symmetrically, creating a neutral but highly technical position for sweeps and leg locks.',
    descriptionPortuguese:
      'Uma guarda moderna onde ambos os jogadores têm as pernas entrelaçadas de forma simétrica, criando uma posição neutra porém altamente técnica para raspagens e chaves de perna.',
    category: Category.Guard,
    difficulty: Difficulty.Advanced,
  },

  // ─────────────────────────────────────────────
  //  TAKEDOWNS
  // ─────────────────────────────────────────────

  // Beginner
  {
    id: 'tkd-beg-101',
    name: 'Body Lock Takedown',
    namePortuguese: 'Queda com Body Lock',
    description:
      "A basic takedown where the attacker locks their hands around the opponent's torso, breaks their posture, and steps behind to trip or twist them to the mat.",
    descriptionPortuguese:
      'Uma queda básica onde o atacante trava as mãos ao redor do tronco do oponente, quebra a postura e dá um passo por trás para desequilibrar e derrubá-lo no tatame.',
    category: Category.Takedown,
    difficulty: Difficulty.Beginner,
  },

  // Intermediate
  {
    id: 'tkd-int-101',
    name: 'Kouchi Gari (Minor Inner Reap)',
    namePortuguese: 'Kouchi Gari',
    description:
      "A judo takedown where the attacker reaps the inside of the opponent's near leg while driving them backward with upper body control.",
    descriptionPortuguese:
      'Uma queda de judô onde o atacante ceifa a parte interna da perna próxima do oponente enquanto o empurra para trás com controle do tronco.',
    category: Category.Takedown,
    difficulty: Difficulty.Intermediate,
  },

  // Advanced
  {
    id: 'tkd-adv-101',
    name: 'Flying Scissor Takedown',
    namePortuguese: 'Queda Tesoura Voadora',
    description:
      "An advanced sacrifice takedown where the attacker jumps sideways, scissoring the opponent's legs to topple them while landing in a dominant entanglement.",
    descriptionPortuguese:
      'Uma queda de sacrifício avançada onde o atacante salta de lado, fazendo uma tesoura nas pernas do oponente para derrubá-lo enquanto cai em um enroscamento dominante.',
    category: Category.Takedown,
    difficulty: Difficulty.Advanced,
  },

  // ─────────────────────────────────────────────
  //  DEFENSES
  // ─────────────────────────────────────────────

  // Beginner
  {
    id: 'def-beg-101',
    name: 'Frame and Hip Escape from Side Control',
    namePortuguese: 'Enquadrar e Fugir de Quadril do Controle Lateral',
    description:
      'A basic defensive movement from side control using frames on the neck and hip combined with a strong hip escape to create space and recover guard.',
    descriptionPortuguese:
      'Um movimento defensivo básico do controle lateral usando enquadramentos no pescoço e quadril combinado com uma fuga de quadril forte para criar espaço e recuperar a guarda.',
    category: Category.Defend,
    difficulty: Difficulty.Beginner,
  },

  // Intermediate
  {
    id: 'def-int-101',
    name: 'Turtle Defense to Guard',
    namePortuguese: 'Defesa da Tartaruga para Guarda',
    description:
      'A defensive sequence from turtle where the player rolls or sits through to recover guard instead of staying static in turtle.',
    descriptionPortuguese:
      'Uma sequência defensiva a partir da posição tartaruga onde o jogador rola ou gira sentado para recuperar a guarda em vez de permanecer estático na tartaruga.',
    category: Category.Defend,
    difficulty: Difficulty.Intermediate,
  },

  // Advanced
  {
    id: 'def-adv-101',
    name: 'Rolling Back Take Counter',
    namePortuguese: 'Contra-Ataque com Rolamento para as Costas',
    description:
      "An advanced defensive counter where the player rolls through a guard pass or takedown attempt to come up taking the opponent's back.",
    descriptionPortuguese:
      'Um contra-ataque defensivo avançado onde o jogador rola através de uma tentativa de passagem de guarda ou queda para emergir pegando as costas do oponente.',
    category: Category.Defend,
    difficulty: Difficulty.Advanced,
  },

  // ─────────────────────────────────────────────
  //  SUBMISSION ESCAPES
  // ─────────────────────────────────────────────

  // Beginner
  {
    id: 'esc-beg-101',
    name: 'Cross-Body Armbar Hitchhiker Escape',
    namePortuguese: 'Fuga Hitchhiker da Chave de Braço',
    description:
      "A beginner-friendly escape from the armbar where the defender turns the thumb down, runs their body around the opponent's legs, and slips the elbow free.",
    descriptionPortuguese:
      'Uma fuga acessível da chave de braço onde o defensor gira o polegar para baixo, corre com o corpo ao redor das pernas do oponente e desliza o cotovelo para fora.',
    category: Category.SubmissionEscape,
    difficulty: Difficulty.Beginner,
  },

  // Intermediate
  {
    id: 'esc-int-101',
    name: 'Rear Naked Choke Escape with Shoulder Slide',
    namePortuguese: 'Fuga do Mata Leão com Deslize de Ombro',
    description:
      'An escape from the rear naked choke where the defender slides their shoulders to the mat on the choking-arm side and rotates to end up in top position.',
    descriptionPortuguese:
      'Uma fuga do mata leão onde o defensor desliza os ombros até o tatame do lado do braço do estrangulamento e gira para terminar por cima.',
    category: Category.SubmissionEscape,
    difficulty: Difficulty.Intermediate,
  },

  // Advanced
  {
    id: 'esc-adv-101',
    name: 'Triangle Counter to Pass',
    namePortuguese: 'Contra-Ataque do Triângulo para Passagem',
    description:
      'An advanced escape where the defender uses stacking pressure and leg pummeling to not only escape the triangle but immediately transition into a guard pass.',
    descriptionPortuguese:
      'Uma fuga avançada onde o defensor usa pressão de empilhamento e troca de ganchos com as pernas para não apenas escapar do triângulo, mas também transicionar imediatamente para uma passagem de guarda.',
    category: Category.SubmissionEscape,
    difficulty: Difficulty.Advanced,
  },
];

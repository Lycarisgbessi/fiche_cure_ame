import { Section } from './types';

const tableOptions = [
  "Ça ne s'est jamais produit dans ma vie",
  "Ça se produisait dans le passé (ça ne se produit plus depuis 1 an)",
  "Ça se produit présentement (il y a moins d'1 an que ça s'est produit)",
  "Ça se produit souvent dans ma famille"
];

const createTableQuestion = (id: string, label: string) => ({
  id,
  label,
  type: 'multi-select' as const,
  options: tableOptions
});

const createYesNoDetailsQuestion = (id: string, label: string) => ({
  id,
  label,
  type: 'yes-no-details' as const,
});

const createYesNoWhoQuestion = (id: string, label: string) => ({
  id,
  label,
  type: 'yes-no-who' as const,
});

export const formSchema: Section[] = [
  {
    id: 'infos_personnelles',
    title: 'Informations Personnelles',
    questions: [
      { id: 'nom', label: 'Nom(s)', type: 'text' },
      { id: 'prenom', label: 'Prénom(s)', type: 'text' },
      { id: 'date_lieu_naissance', label: 'Date et lieu de Naissance', type: 'text' },
      { id: 'nationalite', label: 'Nationalité', type: 'text' },
      { id: 'ethnie', label: 'Ethnie', type: 'text' },
      { id: 'niveau_etude', label: 'Niveau d’étude', type: 'text' },
      { id: 'profession', label: 'Profession', type: 'text' },
      { id: 'adresse', label: 'Adresse', type: 'text' },
      { id: 'contacts', label: 'Contacts', type: 'text' },
      { id: 'email', label: 'Email', type: 'text' },
    ]
  },
  {
    id: 'situation_matrimoniale',
    title: 'Situation Matrimoniale',
    questions: [
      { 
        id: 'statut_matrimonial', 
        label: 'Statut', 
        type: 'radio', 
        options: [
          'Célibataire', 'Cheminant(e)', 'Fiancé(e)', 'Marié(e)', 'Veuf(ve)', 
          'Petit(e) ami(e)', 'Polygame', 'Polyandre', 'En Séparation de corps', 'Divorcé(e)'
        ] 
      },
      { id: 'nom_conjoint', label: 'Nom(s) et Prénom(s) du (de la) conjoint(e)', type: 'text' },
      { id: 'conjoint_converti', label: 'Le (la) conjoint(e) est-il(elle) converti(e) ?', type: 'radio', options: ['Oui', 'Non'] },
      { id: 'religion_conjoint', label: 'Si non, religion du (de la) conjoint(e)', type: 'text' },
      { id: 'nombre_enfants', label: 'Nombre d’enfants', type: 'text' },
    ]
  },
  {
    id: 'etat_spirituel',
    title: 'Etat Spirituel',
    questions: [
      { id: 'ne_de_nouveau', label: 'Êtes-vous né(e) de nouveau ?', type: 'radio', options: ['Oui', 'Non'] },
      { id: 'depuis_quand_ne_de_nouveau', label: 'Depuis combien de temps êtes-vous né(e) de nouveau ?', type: 'text' },
      { id: 'baptise_eau', label: 'Êtes-vous baptisé(e) d’eau ?', type: 'radio', options: ['Oui', 'Non'] },
      { id: 'date_bapteme_eau', label: 'Date Baptême', type: 'text' },
      { id: 'baptise_saint_esprit', label: 'Êtes-vous baptisé(e) du Saint Esprit ?', type: 'radio', options: ['Oui', 'Non'] },
      { id: 'date_bapteme_saint_esprit', label: 'Date Baptême', type: 'text' },
      { id: 'dons_spirituels', label: 'Manifestez-vous des dons spirituels ?', type: 'radio', options: ['Oui', 'Non'] },
      { id: 'lesquels_dons_spirituels', label: 'Lesquels ?', type: 'text' },
      { id: 'eglise_frequentee', label: 'Eglise fréquentée ?', type: 'text' },
    ]
  },
  {
    id: 'objectif_entretien',
    title: 'OBJECTIF DE L’ENTRETIEN : Quelle est l’importance de cette démarche ?',
    description: [
      'La cure d’âme est une étape très importante de la délivrance. Elle permet de déceler les esprits impurs qui troublent votre vie afin d’obtenir une délivrance totale. La délivrance s’opère à trois niveaux :',
      'La délivrance du corps : C’est l’aspect le plus connu de la délivrance. Elle consiste à chasser le(s) démon(s) au nom de Jésus-Christ (Actes 16v18)',
      'La délivrance de l’âme : Elle consiste à libérer l’âme des fardeaux, des blessures intérieures et chocs émotionnels, des mauvaises attitudes, du mauvais caractère et de la convoitise (Jacques 1v14 à 15). Cela se fait de manière progressive par l’entretien, la prière et l’enseignement de la parole de Dieu.',
      'La délivrance de l’esprit : C’est un processus qui consiste à renouveler l’intelligence. L’esprit est non seulement libéré de toute forme de croyance ou de conceptions contraires aux vérités bibliques mais également des pensées impures (2 Cor 10v 5)',
      'Cette fiche nous permettra donc de conduire l’entretien auquel vous vous prêtez. Aussi les réponses que vous donnerez doivent être franches et précises.',
      'Que le Seigneur vous accorde sa grâce afin d’obtenir votre délivrance totale.',
      'Que Christ vous bénisse !'
    ],
    questions: [
      { id: 'problemes_actuels', label: 'Avez-vous des problèmes ou des préoccupation actuels et depuis quand durent-ils ?', type: 'textarea' },
      { id: 'deja_fait_cure_ame', label: 'Avez-vous déjà fait une cure d’âme ?', type: 'radio', options: ['Oui', 'Non'] },
      { id: 'ou_quand_cure_ame', label: 'Où et quand ?', type: 'text' },
    ]
  },
  {
    id: 'delivrance_corps_sirene',
    title: 'QUESTIONS RELATIVES A LA DELIVRANCE DU CORPS : La Sirène des eaux',
    questions: [
      createTableQuestion('sirene_garcons', 'Aimer beaucoup les garçons'),
      createTableQuestion('sirene_filles', 'Aimer beaucoup les filles'),
      createTableQuestion('sirene_seduction', 'Comportements séduisants'),
      createTableQuestion('sirene_sexy', 'Habillements Sexy'),
      createTableQuestion('sirene_masturbation', 'Masturbation se donner du plaisir sexuel tout seul'),
      createTableQuestion('sirene_impudicite', 'Impudicité ou Fornication rapports sexuels sans être marié(e)'),
      createTableQuestion('sirene_adultere', 'Adultère rapports sexuels avec une personne autre que son(sa) conjoint(e) quand on est marié(e) ou rapports sexuels avec une personne mariée quand on est célibataire'),
      createTableQuestion('sirene_homosexualite', 'Homosexualité rapports sexuels avec une personne de même sexe : homme avec homme (pédérastie, gay) ou femme avec femme (lesbianisme)'),
      createTableQuestion('sirene_transsexuel', 'Transsexuel travesti(e), c-à-d personne ayant changé de sexe'),
    ]
  },
  {
    id: 'delivrance_corps_debauche',
    title: 'Débauche',
    questions: [
      createTableQuestion('debauche_pornographie', 'Pornographie suivre des films pornographiques, ou lire des revues ou récits pornographiques/érotiques'),
      createTableQuestion('debauche_partouze', 'Partouze rapports sexuels avec plusieurs partenaires ensemble à la fois'),
      createTableQuestion('debauche_echangisme', 'Echangisme rapports sexuels avec son(sa) conjoint(e) et avec d’autres couples ou partenaires ensemble à la fois'),
      createTableQuestion('debauche_sodomie', 'Sodomie rapports sexuels par voie anale'),
      createTableQuestion('debauche_inceste', 'Inceste rapports sexuels avec un membre de sa famille'),
      createTableQuestion('debauche_prostitution', 'Prostitution rapports sexuels pour de l’argent ou rapports sexuels avec un(e) prostitué(e)'),
      createTableQuestion('debauche_zoophilie', 'Zoophilie rapports sexuels avec des animaux'),
      createTableQuestion('debauche_avortement', 'Avortement interruption volontaire de grossesse'),
      createTableQuestion('debauche_alcoolisme', 'Alcoolisme'),
      createTableQuestion('debauche_tabac', 'Tabac tabac « normal » ou cigarettes autorisées à la vente, chanvre, cannabis ou équivalent'),
      createTableQuestion('debauche_drogue', 'Drogue drogues dures (cocaïne, héroïne, weed, opium, etc) et dérivés (extasie, amphétamines, aphrodisiaques, etc.)'),
      createTableQuestion('debauche_tatouage', 'Tatouage'),
    ]
  },
  {
    id: 'delivrance_corps_mariage_famille',
    title: 'Mariage dans la famille',
    questions: [
      createYesNoDetailsQuestion('mariage_famille_vous', 'Êtes-vous marié(e) à un membre de votre famille (cousin(e), oncle, nièce, etc.) ?'),
      createYesNoDetailsQuestion('mariage_famille_autres', 'Y’a-t-il un ou des membres de votre famille mariés à d’autres membres de la famille ?'),
    ]
  },
  {
    id: 'delivrance_corps_mari_nuit',
    title: 'Mari de nuit ou femme de nuit',
    questions: [
      createTableQuestion('nuit_douleurs_ventre', 'Douleurs au bas ventre'),
      createTableQuestion('nuit_regles_douloureuses', 'Règles Douloureuses'),
      createTableQuestion('nuit_ulcere', 'Ulcère mal d’estomac'),
      createTableQuestion('nuit_fausses_couches', 'Fausses couches'),
      createTableQuestion('nuit_disputes_partenaire', 'Disputes fréquentes avec son partenaire'),
      createTableQuestion('nuit_desinteret_sexuel', 'Désintérêt des rapports sexuels avec son époux(se)'),
      createTableQuestion('nuit_rapports_reve', 'Rapports sexuels fréquents en rêve'),
    ]
  },
  {
    id: 'delivrance_corps_echec',
    title: 'Esprit d’échec',
    questions: [
      createTableQuestion('echec_etudes', 'Echec régulier dans les études'),
      createTableQuestion('echec_commerce', 'Echec régulier dans le commerce'),
      createTableQuestion('echec_pauvrete', 'Pauvreté'),
      createTableQuestion('echec_retard', 'Esprit de retard et de non-accomplissement'),
      createTableQuestion('echec_terminer', 'Vous avez du mal à terminer ce que vous commencez'),
      createTableQuestion('echec_village_reve', 'En songe vous-vous retrouvez souvent au village ou à la maison familiale'),
      createTableQuestion('echec_perdre_chemin', 'En rêve, vous perdez ou cherchez souvent votre chemin'),
    ]
  },
  {
    id: 'delivrance_corps_mort',
    title: 'Esprit de mort',
    questions: [
      createTableQuestion('mort_poursuivi', 'Poursuivi(e) en rêve'),
      createTableQuestion('mort_fusille', 'Fusillé(e) en rêve'),
      createTableQuestion('mort_contact_decedes', 'En contact avec des personnes décédées'),
      createTableQuestion('mort_funerailles', 'Assister à des funérailles en rêve'),
      createTableQuestion('mort_accidents', 'Rêver d’accidents'),
      createTableQuestion('mort_cimetieres', 'Rêver de cimetières ou de cercueils'),
    ]
  },
  {
    id: 'delivrance_corps_guerrier',
    title: 'Esprit guerrier',
    questions: [
      createTableQuestion('guerrier_bagarre', 'Aimer la bagarre'),
      createTableQuestion('guerrier_colereux', 'Très coléreux'),
      createTableQuestion('guerrier_blesser', 'Envie de blesser'),
      createTableQuestion('guerrier_tuer', 'Envie de tuer'),
      createTableQuestion('guerrier_arts_martiaux', 'Pratique les arts martiaux'),
    ]
  },
  {
    id: 'delivrance_corps_initiation_sorcellerie',
    title: 'Initiation à la sorcellerie',
    questions: [
      createTableQuestion('init_sorcellerie_viande', 'Manger de la viande en rêve'),
      createTableQuestion('init_sorcellerie_voler', 'S’envoler en rêve'),
      createTableQuestion('init_sorcellerie_danser', 'Danser nu ou mi couvert en rêve'),
    ]
  },
  {
    id: 'delivrance_corps_sorcellerie',
    title: 'Esprit de Sorcellerie',
    questions: [
      createTableQuestion('sorcellerie_haine', 'Avoir de la haine dans son cœur'),
      createTableQuestion('sorcellerie_rancunier', 'Être rancunier'),
      createTableQuestion('sorcellerie_jaloux', 'Jaloux'),
      createTableQuestion('sorcellerie_sortir_corps', 'Sortir de son corps'),
    ]
  },
  {
    id: 'delivrance_corps_python',
    title: 'Esprit de Python',
    questions: [
      createTableQuestion('python_serpents', 'Voir des serpents en rêve'),
      createTableQuestion('python_poursuivi', 'Poursuivi en rêve par des serpents'),
      createTableQuestion('python_divination', 'Manifester la divination'),
      createTableQuestion('python_fausses_propheties', 'Donner de fausses prophéties'),
      createTableQuestion('python_division', 'Semer la division'),
    ]
  },
  {
    id: 'delivrance_corps_main_seche',
    title: 'Main sèche (dévoreur)',
    questions: [
      createTableQuestion('main_seche_conserver', 'Ne pas arriver à conserver ou à gérer ses biens'),
      createTableQuestion('main_seche_dimes', 'Ne pas donner ou donner difficilement ses dîmes'),
      createTableQuestion('main_seche_offrandes', 'Faire difficilement des offrandes'),
      createTableQuestion('main_seche_liberalite', 'Manquer de libéralité (générosité)'),
      createTableQuestion('main_seche_avare', 'Être avare'),
    ]
  },
  {
    id: 'delivrance_ame_attitudes',
    title: 'QUESTIONS RELATIVES A LA DELIVRANCE DE L’ÂME',
    description: 'Vous sentez-vous concernés par l’une des attitudes suivantes ?',
    questions: [
      createYesNoWhoQuestion('attitudes_haine', 'Avez-vous de la haine ou de la rancune contre quelqu’un ?'),
      createYesNoWhoQuestion('attitudes_peur', 'Avez-vous souvent peur ?'),
      createYesNoWhoQuestion('attitudes_decu', 'Avez-vous été déçu(e) par quelqu’un ou par quelque chose ?'),
    ]
  },
  {
    id: 'delivrance_ame_sentiments',
    title: 'Sentiments',
    description: 'Cela a-t-il laissé en vous un sentiment quelconque ?',
    questions: [
      createYesNoDetailsQuestion('sentiments_tristesse', 'Tristesse ?'),
      createYesNoDetailsQuestion('sentiments_passivete', 'Passiveté ?'),
      createYesNoDetailsQuestion('sentiments_colere', 'Colère ?'),
      createYesNoDetailsQuestion('sentiments_haine', 'Haine ?'),
      createYesNoDetailsQuestion('sentiments_rancune', 'Rancune ?'),
      createYesNoDetailsQuestion('sentiments_desespoir', 'Désespoir ?'),
    ]
  },
  {
    id: 'delivrance_ame_caractere',
    title: 'Caractère',
    description: 'Comment est votre caractère ?',
    questions: [
      createYesNoDetailsQuestion('caractere_chaud', 'Chaud ?'),
      createYesNoDetailsQuestion('caractere_doux', 'Doux ?'),
      createYesNoDetailsQuestion('caractere_calme', 'Calme ?'),
      createYesNoDetailsQuestion('caractere_froid', 'Froid ?'),
      createYesNoDetailsQuestion('caractere_entete', 'Etes-vous entêté(e) ?'),
      createYesNoDetailsQuestion('caractere_reproches', 'Supportez-vous difficilement les reproches ?'),
      createYesNoDetailsQuestion('caractere_renferme', 'Etes-vous renfermé(e) ?'),
      createYesNoDetailsQuestion('caractere_colere', 'Vous mettez-vous souvent en colère ?'),
      createYesNoDetailsQuestion('caractere_superiotite', 'Avez-vous un complexe de supériorité ?'),
      createYesNoDetailsQuestion('caractere_inferiorite', 'Avez-vous un complexe d’infériorité ?'),
      { id: 'image_de_soi', label: 'Quelle image avez-vous de vous-même ?', type: 'textarea' },
      { id: 'chose_personnelle', label: 'Avez-vous quelque chose de personnel qui vous pèse sur le cœur dont vous aimeriez vous libérer ?', type: 'textarea' },
    ]
  },
  {
    id: 'delivrance_ame_comportements',
    title: 'Comportements',
    questions: [
      createYesNoDetailsQuestion('comportement_paresseux', 'Etes-vous paresseux(se) ?'),
      createYesNoDetailsQuestion('comportement_negligent', 'Etes-vous négligent(e) ?'),
      createYesNoDetailsQuestion('comportement_objectifs', 'Arrivez-vous toujours à atteindre vos objectifs ?'),
      createYesNoDetailsQuestion('comportement_paiens', 'Avez-vous plus de relations avec les païens qu’avec les chrétiens ?'),
    ]
  },
  {
    id: 'delivrance_ame_chocs',
    title: 'Chocs émotionnels',
    description: 'Avez-vous vécu un choc émotionnel lié à un évènement quelconque ?',
    questions: [
      createYesNoDetailsQuestion('choc_accident', 'Accident ?'),
      createYesNoDetailsQuestion('choc_incendie', 'Incendie ?'),
      createYesNoDetailsQuestion('choc_agression', 'Agression, braquage ?'),
      createYesNoDetailsQuestion('choc_viol', 'Viol ?'),
      createYesNoDetailsQuestion('choc_tentative_viol', 'Tentative de viol ?'),
      createYesNoDetailsQuestion('choc_perte_etre_cher', 'Perte d’un être cher ?'),
      createYesNoDetailsQuestion('choc_rejet_parents', 'Rejet des parents'),
      createYesNoDetailsQuestion('choc_autre', 'Autre'),
      { id: 'sentiments_choc', label: 'Quels sentiments cela a-t-il laissé en vous ?', type: 'textarea' },
    ]
  },
  {
    id: 'delivrance_ame_femmes',
    title: 'Femmes uniquement',
    description: 'Répondre par OUI ou NON (Pour les femmes uniquement)',
    questions: [
      createYesNoDetailsQuestion('femme_excisee', 'Êtes-vous excisée ?'),
      createYesNoDetailsQuestion('femme_repassage_seins', 'Avez-vous subi un repassage des seins ?'),
    ]
  },
  {
    id: 'delivrance_ame_blessures',
    title: 'Blessures intérieures',
    description: 'Avez-vous des blessures intérieures liées aux évènements suivants ? (OUI ou NON) (pour tous)',
    questions: [
      createYesNoDetailsQuestion('blessure_parents_divorces', 'Parents divorcés ?'),
      createYesNoDetailsQuestion('blessure_deception_amoureuse', 'Déception amoureuse ?'),
      createYesNoDetailsQuestion('blessure_rejete_famille', 'Rejeté(e) par la famille ?'),
      createYesNoDetailsQuestion('blessure_incompris', 'Incompris ?'),
      createYesNoDetailsQuestion('blessure_divorce', 'Divorce ?'),
      createYesNoDetailsQuestion('blessure_autre', 'Autre'),
      { id: 'relations_parents', label: 'Quelles sont vos relations passées et présentes avec vos parents ?', type: 'textarea' },
      { id: 'attentes_seigneur', label: 'Quelles sont vos attentes vis-à-vis du Seigneur pour votre vie ?', type: 'textarea' },
      { id: 'autres_choses', label: 'Avez-vous d’autres choses à dire qui n’ont pas été mentionnés ci-dessus ?', type: 'textarea' },
    ]
  },
  {
    id: 'delivrance_esprit',
    title: 'QUESTIONS RELATIVES A LA DELIVRANCE DE L’ESPRIT',
    questions: [
      createYesNoDetailsQuestion('esprit_noms_parent', 'Portez-vous le(s) nom(s) d’un parent ?'),
      createYesNoDetailsQuestion('esprit_signification_noms', 'Votre (vos) nom(s) a (ont) t-il(s) des significations particulières ?'),
      createYesNoDetailsQuestion('esprit_consacre_eau', 'Avez-vous été consacré à une eau ?'),
      createYesNoDetailsQuestion('esprit_consacre_foret', 'Avez-vous été consacré à une forêt ?'),
      createYesNoDetailsQuestion('esprit_consacre_esprit', 'Avez-vous été consacré à un esprit ?'),
      createYesNoDetailsQuestion('esprit_consacre_fetiche', 'Avez-vous été consacré à un fétiche ?'),
      createYesNoDetailsQuestion('esprit_initie_bois_sacre', 'Avez-vous été initié au bois sacré ?'),
      createYesNoDetailsQuestion('esprit_fete_generation', 'Avez-vous participé à une fête de génération ?'),
      { id: 'region_origine', label: 'De quelle région êtes –vous originaire ?', type: 'text' },
      { id: 'village_origine', label: 'Village ?', type: 'text' },
      createYesNoDetailsQuestion('esprit_signification_village', 'Ce nom a-t-il une signification particulière ?'),
      createYesNoDetailsQuestion('esprit_sorcellerie_famille', 'La sorcellerie existe-t-elle dans votre famille ?'),
      { id: 'noms_eaux_forets', label: 'Quels sont les noms des eaux ou forêts ou éléments adorés chez vous ?', type: 'textarea' },
      createYesNoDetailsQuestion('esprit_adoration', 'Avez-vous participé à une adoration quelconque ? (Si oui, dites laquelle -colonne détails-)'),
      createYesNoDetailsQuestion('esprit_sacrifices_parents', 'Vos parents ont-ils fait des sacrifices ? (Si oui, dites lesquels -colonne détails-)'),
      createYesNoDetailsQuestion('esprit_charlatans', 'Consultent-ils des charlatans ?'),
      createYesNoDetailsQuestion('esprit_groupes_occultes', 'Avez-vous un parent qui appartient à ou a fréquenté un des groupes suivants : sciences orientales, arts martiaux, sectes, loges occultes ?'),
      createYesNoDetailsQuestion('esprit_assiste_pratiques', 'Avez-vous déjà assisté à l’une de ces pratiques ?'),
      createYesNoDetailsQuestion('esprit_maudit', 'Avez-vous été maudit(e) par vos parents ou par quelqu’un d’autre ? Si oui pourquoi ?'),
      createYesNoDetailsQuestion('esprit_participe_sacrifices', 'Avez-vous participé à des sacrifices ?'),
      createYesNoDetailsQuestion('esprit_pratique_sacrifice', 'Avez-vous personnellement pratiqué un sacrifice quelconque ?'),
      createYesNoDetailsQuestion('esprit_objet_sacrifice', 'Avez-vous utilisé ou consommé l’objet du sacrifice ? (Précisez l’objet : poulet, viande, boisson…)'),
      createYesNoDetailsQuestion('esprit_marabout', 'Avez-vous consulté un marabout ? Si oui, dites pourquoi ? (Colonne détails)'),
      createYesNoDetailsQuestion('esprit_guerisseur', 'Avez-vous consulté un guérisseur ? Si oui, dites pourquoi ? (Colonne détails)'),
      createYesNoDetailsQuestion('esprit_lave_mixture', 'Avez-vous été lavé(e) par une mixture quelconque ? (Précisez dans quelles circonstances)'),
      createYesNoDetailsQuestion('esprit_secte', 'Avez-vous pratiqué une secte ? Préciser laquelle et le degré atteint (Colonne détails)'),
      createYesNoDetailsQuestion('esprit_conjoint_secte', 'Avez-vous eu un(e) conjoint(e) qui pratique une secte ou qui consulte des charlatans/marabouts ?'),
      createYesNoDetailsQuestion('esprit_danse_rituelle', 'Avez-vous participé à une danse rituelle ?'),
      createYesNoDetailsQuestion('esprit_arts_martiaux', 'Avez-vous pratiqué les arts martiaux ?'),
      createYesNoDetailsQuestion('esprit_tourmente_esprits', 'Êtes-vous tourmenté(e) par des esprits impurs ?'),
      createYesNoDetailsQuestion('esprit_voyez_entendez', 'Si oui, les voyez-vous ? Les entendez-vous ?'),
      createYesNoDetailsQuestion('esprit_pensees_troublees', 'Vos pensées sont-elles troublées ?'),
      createYesNoDetailsQuestion('esprit_pensees_impures', 'Vos pensées sont-elles impures ?'),
      createYesNoDetailsQuestion('esprit_pensees_suicide', 'Avez-vous déjà eu des pensées de suicide ?'),
      createYesNoDetailsQuestion('esprit_autres', 'Autres'),
    ]
  }
];

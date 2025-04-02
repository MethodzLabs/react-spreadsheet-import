import type { RsiProps } from "../types"
import { defaultRSIProps } from "../ReactSpreadsheetImport"
import axios from "axios"

const fields = [
  {
    label: "Url",
    key: "url",
    alternateMatches: ["URL du site","domain"],
    fieldType: {
      type: "input",
    },
    example: "exemple.com",
    validations: [
      {
        rule: "required",
        errorMessage: "Url is required",
      },
    ],
  },
  {
    label: "Type de site",
    key: "type",
    alternateMatches: ["Type de site"],
    fieldType: {
      type: "input",
    },
    example: "Média",
    validations: [
      {
        rule: "required",
        errorMessage: "Name is required",
      },
    ],
    description: "Family / Last name",
  },
  {
    label: "Pays cible",
    key: "targetCountries",
    alternateMatches: ["Pays cible"],
    fieldType: {
      type: "input",
    },
    example: "France",
    validations: [
      {
        rule: "required",
        errorMessage: "Name is required",
      },
    ],
  },
  {
    label: "Langues",
    key: "languages",
    alternateMatches: ["langue","language","Langues"],
    fieldType: {
      type: "select",
      options : [
        { label: "Catalan", value: "Catalan" },
        { label: "Norvégien nynorsk", value: "Norvégien nynorsk" },
        { label: "Biélorusse", value: "Biélorusse" },
        { label: "Ourdou", value: "Ourdou" },
        { label: "Français", value: "Français" },
        { label: "Moldave", value: "Moldave" },
        { label: "Portugais", value: "Portugais" },
        { label: "Interlingue", value: "Interlingue" },
        { label: "Kazakh", value: "Kazakh" },
        { label: "Groenlandais", value: "Groenlandais" },
        { label: "Bachkir", value: "Bachkir" },
        { label: "Tswana", value: "Tswana" },
        { label: "Galicien", value: "Galicien" },
        { label: "Soundanais", value: "Soundanais" },
        { label: "Marathi", value: "Marathi" },
        { label: "Japonais", value: "Japonais" },
        { label: "Frison occidental", value: "Frison occidental" },
        { label: "Lituanien", value: "Lituanien" },
        { label: "Kwanyama", value: "Kwanyama" },
        { label: "Tsonga", value: "Tsonga" },
        { label: "Hindi", value: "Hindi" },
        { label: "Islandais", value: "Islandais" },
        { label: "Bichlamar", value: "Bichlamar" },
        { label: "Hiri motu", value: "Hiri motu" },
        { label: "Serbe", value: "Serbe" },
        { label: "Assamais", value: "Assamais" },
        { label: "Suédois", value: "Suédois" },
        { label: "Komi", value: "Komi" },
        { label: "Ganda", value: "Ganda" },
        { label: "Herero", value: "Herero" },
        { label: "Anglais", value: "Anglais" },
        { label: "Swati", value: "Swati" },
        { label: "Malgache", value: "Malgache" },
        { label: "Occitan", value: "Occitan" },
        { label: "Mongol", value: "Mongol" },
        { label: "Norvégien", value: "Norvégien" },
        { label: "Tibétain", value: "Tibétain" },
        { label: "Cachemiri", value: "Cachemiri" },
        { label: "Ido", value: "Ido" },
        { label: "Coréen", value: "Coréen" },
        { label: "Hébreu", value: "Hébreu" },
        { label: "Igbo", value: "Igbo" },
        { label: "Bengali", value: "Bengali" },
        { label: "Rhéto-roman", value: "Rhéto-roman" },
        { label: "Javanais", value: "Javanais" },
        { label: "Northern Ndebele", value: "Northern Ndebele" },
        { label: "Gaélique écossais", value: "Gaélique écossais" },
        { label: "Arabe", value: "Arabe" },
        { label: "Malais", value: "Malais" },
        { label: "Thaï", value: "Thaï" },
        { label: "Guarani", value: "Guarani" },
        { label: "Avaric", value: "Avaric" },
        { label: "Tahitien", value: "Tahitien" },
        { label: "Akan", value: "Akan" },
        { label: "Southern Ndebele", value: "Southern Ndebele" },
        { label: "Wolof", value: "Wolof" },
        { label: "Oromo", value: "Oromo" },
        { label: "Estonien", value: "Estonien" },
        { label: "Pendjabi", value: "Pendjabi" },
        { label: "Volapük", value: "Volapük" },
        { label: "Oriya", value: "Oriya" },
        { label: "Espagnol", value: "Espagnol" },
        { label: "Quechua", value: "Quechua" },
        { label: "Vietnamien", value: "Vietnamien" },
        { label: "Ouzbek", value: "Ouzbek" },
        { label: "Polonais", value: "Polonais" },
        { label: "Yoruba", value: "Yoruba" },
        { label: "Arménien", value: "Arménien" },
        { label: "Créole haïtien", value: "Créole haïtien" },
        { label: "Swahili", value: "Swahili" },
        { label: "Limbourgeois", value: "Limbourgeois" },
        { label: "Foulah", value: "Foulah" },
        { label: "Irlandais", value: "Irlandais" },
        { label: "Fidjien", value: "Fidjien" },
        { label: "Cris", value: "Cris" },
        { label: "Tchétchène", value: "Tchétchène" },
        { label: "Venda", value: "Venda" },
        { label: "Yiddish", value: "Yiddish" },
        { label: "Lao", value: "Lao" },
        { label: "Turkmène", value: "Turkmène" },
        { label: "Gujarati", value: "Gujarati" },
        { label: "Birman", value: "Birman" },
        { label: "Letton", value: "Letton" },
        { label: "Kirghize", value: "Kirghize" },
        { label: "Kurde", value: "Kurde" },
        { label: "Southern Sotho", value: "Southern Sotho" },
        { label: "Luba-Katanga", value: "Luba-Katanga" },
        { label: "Kongo", value: "Kongo" },
        { label: "Tongien", value: "Tongien" },
        { label: "Chinois", value: "Chinois" },
        { label: "Albanais", value: "Albanais" },
        { label: "Finnois", value: "Finnois" },
        { label: "Tamoul", value: "Tamoul" },
        { label: "Pachto", value: "Pachto" },
        { label: "Roumain", value: "Roumain" },
        { label: "Italien", value: "Italien" },
        { label: "Bosniaque", value: "Bosniaque" },
        { label: "Ossète", value: "Ossète" },
        { label: "Amharique", value: "Amharique" },
        { label: "Afar", value: "Afar" },
        { label: "Khmer", value: "Khmer" },
        { label: "Afrikaans", value: "Afrikaans" },
        { label: "Luxembourgeois", value: "Luxembourgeois" },
        { label: "Sarde", value: "Sarde" },
        { label: "Azéri", value: "Azéri" },
        { label: "Lingala", value: "Lingala" },
        { label: "Zhuang", value: "Zhuang" },
        { label: "Persan", value: "Persan" },
        { label: "Espéranto", value: "Espéranto" },
        { label: "Samoan", value: "Samoan" },
        { label: "Gallois", value: "Gallois" },
        { label: "Slovène", value: "Slovène" },
        { label: "Same du Nord", value: "Same du Nord" },
        { label: "Maori", value: "Maori" },
        { label: "Maltais", value: "Maltais" },
        { label: "Turc", value: "Turc" },
        { label: "Xhosa", value: "Xhosa" },
        { label: "Inupiak", value: "Inupiak" },
        { label: "Dzongkha", value: "Dzongkha" },
        { label: "Tchouvache", value: "Tchouvache" },
        { label: "Kannada", value: "Kannada" },
        { label: "Hongrois", value: "Hongrois" },
        { label: "Danois", value: "Danois" },
        { label: "Kikuyu", value: "Kikuyu" },
        { label: "Indonésien", value: "Indonésien" },
        { label: "Sango", value: "Sango" },
        { label: "Géorgien", value: "Géorgien" },
        { label: "Nauruan", value: "Nauruan" },
        { label: "Kanouri", value: "Kanouri" },
        { label: "Télougou", value: "Télougou" },
        { label: "Macédonien", value: "Macédonien" },
        { label: "Kirundi", value: "Kirundi" },
        { label: "Latin", value: "Latin" },
        { label: "Manx", value: "Manx" },
        { label: "Ukrainien", value: "Ukrainien" },
        { label: "Sinhala", value: "Sinhala" },
        { label: "Bihari", value: "Bihari" },
        { label: "Féroïen", value: "Féroïen" },
        { label: "Wallon", value: "Wallon" },
        { label: "Aymara", value: "Aymara" },
        { label: "Shona", value: "Shona" },
        { label: "Zoulou", value: "Zoulou" },
        { label: "Breton", value: "Breton" },
        { label: "Corse", value: "Corse" },
        { label: "Népalais", value: "Népalais" },
        { label: "Navajo", value: "Navajo" },
        { label: "Grec", value: "Grec" },
        { label: "Twi", value: "Twi" },
        { label: "Interlingua", value: "Interlingua" },
        { label: "Inuktitut", value: "Inuktitut" },
        { label: "Tigrigna", value: "Tigrigna" },
        { label: "Aragonais", value: "Aragonais" },
        { label: "Basque", value: "Basque" },
        { label: "Chichewa", value: "Chichewa" },
        { label: "Tagalog", value: "Tagalog" },
        { label: "Vieux slave d’église", value: "Vieux slave d’église" },
        { label: "Avestique", value: "Avestique" },
        { label: "Norvégien bokmål", value: "Norvégien bokmål" },
        { label: "Croate", value: "Croate" },
        { label: "Ndonga", value: "Ndonga" },
        { label: "Kinyarwanda", value: "Kinyarwanda" },
        { label: "Cornique", value: "Cornique" },
        { label: "Slovaque", value: "Slovaque" },
        { label: "Bulgare", value: "Bulgare" },
        { label: "Chamorro", value: "Chamorro" },
        { label: "Sanskrit", value: "Sanskrit" },
        { label: "Bambara", value: "Bambara" },
        { label: "Allemand", value: "Allemand" },
        { label: "Marshallais", value: "Marshallais" },
        { label: "Malayalam", value: "Malayalam" },
        { label: "Russe", value: "Russe" },
        { label: "Maldivien", value: "Maldivien" },
        { label: "Néerlandais", value: "Néerlandais" },
        { label: "Éwé", value: "Éwé" },
        { label: "Ojibwé", value: "Ojibwé" },
        { label: "Tchèque", value: "Tchèque" },
        { label: "Pali", value: "Pali" },
        { label: "Haoussa", value: "Haoussa" },
      ]
    },
    example: "France",
    validations: [
      {
        rule: "required",
        errorMessage: "Team is required",
      },
    ],
  },  {
    label: "Thematiques",
    key: "themes",
    alternateMatches: ["theme","Thématiques"],
    fieldType: {
      type: "select",
      options: [
        { label: "Décoration", value: "decoration" },
        { label: "Lifestyle", value: "lifestyle" },
        { label: "Divers", value: "divers" },
        { label: "Bons plans - Promo - Shopping - Concours", value: "bons-plans-promo-shopping-concours" },
        { label: "Religion", value: "religion" },
        { label: "Beauté", value: "beaute" },
        { label: "Mode", value: "mode" },
        { label: "Audio", value: "audio" },
        { label: "Nautisme", value: "nautisme" },
        { label: "Presse", value: "presse" },
        { label: "Bricolage", value: "bricolage" },
        { label: "Loisirs - Sorties - Divertissement", value: "loisirs-sorties-divertissement" },
        { label: "Généraliste", value: "generaliste" },
        { label: "Jouet", value: "jouet" },
        { label: "Jardin", value: "jardin" },
        { label: "Jeux vidéo", value: "jeux-video" },
        { label: "Sécurité", value: "securite" },
        { label: "Luxe", value: "luxe" },
        { label: "Chasse - Pêche", value: "chasse-peche" },
        { label: "Informatique - Webmaster", value: "informatique-webmaster" },
        { label: "Cigarette électronique", value: "cigarette-electronique" },
        { label: "Education - Emploi - Formation - Carrière", value: "education-emploi-formation-carriere" },
        { label: "Bureautique", value: "bureautique" },
        { label: "Spiritualité - Voyance - Croyance - Esotérisme", value: "spiritualite-voyance-croyance-esoterisme" },
        { label: "Cinéma", value: "cinema" },
        { label: "Agriculture", value: "agriculture" },
        { label: "Communauté - société", value: "communaute-societe" },
        { label: "Masculin", value: "masculin" },
        { label: "Management", value: "management" },
        { label: "Référencement - SEO", value: "referencement-seo" },
        { label: "Vidéos", value: "videos" },
        { label: "B2B - Entrepreneurs - Marketing - Communication", value: "b2b-entrepreneurs-marketing-communication" },
        { label: "Féminin", value: "feminin" },
        { label: "Cuisine - Vins - Gastronomie - Boissons - Alimentation", value: "cuisine-vins-gastronomie-boissons-alimentation", },
        { label: "Droit - Gouvernement - Juridique", value: "droit-gouvernement-juridique" },
        { label: "Maison", value: "maison" },
        { label: "Sénior", value: "senior" },
        { label: "Buzz", value: "buzz" },
        { label: "Rencontre", value: "rencontre" },
        { label: "Ecologie - Environnement", value: "ecologie-environnement" },
        { label: "Sciences - Nature", value: "sciences-nature" },
        { label: "Energie", value: "energie" },
        { label: "Culture - Art", value: "culture-art" },
        { label: "Transport", value: "transport" },
        { label: "Bio", value: "bio" },
        { label: "Idée cadeau", value: "idee-cadeau" },
        { label: "Adultes - Rencontre - Sexe", value: "adultes-rencontre-sexe" },
        { label: "Banque - Finance - Economie", value: "banque-finance-economie" },
        { label: "Littérature - Bande dessinée", value: "litterature-bande-dessinee" },
        { label: "People", value: "people" },
        { label: "Gaming", value: "gaming" },
        { label: "Evénementiel", value: "evenementiel" },
        { label: "Spiritueux", value: "spiritueux" },
        { label: "Ameublement", value: "ameublement" },
        { label: "DIY - Do It Youself", value: "diy-do-it-yourself" },
        { label: "Auto - Moto", value: "auto-moto" },
        { label: "Santé - Bien-être", value: "sante-bien-etre" },
        { label: "Enfant", value: "enfant" },
        { label: "Électroménager", value: "electromenager" },
        { label: "Ouvrages de référence", value: "ouvrages-de-reference" },
        { label: "E-commerce", value: "e-commerce" },
        { label: "Geek", value: "geek" },
        { label: "Voyage - Tourisme", value: "voyage-tourisme" },
        { label: "Sport", value: "sport" },
        { label: "BTP - Travaux B2B - Industrie", value: "btp-travaux-b2b-industrie" },
        { label: "Animaux", value: "animaux" },
        { label: "Famille", value: "famille" },
        { label: "Actu du web", value: "actu-du-web" },
        { label: "Actualités - Médias généraliste", value: "actualites-medias-generaliste" },
        { label: "Assurance - Mutuelle", value: "assurance-mutuelle" },
        { label: "Hygiène", value: "hygiene" },
        { label: "Jeux d'argent - Poker", value: "jeux-d-argent-poker" },
        { label: "Mariage", value: "mariage" },
        { label: "Webmarketing", value: "webmarketing" },
        { label: "Immobilier", value: "immobilier" },
        { label: "Musique", value: "musique" },
        { label: "High tech", value: "high-tech" },
        { label: "Psychologie", value: "psychologie" },
        { label: "Politique", value: "politique" },
        { label: "Local", value: "local" },
        { label: "Business - Entreprise", value: "business-entreprise" },
      ],
    },
    example: "Beauté",
    validations: [
      {
        rule: "required",
        errorMessage: "Team is required",
      },
    ],
  },
  {
    label: "Description",
    key: "presentation",
    alternateMatches: ["desc"],
    fieldType: {
      type: "input",
    },
    example: "Description...",
    validations: [
      {
        rule: "unique",
        errorMessage: "Last name must be unique",
        level: "info",
      },
    ]
  },
  {
    label: "Nombre mot inclus",
    key: "nbWords",
    alternateMatches: ["Nombre de mots inclus"],
    fieldType: {
      type: "input",
    },
    example: "2",
    validations: [
      {
        rule: "unique",
        errorMessage: "Last name must be unique",
        level: "info",
      },
    ]
  },
  {
    label: "Tarif avec rédaction",
    key: "priceWithRedaction",
    alternateMatches: ["price"],
    fieldType: {
      type: "input",
    },
    example: "500€"
  },
  {
    label: "Tarif sans rédaction",
    key: "priceWithoutRedaction",
    alternateMatches: ["price"],
    fieldType: {
      type: "input",
    },
    example: "500€"
  },
  {
    label: "Tarif niche casino",
    key: "additionnalPriceCasino",
    alternateMatches: ["price"],
    fieldType: {
      type: "input",
    },
    example: "500€"
  },
  {
    label: "Tarif avec rédaction, niche CBD",
    key: "additionnalPriceCBD",
    alternateMatches: ["price"],
    fieldType: {
      type: "input",
    },
    example: "500€"
  },
  {
    label: "Tarif pour 100 mots supplémentaires",
    key: "price100words",
    alternateMatches: ["price100words"],
    fieldType: {
      type: "input",
    },
    example: "5€"
  },  {
    label: "Type de lien",
    key: "linkType",
    alternateMatches: ["Type de lien "],
    fieldType: {
      type: "select",
      options: [
        { label: "Lien en \"doFollow\"", value: "Lien en \"doFollow\"" },
        { label: "Lien en \"noFollow\"", value: "one" },
      ],
    },
    example: "Lien en \"doFollow\"",
    validations: [
      {
        rule: "required",
        errorMessage: "Team is required",
      },
    ],
  },  {
    label: "Type de redaction",
    key: "redactionType",
    alternateMatches: ["Type de redaction"],
    fieldType: {
      type: "select",
      options: [
        { label: "Humaine", value: "HUMAN" },
        { label: "IA", value: "AI" },
        { label: "Mixte", value: "MIXED" },
      ],
    },
    example: "Humaine",
    validations: [
      {
        rule: "required",
        errorMessage: "Team is required",
      },
    ],
  },
  {
    label: "Nombre max de liens sources externes",
    key: "nbMaxLinksExternal",
    alternateMatches: ["externalLink"],
    fieldType: {
      type: "input",
    },
    example: "2",
    validations: [
      {
        rule: "required",
        errorMessage: "Team is required",
      },
    ],
  },
  {
    label: "Nombre max de liens vers client",
    key: "nbMaxLinksClient",
    alternateMatches: ["clientLink"],
    fieldType: {
      type: "input",
    },
    example: "2",
    validations: [
      {
        rule: "required",
        errorMessage: "Team is required",
      },
    ],
  },  {
    label: "Mention sponso",
    key: "sponso",
    alternateMatches: ["qsd"],
    fieldType: {
      type: "select",
      options: [
        { label: "Obligatoire", value: "MANDATORY" },
        { label: "Non obligatoire", value: "NON_MANDATORY" },
        { label: "Les deux", value: "BOTH" },
      ],
    },
    example: "Obligatoire",
    validations: [
      {
        rule: "required",
        errorMessage: "Team is required",
      },
    ],
  },  {
    label: "Catalogue privé",
    key: "privateCatalog",
    alternateMatches: ["do follow"],
    fieldType: {
      type: "select",
      options: [
        { label: "Oui", value: "true" },
        { label: "Non", value: "false" },
      ],
    },
    example: "oui",
    validations: [
      {
        rule: "required",
        errorMessage: "Team is required",
      },
    ],
  },


] as const

const mockComponentBehaviourForTypes = <T extends string>(props: RsiProps<T>) => props

export const mockRsiValues = mockComponentBehaviourForTypes({
  ...defaultRSIProps,
  organizations: [{ name: "Zaacom", id: "71d2ccbb-7706-45c9-97c1-bbb2fa4130ce" }, { name: "Addictus", id: "2" }],
  fields: fields,
  onSubmit: (data) => {
    console.log(data.all.map((value) => value))
  },
  isOpen: true,
  isNavigationEnabled:true,
  autoMapDistance: 2,
  savedMapping:{
    sponso: {
      "non obligatoire": "NON_MANDATORY",
    },
    themes: {
      "health": "Santé",
      "Stando": "Santé",
    }
  },
  getProfiles: async (orgaId) => {
    return axios.get(`http://localhost:8091/import/profile/${orgaId}`)
  },
  saveProfiles: async (orgaId, profiles) => {
    return axios.post(`http://localhost:8091/import/profile/${orgaId}`, profiles)
  },

  getSavedMapping: async () => {
    return axios.get(`http://localhost:8091/import/savedMapping`)
  },

  saveMapping: async (field: string,key: string, value: string) => {
    axios.post(`http://localhost:8091/import/savedMapping`, {field:field,key:key,value:value})

  },
  getSavedAlternateFields: async  () => {
    return axios.get(`http://localhost:8091/savedAlternateFields`)
  },
  saveSavedAlternateFields:async (field: string, value: string) => {
    return axios.post(`http://localhost:8091/savedAlternateFields`, {field:field,value:value})
  },
  onClose: () => {},
  // uploadStepHook: async (data) => {
  //   await new Promise((resolve) => {
  //     setTimeout(() => resolve(data), 4000)
  //   })
  //   return data
  // },
  // selectHeaderStepHook: async (hData, data) => {
  //   await new Promise((resolve) => {
  //     setTimeout(
  //       () =>
  //         resolve({
  //           headerValues: hData,
  //           data,
  //         }),
  //       4000,
  //     )
  //   })
  //   return {
  //     headerValues: hData,
  //     data,
  //   }
  // },
  // // Runs after column matching and on entry change, more performant
  // matchColumnsStepHook: async (data) => {
  //   await new Promise((resolve) => {
  //     setTimeout(() => resolve(data), 4000)
  //   })
  //   return data
  // },
})

export const editableTableInitialData = [
  {
    name: "Hello",
    surname: "Hello",
    age: "123123",
    team: "one",
    is_manager: true,
  },
  {
    name: "Hello",
    surname: "Hello",
    age: "12312zsas3",
    team: "two",
    is_manager: true,
  },
  {
    name: "Whooaasdasdawdawdawdiouasdiuasdisdhasd",
    surname: "Hello",
    age: "123123",
    team: undefined,
    is_manager: false,
  },
  {
    name: "Goodbye",
    surname: "Goodbye",
    age: "111",
    team: "two",
    is_manager: true,
  },
]

export const headerSelectionTableFields = [
  ["text", "num", "select", "bool"],
  ["second", "123", "one", "true"],
  ["third", "123", "one", "true"],
  ["fourth", "123", "one", "true"],
]

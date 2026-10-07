export type Photograph = {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: string;
  category: "mensen" | "natuur" | "details";
  temporary: boolean;
  position: string;
};

// Add the supplied original photograph at public/images/sanne-portret.jpg.
// Until it exists, the site shows an honest empty image frame.
const portrait: Photograph = {
  id: "sanne-portret",
  src: "/images/sanne-portret.jpg",
  alt: "Zwart-witportret van Sanne Roeland met haar camera",
  width: 1200,
  height: 1600,
  caption: "Sanne, achter de camera",
  category: "mensen",
  temporary: false,
  position: "50% 50%",
};

export const content = {
  ui: {
    heroPrimary: "Bekijk mijn werk",
    heroSecondary: "Kennismaken",
    portraitCaption: "De persoon achter de camera",
    scroll: "Een beetje verder kijken",
    workLabel: "01 — Een selectie",
    aboutLabel: "02 — Aangenaam",
    shootLabel: "Samen iets maken",
    shootButton: "Laten we het bespreken",
    aboutButton: "Kennismaken?",
    contactLabel: "03 — Zeg eens hallo",
    contactButton: "Stuur me een bericht",
  },
  name: "Sanne Roeland",
  label: "Sanne Roeland · Fotografie",
  heroTitle: "Hi, ik ben Sanne.",
  intro:
    "De persoon achter de camera. " +
    "Ik fotografeer mensen en de dingen die me opvallen.",
  workTitle: "Door mijn lens",
  workIntro: "Mensen, kleine details en alles wat even mijn aandacht vangt.",
  temporaryNote:
    "Binnenkort meer werk. Voor nu zie je hier hetzelfde portret van Sanne.",
  aboutTitle: "De persoon achter de camera",
  about:
    "Ik ben Sanne. Ik fotografeer vooral mensen, " +
    "maar richt mijn camera ook graag op natuur en kleine details. " +
    "Op deze plek deel ik een selectie van wat ik maak. " +
    "Lijkt het je leuk om samen iets vast te leggen? " +
    "Stuur me gerust een bericht.",
  shootTitle: "Wat wil jij vastleggen?",
  shoot:
    "Een idee, groot of klein? Vertel me wat je in gedachten hebt. " +
    "Dan kijken we samen wat we kunnen maken.",
  contactTitle: "Een idee voor een shoot?",
  contactIntro:
    "Ik hoor graag van je. Stuur me een bericht op Instagram, " +
    "dan praten we verder.",
  contact: {
    instagram: "https://www.instagram.com/sanneroeland._/",
    handle: "@sanneroeland._",
    email: "",
  },
  navigation: [
    { href: "#werk", label: "Werk" },
    { href: "#over", label: "Over Sanne" },
    { href: "#contact", label: "Contact" },
  ],
  portrait,
  aboutImage: { ...portrait, id: "over-sanne", temporary: true },
  portfolio: [
    {
      ...portrait,
      id: "werk-01",
      temporary: true,
      caption: "Sanne — het portret",
    },
    {
      ...portrait,
      id: "werk-02",
      temporary: true,
      caption: "Sanne — een andere uitsnede",
      position: "50% 35%",
    },
    {
      ...portrait,
      id: "werk-03",
      temporary: true,
      caption: "Sanne — achter de camera",
      position: "50% 60%",
    },
  ] satisfies Photograph[],
};

export type CharacterAccent = "rose" | "coral" | "apricot" | "leaf";

export type CharacterSheet = {
  key: string;
  number: string;
  name: string;
  subtitle: string;
  story: string;
  mission: string;
  power: string;
  weakness: string;
  type: string;
  quote: string;
  accent: CharacterAccent;
  mark: string;
  corner: "heart" | "hand" | "shield";
};

const accents: CharacterAccent[] = ["rose", "coral", "apricot", "leaf"];

const names = [
  "Lunín", "Solín", "Nubín", "Brisín", "Gotín", "Hilín", "Trazín", "Manchín",
  "Colorín", "Ritín", "Notín", "Melín", "Dulín", "Chisín", "Corín", "Alín",
  "Besín", "Danzín", "Estelín", "Florín", "Grinín", "Hondín", "Irisín", "Kairín",
  "Luzín", "Marín", "Naranín", "Olasín", "Pincelín", "Querín", "Rayín", "Sonín",
  "Uvinín", "Verdinín", "Xilín", "Yelín", "Zafín", "Bolín", "Pecín", "Sabrín",
  "Ternín", "Vivín", "Polín", "Farín", "Gajín", "Jolín", "Lemín", "Mirín",
  "Pazín", "Rondín", "Susín", "Tornín", "Wawín", "Yumín", "Zorín", "Burbín",
  "Crispín", "Drilín", "Ecoín", "Frutín", "Glisín", "Hojín", "Ilín", "Jubín",
  "Kiwín", "Lirín", "Mielín", "Nievín", "Ojín", "Perlín", "Quisín", "Rizín",
  "Sillín", "Tulín", "Umbín", "Vientín", "Xocín", "Yuyín", "Zumbín", "Alelín",
  "Bramín", "Cielín", "Durín", "Esquín", "Fosín", "Gomín", "Hiloín", "Imánín",
  "Jazín", "Kumín", "Lagrín", "Mapín", "Nidín", "Orlín", "Pumín", "Quinín",
  "Rocín", "Semín", "Tizín", "Volín", "Xilofín", "Yoyín", "Zurín", "Anclín",
  "Broteín", "Cajín", "Dibujín", "Espín", "Fiestín", "Globín", "Inklín", "Jirín",
  "Koalín", "Moteín", "Nudín", "Ondín", "Pintín", "Quitín", "Ruedín", "Sopín",
  "Zepín", "Abrilín", "Bolsín", "Cantín", "Dulcín", "Frescín", "Guín", "Iglín",
  "Kafín", "Lentín", "Manín", "Naranjín", "Orejín", "Patín", "Quesín", "Ritmín",
  "Saltarín", "Tambín", "Unicín", "Violetín", "Wokín", "Yerbín", "Zapatín", "Amorín",
  "Banderín", "Cucharín", "Dientín", "Estrellín", "Fogonín", "Gatín", "Jugoín",
  "Kiteín", "Lápizín", "Mochilín", "Nubeín", "Ojotín", "Panín", "Quimín", "Ramoín",
  "Sombrín", "Tazaín", "Uvaín", "Viajín", "Xadín", "Yemaín", "Aventín", "Brillín",
  "Cuentín", "Fabulín", "Giroín", "Ideaín", "Jugín", "Kioslín", "Librín", "Mundoín",
  "Paseín", "Quietín", "Risaín", "Sueñín", "Tintaín", "Abrazín", "Canciónín",
  "Despín", "Espejín", "Felicín", "Gomítín", "Hondelín", "Ilusín", "Juguetín",
  "Noticín", "Músicín", "Nadín", "Otoñín", "Papelín", "Queridín", "Regalín",
  "Bancín", "Trazosín", "Últimín", "Ventanín", "Yaín", "Zapín",
];

const marks = ["♥", "✚", "✋", "🛡"];

const subtitles = [
  "El que siempre está para ayudar",
  "El semáforo de tu cuerpo",
  "El que recuerda la fuerza de adentro",
  "El guardián de las defensas",
  "La luz que no se apura",
  "El trazo que se quiere ir de paseo",
  "Quien acompaña sin pedir permiso",
  "El que escucha antes de hablar",
];

const stories = [
  (name: string) =>
    `${name} nunca pasa de largo cuando alguien necesita una mano. Cree que un gesto chiquito puede cambiar el día de una persona. Saluda, acompaña y contagia ganas con una sonrisa enorme.`,
  (name: string) =>
    `${name} nació para recordar que cada persona lleva adentro una fuerza enorme. Siempre sonríe y reparte coraje, porque cree que el amor propio, el cuidado y la esperanza pueden cambiar cualquier día. Su misión es acompañar, proteger y regalar una sonrisa a quien lo necesite.`,
  (name: string) =>
    `${name} vive cuidando las puertas del cuerpo. Trabaja de día y de noche, y aunque a veces parece serio, su misión es mantenernos fuertes y saludables.`,
  (name: string) =>
    `${name} nació del deseo de escuchar al cuerpo. Es un semáforo chiquito: ayuda a detenerse, respirar y saber cómo nos sentimos. Con la mano en alto dice basta cuando algo no está bien.`,
  (name: string) =>
    `${name} salió del cuaderno de Ariana con el pulso intacto. No copia a nadie. Ahora puede irse de paseo en una bolsa y quedarse al lado, sin apuro y sin ruido.`,
  (name: string) =>
    `${name} cree que el color también abraza. Donde hay un trazo suyo, hay un rincón más calmo. Acompaña, protege y regala una sonrisa a quien lo necesite.`,
  (name: string) =>
    `${name} no pide protagonismo. Se sienta al borde de la hoja y espera. Si lo elegís, se viene con vos y deja el cuaderno un rato, feliz de servir para algo de todos los días.`,
  (name: string) =>
    `${name} nació de un día de música y lápices. Tiene ritmo hasta en las orejas. Cuando el mundo apura, marca un tiempo más amable y te guiña un ojo.`,
];

const missions = [
  "Ayudar sin esperar nada a cambio.",
  "Acompañar, proteger y regalar sonrisas.",
  "Proteger al organismo de los invasores.",
  "Ayudar a escuchar el cuerpo y decidir mejor.",
  "Irse de paseo y hacer compañía.",
  "Recordar que el cuidado también es valentía.",
  "Dejar una luz chiquita donde hace falta.",
  "Hacer que el día pese un poco menos.",
];

const powers = [
  "La empatía y la solidaridad.",
  "Amor propio, cuidado y esperanza.",
  "Detectar y atrapar a los gérmenes.",
  "Detenerse a tiempo para cuidarte.",
  "Su manera de mirar.",
  "Contagiar calma.",
  "El color que no se copia.",
  "Escuchar sin interrumpir.",
];

const weaknesses = [
  "Se pone triste cuando las personas son indiferentes.",
  "Que se olviden de cuidarse.",
  "Se debilita cuando no descansamos o no nos cuidamos.",
  "A veces lo ignoran cuando hay prisa.",
  "Quedarse para siempre en el cuaderno.",
  "El apuro de los demás.",
  "Que lo dejen de mirar.",
  "Las hojas en blanco demasiado tiempo.",
];

const types = [
  "Guardián de los buenos gestos y la amistad.",
  "Guardián del bienestar.",
  "Guardián de la salud y las defensas.",
  "Guardián del equilibrio y la atención plena.",
  "Guardián de Ariana.",
  "Guardián del color.",
  "Guardián de la compañía.",
  "Guardián de los días comunes.",
];

const quotes = [
  "Una mano tendida vale más que mil palabras.",
  "Donde hay amor y cuidado, siempre florece la vida.",
  "Las mejores defensas empiezan con buenos hábitos.",
  "Escuchar tu cuerpo es el primer paso para cuidarte.",
  "Me voy de paseo con vos.",
  "Un trazo también puede abrazar.",
  "Hoy el día puede ser más liviano.",
  "Si me llevás, yo te acompaño.",
];

const named: Partial<Record<string, Partial<CharacterSheet>>> = {};

export function drawingNumber(key: string) {
  const match = key.match(/(\d+)$/);
  return match ? Number(match[1]) : 0;
}

function pick<T>(list: T[], n: number, salt = 0) {
  return list[(n + salt) % list.length];
}

export function characterSheet(key: string): CharacterSheet {
  const n = drawingNumber(key);
  const extra = named[key] ?? {};
  const accent = extra.accent ?? accents[(n + 3) % accents.length];
  const name = extra.name ?? names[n % names.length];

  return {
    key,
    number: n >= 100 ? String(n).padStart(3, "0") : String(n).padStart(2, "0"),
    name,
    subtitle: extra.subtitle ?? pick(subtitles, n),
    story: extra.story ?? pick(stories, n)(name),
    mission: extra.mission ?? pick(missions, n, 1),
    power: extra.power ?? pick(powers, n, 2),
    weakness: extra.weakness ?? pick(weaknesses, n, 3),
    type: extra.type ?? pick(types, n, 4),
    quote: extra.quote ?? pick(quotes, n, 5),
    accent,
    mark: extra.mark ?? pick(marks, n),
    corner: extra.corner ?? cornerFromType(extra.type ?? pick(types, n, 4)),
  };
}

function cornerFromType(type: string): CharacterSheet["corner"] {
  const t = type.toLowerCase();
  if (t.includes("gesto") || t.includes("amistad") || t.includes("mano")) return "hand";
  if (t.includes("defensa") || t.includes("salud")) return "shield";
  return "heart";
}

// Archivo de mensajes personalizados para el Tamagotchi de Rachel

// Mensajes aleatorios que mostrará el conejo
const randomMessages = [
    "¡Qué te gustaaa ehh!!",
    "Mi mujer, mi esposa, MI WIFE",
    "¡Que lokita nooo??",
    "¿Nos hacemos un té lésbico?",
    "¡Mi Queen!",
    "¡Putada mano!",
    "El otro día fui a Intro, que locura, ¡el mejor día de mi vida!",
    "¿Nos hacemos un tattoo?, soy adicta a la tinta",
    "¿No te apetece querer rebobinar el ahora?",
    "¡No me molestes! Estoy en un master con el director de arte de DELLAFUENTE",
    "¡Lo que te quiero yo GORDAAAA!",
    "¿Publicidad? ¡YO SOY DIRECTORA CREATIVA!",
    "Eres mi persona favorita 💙"
];

// Mensajes cuando alimentas al conejo
const feedMessages = [
    "¡Qué rica zanahoria, ojala pudieras tener la mia!",
    "¿Lo has cocinado tu? Porque está INCREIBLE",
    "¡Gracias por alimentarme, MI MUJER, ESPOSA, MI WIFE!",
    "¡Chin Chan Chun, que ricooo!"
];

// Mensajes cuando juegas con el conejo
const playMessages = [
    "¿Nos echamos un Mario kart?",
    "¡VINITO, CARTAS Y TÚ!",
    "¡La próxima vez jugamos al Kamasutra!"
];

// Mensajes cuando el conejo duerme
const sleepMessages = [
    "Zzz... soñando con mi DRAGÓN ROJO...",
    "Zzz... dormimos juntitos, abrazaditos...",
    "Zzz... en mi propia casa JUAN PABLO LORENZO..."
];

// Mensajes cuando el conejo está triste
const sadMessages = [
    "ya no me quieres petarda...",
    "Quiero mimitoos...",
    "¿Dónde está mi princesa de Chichinabo?",
    "¡Necesito cariñitos y besitos!"
];

// Mensajes para fechas especiales
const anniversaryMessages = {
    // 18 de julio - Cumpleaños
    "7-18": {
        title: "¡FELIZ CUMPLEAÑOS MI NIÑA!",
        message: "¡Feliz cumple mi Love! Te quiero mucho, eres muy importante para mi, me haces muy feliz."
    }
};
 // 18 de noviembre - Aniversario de pareja
    "11-18": {
        title: "¡FELIZ ANIVERSARIO, MI WIFE!",
        message: "Hoy es nuestro día especial, cada día a tu lado es un regalo. Te quiero más que ayer y menos que mañana. ¡Feliz aniversario mi amor!"
    }
};
// Mensajes para botón especial
const specialMessages = [
    "TE QUIERO MUCHO ERES LA MEJOR GORDA",
    "Cada día te quiero más, MI MUJER, MI ESPOSA MI WIFE",
    "Tu creatividad me inspira siempre",
    "Eres la mujer más EMPOWERGIRL del mundo",
    "¿HACEMOS UN HIJO?"
];
// Resultados del mini-juego
const gameResultMessages = {
    win: [
        "¡Como me ganes otra vez pido el divorcio",
        "Tu sabes MUCHOOO, Para ya nooo?.",
        "¡Eres una abusadora, reggaetonera hasta la tumba"
    ],
    lose: [
        "NO te piqueees ehh",
        "Que otra partida a ver si me ganas jejeje",
        "Gané yo, ahora dame un besito"
    ],
    tie: [
        "¡Empate! Somos UNO",
        "Empate... Esto es el destino, HACEMOS UN HIJO?",
        "Lesbian Connection Active"
    ]
};

// Función para obtener un mensaje aleatorio de un array
function getRandomMessage(messageArray) {
    const randomIndex = Math.floor(Math.random() * messageArray.length);
    return messageArray[randomIndex];
}

// Verificar si hoy es una fecha especial
function checkSpecialDate() {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const dateKey = `${month}-${day}`;
    
    return anniversaryMessages[dateKey];
}

// Verificar si el año está en el rango designado (2025-2050)
function isSpecialYear() {
    const currentYear = new Date().getFullYear();
    return currentYear >= 2025 && currentYear <= 2050;
}

// Hacer que estas funciones y variables sean globalmente accesibles
window.getRandomMessage = getRandomMessage;
window.checkSpecialDate = checkSpecialDate;
window.isSpecialYear = isSpecialYear;
window.randomMessages = randomMessages;
window.feedMessages = feedMessages;
window.playMessages = playMessages;
window.sleepMessages = sleepMessages;
window.sadMessages = sadMessages;
window.specialMessages = specialMessages;
window.anniversaryMessages = anniversaryMessages;
window.gameResultMessages = gameResultMessages;

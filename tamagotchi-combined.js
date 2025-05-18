// tamagotchi-combined.js - Versión simplificada y arreglada
console.log("Cargando tamagotchi-combined.js...");

// Configuración de parámetros del juego
const CONFIG = {
    decreaseInterval: 15000, // 15 segundos
    decreaseAmount: 5,
    initialHunger: 80,
    initialHappiness: 80,
    initialEnergy: 80,
    sadThreshold: 30,
    criticalThreshold: 15,
    animationDuration: 2000,
    autoSaveInterval: 60000
};

// Estados disponibles del conejo
const PET_STATES = {
    NORMAL: 'normal',
    EATING: 'eating',
    PLAYING: 'playing',
    SLEEPING: 'sleeping',
    SAD: 'sad'
};

// Estado del juego - Debe estar definido ANTES de las funciones
let gameState = {
    name: "Rachel Bunny",
    hunger: CONFIG.initialHunger,
    happiness: CONFIG.initialHappiness,
    energy: CONFIG.initialEnergy,
    lastUpdate: Date.now(),
    state: PET_STATES.NORMAL,
    isSleeping: false,
    isPlaying: false,
    isEating: false
};

// Temporizadores activos
let timers = {
    decrease: null,
    autoSave: null,
    action: null,
    message: null,
    randomMessage: null,
    surprise: null
};

// Referencias a elementos del DOM
const elements = {
    hungerBar: null,
    happinessBar: null,
    energyBar: null,
    petSprite: null,
    messageBubble: null,
    feedButton: null,
    playButton: null,
    sleepButton: null,
    specialButton: null,
    dateCheck: null,
    anniversaryMessage: null,
    closeAnniversary: null,
    experienceText: null
};

// Sistema de experiencia y recompensas
const REWARDS_SYSTEM = {
    experience: 0,
    level: 1,
    unlockedImages: [],
    availableImages: [
        {id: "image1", name: "Primer recuerdo", exp: 50, url: "memory1.jpg"},
        {id: "image2", name: "Viaje romántico", exp: 100, url: "memory2.jpg"},
        {id: "image3", name: "Foto favorita", exp: 200, url: "memory3.jpg"},
        {id: "image4", name: "Momento especial", exp: 300, url: "memory4.jpg"},
        {id: "image5", name: "Lo mejor", exp: 500, url: "memory5.jpg"}
    ]
};

// Mensajes del juego
const randomMessages = [
    "¡Qué te gustaaa ehh!!",
    "Mi mujer, mi esposa, MI WIFE",
    "¡Que lokita nooo??",
    "¿Nos hacemos un té lésbico?",
    "¡Mi Queen!",
    "¡Putada mano!",
    "¿Nos hacemos un tattoo?, soy adicta a la tinta",
    "¿No te apetece querer rebobinar el ahora?",
    "¡Lo que te quiero yo GORDAAAA!",
    "¿Publicidad? ¡YO SOY DIRECTORA CREATIVA!",
    "Eres mi persona favorita 💙"
];

const feedMessages = [
    "¡Qué rica zanahoria, ojala pudieras tener la mia!",
    "¿Lo has cocinado tu? Porque está INCREIBLE",
    "¡Gracias por alimentarme, MI MUJER, ESPOSA, MI WIFE!",
    "¡Chin Chan Chun, que ricooo!"
];

const playMessages = [
    "¿Nos echamos un Mario kart?",
    "¡VINITO, CARTAS Y TÚ!",
    "¡La próxima vez jugamos al Kamasutra!"
];

const sleepMessages = [
    "Zzz... soñando con mi DRAGÓN ROJO...",
    "Zzz... dormimos juntitos, abrazaditos...",
    "Zzz... en mi propia casa JUAN PABLO LORENZO..."
];

const sadMessages = [
    "ya no me quieres petarda...",
    "Quiero mimitoos...",
    "¿Dónde está mi princesa de Chichinabo?",
    "¡Necesito cariñitos y besitos!"
];

const specialMessages = [
    "TE QUIERO MUCHO ERES LA MEJOR GORDA",
    "Cada día te quiero más, MI MUJER, MI ESPOSA MI WIFE",
    "Tu creatividad me inspira siempre",
    "Eres la mujer más EMPOWERGIRL del mundo",
    "¿HACEMOS UN HIJO?"
];

const anniversaryMessages = {
    "7-18": {
        title: "¡FELIZ CUMPLEAÑOS MI NIÑA!",
        message: "¡Feliz cumple mi Love! Te quiero mucho, eres muy importante para mi, me haces muy feliz."
    },
    "11-18": {
        title: "¡FELIZ ANIVERSARIO, MI WIFE!",
        message: "Hoy es nuestro día especial, cada día a tu lado es un regalo. Te quiero más que ayer y menos que mañana. ¡Feliz aniversario mi amor!"
    }
};

// Función para obtener un mensaje aleatorio de forma segura
function getRandomMessage(messageArray) {
    if (!messageArray || !Array.isArray(messageArray) || messageArray.length === 0) {
        console.error("getRandomMessage: Array no válido");
        return "¡Hola!";
    }
    const randomIndex = Math.floor(Math.random() * messageArray.length);
    return messageArray[randomIndex];
}

// Cambiar el sprite según el estado
function changeSprite(state) {
    console.log("changeSprite: Cambiando a", state);
    
    const petSprite = document.getElementById('pet-sprite');
    if (!petSprite) {
        console.error("No se encontró el sprite");
        return;
    }
    
    // Quitar animaciones y clases actuales
    petSprite.style.animation = 'none';
    petSprite.classList.remove('normal', 'eating', 'playing', 'sleeping', 'sad');
    
    // Aplicar nueva animación según estado
    switch (state) {
        case PET_STATES.NORMAL:
            petSprite.style.animation = 'idle 2s infinite ease-in-out';
            petSprite.classList.add('normal');
            break;
        case PET_STATES.EATING:
            petSprite.style.animation = 'eating 0.5s infinite ease-in-out';
            petSprite.classList.add('eating');
            break;
        case PET_STATES.PLAYING:
            petSprite.style.animation = 'playing 0.8s infinite ease-in-out';
            petSprite.classList.add('playing');
            break;
        case PET_STATES.SLEEPING:
            petSprite.style.animation = 'sleeping 2s infinite ease-in-out';
            petSprite.classList.add('sleeping');
            petSprite.style.filter = 'brightness(0.8)';
            break;
        case PET_STATES.SAD:
            petSprite.style.animation = 'sad 3s infinite ease-in-out';
            petSprite.classList.add('sad');
            petSprite.style.filter = 'grayscale(0.3)';
            break;
        default:
            petSprite.style.animation = 'idle 2s infinite ease-in-out';
            petSprite.classList.add('normal');
    }
    
    // Restablecer filtros si no está durmiendo o triste
    if (state !== PET_STATES.SLEEPING && state !== PET_STATES.SAD) {
        petSprite.style.filter = 'none';
    }
}

// Inicializar las animaciones
function initSprites() {
    console.log("Inicializando sprites");
    
    // Configurar animaciones
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes idle {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
        }
        @keyframes eating {
            0%, 100% { transform: scaleX(1); }
            25% { transform: scaleX(1.1) scaleY(0.9); }
            50% { transform: scaleX(1); }
            75% { transform: scaleX(1.1) scaleY(0.9); }
        }
        @keyframes playing {
            0%, 100% { transform: rotate(-5deg); }
            25% { transform: rotate(5deg); }
            50% { transform: rotate(-5deg); }
            75% { transform: rotate(5deg); }
        }
        @keyframes sleeping {
            0%, 100% { transform: scaleY(1); }
            50% { transform: scaleY(0.95); }
        }
        @keyframes sad {
            0%, 100% { transform: rotate(0); }
            25% { transform: rotate(-2deg); }
            75% { transform: rotate(2deg); }
        }
    `;
    document.head.appendChild(styleSheet);
    
    // Aplicar estado inicial
    changeSprite(PET_STATES.NORMAL);
}

// Función para mostrar un mensaje
function showMessage(message, duration = 3000) {
    if (!elements.messageBubble) {
        console.error("Burbuja de mensaje no disponible");
        return;
    }
    
    elements.messageBubble.textContent = message;
    elements.messageBubble.classList.remove('hidden');
    
    // Limpiar temporizador anterior
    clearTimeout(timers.message);
    
    // Configurar temporizador para ocultar
    timers.message = setTimeout(() => {
        elements.messageBubble.classList.add('hidden');
    }, duration);
}

// Actualizar barras de estado
function updateStatusBars() {
    console.log("Actualizando barras - hambre:", gameState.hunger, "felicidad:", gameState.happiness, "energía:", gameState.energy);
    
    if (!elements.hungerBar || !elements.happinessBar || !elements.energyBar) {
        console.error("Elementos de barra no disponibles");
        return;
    }
    
    elements.hungerBar.style.width = `${gameState.hunger}%`;
    elements.happinessBar.style.width = `${gameState.happiness}%`;
    elements.energyBar.style.width = `${gameState.energy}%`;
    
    // Actualizar display de experiencia
    if (elements.experienceText) {
        elements.experienceText.textContent = `Nivel: ${REWARDS_SYSTEM.level}`;
    }
    
    checkStatus();
}

// Verificar estado general
function checkStatus() {
    // Si cualquiera de los valores está por debajo del umbral de tristeza
    if (gameState.hunger <= CONFIG.sadThreshold || 
        gameState.happiness <= CONFIG.sadThreshold || 
        gameState.energy <= CONFIG.sadThreshold) {
        
        // Si no estamos en medio de una acción, mostrar tristeza
        if (!gameState.isEating && !gameState.isPlaying && !gameState.isSleeping) {
            changeSprite(PET_STATES.SAD);
            gameState.state = PET_STATES.SAD;
            
            // Si está muy triste, mostrar un mensaje
            if (Math.random() < 0.3) { // 30% de probabilidad
                showMessage(getRandomMessage(sadMessages));
            }
        }
    } else if (gameState.state === PET_STATES.SAD && !gameState.isEating && 
              !gameState.isPlaying && !gameState.isSleeping) {
        // Si ya no está triste, volver al estado normal
        changeSprite(PET_STATES.NORMAL);
        gameState.state = PET_STATES.NORMAL;
    }
}

// Alimentar al conejo
function feedPet() {
    console.log("Alimentando al conejo");
    
    // No permitir alimentar si ya está comiendo
    if (gameState.isEating) return;
    
    // No permitir alimentar si está durmiendo
    if (gameState.isSleeping) {
        showMessage("Zzz... Estoy durmiendo Gorda, después te como...");
        return;
    }
    
    gameState.isEating = true;
    
    // Cambiar sprite y mostrar mensaje
    changeSprite(PET_STATES.EATING);
    showMessage(getRandomMessage(feedMessages));
    
    // Aumentar hambre
    gameState.hunger = Math.min(100, gameState.hunger + 20);
    
    // Aumentar felicidad un poco
    gameState.happiness = Math.min(100, gameState.happiness + 5);
    
    // Actualizar barras
    updateStatusBars();
    
    // Volver al estado normal después de la animación
    clearTimeout(timers.action);
    timers.action = setTimeout(() => {
        gameState.isEating = false;
        if (gameState.hunger <= CONFIG.sadThreshold || 
            gameState.happiness <= CONFIG.sadThreshold || 
            gameState.energy <= CONFIG.sadThreshold) {
            changeSprite(PET_STATES.SAD);
            gameState.state = PET_STATES.SAD;
        } else {
            changeSprite(PET_STATES.NORMAL);
            gameState.state = PET_STATES.NORMAL;
        }
    }, CONFIG.animationDuration);
    
    // Guardar el estado
    saveGameState();
}

// Jugar con el conejo
function playWithPet() {
    console.log("Jugando con el conejo");
    
    // No permitir jugar si ya está jugando
    if (gameState.isPlaying) return;
    
    // No permitir jugar si está durmiendo
    if (gameState.isSleeping) {
        showMessage("Zzz... Estoy soñando contigo, luego hablamos...");
        return;
    }
    
    // No permitir jugar si tiene poca energía
    if (gameState.energy <= CONFIG.criticalThreshold) {
        showMessage("ESTOY LOW BATTERY, ¿NOS VAMOS DE AVENTURA?...");
        return;
    }
    
    gameState.isPlaying = true;
    
    // Cambiar sprite y mostrar mensaje
    changeSprite(PET_STATES.PLAYING);
    showMessage(getRandomMessage(playMessages));
    
    // Aumentar felicidad
    gameState.happiness = Math.min(100, gameState.happiness + 20);
    
    // Disminuir energía
    gameState.energy = Math.max(0, gameState.energy - 10);
    
    // Disminuir hambre un poco (esfuerzo)
    gameState.hunger = Math.max(0, gameState.hunger - 5);
    
    // Actualizar barras
    updateStatusBars();
    
    // Volver al estado normal después de la animación
    clearTimeout(timers.action);
    timers.action = setTimeout(() => {
        gameState.isPlaying = false;
        if (gameState.hunger <= CONFIG.sadThreshold || 
            gameState.happiness <= CONFIG.sadThreshold || 
            gameState.energy <= CONFIG.sadThreshold) {
            changeSprite(PET_STATES.SAD);
            gameState.state = PET_STATES.SAD;
        } else {
            changeSprite(PET_STATES.NORMAL);
            gameState.state = PET_STATES.NORMAL;
        }
    }, CONFIG.animationDuration);
    
    // Añadir algo de experiencia
    addExperience(5);
    
    // Guardar el estado
    saveGameState();
}

// Hacer dormir/despertar al conejo
function toggleSleep() {
    console.log("Durmiendo/despertando conejo");
    
    if (gameState.isSleeping) {
        // Despertar
        gameState.isSleeping = false;
        
        // Cambiar sprite según el estado general
        if (gameState.hunger <= CONFIG.sadThreshold || 
            gameState.happiness <= CONFIG.sadThreshold || 
            gameState.energy <= CONFIG.sadThreshold) {
            changeSprite(PET_STATES.SAD);
            gameState.state = PET_STATES.SAD;
        } else {
            changeSprite(PET_STATES.NORMAL);
            gameState.state = PET_STATES.NORMAL;
        }
        
        // Cambiar texto del botón
        if (elements.sleepButton && elements.sleepButton.querySelector('.btn-text')) {
            elements.sleepButton.querySelector('.btn-text').textContent = 'Dormir abrazaditos';
        }
        
        if (elements.sleepButton && elements.sleepButton.querySelector('.btn-icon')) {
            elements.sleepButton.querySelector('.btn-icon').textContent = '💤';
        }
        
        showMessage("¡Buenos diotaaas! Que no es lo mismo que Buenos Idiotaaas");
    } else {
        // Dormir
        gameState.isSleeping = true;
        
        // Cambiar sprite
        changeSprite(PET_STATES.SLEEPING);
        gameState.state = PET_STATES.SLEEPING;
        
        // Cambiar texto del botón
        if (elements.sleepButton && elements.sleepButton.querySelector('.btn-text')) {
            elements.sleepButton.querySelector('.btn-text').textContent = 'Despertar con besitos';
        }
        
        if (elements.sleepButton && elements.sleepButton.querySelector('.btn-icon')) {
            elements.sleepButton.querySelector('.btn-icon').textContent = '🌞';
        }
        
        showMessage(getRandomMessage(sleepMessages));
        
        // Aumentar energía al dormir
        gameState.energy = Math.min(100, gameState.energy + 20);
        updateStatusBars();
    }
    
    // Guardar el estado
    saveGameState();
}

// Mostrar mensaje especial
function showSpecialMessage() {
    console.log("Mostrando mensaje especial");
    showMessage(getRandomMessage(specialMessages), 4000);
}

// Disminuir valores con el tiempo
function decreaseValues() {
    // Disminuir hambre
    gameState.hunger = Math.max(0, gameState.hunger - CONFIG.decreaseAmount);
    
    // Disminuir felicidad, pero menos si está durmiendo
    if (gameState.isSleeping) {
        gameState.happiness = Math.max(0, gameState.happiness - (CONFIG.decreaseAmount / 2));
    } else {
        gameState.happiness = Math.max(0, gameState.happiness - CONFIG.decreaseAmount);
    }
    
    // Disminuir energía, pero aumenta si está durmiendo
    if (gameState.isSleeping) {
        gameState.energy = Math.min(100, gameState.energy + CONFIG.decreaseAmount);
    } else {
        gameState.energy = Math.max(0, gameState.energy - CONFIG.decreaseAmount);
    }
    
    // Actualizar la interfaz
    updateStatusBars();
    
    // Guardar el estado
    saveGameState();
}

// Verificar si hay fechas especiales
function checkSpecialDate() {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const dateKey = `${month}-${day}`;
    
    return anniversaryMessages[dateKey];
}

// Verificar si el año está en el rango designado
function isSpecialYear() {
    const currentYear = new Date().getFullYear();
    return currentYear >= 2023 && currentYear <= 2050;
}

// Verificar si hay fechas especiales
function checkForSpecialDates() {
    const specialDate = checkSpecialDate();
    
    if (specialDate && isSpecialYear()) {
        showMessage(`¡${specialDate.title}! ${specialDate.message}`, 5000);
    }
}

// Añadir experiencia y verificar desbloqueos
function addExperience(amount) {
    REWARDS_SYSTEM.experience += amount;
    
    // Calcular nivel basado en experiencia
    const newLevel = Math.floor(REWARDS_SYSTEM.experience / 100) + 1;
    
    // Si subió de nivel
    if (newLevel > REWARDS_SYSTEM.level) {
        REWARDS_SYSTEM.level = newLevel;
        showMessage(`¡Has subido a nivel ${newLevel}! ¡Sigue así!`, 4000);
    }
    
    // Actualizar display de experiencia
    if (elements.experienceText) {
        elements.experienceText.textContent = `Nivel: ${REWARDS_SYSTEM.level}`;
    }
    
    // Guardar el estado de experiencia y desbloqueos
    localStorage.setItem('rachelTamagotchiRewards', JSON.stringify(REWARDS_SYSTEM));
}

// Guardar el estado del juego
function saveGameState() {
    const stateToSave = {
        ...gameState,
        lastUpdate: Date.now()
    };
    
    localStorage.setItem('rachelTamagotchiState', JSON.stringify(stateToSave));
}

// Cargar el estado guardado
function loadGameState() {
    // Cargar estado normal del juego
    const savedState = localStorage.getItem('rachelTamagotchiState');
    
    if (savedState) {
        try {
            const parsedState = JSON.parse(savedState);
            
            // Actualizar estado con valores guardados
            gameState = {
                ...parsedState,
                lastUpdate: Date.now()
            };
            
            // Asegurarse de que el estado visual sea correcto
            if (gameState.isSleeping) {
                changeSprite(PET_STATES.SLEEPING);
                if (elements.sleepButton) {
                    const textSpan = elements.sleepButton.querySelector('.btn-text');
                    if (textSpan) textSpan.textContent = 'Despertar con besitos';
                    
                    const iconSpan = elements.sleepButton.querySelector('.btn-icon');
                    if (iconSpan) iconSpan.textContent = '🌞';
                }
            } else if (gameState.hunger <= CONFIG.sadThreshold || 
                    gameState.happiness <= CONFIG.sadThreshold || 
                    gameState.energy <= CONFIG.sadThreshold) {
                changeSprite(PET_STATES.SAD);
            } else {
                changeSprite(PET_STATES.NORMAL);
            }
        } catch (e) {
            console.error("Error al cargar estado:", e);
        }
    }
    
    // Cargar estado de recompensas
    const savedRewards = localStorage.getItem('rachelTamagotchiRewards');
    if (savedRewards) {
        try {
            const parsedRewards = JSON.parse(savedRewards);
            REWARDS_SYSTEM.experience = parsedRewards.experience || 0;
            REWARDS_SYSTEM.level = parsedRewards.level || 1;
            REWARDS_SYSTEM.unlockedImages = parsedRewards.unlockedImages || [];
        } catch (e) {
            console.error("Error al cargar recompensas:", e);
        }
    }
}

// Iniciar temporizadores
function startTimers() {
    // Temporizador para disminuir valores
    timers.decrease = setInterval(decreaseValues, CONFIG.decreaseInterval);
    
    // Temporizador para guardar automáticamente
    timers.autoSave = setInterval(saveGameState, CONFIG.autoSaveInterval);
    
    // Temporizador para mensajes aleatorios
    timers.randomMessage = setInterval(() => {
        if (Math.random() < 0.3) { // 30% de probabilidad
            showRandomMessage();
        }
    }, 45000); // Cada 45 segundos
}

// Mostrar un mensaje aleatorio
function showRandomMessage() {
    // Solo mostrar si no está ocupado en otra actividad
    if (!gameState.isEating && !gameState.isPlaying && !elements.messageBubble.textContent) {
        let message = getRandomMessage(randomMessages);
        showMessage(message);
    }
}

// Inicializar el juego
function initGame() {
    console.log("Inicializando el juego");
    
    // Inicializar sprites
    initSprites();
    
    // Obtener referencias a elementos del DOM
    elements.hungerBar = document.getElementById('hunger-bar');
    elements.happinessBar = document.getElementById('happiness-bar');
    elements.energyBar = document.getElementById('energy-bar');
    elements.petSprite = document.getElementById('pet-sprite');
    elements.messageBubble = document.getElementById('message-bubble');
    elements.feedButton = document.getElementById('feed-btn');
    elements.playButton = document.getElementById('play-btn');
    elements.sleepButton = document.getElementById('sleep-btn');
    elements.specialButton = document.getElementById('special-btn');
    elements.experienceText = document.getElementById('experience-text');
    
    console.log("Elementos cargados:", elements);
    
    // Cargar el estado guardado si existe
    loadGameState();
    
    // Iniciar temporizadores
    startTimers();
    
    // Actualizar barras de estado
    updateStatusBars();
    
    // Verificar si hay fechas especiales
    checkForSpecialDates();
    
    // Mostrar un mensaje aleatorio al inicio
    setTimeout(() => {
        showRandomMessage();
    }, 2000);
    
    console.log("Juego inicializado!");
}

// Inicializar el juego cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM cargado, inicializando...");
    
    // Esperar un poco para asegurarse de que todo se ha cargado
    setTimeout(initGame, 500);
});

// Exponer funciones públicas para que sean accesibles desde HTML
window.feedPet = feedPet;
window.playWithPet = playWithPet;
window.toggleSleep = toggleSleep;
window.showSpecialMessage = showSpecialMessage;

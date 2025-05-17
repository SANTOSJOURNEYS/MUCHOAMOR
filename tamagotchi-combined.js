// tamagotchi-combined.js - Combinación de todos los archivos para evitar problemas de orden de carga
console.log("Cargando tamagotchi-combined.js...");

// Configuración de parámetros del juego
const CONFIG = {
    // Velocidad de disminución de los valores (en milisegundos)
    decreaseInterval: 15000, // 15 segundos
    // Velocidad de disminución (de 0 a 100)
    decreaseAmount: 5,
    // Valores iniciales (de 0 a 100)
    initialHunger: 80,
    initialHappiness: 80,
    initialEnergy: 80,
    // Umbrales
    sadThreshold: 30, // por debajo de este valor el conejo estará triste
    criticalThreshold: 15, // por debajo de este valor es crítico
    // Duración de las animaciones (en milisegundos)
    animationDuration: 2000,
    // Guardado automático (en milisegundos)
    autoSaveInterval: 60000, // cada minuto
};

// Estados disponibles del conejo
const PET_STATES = {
    NORMAL: 'normal',
    EATING: 'eating',
    PLAYING: 'playing',
    SLEEPING: 'sleeping',
    SAD: 'sad'
};

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
    },
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

// Estado del juego
let gameState = {
    name: "Rachel Bunny",
    hunger: CONFIG.initialHunger,
    happiness: CONFIG.initialHappiness,
    energy: CONFIG.initialEnergy,
    lastUpdate: Date.now(),
    state: PET_STATES.NORMAL,
    // Indicadores de estado
    isSleeping: false,
    isPlaying: false,
    isEating: false,
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
};

// Sistema de experiencia y recompensas
const REWARDS_SYSTEM = {
    experience: 0,
    level: 1,
    unlockedImages: [],
    // Imágenes que se pueden desbloquear
    availableImages: [
        {
            id: "image1",
            name: "Primer recuerdo juntos",
            exp: 50,
            url: "memory1.jpg" 
        },
        {
            id: "image2",
            name: "Viaje romántico",
            exp: 100,
            url: "memory2.jpg"
        },
        {
            id: "image3",
            name: "Foto favorita de Rachel",
            exp: 200,
            url: "memory3.jpg"
        },
        {
            id: "image4",
            name: "Nuestro momento especial",
            exp: 300,
            url: "memory4.jpg"
        },
        {
            id: "image5",
            name: "¡Lo mejor está por venir!",
            exp: 500,
            url: "memory5.jpg"
        }
    ]
};

// Función para obtener un mensaje aleatorio de forma segura
function safeGetRandomMessage(messageArray) {
    if (!messageArray || !Array.isArray(messageArray) || messageArray.length === 0) {
        console.error("safeGetRandomMessage: Array de mensajes no válido", messageArray);
        return "¡Hola!";
    }
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

// Cambiar el sprite según el estado
function changeSprite(state) {
    console.log("changeSprite: Cambiando sprite a estado:", state);
    
    const petSprite = document.getElementById('pet-sprite');
    if (!petSprite) {
        console.error("changeSprite: Error - Elemento del sprite no encontrado");
        return;
    }
    
    // Quitar animaciones y clases actuales
    petSprite.style.animation = 'none';
    petSprite.classList.remove('normal', 'eating', 'playing', 'sleeping', 'sad');
    
    // Aplicar nueva animación y clase según estado
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
// Inicializar los sprites
function initSprites() {
    console.log("initSprites: Inicializando sprites");
    
    // Asegurarse de que el elemento del sprite existe
    const petSprite = document.getElementById('pet-sprite');
    if (!petSprite) {
        console.error("initSprites: Error - Elemento del sprite no encontrado");
        return;
    }
    
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
    
    // Configurar estado inicial
    changeSprite(PET_STATES.NORMAL);
}

// Función para mostrar un mensaje en la burbuja
function showMessage(message, duration = 3000) {
    if (!elements.messageBubble) {
        console.error("showMessage: Error - Burbuja de mensaje no disponible");
        return;
    }
    
    elements.messageBubble.textContent = message;
    elements.messageBubble.classList.remove('hidden');
    
    // Limpiar temporizador anterior si existe
    clearTimeout(timers.message);
    
    // Configurar temporizador para ocultar el mensaje
    timers.message = setTimeout(() => {
        elements.messageBubble.classList.add('hidden');
    }, duration);
}

// Función para mostrar un mensaje aleatorio
function showRandomMessage() {
    // Solo mostrar si no está ocupado en otra actividad
    if (!gameState.isEating && !gameState.isPlaying && !elements.messageBubble.textContent) {
        showMessage(safeGetRandomMessage(randomMessages));
    }
}

// Función para verificar el estado general del conejo
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
                showMessage(safeGetRandomMessage(sadMessages));
            }
        }
    } else if (gameState.state === PET_STATES.SAD && !gameState.isEating && 
              !gameState.isPlaying && !gameState.isSleeping) {
        // Si ya no está triste, volver al estado normal
        changeSprite(PET_STATES.NORMAL);
        gameState.state = PET_STATES.NORMAL;
    }
}

// Función para actualizar las barras de estado
function updateStatusBars() {
    if (!elements.hungerBar || !elements.happinessBar || !elements.energyBar) {
        console.error("updateStatusBars: Error - Elementos de barra no disponibles");
        return;
    }
    
    elements.hungerBar.style.width = `${gameState.hunger}%`;
    elements.happinessBar.style.width = `${gameState.happiness}%`;
    elements.energyBar.style.width = `${gameState.energy}%`;
    
    checkStatus();
}

// Función para alimentar al conejo
function feedPet() {
    console.log("feedPet: Función llamada");
    
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
    showMessage(safeGetRandomMessage(feedMessages));
    
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
// Función para jugar con el conejo
function playWithPet() {
    console.log("playWithPet: Función llamada");
    
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
    showMessage(safeGetRandomMessage(playMessages));
    
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
    
    // Guardar el estado
    saveGameState();
}
// Función para hacer dormir/despertar al conejo
function toggleSleep() {
    console.log("toggleSleep: Función llamada");
    
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
        
        showMessage(safeGetRandomMessage(sleepMessages));
    }
    
    // Guardar el estado
    saveGameState();
}

// Función para mostrar mensaje especial
function showSpecialMessage() {
    console.log("showSpecialMessage: Función llamada");
    console.log("showSpecialMessage: Seleccionando mensaje especial aleatorio");
    
    let message = safeGetRandomMessage(specialMessages);
    showMessage(message, 4000);
}

// Función para disminuir los valores con el tiempo
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
// Función para verificar si hay fechas especiales
function checkForSpecialDates() {
    const specialDate = checkSpecialDate();
    
    if (specialDate && isSpecialYear()) {
        showMessage(`¡${specialDate.title}! ${specialDate.message}`, 5000);
    }
}

// Función para guardar el estado del juego
function saveGameState() {
    const stateToSave = {
        ...gameState,
        lastUpdate: Date.now()
    };
    
    localStorage.setItem('rachelTamagotchiState', JSON.stringify(stateToSave));
}

// Función para cargar el estado guardado
function loadGameState() {
    // Cargar estado normal del juego
    const savedState = localStorage.getItem('rachelTamagotchiState');
    
    if (savedState) {
        try {
            const parsedState = JSON.parse(savedState);
            
            // Calcular tiempo transcurrido desde la última actualización
            const currentTime = Date.now();
            const timeDiff = currentTime - parsedState.lastUpdate;
            
            // Actualizar estado con valores guardados
            gameState = {
                ...parsedState,
                lastUpdate: currentTime
            };
            
            // Si pasó mucho tiempo (más de 8 horas), aplicar simulación del tiempo
            if (timeDiff > 8 * 60 * 60 * 1000) {
                simulateTimeElapsed(timeDiff);
            }
            
            // Asegurarse de que el estado visual sea correcto
            if (gameState.isSleeping) {
                changeSprite(PET_STATES.SLEEPING);
                gameState.state = PET_STATES.SLEEPING;
                if (elements.sleepButton && elements.sleepButton.querySelector('.btn-text')) {
                    elements.sleepButton.querySelector('.btn-text').textContent = 'Despertar con besitos';
                }
                if (elements.sleepButton && elements.sleepButton.querySelector('.btn-icon')) {
                    elements.sleepButton.querySelector('.btn-icon').textContent = '🌞';
                }
            } else if (gameState.hunger <= CONFIG.sadThreshold || 
                      gameState.happiness <= CONFIG.sadThreshold || 
                      gameState.energy <= CONFIG.sadThreshold) {
                changeSprite(PET_STATES.SAD);
                gameState.state = PET_STATES.SAD;
            } else {
                changeSprite(PET_STATES.NORMAL);
                gameState.state = PET_STATES.NORMAL;
            }
        } catch (e) {
            console.error("Error al cargar el estado guardado:", e);
            // Usar valores por defecto si hay un error
            gameState.hunger = CONFIG.initialHunger;
            gameState.happiness = CONFIG.initialHappiness;
            gameState.energy = CONFIG.initialEnergy;
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

// Función para simular tiempo transcurrido mientras estaba ausente
function simulateTimeElapsed(timeDiff) {
    // Número de decrementos que habrían ocurrido
    const decrements = Math.floor(timeDiff / CONFIG.decreaseInterval);
    
    // Aplicar decrementos, pero con un límite para que no sea demasiado cruel
    const maxDecreasePerStat = 50; // Máximo 50% de reducción mientras está ausente
    
    if (gameState.isSleeping) {
        // Si estaba durmiendo, disminuye la felicidad ligeramente y aumenta la energía
        gameState.happiness = Math.max(30, gameState.happiness - Math.min(maxDecreasePerStat, decrements * (CONFIG.decreaseAmount / 4)));
        gameState.energy = 100; // Recupera toda la energía
        gameState.hunger = Math.max(20, gameState.hunger - Math.min(maxDecreasePerStat, decrements * (CONFIG.decreaseAmount / 2)));
    } else {
        // Si no estaba durmiendo, disminuye todos los valores
        gameState.hunger = Math.max(20, gameState.hunger - Math.min(maxDecreasePerStat, decrements * CONFIG.decreaseAmount / 2));
        gameState.happiness = Math.max(20, gameState.happiness - Math.min(maxDecreasePerStat, decrements * CONFIG.decreaseAmount / 2));
        gameState.energy = Math.max(20, gameState.energy - Math.min(maxDecreasePerStat, decrements * CONFIG.decreaseAmount / 2));
    }
}

// Función para iniciar los temporizadores
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
    
    // Temporizador para eventos sorpresa
    timers.surprise = setInterval(() => {
        // 10% de probabilidad de evento sorpresa
        if (Math.random() < 0.1 && !gameState.isEating && !gameState.isPlaying && !gameState.isSleeping) {
            const surpriseEvents = [
                "¡Acabo de ver un unicornio azul! ¿Lo has visto?",
                "Creo que te estoy viendo dibujar... ¡Qué creatividad!",
                "¿Sabes que eres la mejor persona del mundo mundial?",
                "Si pudiera, te daría un besito en la nariz ahora mismo",
                "Algún día haremos un viaje juntas a Marte, ¿vale?",
                "Me gustas más tú que las zanahorias, y mira que me gustan",
                "¿Y esa carita de chichihabo tan mona, gorda?"
            ];
            showMessage(surpriseEvents[Math.floor(Math.random() * surpriseEvents.length)], 5000);
        }
    }, 60000); // Cada minuto hay una pequeña posibilidad
}
// Configurar controladores de eventos
function setupEventListeners() {
    // Verificar que todos los elementos existen antes de agregar event listeners
    if (elements.feedButton) {
        elements.feedButton.addEventListener('click', feedPet);
    }
    
    if (elements.playButton) {
        elements.playButton.addEventListener('click', playWithPet);
    }
    
    if (elements.sleepButton) {
        elements.sleepButton.addEventListener('click', toggleSleep);
    }
    
    if (elements.specialButton) {
        elements.specialButton.addEventListener('click', showSpecialMessage);
    }
    
    // Botón de cerrar mensaje de aniversario (solo si existe)
    if (elements.closeAnniversary) {
        elements.closeAnniversary.addEventListener('click', () => {
            if (elements.dateCheck) {
                elements.dateCheck.classList.add('hidden');
            }
        });
    }
}

// Función para inicializar el juego
function initGame() {
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
    elements.dateCheck = document.getElementById('date-check');
    elements.anniversaryMessage = document.getElementById('anniversary-message');
    elements.closeAnniversary = document.getElementById('close-anniversary');
    
    // Cargar el estado guardado si existe
    loadGameState();
    
    // Iniciar temporizadores
    startTimers();
    
    // Actualizar barras de estado
    updateStatusBars();
    
    // Configurar eventos de clic en botones
    setupEventListeners();
    
    // Verificar si hay fechas especiales
    checkForSpecialDates();
    
    // Mostrar un mensaje aleatorio al inicio
    showRandomMessage();
    
    // Asegurarse de que el modal de aniversario está cerrado
    if (elements.dateCheck) {
        elements.dateCheck.classList.add('hidden');
    }
}

// Inicializar el juego cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM cargado, inicializando Tamagotchi para Rachel...");
    
    // Inicializar el juego
    initGame();
    
    console.log("Tamagotchi inicializado con éxito");
});

// Exponer las funciones principales globalmente para que puedan usarse desde HTML
window.feedPet = feedPet;
window.playWithPet = playWithPet;
window.toggleSleep = toggleSleep;
window.showSpecialMessage = showSpecialMessage;

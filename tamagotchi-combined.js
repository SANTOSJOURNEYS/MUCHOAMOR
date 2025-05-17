// tamagotchi-combined.js - Combinación de todos los archivos para evitar problemas de orden de carga
console.log("Cargando tamagotchi-combined.js...");

// =========== SPRITES.JS ===========
// Estados disponibles del conejo
const PET_STATES = {
    NORMAL: 'normal',
    EATING: 'eating',
    PLAYING: 'playing',
    SLEEPING: 'sleeping',
    SAD: 'sad'
};

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
            console.log("changeSprite: Aplicando animación de estado normal");
            petSprite.style.animation = 'idle 2s infinite ease-in-out';
            petSprite.classList.add('normal');
            break;
        case PET_STATES.EATING:
            console.log("changeSprite: Aplicando animación de estado comiendo");
            petSprite.style.animation = 'eating 0.5s infinite ease-in-out';
            petSprite.classList.add('eating');
            break;
        case PET_STATES.PLAYING:
            console.log("changeSprite: Aplicando animación de estado jugando");
            petSprite.style.animation = 'playing 0.8s infinite ease-in-out';
            petSprite.classList.add('playing');
            break;
        case PET_STATES.SLEEPING:
            console.log("changeSprite: Aplicando animación de estado durmiendo");
            petSprite.style.animation = 'sleeping 2s infinite ease-in-out';
            petSprite.classList.add('sleeping');
            petSprite.style.filter = 'brightness(0.8)';
            break;
        case PET_STATES.SAD:
            console.log("changeSprite: Aplicando animación de estado triste");
            petSprite.style.animation = 'sad 3s infinite ease-in-out';
            petSprite.classList.add('sad');
            petSprite.style.filter = 'grayscale(0.3)';
            break;
        default:
            console.log("changeSprite: Estado desconocido, usando estado normal");
            petSprite.style.animation = 'idle 2s infinite ease-in-out';
            petSprite.classList.add('normal');
    }
    
    // Restablecer filtros si no está durmiendo o triste
    if (state !== PET_STATES.SLEEPING && state !== PET_STATES.SAD) {
        petSprite.style.filter = 'none';
    }
    
    console.log("changeSprite: Sprite actualizado correctamente");
}

// Inicializar los sprites según el estado
function initSprites() {
    console.log("initSprites: Inicializando sprites");
    
    // Asegurarse de que el elemento del sprite existe
    const petSprite = document.getElementById('pet-sprite');
    if (!petSprite) {
        console.error("initSprites: Error - Elemento del sprite no encontrado");
        return;
    }
    
    console.log("initSprites: Configurando animaciones");
    
    // Configurar animación para el estado normal
    const normalAnimation = `
        @keyframes idle {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
        }
    `;
    
    // Configurar animación para comer
    const eatingAnimation = `
        @keyframes eating {
            0%, 100% { transform: scaleX(1); }
            25% { transform: scaleX(1.1) scaleY(0.9); }
            50% { transform: scaleX(1); }
            75% { transform: scaleX(1.1) scaleY(0.9); }
        }
    `;
// Configurar animación para jugar
    const playingAnimation = `
        @keyframes playing {
            0%, 100% { transform: rotate(-5deg); }
            25% { transform: rotate(5deg); }
            50% { transform: rotate(-5deg); }
            75% { transform: rotate(5deg); }
        }
    `;
    
    // Configurar animación para dormir
    const sleepingAnimation = `
        @keyframes sleeping {
            0%, 100% { transform: scaleY(1); }
            50% { transform: scaleY(0.95); }
        }
    `;
    
    // Configurar animación para triste
    const sadAnimation = `
        @keyframes sad {
            0%, 100% { transform: rotate(0); }
            25% { transform: rotate(-2deg); }
            75% { transform: rotate(2deg); }
        }
    `;
    
    // Añadir todas las animaciones al CSS
    const styleSheet = document.createElement('style');
    styleSheet.textContent = normalAnimation + eatingAnimation + playingAnimation + sleepingAnimation + sadAnimation;
    document.head.appendChild(styleSheet);
    
    console.log("initSprites: Animaciones configuradas correctamente");
    
    // Configurar estado inicial
    console.log("initSprites: Configurando estado inicial a NORMAL");
    changeSprite(PET_STATES.NORMAL);
}

// =========== MESSAGES.JS ===========
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
    // Imágenes que se pueden desbloquear (añade tus propias imágenes a la carpeta)
    availableImages: [
        {
            id: "image1",
            name: "Primer recuerdo juntos",
            exp: 50,
            url: "memory1.jpg" // Añade esta imagen a la carpeta
        },
        {
            id: "image2",
            name: "Viaje romántico",
            exp: 100,
            url: "memory2.jpg" // Añade esta imagen a la carpeta
        },
        {
            id: "image3",
            name: "Foto favorita de Rachel",
            exp: 200,
            url: "memory3.jpg" // Añade esta imagen a la carpeta
        },
        {
            id: "image4",
            name: "Nuestro momento especial",
            exp: 300,
            url: "memory4.jpg" // Añade esta imagen a la carpeta
        },
        {
            id: "image5",
            name: "¡Lo mejor está por venir!",
            exp: 500,
            url: "memory5.jpg" // Añade esta imagen a la carpeta
        }
    ]
};

// Función para mostrar un mensaje en la burbuja
function showMessage(message, duration = 3000) {
    console.log("showMessage: Mostrando mensaje:", message);
    
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
        console.log("showMessage: Ocultando mensaje después de", duration, "ms");
        elements.messageBubble.classList.add('hidden');
    }, duration);
}

// Función para mostrar un mensaje aleatorio
function showRandomMessage() {
    // Solo mostrar si no está ocupado en otra actividad
    if (!gameState.isEating && !gameState.isPlaying && !elements.messageBubble.textContent) {
        // Usar safeGetRandomMessage en lugar de getRandomMessage
        let message = safeGetRandomMessage(randomMessages);
        showMessage(message);
    }
}

// Función para actualizar las barras de estado
function updateStatusBars() {
    console.log("updateStatusBars: Actualizando barras - hambre:", gameState.hunger, "felicidad:", gameState.happiness, "energía:", gameState.energy);
    
    if (!elements.hungerBar || !elements.happinessBar || !elements.energyBar) {
        console.error("updateStatusBars: Error - Elementos de barra no disponibles", {
            hungerBar: !!elements.hungerBar,
            happinessBar: !!elements.happinessBar,
            energyBar: !!elements.energyBar
        });
        return;
    }
    
    elements.hungerBar.style.width = `${gameState.hunger}%`;
    elements.happinessBar.style.width = `${gameState.happiness}%`;
    elements.energyBar.style.width = `${gameState.energy}%`;
    
    console.log("updateStatusBars: Barras actualizadas correctamente");
    
    // Verificar si debemos cambiar el estado del conejo basado en los niveles
    checkStatus();
}

// Función para verificar el estado general del conejo
function checkStatus() {
    console.log("checkStatus: Verificando estado general del conejo");
    
    // Si cualquiera de los valores está por debajo del umbral de tristeza
    if (gameState.hunger <= CONFIG.sadThreshold || 
        gameState.happiness <= CONFIG.sadThreshold || 
        gameState.energy <= CONFIG.sadThreshold) {
        
        console.log("checkStatus: Al menos un valor está por debajo del umbral de tristeza");
        
        // Si no estamos en medio de una acción, mostrar tristeza
        if (!gameState.isEating && !gameState.isPlaying && !gameState.isSleeping) {
            console.log("checkStatus: El conejo no está ocupado, cambiando a estado SAD");
            changeSprite(PET_STATES.SAD);
            gameState.state = PET_STATES.SAD;
            
            // Si está muy triste, mostrar un mensaje
            if (Math.random() < 0.3) { // 30% de probabilidad
                console.log("checkStatus: Mostrando mensaje de tristeza");
                // Usar safeGetRandomMessage en lugar de getRandomMessage
                let message = safeGetRandomMessage(sadMessages);
                showMessage(message);
            }
        }
    } else if (gameState.state === PET_STATES.SAD && !gameState.isEating && 
              !gameState.isPlaying && !gameState.isSleeping) {
        console.log("checkStatus: El conejo estaba triste pero ya no, cambiando a estado NORMAL");
        changeSprite(PET_STATES.NORMAL);
        gameState.state = PET_STATES.NORMAL;
    } else {
        console.log("checkStatus: No hay cambios necesarios en el estado");
    }
}
// Función para alimentar al conejo
function feedPet() {
    console.log("feedPet: Función llamada");
    
    // No permitir alimentar si ya está comiendo
    if (gameState.isEating) {
        console.log("feedPet: El conejo ya está comiendo, ignorando clic");
        return;
    }
    
    // No permitir alimentar si está durmiendo
    if (gameState.isSleeping) {
        console.log("feedPet: El conejo está durmiendo, mostrando mensaje");
        showMessage("Zzz... Estoy durmiendo Gorda, después te como...");
        return;
    }
    
    console.log("feedPet: Iniciando alimentación");
    gameState.isEating = true;
    
    // Cambiar sprite y mostrar mensaje
    console.log("feedPet: Cambiando sprite a EATING");
    changeSprite(PET_STATES.EATING);
    
    // Usar safeGetRandomMessage en lugar de getRandomMessage
    console.log("feedPet: Obteniendo mensaje aleatorio de alimentación");
    let message = safeGetRandomMessage(feedMessages);
    console.log("feedPet: Mensaje seleccionado:", message);
    showMessage(message);
    
    // Aumentar hambre
    console.log("feedPet: Valores antes - hambre:", gameState.hunger, "felicidad:", gameState.happiness);
    gameState.hunger = Math.min(100, gameState.hunger + 20);
    
    // Aumentar felicidad un poco
    gameState.happiness = Math.min(100, gameState.happiness + 5);
    console.log("feedPet: Valores después - hambre:", gameState.hunger, "felicidad:", gameState.happiness);
    
    // Actualizar barras
    console.log("feedPet: Actualizando barras de estado");
    updateStatusBars();
    
    // Volver al estado normal después de la animación
    console.log("feedPet: Configurando temporizador para volver al estado normal");
    clearTimeout(timers.action);
    timers.action = setTimeout(() => {
        console.log("feedPet: Temporizador activado, volviendo al estado normal");
        gameState.isEating = false;
        if (gameState.hunger <= CONFIG.sadThreshold || 
            gameState.happiness <= CONFIG.sadThreshold || 
            gameState.energy <= CONFIG.sadThreshold) {
            console.log("feedPet: Conejo sigue triste, cambiando a estado SAD");
            changeSprite(PET_STATES.SAD);
            gameState.state = PET_STATES.SAD;
        } else {
            console.log("feedPet: Conejo feliz, cambiando a estado NORMAL");
            changeSprite(PET_STATES.NORMAL);
            gameState.state = PET_STATES.NORMAL;
        }
    }, CONFIG.animationDuration);
    
    // Guardar el estado
    console.log("feedPet: Guardando estado del juego");
    saveGameState();
}

// Función para jugar con el conejo
function playWithPet() {
    console.log("playWithPet: Función llamada");
    
    // No permitir jugar si ya está jugando
    if (gameState.isPlaying) {
        console.log("playWithPet: Ya está jugando, ignorando clic");
        return;
    }
    
    // No permitir jugar si está durmiendo
    if (gameState.isSleeping) {
        console.log("playWithPet: Está durmiendo, mostrando mensaje");
        showMessage("Zzz... Estoy soñando contigo, lúego hablamoos...");
        return;
    }
    
    // No permitir jugar si tiene poca energía
    if (gameState.energy <= CONFIG.criticalThreshold) {
        console.log("playWithPet: Poca energía, mostrando mensaje");
        showMessage("ESTOY LOW BATTERY, ¿NOS ECHAMOS UNA SIESTA EN EL SOFA?...");
        return;
    }
    
    console.log("playWithPet: Iniciando juego");
    gameState.isPlaying = true;
    
    // Cambiar sprite a jugando mientras selecciona
    console.log("playWithPet: Cambiando sprite a PLAYING");
    changeSprite(PET_STATES.PLAYING);
    
    // Mostrar mensaje de juego
    let message = safeGetRandomMessage(playMessages);
    showMessage(message);
    
    // Aumentar felicidad
    gameState.happiness = Math.min(100, gameState.happiness + 20);
    
    // Disminuir energía
    gameState.energy = Math.max(0, gameState.energy - 10);
    
    // Actualizar barras
    updateStatusBars();
    
    // Volver al estado normal después de un tiempo
    console.log("playWithPet: Configurando temporizador para volver al estado normal");
    clearTimeout(timers.action);
    timers.action = setTimeout(() => {
        console.log("playWithPet: Temporizador activado, volviendo al estado normal");
        gameState.isPlaying = false;
        if (gameState.hunger <= CONFIG.sadThreshold || 
            gameState.happiness <= CONFIG.sadThreshold || 
            gameState.energy <= CONFIG.sadThreshold) {
            console.log("playWithPet: Conejo sigue triste, cambiando a estado SAD");
            changeSprite(PET_STATES.SAD);
            gameState.state = PET_STATES.SAD;
        } else {
            console.log("playWithPet: Conejo feliz, cambiando a estado NORMAL");
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
        console.log("toggleSleep: Despertando al conejo");
        // Despertar
        gameState.isSleeping = false;
        
        // Cambiar sprite según el estado general
        if (gameState.hunger <= CONFIG.sadThreshold || 
            gameState.happiness <= CONFIG.sadThreshold || 
            gameState.energy <= CONFIG.sadThreshold) {
            console.log("toggleSleep: Conejo despierto pero triste, cambiando a estado SAD");
            changeSprite(PET_STATES.SAD);
            gameState.state = PET_STATES.SAD;
        } else {
            console.log("toggleSleep: Conejo despierto y feliz, cambiando a estado NORMAL");
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
        
        console.log("toggleSleep: Mostrando mensaje de despertar");
        showMessage("¡Buenos diotaaas! Que no es lo mismo que Buenos Idiotaaas");
    } else {
        console.log("toggleSleep: Poniendo a dormir al conejo");
        // Dormir
        gameState.isSleeping = true;
        
        // Cambiar sprite
        console.log("toggleSleep: Cambiando sprite a SLEEPING");
        changeSprite(PET_STATES.SLEEPING);
        gameState.state = PET_STATES.SLEEPING;
        
        // Cambiar texto del botón
        if (elements.sleepButton && elements.sleepButton.querySelector('.btn-text')) {
            elements.sleepButton.querySelector('.btn-text').textContent = 'Despertar con besitos';
        }
        
        if (elements.sleepButton && elements.sleepButton.querySelector('.btn-icon')) {
            elements.sleepButton.querySelector('.btn-icon').textContent = '🌞';
        }
        
        console.log("toggleSleep: Seleccionando mensaje aleatorio para dormir");
        // Usar safeGetRandomMessage en lugar de getRandomMessage
        let message = safeGetRandomMessage(sleepMessages);
        showMessage(message);
    }
    
    // Guardar el estado
    console.log("toggleSleep: Guardando estado del juego");
    saveGameState();
}

// Función para mostrar mensaje especial
function showSpecialMessage() {
    console.log("showSpecialMessage: Función llamada");
    
    // Usar safeGetRandomMessage en lugar de getRandomMessage
    console.log("showSpecialMessage: Seleccionando mensaje especial aleatorio");
    let message = safeGetRandomMessage(specialMessages);
    console.log("showSpecialMessage: Mensaje seleccionado:", message);
    showMessage(message, 4000);
}

// Función para verificar si hay fechas especiales
function checkForSpecialDates() {
    const specialDate = checkSpecialDate();
    
    if (specialDate && isSpecialYear()) {
        // Asegurarnos de que el elemento existe
        if (elements.anniversaryMessage && elements.dateCheck) {
            elements.anniversaryMessage.innerHTML = `
                <h2>${specialDate.title}</h2>
                <p>${specialDate.message}</p>
            `;
            elements.dateCheck.classList.remove('hidden');
        } else {
            // Si no existe el elemento modal, mostrar un mensaje normal
            showMessage(`¡${specialDate.title}! ${specialDate.message}`, 5000);
        }
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

// Función para cargar el estado guardado
function loadGameState() {
    // Cargar estado normal del juego
    const savedState = localStorage.getItem('rachelTamagotchiState');
    
    if (savedState) {
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
    }
    
    // Cargar estado de recompensas
    const savedRewards = localStorage.getItem('rachelTamagotchiRewards');
    if (savedRewards) {
        const parsedRewards = JSON.parse(savedRewards);
        REWARDS_SYSTEM.experience = parsedRewards.experience || 0;
        REWARDS_SYSTEM.level = parsedRewards.level || 1;
        REWARDS_SYSTEM.unlockedImages = parsedRewards.unlockedImages || [];
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

// Inicializar el juego cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM cargado, inicializando Tamagotchi para Rachel...");
    
    // Inicializar el juego
    initGame();
    
    // Configurar controladores de eventos directamente en los botones como respaldo
    const feedBtn = document.getElementById('feed-btn');
    const playBtn = document.getElementById('play-btn');
    const sleepBtn = document.getElementById('sleep-btn');
    const specialBtn = document.getElementById('special-btn');
    
    if (feedBtn) {
        feedBtn.onclick = function() { 
            console.log("Botón alimentar clickeado (respaldo)");
            feedPet();
        };
    }
    
    if (playBtn) {
        playBtn.onclick = function() {
            console.log("Botón jugar clickeado (respaldo)");
            playWithPet();
        };
    }
    
    if (sleepBtn) {
        sleepBtn.onclick = function() {
            console.log("Botón dormir clickeado (respaldo)");
            toggleSleep();
        };
    }
    
    if (specialBtn) {
        specialBtn.onclick = function() {
            console.log("Botón mensaje especial clickeado (respaldo)");
            showSpecialMessage();
        };
    }
    
    console.log("Tamagotchi inicializado con éxito");
});

// Exponer las funciones principales globalmente para que puedan usarse desde HTML
window.feedPet = feedPet;
window.playWithPet = playWithPet;
window.toggleSleep = toggleSleep;
window.showSpecialMessage = showSpecialMessage;
window.getRandomMessage = getRandomMessage;
window.safeGetRandomMessage = safeGetRandomMessage;

// Archivo principal del juego Tamagotchi personalizado para Rachel

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
    randomMessage: null
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
    elements.dateCheck.classList.add('hidden');
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
}

// Función para configurar los event listeners
function setupEventListeners() {
    // Botón de alimentar
    elements.feedButton.addEventListener('click', feedPet);
    
    // Botón de jugar
    elements.playButton.addEventListener('click', playWithPet);
    
    // Botón de dormir/despertar
    elements.sleepButton.addEventListener('click', toggleSleep);
    
    // Botón de mensaje especial
    elements.specialButton.addEventListener('click', showSpecialMessage);
    
    // Botón de cerrar mensaje de aniversario
    elements.closeAnniversary.addEventListener('click', () => {
        elements.dateCheck.classList.add('hidden');
    });
}

// Función para actualizar las barras de estado
function updateStatusBars() {
    elements.hungerBar.style.width = `${gameState.hunger}%`;
    elements.happinessBar.style.width = `${gameState.happiness}%`;
    elements.energyBar.style.width = `${gameState.energy}%`;
    
    checkStatus();
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

// Función para alimentar al conejo
function feedPet() {
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

// Función para jugar con el conejo
function playWithPet() {
    // No permitir jugar si ya está jugando
    if (gameState.isPlaying) return;
    
    // No permitir jugar si está durmiendo
    if (gameState.isSleeping) {
        showMessage("Zzz... Estoy soñando contigo, lúego hablamoos...");
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
    
    // Guardar el estado
    saveGameState();
}

// Función para hacer dormir/despertar al conejo
function toggleSleep() {
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
        elements.sleepButton.querySelector('.btn-text').textContent = 'Dormir abrazaditos';
        elements.sleepButton.querySelector('.btn-icon').textContent = '💤';
        
        showMessage("¡Buenos diotaaas! Que no es lo mismo que Buenos Idiotaaas");
    } else {
        // Dormir
        gameState.isSleeping = true;
        
        // Cambiar sprite
        changeSprite(PET_STATES.SLEEPING);
        gameState.state = PET_STATES.SLEEPING;
        
        // Cambiar texto del botón
        elements.sleepButton.querySelector('.btn-text').textContent = 'Despertar con besitos';
        elements.sleepButton.querySelector('.btn-icon').textContent = '🌞';
        
        showMessage(getRandomMessage(sleepMessages));
    }
    
    // Guardar el estado
    saveGameState();
}

// Función para mostrar mensaje especial
function showSpecialMessage() {
    showMessage(getRandomMessage(specialMessages), 4000);
}

// Función para mostrar un mensaje en la burbuja
function showMessage(message, duration = 3000) {
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
        showMessage(getRandomMessage(randomMessages));
    }
}

// Función para verificar si hay fechas especiales
function checkForSpecialDates() {
    // Desactivar temporalmente esta función para evitar el bloqueo
    return;
    
    const specialDate = checkSpecialDate();
    
    if (specialDate && isSpecialYear()) {
        elements.anniversaryMessage.innerHTML = `
            <h2>${specialDate.title}</h2>
            <p>${specialDate.message}</p>
        `;
        elements.dateCheck.classList.remove('hidden');
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
            elements.sleepButton.querySelector('.btn-text').textContent = 'Despertar con besitos';
            elements.sleepButton.querySelector('.btn-icon').textContent = '🌞';
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

// Iniciar el juego cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', initGame);
}

// Iniciar el juego cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', initGame);

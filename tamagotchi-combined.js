// tamagotchi-combined.js - Versión super simplificada y concentrada en solucionar los problemas
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

// Estado del juego
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

// Temporizadores
let timers = {};

// Referencias a elementos del DOM
let hungerBar = null;
let happinessBar = null;
let energyBar = null;
let petSprite = null;
let messageBubble = null;

// Función para obtener un mensaje aleatorio
function getRandomMessage(messageArray) {
    if (!messageArray || messageArray.length === 0) {
        return "¡Hola!";
    }
    const randomIndex = Math.floor(Math.random() * messageArray.length);
    return messageArray[randomIndex];
}

// Función para mostrar un mensaje
function showMessage(message, duration = 3000) {
    if (!messageBubble) return;
    
    console.log("Mostrando mensaje:", message);
    
    messageBubble.textContent = message;
    messageBubble.classList.remove('hidden');
    
    // Limpiar temporizador anterior
    clearTimeout(timers.message);
    
    // Configurar temporizador para ocultar
    timers.message = setTimeout(() => {
        messageBubble.classList.add('hidden');
    }, duration);
}

// Actualizar barras de estado - FUNCIÓN CLAVE
function updateStatusBars() {
    console.log("Actualizando barras - hambre:", gameState.hunger, "felicidad:", gameState.happiness, "energía:", gameState.energy);
    
    if (!hungerBar || !happinessBar || !energyBar) {
        console.error("Error: barras no encontradas");
        return;
    }
    
    // Actualizar ancho de las barras según valores actuales
    hungerBar.style.width = `${gameState.hunger}%`;
    happinessBar.style.width = `${gameState.happiness}%`;
    energyBar.style.width = `${gameState.energy}%`;
    
    // Cambiar estado según niveles
    if (gameState.hunger <= CONFIG.sadThreshold || 
        gameState.happiness <= CONFIG.sadThreshold || 
        gameState.energy <= CONFIG.sadThreshold) {
        
        if (!gameState.isEating && !gameState.isPlaying && !gameState.isSleeping) {
            changeSprite(PET_STATES.SAD);
        }
    } else if (!gameState.isEating && !gameState.isPlaying && !gameState.isSleeping) {
        changeSprite(PET_STATES.NORMAL);
    }
}

// Cambiar el sprite según el estado
function changeSprite(state) {
    console.log("Cambiando sprite a:", state);
    
    if (!petSprite) {
        console.error("Error: sprite no encontrado");
        return;
    }
    
    // Quitar todos los estados actuales
    petSprite.classList.remove('normal', 'eating', 'playing', 'sleeping', 'sad');
    
    // Aplicar el nuevo estado
    petSprite.classList.add(state);
    
    // Guardar el estado
    gameState.state = state;
}

// Alimentar al conejo - FUNCIÓN CLAVE
function feedPet() {
    console.log("Alimentando al conejo");
    
    if (gameState.isEating) return;
    
    if (gameState.isSleeping) {
        showMessage("Zzz... Estoy durmiendo Gorda, después te como...");
        return;
    }
    
    // Marcar como comiendo
    gameState.isEating = true;
    
    // Mostrar animación de comiendo
    changeSprite(PET_STATES.EATING);
    
    // Mostrar mensaje
    showMessage(getRandomMessage(feedMessages));
    
    // IMPORTANTE: Aumentar nivel de hambre
    gameState.hunger = Math.min(100, gameState.hunger + 20);
    
    // Aumentar felicidad un poco
    gameState.happiness = Math.min(100, gameState.happiness + 5);
    
    // Actualizar barras inmediatamente
    updateStatusBars();
    
    // Volver al estado normal después
    clearTimeout(timers.eating);
    timers.eating = setTimeout(() => {
        gameState.isEating = false;
        
        // Volver al estado apropiado
        if (gameState.hunger <= CONFIG.sadThreshold || 
            gameState.happiness <= CONFIG.sadThreshold || 
            gameState.energy <= CONFIG.sadThreshold) {
            changeSprite(PET_STATES.SAD);
        } else {
            changeSprite(PET_STATES.NORMAL);
        }
    }, CONFIG.animationDuration);
    
    // Guardar el estado
    localStorage.setItem('rachelTamagotchiState', JSON.stringify(gameState));
}

// Jugar con el conejo - FUNCIÓN CLAVE
function playWithPet() {
    console.log("Jugando con el conejo");
    
    if (gameState.isPlaying) return;
    
    if (gameState.isSleeping) {
        showMessage("Zzz... Estoy soñando contigo, luego hablamos...");
        return;
    }
    
    if (gameState.energy <= CONFIG.criticalThreshold) {
        showMessage("ESTOY LOW BATTERY, ¿NOS VAMOS DE AVENTURA?...");
        return;
    }
    
    // Por ahora implementamos juego simple, sin menú
    gameState.isPlaying = true;
    
    // Cambiar sprite y mostrar mensaje
    changeSprite(PET_STATES.PLAYING);
    showMessage(getRandomMessage(playMessages));
    
    // IMPORTANTE: Aumentar felicidad
    gameState.happiness = Math.min(100, gameState.happiness + 20);
    
    // IMPORTANTE: Disminuir energía
    gameState.energy = Math.max(0, gameState.energy - 10);
    
    // IMPORTANTE: Disminuir hambre un poco (esfuerzo)
    gameState.hunger = Math.max(0, gameState.hunger - 5);
    
    // Actualizar barras inmediatamente
    updateStatusBars();
    
    // Volver al estado normal después
    clearTimeout(timers.playing);
    timers.playing = setTimeout(() => {
        gameState.isPlaying = false;
        
        // Volver al estado apropiado
        if (gameState.hunger <= CONFIG.sadThreshold || 
            gameState.happiness <= CONFIG.sadThreshold || 
            gameState.energy <= CONFIG.sadThreshold) {
            changeSprite(PET_STATES.SAD);
        } else {
            changeSprite(PET_STATES.NORMAL);
        }
    }, CONFIG.animationDuration);
    
    // Guardar el estado
    localStorage.setItem('rachelTamagotchiState', JSON.stringify(gameState));
}

// Hacer dormir/despertar al conejo - FUNCIÓN CLAVE
function toggleSleep() {
    console.log("Durmiendo/despertando conejo");
    
    const sleepButton = document.getElementById('sleep-btn');
    const btnText = sleepButton ? sleepButton.querySelector('.btn-text') : null;
    const btnIcon = sleepButton ? sleepButton.querySelector('.btn-icon') : null;
    
    if (gameState.isSleeping) {
        // Despertar
        gameState.isSleeping = false;
        
        // Cambiar sprite según estado general
        if (gameState.hunger <= CONFIG.sadThreshold || 
            gameState.happiness <= CONFIG.sadThreshold || 
            gameState.energy <= CONFIG.sadThreshold) {
            changeSprite(PET_STATES.SAD);
        } else {
            changeSprite(PET_STATES.NORMAL);
        }
        
        // Cambiar texto del botón
        if (btnText) btnText.textContent = 'Dormir abrazaditos';
        if (btnIcon) btnIcon.textContent = '💤';
        
        showMessage("¡Buenos diotaaas! Que no es lo mismo que Buenos Idiotaaas");
    } else {
        // Dormir
        gameState.isSleeping = true;
        
        // Cambiar sprite
        changeSprite(PET_STATES.SLEEPING);
        
        // Cambiar texto del botón
        if (btnText) btnText.textContent = 'Despertar con besitos';
        if (btnIcon) btnIcon.textContent = '🌞';
        
        showMessage(getRandomMessage(sleepMessages));
        
        // IMPORTANTE: Aumentar energía al dormir
        gameState.energy = Math.min(100, gameState.energy + 20);
    }
    
    // Actualizar barras inmediatamente
    updateStatusBars();
    
    // Guardar el estado
    localStorage.setItem('rachelTamagotchiState', JSON.stringify(gameState));
}

// Mostrar mensaje especial
function showSpecialMessage() {
    console.log("Mostrando mensaje especial");
    showMessage(getRandomMessage(specialMessages), 4000);
}

// Disminuir valores con el tiempo
function decreaseValues() {
    console.log("Disminuyendo valores con el tiempo");
    
    if (gameState.isSleeping) {
        // Si está durmiendo, recupera energía pero pierde hambre y un poco de felicidad
        gameState.energy = Math.min(100, gameState.energy + CONFIG.decreaseAmount);
        gameState.hunger = Math.max(0, gameState.hunger - CONFIG.decreaseAmount/2);
        gameState.happiness = Math.max(0, gameState.happiness - CONFIG.decreaseAmount/4);
    } else {
        // Si está despierto, pierde todo normalmente
        gameState.hunger = Math.max(0, gameState.hunger - CONFIG.decreaseAmount);
        gameState.happiness = Math.max(0, gameState.happiness - CONFIG.decreaseAmount);
        gameState.energy = Math.max(0, gameState.energy - CONFIG.decreaseAmount);
    }
    
    // Actualizar barras
    updateStatusBars();
    
    // Guardar estado
    localStorage.setItem('rachelTamagotchiState', JSON.stringify(gameState));
}

// Función para cargar estado guardado
function loadGameState() {
    const savedState = localStorage.getItem('rachelTamagotchiState');
    
    if (savedState) {
        try {
            // Cargar estado desde localStorage
            const parsedState = JSON.parse(savedState);
            
            // Usar valores guardados si existen, o los iniciales si no
            gameState.hunger = parsedState.hunger !== undefined ? parsedState.hunger : CONFIG.initialHunger;
            gameState.happiness = parsedState.happiness !== undefined ? parsedState.happiness : CONFIG.initialHappiness;
            gameState.energy = parsedState.energy !== undefined ? parsedState.energy : CONFIG.initialEnergy;
            gameState.isSleeping = parsedState.isSleeping !== undefined ? parsedState.isSleeping : false;
            gameState.state = parsedState.state || PET_STATES.NORMAL;
            
            console.log("Estado cargado:", gameState);
            
            // Actualizar UI según estado cargado
            if (gameState.isSleeping) {
                // Si estaba durmiendo, actualizar botón
                const sleepButton = document.getElementById('sleep-btn');
                
                if (sleepButton) {
                    const btnText = sleepButton.querySelector('.btn-text');
                    const btnIcon = sleepButton.querySelector('.btn-icon');
                    
                    if (btnText) btnText.textContent = 'Despertar con besitos';
                    if (btnIcon) btnIcon.textContent = '🌞';
                }
                
                // Mostrar sprite durmiendo
                changeSprite(PET_STATES.SLEEPING);
            } else {
                // Si no estaba durmiendo, mostrar estado según niveles
                if (gameState.hunger <= CONFIG.sadThreshold || 
                    gameState.happiness <= CONFIG.sadThreshold || 
                    gameState.energy <= CONFIG.sadThreshold) {
                    changeSprite(PET_STATES.SAD);
                } else {
                    changeSprite(PET_STATES.NORMAL);
                }
            }
        } catch (e) {
            console.error("Error cargando estado:", e);
            
            // En caso de error, usar valores iniciales
            gameState.hunger = CONFIG.initialHunger;
            gameState.happiness = CONFIG.initialHappiness;
            gameState.energy = CONFIG.initialEnergy;
            
            // Mostrar estado normal
            changeSprite(PET_STATES.NORMAL);
        }
    }
}

// Inicializar el juego
function initGame() {
    console.log("Inicializando tamagotchi...");
    
    // Obtener referencias a elementos DOM
    hungerBar = document.getElementById('hunger-bar');
    happinessBar = document.getElementById('happiness-bar');
    energyBar = document.getElementById('energy-bar');
    petSprite = document.getElementById('pet-sprite');
    messageBubble = document.getElementById('message-bubble');
    
    if (!hungerBar || !happinessBar || !energyBar || !petSprite || !messageBubble) {
        console.error("No se pudieron encontrar todos los elementos necesarios");
        return;
    }
    
    console.log("Elementos encontrados correctamente");
    
    // Configurar animaciones básicas si no existen
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes idle {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
        }
        .normal {
            animation: idle 2s infinite ease-in-out;
        }
        .eating {
            animation: idle 0.5s infinite ease-in-out;
            transform: scale(1.1);
        }
        .playing {
            animation: idle 0.8s infinite ease-in-out;
            transform: rotate(5deg);
        }
        .sleeping {
            filter: brightness(0.8);
        }
        .sad {
            filter: grayscale(0.3);
        }
    `;
    document.head.appendChild(styleSheet);
    
    // Cargar estado guardado
    loadGameState();
    
    // Actualizar barras de estado
    updateStatusBars();
    
    // Iniciar temporizador para disminuir valores
    setInterval(decreaseValues, CONFIG.decreaseInterval);
    
    // Iniciar temporizador para mensajes aleatorios
    setInterval(() => {
        if (Math.random() < 0.3 && 
            !gameState.isEating && 
            !gameState.isPlaying && 
            !messageBubble.textContent) {
            showMessage(getRandomMessage(randomMessages));
        }
    }, 45000);
    
    console.log("Tamagotchi inicializado correctamente");
}

// Inicializar el juego cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM cargado, inicializando el juego...");
    
    // Esperar un poco para asegurarse de que todo se ha cargado
    setTimeout(initGame, 500);
});

// Exponer funciones para que sean accesibles desde HTML
window.feedPet = feedPet;
window.playWithPet = playWithPet;
window.toggleSleep = toggleSleep;
window.showSpecialMessage = showSpecialMessage;

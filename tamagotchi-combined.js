// tamagotchi-fixed.js - Versión corregida con minijuegos y sistema de fotos
console.log("Cargando tamagotchi-fixed.js...");

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

// Sistema de experiencia y recompensas
const REWARDS_SYSTEM = {
    experience: 0,
    level: 1,
    unlockedImages: [],
    // Imágenes que se pueden desbloquear
    availableImages: [
        {id: "image1", name: "Primer recuerdo juntos", exp: 50, url: "memory1.jpg"},
        {id: "image2", name: "Viaje romántico", exp: 100, url: "memory2.jpg"},
        {id: "image3", name: "Foto favorita de Rachel", exp: 200, url: "memory3.jpg"},
        {id: "image4", name: "Momento especial", exp: 300, url: "memory4.jpg"},
        {id: "image5", name: "Lo mejor está por venir", exp: 500, url: "memory5.jpg"}
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

// Resultados del mini-juego
const gameResultMessages = {
    win: [
        "¡Ganaste! Eres mi campeona",
        "Wow, me has vencido, eres la mejor.",
        "¡Increíble! ¿Cómo lo has hecho?"
    ],
    lose: [
        "¡Ja! Te gané, pero te dejo revancha",
        "¡Perdiste! Aunque sigues siendo mi WIFE",
        "Gané yo, ahora dame un besito"
    ],
    tie: [
        "¡Empate! Nuestras mentes están conectadas",
        "Empate... Esto es el destino, somos una",
        "¡Nos leemos la mente! Empate"
    ]
};

// Mensajes para fechas especiales
const anniversaryMessages = {
    // 18 de julio - Cumpleaños
    "7-18": {
        title: "¡FELIZ CUMPLEAÑOS MI NIÑA!",
        message: "¡Feliz cumple mi Love! Te quiero mucho, eres muy importante para mi, me haces muy feliz."
    },
    // 18 de noviembre - Aniversario
    "11-18": {
        title: "¡FELIZ ANIVERSARIO, MI WIFE!",
        message: "Hoy es nuestro día especial, cada día a tu lado es un regalo. Te quiero más que ayer y menos que mañana. ¡Feliz aniversario mi amor!"
    }
};

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
let levelDisplay = null;

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
    if (!messageBubble) {
        messageBubble = document.getElementById('message-bubble');
        if (!messageBubble) {
            console.error("Error: message-bubble no encontrado");
            return;
        }
    }
    
    console.log("Mostrando mensaje:", message);
    
    messageBubble.textContent = message;
    messageBubble.classList.remove('hidden');
    
    // Limpiar temporizador anterior
    clearTimeout(timers.message);
    
    // Configurar temporizador para ocultar
    timers.message = setTimeout(() => {
        if (messageBubble) {
            messageBubble.classList.add('hidden');
        }
    }, duration);
}

// Función para cambiar el sprite según el estado
function changeSprite(state) {
    console.log("Cambiando sprite a:", state);
    
    if (!petSprite) {
        petSprite = document.getElementById('pet-sprite');
        if (!petSprite) {
            console.error("Error: sprite no encontrado");
            return;
        }
    }
    
    // Quitar todos los estados actuales
    petSprite.classList.remove('normal', 'eating', 'playing', 'sleeping', 'sad');
    
    // Aplicar el nuevo estado
    petSprite.classList.add(state);
    
    // Guardar el estado
    gameState.state = state;
}
// Actualizar barras de estado
function updateStatusBars() {
    console.log("Actualizando barras - hambre:", gameState.hunger, "felicidad:", gameState.happiness, "energía:", gameState.energy);
    
    if (!hungerBar || !happinessBar || !energyBar) {
        hungerBar = document.getElementById('hunger-bar');
        happinessBar = document.getElementById('happiness-bar');
        energyBar = document.getElementById('energy-bar');
        
        if (!hungerBar || !happinessBar || !energyBar) {
            console.error("Error: barras no encontradas");
            return;
        }
    }
    
    // Asegurar que los valores nunca sean negativos
    gameState.hunger = Math.max(0, gameState.hunger);
    gameState.happiness = Math.max(0, gameState.happiness);
    gameState.energy = Math.max(0, gameState.energy);
    
    // Si todos los valores están en 0, reiniciarlos a valores iniciales
    if (gameState.hunger <= 5 && gameState.happiness <= 5 && gameState.energy <= 5) {
        console.log("Valores críticos detectados, reiniciando a valores iniciales");
        gameState.hunger = CONFIG.initialHunger / 2;
        gameState.happiness = CONFIG.initialHappiness / 2;
        gameState.energy = CONFIG.initialEnergy / 2;
        
        showMessage("¡Oh no! Estaba muy mal... ¡Gracias por venir a rescatarme!", 5000);
    }
    
    // Actualizar ancho de las barras según valores actuales
    hungerBar.style.width = `${gameState.hunger}%`;
    happinessBar.style.width = `${gameState.happiness}%`;
    energyBar.style.width = `${gameState.energy}%`;
    
    // Actualizar display de nivel si existe
    if (!levelDisplay) {
        levelDisplay = document.getElementById('experience-text');
    }
    
    if (levelDisplay) {
        levelDisplay.textContent = `Nivel: ${REWARDS_SYSTEM.level}`;
    }
    
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

// Alimentar al conejo
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
    
    // Aumentar nivel de hambre
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
    saveGameState();
}

// Jugar con el conejo - AHORA MUESTRA EL MENÚ DE JUEGOS
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
    
    // Mostrar el menú de juegos
    showGameMenu();
}

// Mostrar menú de juegos
function showGameMenu() {
    console.log("Mostrando menú de juegos");
    
    // Crear el contenedor del menú
    const menuContainer = document.createElement('div');
    menuContainer.id = 'game-menu-container';
    menuContainer.style.position = 'fixed';
    menuContainer.style.top = '50%';
    menuContainer.style.left = '50%';
    menuContainer.style.transform = 'translate(-50%, -50%)';
    menuContainer.style.background = 'white';
    menuContainer.style.padding = '20px';
    menuContainer.style.borderRadius = '15px';
    menuContainer.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
    menuContainer.style.zIndex = '1000';
    menuContainer.style.textAlign = 'center';
    menuContainer.style.minWidth = '300px';
    
    // Crear contenido del menú
    let menuContent = `
        <h2 style="margin-bottom: 15px; color: #4682B4;">¿A qué quieres jugar?</h2>
        <p style="margin-bottom: 20px;">Elige un juego para divertirte conmigo:</p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
    `;
    
    // Opciones de juegos
    const games = [
        {id: 'rps', name: 'Piedra, Papel, Tijeras', icon: '✂️', color: '#FF9966'},
        {id: 'flappy', name: 'Flappy Rabbit', icon: '🐰', color: '#87CEEB'},
        {id: 'snake', name: 'Snake', icon: '🐍', color: '#4CAF50'},
        {id: 'album', name: 'Ver Álbum', icon: '📷', color: '#FF6B6B'}
    ];
    
    // Añadir cada juego al menú
    games.forEach(game => {
        menuContent += `
            <button id="game-${game.id}" style="
                padding: 15px 10px;
                background-color: ${game.color};
                border: none;
                border-radius: 10px;
                color: white;
                font-weight: bold;
                cursor: pointer;
                font-size: 16px;
                transition: transform 0.2s;
            ">
                ${game.icon} ${game.name}
            </button>
        `;
    });
    
    // Cerrar el grid y añadir botón de cancelar
    menuContent += `
        </div>
        <button id="cancel-game" style="
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #f44336;
            border: none;
            border-radius: 20px;
            color: white;
            cursor: pointer;
        ">Cancelar</button>
    `;
    
    // Establecer contenido y añadir al documento
    menuContainer.innerHTML = menuContent;
    document.body.appendChild(menuContainer);
    
    // Marcar que está jugando
    gameState.isPlaying = true;
    
    // Cambiar sprite
    changeSprite(PET_STATES.PLAYING);
    
    // Añadir event listeners
    document.getElementById('game-rps').addEventListener('click', () => {
        document.body.removeChild(menuContainer);
        playRockPaperScissors();
    });
    
    document.getElementById('game-flappy').addEventListener('click', () => {
        document.body.removeChild(menuContainer);
        playFlappyRabbit();
    });
    
    document.getElementById('game-snake').addEventListener('click', () => {
        document.body.removeChild(menuContainer);
        playSnakeGame();
    });
    
    document.getElementById('game-album').addEventListener('click', () => {
        document.body.removeChild(menuContainer);
        showPhotoAlbum();
    });
    
    document.getElementById('cancel-game').addEventListener('click', () => {
        document.body.removeChild(menuContainer);
        finishPlaying(false); // No dar recompensa si cancela
    });
    
    // Si no selecciona nada, cancelar después de 30 segundos
    timers.gameMenu = setTimeout(() => {
        if (document.body.contains(menuContainer)) {
            document.body.removeChild(menuContainer);
            finishPlaying(false);
        }
    }, 30000);
}

// Finalizar juego
function finishPlaying(withReward = true) {
    // Si se da recompensa
    if (withReward) {
        // Aumentar felicidad
        gameState.happiness = Math.min(100, gameState.happiness + 10);
        
        // Disminuir energía
        gameState.energy = Math.max(0, gameState.energy - 5);
        
        // Actualizar barras
        updateStatusBars();
    }
    
    // Ya no está jugando
    gameState.isPlaying = false;
    
    // Volver al estado normal
    if (gameState.hunger <= CONFIG.sadThreshold || 
        gameState.happiness <= CONFIG.sadThreshold || 
        gameState.energy <= CONFIG.sadThreshold) {
        changeSprite(PET_STATES.SAD);
    } else {
        changeSprite(PET_STATES.NORMAL);
    }
    
    // Guardar estado
    saveGameState();
}

// Hacer dormir/despertar al conejo
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
    saveGameState();
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
    saveGameState();
}

// Guardar el estado del juego
function saveGameState() {
    const stateToSave = {
        ...gameState,
        lastUpdate: Date.now()
    };
    
    localStorage.setItem('rachelTamagotchiState', JSON.stringify(stateToSave));
}

// Verificar fechas especiales
function checkSpecialDates() {
    const today = new Date();
    const month = today.getMonth() + 1; // Los meses en JS van de 0-11
    const day = today.getDate();
    
    const dateKey = `${month}-${day}`;
    
    if (anniversaryMessages[dateKey]) {
        // Mostrar mensaje de fecha especial
        showMessage(`¡${anniversaryMessages[dateKey].title}! ${anniversaryMessages[dateKey].message}`, 6000);
    }
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
            } else if (gameState.hunger <= CONFIG.sadThreshold || 
                      gameState.happiness <= CONFIG.sadThreshold || 
                      gameState.energy <= CONFIG.sadThreshold) {
                changeSprite(PET_STATES.SAD);
            } else {
                changeSprite(PET_STATES.NORMAL);
            }
            
            // Actualizar texto del botón de dormir
            const sleepButton = document.getElementById('sleep-btn');
            if (sleepButton) {
                const btnText = sleepButton.querySelector('.btn-text');
                const btnIcon = sleepButton.querySelector('.btn-icon');
                
                if (gameState.isSleeping) {
                    if (btnText) btnText.textContent = 'Despertar con besitos';
                    if (btnIcon) btnIcon.textContent = '🌞';
                } else {
                    if (btnText) btnText.textContent = 'Dormir abrazaditos';
                    if (btnIcon) btnIcon.textContent = '💤';
                }
            }
        } catch (e) {
            console.error("Error al cargar el estado guardado:", e);
            // Usar valores por defecto si hay un error
            resetGameState();
        }
    } else {
        // Si no hay estado guardado, usar valores iniciales
        resetGameState();
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

// Función para reiniciar el estado del juego
function resetGameState() {
    console.log("Reiniciando estado del juego a valores iniciales");
    
    gameState.hunger = CONFIG.initialHunger;
    gameState.happiness = CONFIG.initialHappiness;
    gameState.energy = CONFIG.initialEnergy;
    gameState.isSleeping = false;
    
    // Mostrar estado normal
    changeSprite(PET_STATES.NORMAL);
    
    // Actualizar barras
    updateStatusBars();
    
    // Mostrar mensaje de bienvenida
    showMessage("¡Hola! Soy Rachel Bunny, tu conejo virtual. ¡Cuídame bien!", 4000);
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

// Inicializar el juego
function initGame() {
    console.log("Inicializando el juego");
    
    // Obtener referencias a elementos del DOM
    hungerBar = document.getElementById('hunger-bar');
    happinessBar = document.getElementById('happiness-bar');
    energyBar = document.getElementById('energy-bar');
    petSprite = document.getElementById('pet-sprite');
    messageBubble = document.getElementById('message-bubble');
    levelDisplay = document.getElementById('experience-text');
    
    // Cargar estado guardado
    loadGameState();
    
    // Actualizar barras de estado
    updateStatusBars();
    
    // Iniciar temporizador para disminuir valores
    timers.decrease = setInterval(decreaseValues, CONFIG.decreaseInterval);
    
    // Iniciar temporizador para mensajes aleatorios
    timers.randomMessage = setInterval(() => {
        if (Math.random() < 0.3 && 
            !gameState.isEating && 
            !gameState.isPlaying && 
            !gameState.isSleeping &&
            !messageBubble.textContent) {
            showMessage(getRandomMessage(randomMessages));
        }
    }, 45000);
    
    // Verificar si hay fechas especiales
    checkSpecialDates();
    
    // Mostrar mensaje de bienvenida después de un momento
    setTimeout(() => {
        showMessage("¡Hola! Estoy muy feliz de verte de nuevo. ¡Juguemos juntas!", 4000);
    }, 1000);
    
    console.log("Tamagotchi inicializado correctamente");
    
    // Configurar event listeners
    setupEventListeners();
}

// Configurar los event listeners para los botones
function setupEventListeners() {
    const feedBtn = document.getElementById('feed-btn');
    const playBtn = document.getElementById('play-btn');
    const sleepBtn = document.getElementById('sleep-btn');
    const specialBtn = document.getElementById('special-btn');
    
    if (feedBtn) feedBtn.addEventListener('click', feedPet);
    if (playBtn) playBtn.addEventListener('click', playWithPet);
    if (sleepBtn) sleepBtn.addEventListener('click', toggleSleep);
    if (specialBtn) specialBtn.addEventListener('click', showSpecialMessage);
}

// Inicializar el juego cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM cargado, inicializando el juego...");
    
    // Esperar un poco para asegurarse de que todo se ha cargado
    setTimeout(initGame, 500);
});
// Juego de Piedra, Papel o Tijeras
function playRockPaperScissors() {
    console.log("Iniciando Piedra, Papel o Tijeras");
    
    // Crear contenedor del juego
    const gameContainer = document.createElement('div');
    gameContainer.id = 'rps-game-container';
    gameContainer.style.position = 'fixed';
    gameContainer.style.top = '50%';
    gameContainer.style.left = '50%';
    gameContainer.style.transform = 'translate(-50%, -50%)';
    gameContainer.style.background = 'white';
    gameContainer.style.padding = '20px';
    gameContainer.style.borderRadius = '15px';
    gameContainer.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
    gameContainer.style.zIndex = '1000';
    gameContainer.style.width = '90%';
    gameContainer.style.maxWidth = '400px';
    gameContainer.style.textAlign = 'center';
    
    // Crear HTML del juego
    let gameHTML = `
        <h2 style="color: #4682B4; margin-bottom: 10px;">Piedra, Papel o Tijeras</h2>
        <p id="rps-message" style="margin-bottom: 20px;">¡Elige tu jugada!</p>
        <div style="
            display: flex;
            justify-content: space-around;
            margin-bottom: 20px;
        ">
            <button class="rps-option" data-choice="piedra" style="
                padding: 15px;
                background-color: #87CEEB;
                border: none;
                border-radius: 50%;
                width: 70px;
                height: 70px;
                font-size: 30px;
                cursor: pointer;
            ">👊</button>
            <button class="rps-option" data-choice="papel" style="
                padding: 15px;
                background-color: #87CEEB;
                border: none;
                border-radius: 50%;
                width: 70px;
                height: 70px;
                font-size: 30px;
                cursor: pointer;
            ">✋</button>
            <button class="rps-option" data-choice="tijeras" style="
                padding: 15px;
                background-color: #87CEEB;
                border: none;
                border-radius: 50%;
                width: 70px;
                height: 70px;
                font-size: 30px;
                cursor: pointer;
            ">✌️</button>
        </div>
        <div id="rps-result" style="
            margin-top: 20px;
            display: none;
        ">
            <p id="rps-choices" style="font-size: 18px;"></p>
            <p id="rps-winner" style="font-size: 20px; font-weight: bold; margin: 10px 0;"></p>
            <p id="rps-score">Puntuación: 0</p>
        </div>
        <button id="close-rps" style="
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #f44336;
            border: none;
            border-radius: 20px;
            color: white;
            cursor: pointer;
        ">Terminar Juego</button>
    `;
    
    // Establecer HTML y añadir al documento
    gameContainer.innerHTML = gameHTML;
    document.body.appendChild(gameContainer);
    
    // Variables para el juego
    let score = 0;
    let rounds = 0;
    
    // Funciones para el juego
    function getEmoji(choice) {
        switch(choice) {
            case 'piedra': return '👊';
            case 'papel': return '✋';
            case 'tijeras': return '✌️';
            default: return '';
        }
    }
    
    function determineWinner(player, computer) {
        if (player === computer) return 'tie';
        
        if ((player === 'piedra' && computer === 'tijeras') ||
            (player === 'papel' && computer === 'piedra') ||
            (player === 'tijeras' && computer === 'papel')) {
            return 'player';
        } else {
            return 'computer';
        }
    }
    
    // Añadir event listeners
    const options = gameContainer.querySelectorAll('.rps-option');
    options.forEach(option => {
        option.addEventListener('click', function() {
            const playerChoice = this.getAttribute('data-choice');
            const choices = ['piedra', 'papel', 'tijeras'];
            const computerChoice = choices[Math.floor(Math.random() * choices.length)];
            
            // Mostrar elecciones
            document.getElementById('rps-choices').textContent = 
                `Tu elección: ${getEmoji(playerChoice)} | Mi elección: ${getEmoji(computerChoice)}`;
            
            // Determinar ganador
            const result = determineWinner(playerChoice, computerChoice);
            let message = '';
            
            if (result === 'player') {
                score += 10;
                message = getRandomMessage(gameResultMessages.win);
                document.getElementById('rps-winner').style.color = 'green';
            } else if (result === 'computer') {
                message = getRandomMessage(gameResultMessages.lose);
                document.getElementById('rps-winner').style.color = 'red';
            } else {
                message = getRandomMessage(gameResultMessages.tie);
                document.getElementById('rps-winner').style.color = 'blue';
            }
            
            document.getElementById('rps-winner').textContent = message;
            rounds++;
            
            // Actualizar puntuación
            document.getElementById('rps-score').textContent = `Puntuación: ${score} (Ronda ${rounds})`;
            
            // Mostrar resultado
            document.getElementById('rps-result').style.display = 'block';
            
            // Si ha jugado 5 rondas, terminar
            if (rounds >= 5) {
                // Dar experiencia basada en la puntuación
                addExperience(score);
                
                // Mostrar mensaje según puntuación
                if (score >= 30) {
                    document.getElementById('rps-message').textContent = "¡Increíble! Has ganado la mayoría de las rondas.";
                } else if (score >= 10) {
                    document.getElementById('rps-message').textContent = "¡Buen juego! La próxima vez te irá aún mejor.";
                } else {
                    document.getElementById('rps-message').textContent = "No te preocupes, sigue practicando. ¡Te quiero igual!";
                }
                
                // Ocultar opciones
                const optionsDiv = gameContainer.querySelector('div');
                optionsDiv.style.display = 'none';
            }
        });
    });
    
    // Botón para cerrar
    document.getElementById('close-rps').addEventListener('click', () => {
        // Dar experiencia si no se han jugado 5 rondas
        if (rounds > 0 && rounds < 5) {
            addExperience(score);
        }
        
        document.body.removeChild(gameContainer);
        finishPlaying(true);
    });
}
// Juego estilo Flappy Bird con conejo
function playFlappyRabbit() {
    console.log("Iniciando Flappy Rabbit");
    
    // Crear contenedor del juego
    const gameContainer = document.createElement('div');
    gameContainer.id = 'flappy-game-container';
    gameContainer.style.position = 'fixed';
    gameContainer.style.top = '0';
    gameContainer.style.left = '0';
    gameContainer.style.width = '100vw';
    gameContainer.style.height = '100vh';
    gameContainer.style.backgroundColor = '#87CEEB';
    gameContainer.style.zIndex = '1000';
    
    // Añadir elementos del juego
    gameContainer.innerHTML = `
        <div id="flappy-game" style="
            width: 100%;
            height: 100%;
            position: relative;
            overflow: hidden;
        ">
            <div id="flappy-score" style="
                position: absolute;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                font-size: 40px;
                font-weight: bold;
                color: white;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
                z-index: 10;
            ">0</div>
            <div id="flappy-rabbit" style="
                position: absolute;
                width: 50px;
                height: 50px;
                background-image: url('icon.png');
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;
                left: 50px;
                top: 50%;
                transform: translateY(-50%);
            "></div>
            <div id="flappy-start-message" style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 24px;
                color: white;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
                background-color: rgba(0, 0, 0, 0.3);
                padding: 10px 20px;
                border-radius: 10px;
            ">Toca para saltar</div>
        </div>
        <button id="close-flappy" style="
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: white;
            border: none;
            padding: 10px 20px;
            border-radius: 30px;
            font-weight: bold;
            cursor: pointer;
        ">Cerrar Juego</button>
    `;
    
    document.body.appendChild(gameContainer);
    
    // Variables del juego
    let gameStarted = false;
    let gameOver = false;
    let score = 0;
    let gravity = 0.5;
    let velocity = 0;
    let rabbitPosition = window.innerHeight / 2;
    let pipes = [];
    let animationFrame;
    
    const rabbit = document.getElementById('flappy-rabbit');
    const scoreElement = document.getElementById('flappy-score');
    const startMessage = document.getElementById('flappy-start-message');
    
    // Iniciar el juego al hacer clic
    gameContainer.addEventListener('click', jump);
    document.getElementById('close-flappy').addEventListener('click', closeGame);
    
    // Salto del conejo
    function jump(e) {
        // No saltar si se hace clic en el botón de cerrar
        if (e.target.id === 'close-flappy') return;
        
        if (!gameStarted) {
            gameStarted = true;
            startMessage.style.display = 'none';
            startGame();
        }
        
        if (!gameOver) {
            velocity = -8;
        }
    }
    
    // Bucle principal del juego
    function startGame() {
        // Crear primer obstáculo
        createPipe();
        
        // Iniciar bucle de juego
        gameLoop();
    }
    
    function gameLoop() {
        // Actualizar posición del conejo
        velocity += gravity;
        rabbitPosition += velocity;
        
        if (rabbit) {
            rabbit.style.top = rabbitPosition + 'px';
        }
        
        // Comprobar colisiones
        const rabbitRect = rabbit.getBoundingClientRect();
        
        // Colisión con el suelo o techo
        if (rabbitPosition <= 0 || rabbitPosition >= window.innerHeight - 50) {
            endGame();
            return;
        }
        
        // Actualizar y comprobar colisiones con obstáculos
        for (let i = 0; i < pipes.length; i++) {
            const pipe = pipes[i];
            
            // Mover obstáculo
            pipe.x -= 2;
            
            const pipeTopElement = document.getElementById(`${pipe.id}-top`);
            const pipeBottomElement = document.getElementById(`${pipe.id}-bottom`);
            
            if (pipeTopElement && pipeBottomElement) {
                pipeTopElement.style.right = pipe.x + 'px';
                pipeBottomElement.style.right = pipe.x + 'px';
                
                // Comprobar colisión
                const pipeTopRect = pipeTopElement.getBoundingClientRect();
                const pipeBottomRect = pipeBottomElement.getBoundingClientRect();
                
                if (
                    (rabbitRect.right > pipeTopRect.left && 
                     rabbitRect.left < pipeTopRect.right && 
                     rabbitRect.top < pipeTopRect.bottom) ||
                    (rabbitRect.right > pipeBottomRect.left && 
                     rabbitRect.left < pipeBottomRect.right && 
                     rabbitRect.bottom > pipeBottomRect.top)
                ) {
                    endGame();
                    return;
                }
                
                // Sumar punto si ha pasado obstáculo
                if (!pipe.passed && pipe.x > window.innerWidth - 50) {
                    pipe.passed = true;
                    score++;
                    scoreElement.textContent = score;
                }
                
                // Eliminar obstáculo si está fuera de pantalla
                if (pipe.x > window.innerWidth + 60) {
                    if (pipeTopElement) pipeTopElement.remove();
                    if (pipeBottomElement) pipeBottomElement.remove();
                    pipes.splice(i, 1);
                    i--;
                }
            }
        }
        
        // Crear nuevo obstáculo cada cierto tiempo
        if (pipes.length < 3 && Math.random() < 0.01) {
            createPipe();
        }
        
        if (!gameOver) {
            animationFrame = requestAnimationFrame(gameLoop);
        }
    }
    
    // Crear obstáculo
    function createPipe() {
        const pipeId = 'pipe-' + Date.now();
        const gapHeight = 150; // Espacio entre tuberías
        const pipeTop = Math.floor(Math.random() * (window.innerHeight - gapHeight - 200)) + 50;
        
        const pipeTopElement = document.createElement('div');
        pipeTopElement.id = `${pipeId}-top`;
        pipeTopElement.style.position = 'absolute';
        pipeTopElement.style.width = '60px';
        pipeTopElement.style.height = pipeTop + 'px';
        pipeTopElement.style.right = '0px';
        pipeTopElement.style.top = '0';
        pipeTopElement.style.backgroundColor = '#4CAF50';
        pipeTopElement.style.border = '4px solid #2E7D32';
        
        const pipeBottomElement = document.createElement('div');
        pipeBottomElement.id = `${pipeId}-bottom`;
        pipeBottomElement.style.position = 'absolute';
        pipeBottomElement.style.width = '60px';
        pipeBottomElement.style.height = (window.innerHeight - pipeTop - gapHeight) + 'px';
        pipeBottomElement.style.right = '0px';
        pipeBottomElement.style.bottom = '0';
        pipeBottomElement.style.backgroundColor = '#4CAF50';
        pipeBottomElement.style.border = '4px solid #2E7D32';
        
        document.getElementById('flappy-game').appendChild(pipeTopElement);
        document.getElementById('flappy-game').appendChild(pipeBottomElement);
        
        pipes.push({
            id: pipeId,
            x: 0,
            passed: false
        });
    }
    
    // Fin del juego
    function endGame() {
        gameOver = true;
        cancelAnimationFrame(animationFrame);
        
        // Mostrar mensaje de fin
        startMessage.textContent = `Juego terminado. Puntuación: ${score}`;
        startMessage.style.display = 'block';
        
        // Añadir experiencia basada en la puntuación
        const expGained = score * 5;
        addExperience(expGained);
        
        setTimeout(() => {
            startMessage.textContent += `\n¡Has ganado ${expGained} puntos de experiencia!`;
        }, 1000);
    }
    
    // Cerrar juego
    function closeGame() {
        cancelAnimationFrame(animationFrame);
        document.body.removeChild(gameContainer);
        
        // Aumentar felicidad al jugar
        gameState.happiness = Math.min(100, gameState.happiness + 10);
        gameState.energy = Math.max(0, gameState.energy - 5);
        updateStatusBars();
        
        // Terminar estado de juego
        finishPlaying(true);
    }
}
// Juego de Snake
function playSnakeGame() {
    console.log("Iniciando juego de Snake");
    
    // Crear contenedor del juego
    const gameContainer = document.createElement('div');
    gameContainer.id = 'snake-game-container';
    gameContainer.style.position = 'fixed';
    gameContainer.style.top = '50%';
    gameContainer.style.left = '50%';
    gameContainer.style.transform = 'translate(-50%, -50%)';
    gameContainer.style.background = 'white';
    gameContainer.style.padding = '20px';
    gameContainer.style.borderRadius = '15px';
    gameContainer.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
    gameContainer.style.zIndex = '1000';
    gameContainer.style.maxWidth = '90%';
    gameContainer.style.maxHeight = '90vh';
    gameContainer.style.overflow = 'hidden';
    gameContainer.style.textAlign = 'center';
    
    // Crear HTML del juego
    const gameHTML = `
        <h2 style="color: #4682B4; margin-bottom: 10px;">Juego de Serpiente</h2>
        <p style="margin-bottom: 20px;">Usa las flechas para mover la serpiente</p>
        <div id="snake-game-board" style="
            width: 300px;
            height: 300px;
            border: 2px solid #87CEEB;
            background-color: #f0f0f0;
            position: relative;
            margin: 0 auto 20px;
        "></div>
        <div id="snake-score" style="margin-bottom: 15px;">Puntuación: 0</div>
        <div id="snake-controls" style="
            display: flex;
            justify-content: center;
            margin-bottom: 20px;
        ">
            <button id="snake-up" style="
                width: 60px;
                height: 60px;
                background: #87CEEB;
                border: none;
                border-radius: 10px;
                color: white;
                font-size: 24px;
                margin: 5px;
            ">↑</button>
        </div>
        <div style="
            display: flex;
            justify-content: center;
        ">
            <button id="snake-left" style="
                width: 60px;
                height: 60px;
                background: #87CEEB;
                border: none;
                border-radius: 10px;
                color: white;
                font-size: 24px;
                margin: 5px;
            ">←</button>
            <button id="snake-down" style="
                width: 60px;
                height: 60px;
                background: #87CEEB;
                border: none;
                border-radius: 10px;
                color: white;
                font-size: 24px;
                margin: 5px;
            ">↓</button>
            <button id="snake-right" style="
                width: 60px;
                height: 60px;
                background: #87CEEB;
                border: none;
                border-radius: 10px;
                color: white;
                font-size: 24px;
                margin: 5px;
            ">→</button>
        </div>
        <button id="close-snake" style="
            padding: 10px 20px;
            background-color: #f44336;
            border: none;
            border-radius: 20px;
            color: white;
            cursor: pointer;
            margin-top: 15px;
        ">Terminar Juego</button>
    `;
    
    gameContainer.innerHTML = gameHTML;
    document.body.appendChild(gameContainer);
    
    // Variables del juego
    const board = document.getElementById('snake-game-board');
    const scoreDisplay = document.getElementById('snake-score');
    const closeButton = document.getElementById('close-snake');
    
    const gridSize = 15;
    const cellSize = 300 / gridSize;
    let snake = [{x: 7, y: 7}]; // Posición inicial de la serpiente
    let direction = 'right';
    let food = generateFood();
    let score = 0;
    let gameRunning = true;
    let gameInterval;
    
    // Event listener para cerrar el juego
    closeButton.addEventListener('click', () => {
        clearInterval(gameInterval);
        document.body.removeChild(gameContainer);
        
        // Dar experiencia según puntuación
        addExperience(score * 2);
        
        finishPlaying(true);
    });
    
    // Event listeners para controles táctiles
    document.getElementById('snake-up').addEventListener('click', () => {
        if (direction !== 'down') direction = 'up';
    });
    
    document.getElementById('snake-down').addEventListener('click', () => {
        if (direction !== 'up') direction = 'down';
    });
    
    document.getElementById('snake-left').addEventListener('click', () => {
        if (direction !== 'right') direction = 'left';
    });
    
    document.getElementById('snake-right').addEventListener('click', () => {
        if (direction !== 'left') direction = 'right';
    });
    
    // Event listener para controlar la serpiente con teclado
    document.addEventListener('keydown', function(e) {
        switch(e.key) {
            case 'ArrowUp':
                if (direction !== 'down') direction = 'up';
                break;
            case 'ArrowDown':
                if (direction !== 'up') direction = 'down';
                break;
            case 'ArrowLeft':
                if (direction !== 'right') direction = 'left';
                break;
            case 'ArrowRight':
                if (direction !== 'left') direction = 'right';
                break;
        }
    });
    
    // Función para generar comida en posición aleatoria
    function generateFood() {
        const food = {
            x: Math.floor(Math.random() * gridSize),
            y: Math.floor(Math.random() * gridSize)
        };
        
        // Asegurarse de que la comida no aparezca sobre la serpiente
        for (let segment of snake) {
            if (segment.x === food.x && segment.y === food.y) {
                return generateFood();
            }
        }
        
        return food;
    }
    
    // Función para dibujar el juego
    function draw() {
        // Limpiar el tablero
        board.innerHTML = '';
        
        // Dibujar serpiente
        snake.forEach((segment, index) => {
            const snakeElement = document.createElement('div');
            snakeElement.style.position = 'absolute';
            snakeElement.style.width = cellSize + 'px';
            snakeElement.style.height = cellSize + 'px';
            snakeElement.style.backgroundColor = index === 0 ? '#4CAF50' : '#8BC34A';
            snakeElement.style.border = '1px solid #388E3C';
            snakeElement.style.left = segment.x * cellSize + 'px';
            snakeElement.style.top = segment.y * cellSize + 'px';
            board.appendChild(snakeElement);
        });
        
        // Dibujar comida
        const foodElement = document.createElement('div');
        foodElement.style.position = 'absolute';
        foodElement.style.width = cellSize + 'px';
        foodElement.style.height = cellSize + 'px';
        foodElement.style.backgroundColor = '#FF5722';
        foodElement.style.borderRadius = '50%';
        foodElement.style.left = food.x * cellSize + 'px';
        foodElement.style.top = food.y * cellSize + 'px';
        board.appendChild(foodElement);
    }
    
    // Función para actualizar el juego
    function update() {
        if (!gameRunning) return;
        
        // Mover la serpiente según la dirección
        const head = {...snake[0]};
        
        switch(direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }
        
        // Comprobar colisión con los bordes
        if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
            gameOver();
            return;
        }
        
        // Comprobar colisión con la propia serpiente
        for (let i = 0; i < snake.length; i++) {
            if (snake[i].x === head.x && snake[i].y === head.y) {
                gameOver();
                return;
            }
        }
        
        // Comprobar si come
        if (head.x === food.x && head.y === food.y) {
            // Añadir segmento a la serpiente (no eliminar el último)
            snake.unshift(head);
            
            // Generar nueva comida
            food = generateFood();
            
            // Aumentar puntuación
            score++;
            scoreDisplay.textContent = `Puntuación: ${score}`;
        } else {
            // Mover la serpiente (añadir nuevo head y eliminar último segmento)
            snake.unshift(head);
            snake.pop();
        }
        
        // Dibujar el juego actualizado
        draw();
    }
    
    // Función de fin de juego
    function gameOver() {
        gameRunning = false;
        clearInterval(gameInterval);
        
        // Mostrar mensaje de fin
        const gameOverMessage = document.createElement('div');
        gameOverMessage.style.position = 'absolute';
        gameOverMessage.style.top = '50%';
        gameOverMessage.style.left = '50%';
        gameOverMessage.style.transform = 'translate(-50%, -50%)';
        gameOverMessage.style.background = 'rgba(0, 0, 0, 0.7)';
        gameOverMessage.style.color = 'white';
        gameOverMessage.style.padding = '20px';
        gameOverMessage.style.borderRadius = '10px';
        gameOverMessage.style.textAlign = 'center';
        gameOverMessage.style.zIndex = '10';
        gameOverMessage.innerHTML = `
            <h3>¡Juego terminado!</h3>
            <p>Tu puntuación: ${score}</p>
        `;
        board.appendChild(gameOverMessage);
        
        // Dar experiencia según puntuación
        addExperience(score * 3);
    }
    
    // Iniciar el juego
    draw();
    gameInterval = setInterval(update, 200);
}

// Mostrar álbum de fotos
function showPhotoAlbum() {
    console.log("Mostrando álbum de fotos");
    
    // Crear álbum
    const album = document.createElement('div');
    album.className = 'photo-album';
    album.style.position = 'fixed';
    album.style.top = '50%';
    album.style.left = '50%';
    album.style.transform = 'translate(-50%, -50%)';
    album.style.background = 'white';
    album.style.padding = '20px';
    album.style.borderRadius = '15px';
    album.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
    album.style.zIndex = '100';
    album.style.width = '90vw';
    album.style.maxWidth = '500px';
    album.style.maxHeight = '80vh';
    album.style.overflow = 'auto';
    album.style.textAlign = 'center';
    
    // Contador de desbloqueos
    const unlockedCount = REWARDS_SYSTEM.unlockedImages.length;
    const totalCount = REWARDS_SYSTEM.availableImages.length;
    
    // Crear HTML del álbum
    let albumHTML = `
        <h2 style="color: #4682B4; margin-bottom: 10px;">Nuestro Álbum de Recuerdos</h2>
        <p style="margin-bottom: 15px;">Has desbloqueado ${unlockedCount} de ${totalCount} recuerdos</p>
        <div style="
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-bottom: 20px;
        ">
    `;
    
    // Mostrar imágenes
    REWARDS_SYSTEM.availableImages.forEach(img => {
        const isUnlocked = REWARDS_SYSTEM.unlockedImages.includes(img.id);
        
        albumHTML += `
            <div style="
                border-radius: 10px;
                padding: 10px;
                background-color: ${isUnlocked ? '#e6f7ff' : '#f0f0f0'};
            ">
        `;
        
        if (isUnlocked) {
            albumHTML += `
                <img src="${img.url}" alt="${img.name}" style="
                    width: 100%;
                    height: auto;
                    border-radius: 8px;
                    margin-bottom: 5px;
                ">
                <p style="font-weight: bold;">${img.name}</p>
            `;
        } else {
            albumHTML += `
                <div style="
                    height: 100px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 40px;
                    background-color: #ddd;
                    border-radius: 8px;
                ">🔒</div>
                <p>Desbloquea con ${img.exp} exp</p>
            `;
        }
        
        albumHTML += `</div>`;
    });
    
    // Cerrar grid y añadir botón
    albumHTML += `
        </div>
        <button id="close-album" style="
            background-color: #87CEEB;
            border: none;
            padding: 10px 20px;
            border-radius: 30px;
            color: white;
            font-weight: bold;
            cursor: pointer;
        ">Cerrar Álbum</button>
    `;
    
    album.innerHTML = albumHTML;
    document.body.appendChild(album);
    
    // Evento para cerrar
    document.getElementById('close-album').addEventListener('click', () => {
        document.body.removeChild(album);
        finishPlaying(true);
    });
}

// Mostrar notificación de desbloqueo de imagen
function showUnlockNotification(image) {
    // Crear elemento para la notificación
    const notification = document.createElement('div');
    notification.className = 'unlock-notification';
    notification.style.position = 'fixed';
    notification.style.top = '50%';
    notification.style.left = '50%';
    notification.style.transform = 'translate(-50%, -50%)';
    notification.style.background = 'white';
    notification.style.padding = '20px';
    notification.style.borderRadius = '15px';
    notification.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
    notification.style.zIndex = '100';
    notification.style.maxWidth = '80vw';
    notification.style.textAlign = 'center';
    
    // Contenido de la notificación
    notification.innerHTML = `
        <h2 style="color: #4682B4; margin-bottom: 10px;">¡Recuerdo Desbloqueado!</h2>
        <p style="margin-bottom: 15px;">${image.name}</p>
        <div style="margin-bottom: 15px;">
            <img src="${image.url}" alt="${image.name}" style="max-width: 100%; max-height: 200px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        </div>
        <div>
            <button id="view-album" style="
                background-color: #4CAF50;
                border: none;
                padding: 8px 15px;
                border-radius: 20px;
                color: white;
                margin-right: 10px;
                cursor: pointer;
            ">Ver Álbum</button>
            <button id="close-notification" style="
                background-color: #f44336;
                border: none;
                padding: 8px 15px;
                border-radius: 20px;
                color: white;
                cursor: pointer;
            ">Cerrar</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Manejar eventos de botones
    document.getElementById('close-notification').addEventListener('click', () => {
        document.body.removeChild(notification);
    });
    
    document.getElementById('view-album').addEventListener('click', () => {
        document.body.removeChild(notification);
        showPhotoAlbum();
    });
}

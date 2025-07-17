// tamagotchi-fixed.js - PARTE 1: Configuración y Variables
console.log("Cargando tamagotchi-fixed.js CORREGIDO - PARTE 1...");

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
    "¿Nos echamos un Mario kart?",
    "¡VINITO, CARTAS Y TÚ!",
    "¡La próxima vez jugamos al Kamasutra!"
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
    "Zzz... Durmiendo con mi princesa de Chichinabo..."
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
    "Gordoooo!! Gordaaaaa!!"
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
    "¿Nos echamos un Mario kart?",
    "¡VINITO, CARTAS Y TÚ!",
    "¡La próxima vez jugamos al Kamasutra!"
];

// Resultados del mini-juego
const gameResultMessages = {
    win: [
        "Rachel bailando samba expresando felicidad máxima",
        "La partes GIIIIRL.",
        "No me calientes lo mio"
        "YA BAAASTA"
    ],
    lose: [
        "Santos perreando sin ningun tipo de contexto",
        "¡Perdiste! Aunque seguiras siendo mi WIFE",
        "Gané yo, ahora dame un besito"
        "Espabila que no espabilas"
    ],
    tie: [
        "¡Empate! Nuestras mentes lésbicas están conectadas",
        "Empate... Esto es el destino, somos una",
        "¡Somos como el ying y el chinchanchun"
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
// tamagotchi-fixed.js - PARTE 2: Funciones Básicas
console.log("Cargando PARTE 2 - Funciones Básicas...");

// FUNCIÓN CORREGIDA: Obtener un mensaje aleatorio
function getRandomMessage(messageArray) {
    if (!messageArray || messageArray.length === 0) {
        return "¡Hola!";
    }
    const randomIndex = Math.floor(Math.random() * messageArray.length);
    return messageArray[randomIndex];
}

// FUNCIÓN CORREGIDA: Mostrar mensaje con mejor manejo de errores
function showMessage(message, duration = 3000) {
    console.log("Intentando mostrar mensaje:", message);
    
    if (!messageBubble) {
        messageBubble = document.getElementById('message-bubble');
        if (!messageBubble) {
            console.error("Error crítico: message-bubble no encontrado en el DOM");
            return;
        }
    }
    
    // Limpiar temporizador anterior si existe
    if (timers.message) {
        clearTimeout(timers.message);
    }
    
    // Mostrar mensaje
    messageBubble.textContent = message;
    messageBubble.classList.remove('hidden');
    
    console.log("Mensaje mostrado exitosamente:", message);
    
    // Programar ocultación del mensaje
    timers.message = setTimeout(() => {
        if (messageBubble && !messageBubble.classList.contains('hidden')) {
            messageBubble.classList.add('hidden');
            console.log("Mensaje ocultado automáticamente");
        }
    }, duration);
}

// FUNCIÓN CORREGIDA: Cambiar sprite con animaciones mejoradas
function changeSprite(state) {
    console.log("Cambiando sprite a estado:", state);

    if (!petSprite) {
        petSprite = document.getElementById('pet-sprite');
        if (!petSprite) {
            console.error("Error crítico: pet-sprite no encontrado");
            return;
        }
    }

    // Quitar clases anteriores
    const stateClasses = ['normal', 'eating', 'playing', 'sleeping', 'sad'];
    stateClasses.forEach(cls => petSprite.classList.remove(cls));
    petSprite.classList.add(state);

    // --- Animación de dormir bonita ---
    let sleepOverlay = document.getElementById('sleep-overlay');
    let zzz = document.getElementById('sleep-zzz');
    if (state === 'sleeping') {
        // Overlay de fondo
        if (!sleepOverlay) {
            sleepOverlay = document.createElement('div');
            sleepOverlay.id = 'sleep-overlay';
            sleepOverlay.className = 'sleep-overlay';
            document.body.appendChild(sleepOverlay);
        }
        // Zzz animado
        if (!zzz) {
            zzz = document.createElement('div');
            zzz.id = 'sleep-zzz';
            zzz.className = 'sleep-zzz';
            zzz.innerText = 'Zzz...';
            document.body.appendChild(zzz);
        }
    } else {
        // Quitar overlay y zzz animado si existen
        if (sleepOverlay && sleepOverlay.parentNode) sleepOverlay.parentNode.removeChild(sleepOverlay);
        if (zzz && zzz.parentNode) zzz.parentNode.removeChild(zzz);
    }

    // Actualiza estado en gameState
    gameState.state = state;
    console.log("Sprite cambiado exitosamente a:", state);
    console.log("Clases actuales del sprite:", petSprite.className);
}
// FUNCIÓN CORREGIDA: Actualizar barras de estado
function updateStatusBars() {
    console.log("Actualizando barras - hambre:", gameState.hunger, "felicidad:", gameState.happiness, "energía:", gameState.energy);

    // Si todos los valores están en 0, haz un reseteo de emergencia
    if (gameState.hunger <= 0 && gameState.happiness <= 0 && gameState.energy <= 0) {
        showMessage("¡Oh no! Estaba muy mal... ¡Gracias por venir a rescatarme!", 4000);
        gameState.hunger = CONFIG.initialHunger / 2;
        gameState.happiness = CONFIG.initialHappiness / 2;
        gameState.energy = CONFIG.initialEnergy / 2;
        setTimeout(updateStatusBars, 100);
        // IMPORTANTE: permite que el usuario alimente de nuevo
        gameState.isEating = false;
        gameState.isPlaying = false;
        gameState.isSleeping = false;
        return;
    }

    // Obtener referencias si no existen
    if (!hungerBar || !happinessBar || !energyBar) {
        hungerBar = document.getElementById('hunger-bar');
        happinessBar = document.getElementById('happiness-bar');
        energyBar = document.getElementById('energy-bar');
        if (!hungerBar || !happinessBar || !energyBar) {
            console.error("Error: No se pudieron encontrar las barras de estado");
            return;
        }
    }

    // Limita los valores entre 0 y 100
    gameState.hunger = Math.max(0, Math.min(100, gameState.hunger));
    gameState.happiness = Math.max(0, Math.min(100, gameState.happiness));
    gameState.energy = Math.max(0, Math.min(100, gameState.energy));

    hungerBar.style.width = `${gameState.hunger}%`;
    happinessBar.style.width = `${gameState.happiness}%`;
    energyBar.style.width = `${gameState.energy}%`;

    // Actualiza display de nivel
    if (!levelDisplay) levelDisplay = document.getElementById('experience-text');
    if (levelDisplay) levelDisplay.textContent = `Nivel: ${REWARDS_SYSTEM.level} (${REWARDS_SYSTEM.experience} exp)`;

    // Cambia sprite según estado actual
    if (gameState.isSleeping) {
        changeSprite(PET_STATES.SLEEPING);
    } else if (gameState.hunger <= CONFIG.sadThreshold ||
        gameState.happiness <= CONFIG.sadThreshold ||
        gameState.energy <= CONFIG.sadThreshold) {
        changeSprite(PET_STATES.SAD);
        if (Math.random() < 0.3) showMessage(getRandomMessage(sadMessages));
    } else {
        changeSprite(PET_STATES.NORMAL);
    }

    // Efectos visuales al contenedor
    const gameContainer = document.getElementById('game-container');
    if (gameContainer) {
        gameContainer.classList.remove('low-hunger', 'low-happiness', 'low-energy');
        if (gameState.hunger <= CONFIG.sadThreshold) gameContainer.classList.add('low-hunger');
        if (gameState.happiness <= CONFIG.sadThreshold) gameContainer.classList.add('low-happiness');
        if (gameState.energy <= CONFIG.sadThreshold) gameContainer.classList.add('low-energy');
    }
}

// Función para añadir experiencia
function addExperience(amount) {
    console.log("Añadiendo experiencia:", amount);
    
    REWARDS_SYSTEM.experience += amount;
    
    // Calcular nivel basado en experiencia
    const newLevel = Math.floor(REWARDS_SYSTEM.experience / 100) + 1;
    
    if (newLevel > REWARDS_SYSTEM.level) {
        REWARDS_SYSTEM.level = newLevel;
        showMessage(`¡Subiste de nivel! Ahora eres nivel ${REWARDS_SYSTEM.level}`, 4000);
    }
    
    // Verifica y desbloquea imágenes según experiencia
    checkUnlockedImages();
    
    // Guardar progreso de recompensas
    saveRewardsState();
    
    // Actualizar display
    if (levelDisplay) {
        levelDisplay.textContent = `Nivel: ${REWARDS_SYSTEM.level} (${REWARDS_SYSTEM.experience} exp)`;
    }
}

// Desbloquea una imagen cada 10 puntos de experiencia
function checkUnlockedImages() {
    const toUnlock = Math.floor(REWARDS_SYSTEM.experience / 10);
    for (let i = 0; i < toUnlock && i < REWARDS_SYSTEM.availableImages.length; i++) {
        const image = REWARDS_SYSTEM.availableImages[i];
        if (!REWARDS_SYSTEM.unlockedImages.includes(image.id)) {
            REWARDS_SYSTEM.unlockedImages.push(image.id);
            showUnlockNotification(image);
        }
    }
}
// tamagotchi-fixed.js - PARTE 3: Acciones del Tamagotchi
console.log("Cargando PARTE 3 - Acciones del Tamagotchi...");

// FUNCIÓN CORREGIDA: Alimentar al conejo
function feedPet() {
    console.log("Función feedPet ejecutada");

    // Si está dormido, no puede comer
    if (gameState.isSleeping) {
        showMessage("Zzz... No puedo comer mientras duermo... 💤");
        return;
    }

    // Si está comiendo, ignorar acción
    if (gameState.isEating) {
        showMessage("¡Espera, sigo comiendo!");
        return;
    }

    // Marca que está comiendo
    gameState.isEating = true;
    changeSprite(PET_STATES.EATING);
    showMessage(getRandomMessage(feedMessages));
    gameState.hunger = Math.min(100, gameState.hunger + 20);
    gameState.happiness = Math.min(100, gameState.happiness + 5);
    updateStatusBars();

    // Deshabilita el botón de alimentar opcionalmente
    const feedBtn = document.getElementById('feed-btn');
    if (feedBtn) feedBtn.disabled = true;

    // Timeout para finalizar el estado de comer
    if (timers.eating) clearTimeout(timers.eating);
    timers.eating = setTimeout(() => {
        gameState.isEating = false;
        // Reactiva el botón de alimentar
        if (feedBtn) feedBtn.disabled = false;
        updateStatusBars();
    }, CONFIG.animationDuration);

    saveGameState();
}
// FUNCIÓN CORREGIDA: Jugar con el conejo - AHORA MUESTRA EL MENÚ
function playWithPet() {
    console.log("Función playWithPet ejecutada");

    if (gameState.isSleeping) {
        showMessage("Zzz... Estoy soñando contigo, luego jugamos...");
        return;
    }
    if (gameState.isEating) {
        showMessage("¡Déjame terminar de comer primero!");
        return;
    }
    if (gameState.isPlaying) {
        showMessage("¡Ya estamos jugando!");
        return;
    }
    if (gameState.energy <= CONFIG.criticalThreshold) {
        showMessage("ESTOY LOW BATTERY, ¿NOS VAMOS DE AVENTURA?...");
        // Si quieres permitir jugar igual, no hagas return aquí.
    }
    gameState.isPlaying = true;
    showGameMenu();
}
// FUNCIÓN CORREGIDA: Mostrar menú de juegos
function showGameMenu() {
    console.log("Mostrando menú de juegos - FUNCIÓN CORREGIDA");
    
    // Eliminar menú anterior si existe
    const existingMenu = document.getElementById('game-menu-container');
    if (existingMenu) {
        document.body.removeChild(existingMenu);
        console.log("Menú anterior eliminado");
    }
    
    // Crear el contenedor del menú
    const menuContainer = document.createElement('div');
    menuContainer.id = 'game-menu-container';
    menuContainer.className = 'game-menu';
    menuContainer.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #87CEEB 0%, #98E4FF 100%);
        padding: 25px;
        border-radius: 20px;
        box-shadow: 0 8px 25px rgba(0,0,0,0.3);
        z-index: 1000;
        text-align: center;
        min-width: 320px;
        max-width: 90vw;
        border: 3px solid #5CACEE;
        animation: slideInFromTop 0.4s ease-out;
    `;
    
    // Crear contenido del menú
    const menuHTML = `
        <h2 style="margin-bottom: 15px; color: white; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">¿A qué quieres jugar?</h2>
        <p style="margin-bottom: 20px; color: white;">Elige un juego para divertirte conmigo:</p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px;">
            <button id="game-rps" class="game-option" style="
                padding: 15px 10px;
                background-color: #FF9966;
                border: none;
                border-radius: 12px;
                color: white;
                font-weight: bold;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.3s ease;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            ">✂️ Piedra, Papel, Tijeras</button>
            
            <button id="game-flappy" class="game-option" style="
                padding: 15px 10px;
                background-color: #87CEEB;
                border: none;
                border-radius: 12px;
                color: white;
                font-weight: bold;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.3s ease;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            ">🐰 Flappy Rabbit</button>
            
            <button id="game-snake" class="game-option" style="
                padding: 15px 10px;
                background-color: #4CAF50;
                border: none;
                border-radius: 12px;
                color: white;
                font-weight: bold;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.3s ease;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            ">🐍 Snake</button>
            
            <button id="game-album" class="game-option" style="
                padding: 15px 10px;
                background-color: #FF6B6B;
                border: none;
                border-radius: 12px;
                color: white;
                font-weight: bold;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.3s ease;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            ">📷 Ver Álbum</button>
        </div>
        <button id="cancel-game" style="
            padding: 12px 24px;
            background-color: #f44336;
            border: none;
            border-radius: 25px;
            color: white;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.2s ease;
            box-shadow: 0 3px 6px rgba(0,0,0,0.2);
        ">Cancelar</button>
    `;
    
    // Establecer contenido y añadir al documento
    menuContainer.innerHTML = menuHTML;
    document.body.appendChild(menuContainer);
    
    console.log("Menú creado y añadido al DOM");
    
    // Marcar que está jugando
    gameState.isPlaying = true;
    
    // Cambiar sprite
    changeSprite(PET_STATES.PLAYING);
    
    // AÑADIR EVENT LISTENERS CON MANEJO DE ERRORES
    try {
        const rpsBtn = document.getElementById('game-rps');
        const flappyBtn = document.getElementById('game-flappy');
        const snakeBtn = document.getElementById('game-snake');
        const albumBtn = document.getElementById('game-album');
        const cancelBtn = document.getElementById('cancel-game');
        
        if (rpsBtn) {
            rpsBtn.addEventListener('click', () => {
                console.log("Botón RPS clickeado");
                document.body.removeChild(menuContainer);
                playRockPaperScissors();
            });
        }
        
        if (flappyBtn) {
            flappyBtn.addEventListener('click', () => {
                console.log("Botón Flappy clickeado");
                document.body.removeChild(menuContainer);
                playFlappyRabbit();
            });
        }
        
        if (snakeBtn) {
            snakeBtn.addEventListener('click', () => {
                console.log("Botón Snake clickeado");
                document.body.removeChild(menuContainer);
                playSnakeGame();
            });
        }
        
        if (albumBtn) {
            albumBtn.addEventListener('click', () => {
                console.log("Botón Álbum clickeado");
                document.body.removeChild(menuContainer);
                showPhotoAlbum();
            });
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                console.log("Juego cancelado");
                document.body.removeChild(menuContainer);
                finishPlaying(false); // No dar recompensa si cancela
                gameState.isPlaying = false; 
            });
        }
        
        console.log("Event listeners del menú configurados exitosamente");
        
    } catch (error) {
        console.error("Error al configurar event listeners del menú:", error);
    }
    
    // Si no selecciona nada, cancelar después de 30 segundos
    timers.gameMenu = setTimeout(() => {
        if (document.body.contains(menuContainer)) {
            console.log("Tiempo de menú agotado, cerrando automáticamente");
            document.body.removeChild(menuContainer);
            finishPlaying(false);
            gameState.isPlaying = false;
        }
    }, 30000);
}

// FUNCIÓN CORREGIDA: Finalizar juego
function finishPlaying(withReward = true) {
  console.log("Finalizando juego, con recompensa:", withReward);
  if (withReward) {
    gameState.happiness = Math.min(100, gameState.happiness + 10);
    gameState.energy = Math.max(0, gameState.energy - 5);
    updateStatusBars();
  }
gameState.isPlaying = false;
if (gameState.isSleeping) {
    changeSprite(PET_STATES.SLEEPING);
} else {
    changeSprite(PET_STATES.NORMAL);
}
saveGameState();
console.log("Juego finalizado exitosamente");
}
// FUNCIÓN CORREGIDA: Hacer dormir/despertar al conejo
function toggleSleep() {
    console.log("Función toggleSleep ejecutada, estado actual isSleeping:", gameState.isSleeping);
    const sleepButton = document.getElementById('sleep-btn');
    const btnText = sleepButton ? sleepButton.querySelector('.btn-text') : null;
    const btnIcon = sleepButton ? sleepButton.querySelector('.btn-icon') : null;
    if (gameState.isSleeping) {
        // DESPERTAR
        console.log("Despertando al conejo");
        gameState.isSleeping = false;
        if (btnText) btnText.textContent = 'Dormir abrazaditos';
        if (btnIcon) btnIcon.textContent = '💤';
        showMessage("¡Buenos diotaaas! Que no es lo mismo que Buenos Idiotaaas");
        changeSprite(PET_STATES.NORMAL);
        updateStatusBars();
    } else {
        // DORMIR
        console.log("Durmiendo al conejo");
        gameState.isSleeping = true;
        if (btnText) btnText.textContent = 'Despertar con besitos';
        if (btnIcon) btnIcon.textContent = '🌞';
        showMessage(getRandomMessage(sleepMessages));
        gameState.energy = Math.min(100, gameState.energy + 25);
        addExperience(1);
        changeSprite(PET_STATES.SLEEPING);
        updateStatusBars();
    }
    if (sleepButton) {
        sleepButton.classList.add('active');
        setTimeout(() => sleepButton.classList.remove('active'), 600);
    }
    saveGameState();
    console.log("toggleSleep completado, nuevo estado isSleeping:", gameState.isSleeping);
}
// FUNCIÓN CORREGIDA: Mostrar mensaje especial
function showSpecialMessage() {
    console.log("Función showSpecialMessage ejecutada");
    
    // Añadir efecto visual al botón
    const specialBtn = document.getElementById('special-btn');
    if (specialBtn) {
        specialBtn.classList.add('active');
        setTimeout(() => specialBtn.classList.remove('active'), 600);
    }
    
    // Mostrar mensaje especial
    showMessage(getRandomMessage(specialMessages), 5000);
    
    // Aumentar felicidad un poco
    gameState.happiness = Math.min(100, gameState.happiness + 3);
    
    // Dar experiencia
    addExperience(1);
    
    // Actualizar barras
    //Bars();
    
    // Guardar estado
    saveGameState();
}
// tamagotchi-fixed.js - PARTE 4: Juego Piedra, Papel, Tijeras
console.log("Cargando PARTE 4 - Juego Piedra, Papel, Tijeras...");

// Juego de Piedra, Papel o Tijeras
function playRockPaperScissors() {
    console.log("Iniciando Piedra, Papel o Tijeras");
    
    // Crear contenedor del juego
    const gameContainer = document.createElement('div');
    gameContainer.id = 'rps-game-container';
    gameContainer.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #FF9966 0%, #FF5E62 100%);
        padding: 25px;
        border-radius: 20px;
        box-shadow: 0 8px 25px rgba(0,0,0,0.3);
        z-index: 1000;
        width: 90%;
        max-width: 400px;
        text-align: center;
        border: 3px solid #E53E3E;
        animation: slideInFromTop 0.4s ease-out;
    `;
    
    // Crear HTML del juego
    const gameHTML = `
        <h2 style="color: white; margin-bottom: 15px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">Piedra, Papel o Tijeras</h2>
        <p id="rps-message" style="margin-bottom: 20px; color: white; font-weight: bold;">¡Elige tu jugada!</p>
        <div style="
            display: flex;
            justify-content: space-around;
            margin-bottom: 20px;
            gap: 15px;
        ">
            <button class="rps-option" data-choice="piedra" style="
                padding: 20px;
                background-color: #4A5568;
                border: none;
                border-radius: 50%;
                width: 80px;
                height: 80px;
                font-size: 35px;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            ">👊</button>
            <button class="rps-option" data-choice="papel" style="
                padding: 20px;
                background-color: #4A5568;
                border: none;
                border-radius: 50%;
                width: 80px;
                height: 80px;
                font-size: 35px;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            ">✋</button>
            <button class="rps-option" data-choice="tijeras" style="
                padding: 20px;
                background-color: #4A5568;
                border: none;
                border-radius: 50%;
                width: 80px;
                height: 80px;
                font-size: 35px;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            ">✌️</button>
        </div>
        <div id="rps-result" style="
            margin-top: 20px;
            display: none;
            background-color: rgba(255,255,255,0.9);
            padding: 15px;
            border-radius: 10px;
            color: #333;
        ">
            <p id="rps-choices" style="font-size: 18px; margin-bottom: 10px;"></p>
            <p id="rps-winner" style="font-size: 20px; font-weight: bold; margin: 10px 0;"></p>
            <p id="rps-score">Puntuación: 0 | Ronda: 0/5</p>
        </div>
        <button id="close-rps" style="
            margin-top: 20px;
            padding: 12px 24px;
            background-color: #f44336;
            border: none;
            border-radius: 25px;
            color: white;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.2s ease;
            box-shadow: 0 3px 6px rgba(0,0,0,0.2);
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
    
    // Añadir efectos hover a los botones
    const options = gameContainer.querySelectorAll('.rps-option');
    options.forEach(option => {
        option.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.backgroundColor = '#68D391';
        });
        
        option.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.backgroundColor = '#4A5568';
        });
        
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
                document.getElementById('rps-winner').style.color = '#38A169';
            } else if (result === 'computer') {
                message = getRandomMessage(gameResultMessages.lose);
                document.getElementById('rps-winner').style.color = '#E53E3E';
            } else {
                score += 5;
                message = getRandomMessage(gameResultMessages.tie);
                document.getElementById('rps-winner').style.color = '#3182CE';
            }
            
            document.getElementById('rps-winner').textContent = message;
            rounds++;
            
            // Actualizar puntuación
            document.getElementById('rps-score').textContent = `Puntuación: ${score} | Ronda: ${rounds}/5`;
            
            // Mostrar resultado
            document.getElementById('rps-result').style.display = 'block';
            
            // Si ha jugado 5 rondas, terminar
            if (rounds >= 5) {
                // Dar experiencia basada en la puntuación
                addExperience(score);
                
                // Mostrar mensaje según puntuación
                let finalMessage = '';
                if (score >= 40) {
                    finalMessage = "¡Increíble! Has ganado la mayoría de las rondas.";
                } else if (score >= 25) {
                    finalMessage = "¡Buen juego! La próxima vez te irá aún mejor.";
                } else {
                    finalMessage = "No te preocupes, sigue practicando. ¡Te quiero igual!";
                }
                
                document.getElementById('rps-message').textContent = finalMessage;
                
                // Ocultar opciones
                const optionsDiv = gameContainer.querySelector('div');
                if (optionsDiv) {
                    optionsDiv.style.display = 'none';
                }
                
                // Cambiar texto del botón
                document.getElementById('close-rps').textContent = 'Cerrar y Continuar';
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
 // FLAPPY RABBIT IMPLEMENTACIÓN
function playFlappyRabbit() {
    console.log("Iniciando Flappy Rabbit");

    // Crear contenedor del juego
    const gameContainer = document.createElement('div');
    gameContainer.id = 'flappy-game-container';
    gameContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: linear-gradient(to bottom, #87CEEB 0%, #98E4FF 100%);
        z-index: 1000;
        overflow: hidden;
    `;

    // Añadir elementos del juego, usando icon.png como sprite
    gameContainer.innerHTML = `
        <div id="flappy-game" style="
            width: 100vw;
            height: 100vh;
            position: relative;
            overflow: hidden;
        ">
            <div id="flappy-score" style="
                position: absolute;
                top: 30px;
                left: 50%;
                transform: translateX(-50%);
                font-size: 40px;
                font-weight: bold;
                color: white;
                text-shadow: 3px 3px 6px rgba(0,0,0,0.5);
                z-index: 10;
                font-family: Arial, sans-serif;
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
                border-radius: 50%;
                box-shadow: 0 0 10px rgba(255,255,255,0.5);
                transition: transform 0.1s ease;
            "></div>
            <div id="flappy-start-message" style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 24px;
                color: white;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.7);
                background-color: rgba(0, 0, 0, 0.4);
                padding: 15px 25px;
                border-radius: 15px;
                border: 2px solid white;
                text-align: center;
                max-width: 80%;
            ">Toca en cualquier lugar para saltar<br><small>¡Evita los obstáculos!</small></div>
        </div>
    `;

    // Botón cerrar flotante
    const closeBtn = document.createElement('button');
    closeBtn.id = 'close-flappy';
    closeBtn.innerText = 'Cerrar Juego';
    closeBtn.style.position = 'fixed';
    closeBtn.style.bottom = '30px';
    closeBtn.style.left = '50%';
    closeBtn.style.transform = 'translateX(-50%)';
    closeBtn.style.background = 'rgba(255,255,255,0.96)';
    closeBtn.style.border = 'none';
    closeBtn.style.padding = '16px 32px';
    closeBtn.style.borderRadius = '30px';
    closeBtn.style.fontWeight = 'bold';
    closeBtn.style.fontSize = '18px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.zIndex = '10000';
    closeBtn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.25)';
    gameContainer.appendChild(closeBtn);
    document.body.appendChild(gameContainer);
    document.body.style.overflow = 'hidden';

    // Ajusta la física para hacerlo más rápido y divertido
    let gravity = 1.8;
    let velocity = 0;
    let jumpPower = -18;
    let pipeSpeed = 7;
    let rabbitPosition = window.innerHeight / 2;
    let pipes = [];
    let animationFrame;
    let lastPipeTime = 0;
    let gameStarted = false;
    let gameOver = false;
    let score = 0;

    const rabbit = document.getElementById('flappy-rabbit');
    const scoreElement = document.getElementById('flappy-score');
    const startMessage = document.getElementById('flappy-start-message');
    const gameBoard = document.getElementById('flappy-game');

    // SALTO ÚNICO (sin doble salto en móvil)
    let lastJumpTime = 0;
    function jump(e) {
        // Evita doble salto causado por 'touchstart' + 'click'
        const now = Date.now();
        if (now - lastJumpTime < 300) return; // 300ms de margen para evitar doble salto
        lastJumpTime = now;

        if (e.target && e.target.id === 'close-flappy') return;
        if (!gameStarted) {
            gameStarted = true;
            startMessage.style.display = 'none';
            startGame();
        }
        if (!gameOver) {
            velocity = jumpPower;
            if (rabbit) {
                rabbit.style.transform = 'translateY(-50%) rotate(-20deg)';
                setTimeout(() => {
                    if (rabbit) rabbit.style.transform = 'translateY(-50%) rotate(0deg)';
                }, 200);
            }
        }
    }
    // Listeners
    gameContainer.addEventListener('touchstart', jump, {passive: false});
    gameContainer.addEventListener('click', jump);

    // Cerrar juego
    function closeGame() {
        cancelAnimationFrame(animationFrame);
        if (document.body.contains(gameContainer)) {
            document.body.removeChild(gameContainer);
        }
        document.body.style.overflow = '';
        gameState.isPlaying = false;
        finishPlaying(true);
    }
    closeBtn.addEventListener('click', closeGame);
    closeBtn.addEventListener('touchend', function(e) {
        e.preventDefault();
        closeGame();
    });

    // Prevenir scroll en móviles (solo fuera del álbum)
    gameContainer.addEventListener('touchmove', function(e) {
        let el = e.target;
        while (el) {
            if (el.id === 'album-content') return;
            el = el.parentElement;
        }
        e.preventDefault();
    }, { passive: false });

    // Bucle principal del juego y resto de lógica...
    function startGame() {
        gameLoop();
    }

    function gameLoop() {
        if (gameOver) return;
        velocity += gravity;
        rabbitPosition += velocity;

        // Limitar posición del conejo dentro del gameBoard
        const boardHeight = gameBoard.offsetHeight || window.innerHeight;
        rabbitPosition = Math.max(25, Math.min(boardHeight - 75, rabbitPosition));
        if (rabbit) rabbit.style.top = rabbitPosition + 'px';

        // Colisión con bordes
        if (rabbitPosition <= 25 || rabbitPosition >= boardHeight - 75) {
            endGame();
            return;
        }

        // Crear nuevos obstáculos
        const currentTime = Date.now();
        if (currentTime - lastPipeTime > 1600) {
            createPipe();
            lastPipeTime = currentTime;
        }

        // Actualizar y comprobar obstáculos
        for (let i = pipes.length - 1; i >= 0; i--) {
            const pipe = pipes[i];
            pipe.x -= pipeSpeed;
            const pipeTopElement = document.getElementById(`${pipe.id}-top`);
            const pipeBottomElement = document.getElementById(`${pipe.id}-bottom`);

            if (pipeTopElement && pipeBottomElement) {
                pipeTopElement.style.left = pipe.x + 'px';
                pipeBottomElement.style.left = pipe.x + 'px';

                // Colisión exacta relativa al gameBoard
                const rabbitRect = rabbit.getBoundingClientRect();
                const pipeTopRect = pipeTopElement.getBoundingClientRect();
                const pipeBottomRect = pipeBottomElement.getBoundingClientRect();
                const gameRect = gameBoard.getBoundingClientRect();

                const relRabbit = {
                    left: rabbitRect.left - gameRect.left,
                    right: rabbitRect.right - gameRect.left,
                    top: rabbitRect.top - gameRect.top,
                    bottom: rabbitRect.bottom - gameRect.top
                };
                const relPipeTop = {
                    left: pipeTopRect.left - gameRect.left,
                    right: pipeTopRect.right - gameRect.left,
                    top: pipeTopRect.top - gameRect.top,
                    bottom: pipeTopRect.bottom - gameRect.top
                };
                const relPipeBottom = {
                    left: pipeBottomRect.left - gameRect.left,
                    right: pipeBottomRect.right - gameRect.left,
                    top: pipeBottomRect.top - gameRect.top,
                    bottom: pipeBottomRect.bottom - gameRect.top
                };

                if (
                    (relRabbit.right > relPipeTop.left &&
                    relRabbit.left < relPipeTop.right &&
                    relRabbit.top < relPipeTop.bottom) ||
                    (relRabbit.right > relPipeBottom.left &&
                    relRabbit.left < relPipeBottom.right &&
                    relRabbit.bottom > relPipeBottom.top)
                ) {
                    endGame();
                    return;
                }

                if (!pipe.passed && pipe.x + 60 < relRabbit.left) {
                    pipe.passed = true;
                    score++;
                    scoreElement.textContent = score;
                    scoreElement.style.transform = 'scale(1.2)';
                    setTimeout(() => { scoreElement.style.transform = 'scale(1)'; }, 200);
                }
            }

            if (pipe.x < -80) {
                if (pipeTopElement) pipeTopElement.remove();
                if (pipeBottomElement) pipeBottomElement.remove();
                pipes.splice(i, 1);
            }
        }

        if (!gameOver) {
            animationFrame = requestAnimationFrame(gameLoop);
        }
    }

    // Crear obstáculo
    function createPipe() {
        const pipeId = 'pipe-' + Date.now();
        const gapHeight = 170;
        const minHeight = 60;
        const maxHeight = (gameBoard.offsetHeight || window.innerHeight) - gapHeight - minHeight;
        const pipeTop = Math.floor(Math.random() * (maxHeight - minHeight)) + minHeight;

        // Tubería superior
        const pipeTopElement = document.createElement('div');
        pipeTopElement.id = `${pipeId}-top`;
        pipeTopElement.style.cssText = `
            position: absolute;
            width: 60px;
            height: ${pipeTop}px;
            left: ${window.innerWidth}px;
            top: 0;
            background: linear-gradient(to right, #4CAF50, #45A049);
            border: 3px solid #2E7D32;
            border-radius: 0 0 8px 8px;
            box-shadow: inset 0 0 10px rgba(255,255,255,0.2);
        `;

        // Tubería inferior
        const pipeBottomElement = document.createElement('div');
        pipeBottomElement.id = `${pipeId}-bottom`;
        pipeBottomElement.style.cssText = `
            position: absolute;
            width: 60px;
            height: ${(gameBoard.offsetHeight || window.innerHeight) - pipeTop - gapHeight}px;
            left: ${window.innerWidth}px;
            bottom: 0;
            background: linear-gradient(to right, #4CAF50, #45A049);
            border: 3px solid #2E7D32;
            border-radius: 8px 8px 0 0;
            box-shadow: inset 0 0 10px rgba(255,255,255,0.2);
        `;

        gameBoard.appendChild(pipeTopElement);
        gameBoard.appendChild(pipeBottomElement);

        pipes.push({
            id: pipeId,
            x: window.innerWidth,
            passed: false
        });
    }

    // Fin del juego
    function endGame() {
        gameOver = true;
        cancelAnimationFrame(animationFrame);

        // Mostrar mensaje de fin
        startMessage.innerHTML = `
            <div style="text-align: center;">
                <h3 style="margin-bottom: 10px;">¡Juego terminado!</h3>
                <p style="font-size: 20px; margin-bottom: 10px;">Puntuación: <strong>${score}</strong></p>
                <p style="font-size: 14px;">¡Has ganado ${score * 5} puntos de experiencia!</p>
                <button id="flappy-exit-btn" style="
                    margin-top: 18px; padding: 12px 30px;
                    background: #f44336; border: none; border-radius: 22px;
                    color: white; font-weight: bold; cursor: pointer; font-size: 16px;
                    box-shadow: 0 3px 8px rgba(0,0,0,0.1);
                ">Cerrar</button>
            </div>
        `;

        // Solo una vez el exitBtn:
        const exitBtn = document.getElementById('flappy-exit-btn');
        if (exitBtn) exitBtn.addEventListener('click', closeGame);

        // Añadir experiencia basada en la puntuación
        const expGained = score * 5;
        addExperience(expGained);

        // También permitir cerrar con el botón principal si sigue visible
        if (closeBtn) {
            closeBtn.addEventListener('click', closeGame);
            closeBtn.addEventListener('touchend', function(e) {
                e.preventDefault();
                closeGame();
            });
        }
    }
}
// tamagotchi-fixed.js - PARTE 6: Juego Snake
console.log("Cargando PARTE 6 - Juego Snake...");

// Juego de Snake
function playSnakeGame() {
    console.log("Iniciando juego de Snake");
    
    // Crear contenedor del juego
    const gameContainer = document.createElement('div');
    gameContainer.id = 'snake-game-container';
    gameContainer.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #4CAF50 0%, #45A049 100%);
        padding: 25px;
        border-radius: 20px;
        box-shadow: 0 8px 25px rgba(0,0,0,0.3);
        z-index: 1000;
        max-width: 90%;
        max-height: 90vh;
        overflow: hidden;
        text-align: center;
        border: 3px solid #2E7D32;
        animation: slideInFromTop 0.4s ease-out;
    `;
    
    // Crear HTML del juego
    const gameHTML = `
        <h2 style="color: white; margin-bottom: 15px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">Juego de Serpiente</h2>
        <p style="margin-bottom: 20px; color: white; font-weight: bold;">Usa los controles para mover la serpiente</p>
        <div id="snake-game-board" style="
            width: 300px;
            height: 300px;
            border: 3px solid white;
            background: linear-gradient(45deg, #E8F5E8 0%, #F1F8E9 100%);
            position: relative;
            margin: 0 auto 20px;
            border-radius: 10px;
            box-shadow: inset 0 0 20px rgba(0,0,0,0.1);
        "></div>
        <div id="snake-score" style="
            margin-bottom: 15px; 
            color: white; 
            font-size: 18px; 
            font-weight: bold;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
        ">Puntuación: 0</div>
        
        <!-- Controles táctiles -->
        <div style="margin-bottom: 20px;">
            <div style="display: flex; justify-content: center; margin-bottom: 5px;">
                <button id="snake-up" class="snake-control" style="
                    width: 60px;
                    height: 60px;
                    background: rgba(255,255,255,0.9);
                    border: 2px solid #2E7D32;
                    border-radius: 12px;
                    color: #2E7D32;
                    font-size: 24px;
                    margin: 3px;
                    cursor: pointer;
                    font-weight: bold;
                    transition: all 0.2s ease;
                    box-shadow: 0 3px 6px rgba(0,0,0,0.2);
                ">↑</button>
            </div>
            <div style="display: flex; justify-content: center;">
                <button id="snake-left" class="snake-control" style="
                    width: 60px;
                    height: 60px;
                    background: rgba(255,255,255,0.9);
                    border: 2px solid #2E7D32;
                    border-radius: 12px;
                    color: #2E7D32;
                    font-size: 24px;
                    margin: 3px;
                    cursor: pointer;
                    font-weight: bold;
                    transition: all 0.2s ease;
                    box-shadow: 0 3px 6px rgba(0,0,0,0.2);
                ">←</button>
                <button id="snake-down" class="snake-control" style="
                    width: 60px;
                    height: 60px;
                    background: rgba(255,255,255,0.9);
                    border: 2px solid #2E7D32;
                    border-radius: 12px;
                    color: #2E7D32;
                    font-size: 24px;
                    margin: 3px;
                    cursor: pointer;
                    font-weight: bold;
                    transition: all 0.2s ease;
                    box-shadow: 0 3px 6px rgba(0,0,0,0.2);
                ">↓</button>
                <button id="snake-right" class="snake-control" style="
                    width: 60px;
                    height: 60px;
                    background: rgba(255,255,255,0.9);
                    border: 2px solid #2E7D32;
                    border-radius: 12px;
                    color: #2E7D32;
                    font-size: 24px;
                    margin: 3px;
                    cursor: pointer;
                    font-weight: bold;
                    transition: all 0.2s ease;
                    box-shadow: 0 3px 6px rgba(0,0,0,0.2);
                ">→</button>
            </div>
        </div>
        
        <button id="close-snake" style="
            padding: 12px 24px;
            background-color: #f44336;
            border: none;
            border-radius: 25px;
            color: white;
            cursor: pointer;
            font-weight: bold;
            margin-top: 10px;
            transition: all 0.2s ease;
            box-shadow: 0 3px 6px rgba(0,0,0,0.2);
        ">Terminar Juego</button>
    `;
    
    gameContainer.innerHTML = gameHTML;
    document.body.appendChild(gameContainer);
    
    // Variables del juego
    const board = document.getElementById('snake-game-board');
    const scoreDisplay = document.getElementById('snake-score');
    const closeButton = document.getElementById('close-snake');
    
    const gridSize = 15; // 15x15 grid
    const cellSize = 300 / gridSize; // 20px por celda
    let snake = [{x: 7, y: 7}]; // Posición inicial en el centro
    let direction = 'right';
    let food = generateFood();
    let score = 0;
    let gameRunning = true;
    let gameInterval;
    
    // Añadir efectos hover a los controles
    const controls = gameContainer.querySelectorAll('.snake-control');
    controls.forEach(control => {
        control.addEventListener('mouseenter', function() {
            this.style.background = '#81C784';
            this.style.color = 'white';
            this.style.transform = 'scale(1.05)';
        });
        
        control.addEventListener('mouseleave', function() {
            this.style.background = 'rgba(255,255,255,0.9)';
            this.style.color = '#2E7D32';
            this.style.transform = 'scale(1)';
        });
    });
    
    // Event listener para cerrar el juego
    closeButton.addEventListener('click', () => {
        console.log("Cerrando Snake");
        clearInterval(gameInterval);
        document.removeEventListener('keydown', handleKeyPress);
        document.body.removeChild(gameContainer);
        
        // Dar experiencia según puntuación
        addExperience(score * 3);
        
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
    
    // Event listener para controlar con teclado
    function handleKeyPress(e) {
        if (!gameRunning) return;
        
        switch(e.key) {
            case 'ArrowUp':
                e.preventDefault();
                if (direction !== 'down') direction = 'up';
                break;
            case 'ArrowDown':
                e.preventDefault();
                if (direction !== 'up') direction = 'down';
                break;
            case 'ArrowLeft':
                e.preventDefault();
                if (direction !== 'right') direction = 'left';
                break;
            case 'ArrowRight':
                e.preventDefault();
                if (direction !== 'left') direction = 'right';
                break;
        }
    }
    
    document.addEventListener('keydown', handleKeyPress);
    
    // Función para generar comida en posición aleatoria
    function generateFood() {
        let food;
        do {
            food = {
                x: Math.floor(Math.random() * gridSize),
                y: Math.floor(Math.random() * gridSize)
            };
        } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
        
        return food;
    }
    
    // Función para dibujar el juego
    function draw() {
        // Limpiar el tablero
        board.innerHTML = '';
        
        // Dibujar serpiente
        snake.forEach((segment, index) => {
            const snakeElement = document.createElement('div');
            snakeElement.style.cssText = `
                position: absolute;
                width: ${cellSize}px;
                height: ${cellSize}px;
                background-color: ${index === 0 ? '#2E7D32' : '#4CAF50'};
                border: 1px solid ${index === 0 ? '#1B5E20' : '#388E3C'};
                left: ${segment.x * cellSize}px;
                top: ${segment.y * cellSize}px;
                border-radius: ${index === 0 ? '50%' : '3px'};
                box-shadow: ${index === 0 ? '0 0 8px rgba(46, 125, 50, 0.6)' : 'none'};
                transition: all 0.1s ease;
            `;
            board.appendChild(snakeElement);
        });
        
        // Dibujar comida
        const foodElement = document.createElement('div');
        foodElement.style.cssText = `
            position: absolute;
            width: ${cellSize}px;
            height: ${cellSize}px;
            background: radial-gradient(circle, #FF5722, #D84315);
            border-radius: 50%;
            left: ${food.x * cellSize}px;
            top: ${food.y * cellSize}px;
            box-shadow: 0 0 10px rgba(255, 87, 34, 0.6);
            animation: foodPulse 1s ease-in-out infinite alternate;
        `;
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
        for (let segment of snake) {
            if (segment.x === head.x && segment.y === head.y) {
                gameOver();
                return;
            }
        }
        
        // Añadir nueva cabeza
        snake.unshift(head);
        
        // Comprobar si come
        if (head.x === food.x && head.y === food.y) {
            // No eliminar el último segmento (la serpiente crece)
            score++;
            scoreDisplay.textContent = `Puntuación: ${score}`;
            
            // Generar nueva comida
            food = generateFood();
            
            // Efecto visual al conseguir punto
            scoreDisplay.style.transform = 'scale(1.2)';
            setTimeout(() => {
                scoreDisplay.style.transform = 'scale(1)';
            }, 200);
        } else {
            // Eliminar último segmento (la serpiente se mueve)
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
        gameOverMessage.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 25px;
            border-radius: 15px;
            text-align: center;
            z-index: 10;
            border: 2px solid #f44336;
            box-shadow: 0 4px 15px rgba(0,0,0,0.5);
        `;
        gameOverMessage.innerHTML = `
            <h3 style="margin-bottom: 10px; color: #f44336;">¡Juego terminado!</h3>
            <p style="font-size: 18px; margin-bottom: 10px;">Tu puntuación: <strong>${score}</strong></p>
            <p style="font-size: 14px;">¡Has ganado <strong>${score * 3}</strong> puntos de experiencia!</p>
        `;
        board.appendChild(gameOverMessage);
        
        // Dar experiencia según puntuación
        addExperience(score * 3);
        
        console.log("Snake terminado, puntuación:", score);
    }
    
    // Añadir animación CSS para la comida
    const style = document.createElement('style');
    style.textContent = `
        @keyframes foodPulse {
            0% { transform: scale(1); }
            100% { transform: scale(1.1); }
        }
    `;
    document.head.appendChild(style);
    
    // Iniciar el juego
    console.log("Iniciando Snake game loop");
    draw();
    gameInterval = setInterval(update, 200); // Velocidad del juego
}
// tamagotchi-fixed.js - PARTE 7: Álbum de Fotos y Sistema de Guardado
console.log("Cargando PARTE 7 - Álbum de Fotos y Sistema de Guardado...");

// Mostrar álbum de fotos
function showPhotoAlbum() {
    console.log("Mostrando álbum de fotos");
    
    // Bloquear scroll de fondo
    document.body.style.overflow = 'hidden';
    
    // Crear álbum
    const album = document.createElement('div');
    album.id = 'album-modal'; // Asegúrate de usar este id para el cierre
    album.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0,0,0,0.7);
        z-index: 1100;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    `;

    // Contador de desbloqueos
    const unlockedCount = REWARDS_SYSTEM.unlockedImages.length;
    const totalCount = REWARDS_SYSTEM.availableImages.length;
    
    // Construir el HTML del álbum (SOLO UNA VEZ)
    let albumHTML = `
      <div id="album-content" style="
          width: 90%;
          max-width: 400px;
          max-height: 70vh;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          background: white;
          border-radius: 20px;
          padding: 20px;
          position: relative;
      ">
        <button id="close-album" style="position:absolute;top:15px;right:20px;font-size:22px;background:none;border:none;cursor:pointer;">✖</button>
        <h2 style="color: #E53E3E; margin-bottom: 8px;">Nuestro Álbum de Recuerdos</h2>
        <p style="color: #333; font-weight: bold;">
          Has desbloqueado ${unlockedCount} de ${totalCount} recuerdos
        </p>
        <div style="
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
            gap: 12px;
            margin-bottom: 20px;
        ">
    `;
    REWARDS_SYSTEM.availableImages.forEach((img) => {
        const isUnlocked = REWARDS_SYSTEM.unlockedImages.includes(img.id);
        
        albumHTML += `
            <div style="
                border-radius: 15px;
                padding: 15px;
                background-color: ${isUnlocked ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.7)'};
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                transition: transform 0.3s ease;
                border: 2px solid ${isUnlocked ? '#4CAF50' : '#ccc'};
            " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
        `;
        
        if (isUnlocked) {
            albumHTML += `
                <img src="${img.url}" alt="${img.name}" style="width:100%;max-height:100px;object-fit:cover;border-radius:10px;margin-bottom:7px;">
                <div style="font-weight:bold;color:#2E7D32;margin-bottom:3px;">${img.name}</div>
                <div style="font-size:12px;color:#666;">✓ Desbloqueado</div>
            `;
        } else {
            albumHTML += `
                <div style="
                    width: 100%;
                    height: 120px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 50px;
                    background: linear-gradient(45deg, #ddd, #f0f0f0);
                    border-radius: 10px;
                    border: 2px dashed #999;
                    margin-bottom: 10px;
                ">🔒</div>
                <p style="font-weight: bold; color: #666; margin-bottom: 5px;">${img.name}</p>
                <p style="font-size: 12px; color: #E53E3E;">Necesitas ${img.exp} exp</p>
                <div style="
                    width: 100%;
                    height: 6px;
                    background: #eee;
                    border-radius: 3px;
                    overflow: hidden;
                    margin-top: 5px;
                ">
                    <div style="
                        width: ${Math.min(100, (REWARDS_SYSTEM.experience / img.exp) * 100)}%;
                        height: 100%;
                        background: linear-gradient(to right, #FFE66D, #FF6B6B);
                        border-radius: 3px;
                        transition: width 0.3s ease;
                    "></div>
                </div>
            `;
        }
        
        albumHTML += `</div>`;
    });
    
    // Cerrar grid y añadir información adicional
    albumHTML += `
        </div>
        <div style="
            background: rgba(255,255,255,0.93);
            padding: 12px;
            border-radius: 10px;
            margin-bottom: 5px;
            border: 2px solid #87CEEB;
        ">
            <span style="color: #333; font-weight: bold;">
                Experiencia actual: ${REWARDS_SYSTEM.experience} puntos
            </span>
            <br>
            <span style="color: #666; font-size: 13px;">
                ¡Sigue jugando para desbloquear más recuerdos especiales!
            </span>
        </div>
      </div>
    `;
    
    album.innerHTML = albumHTML;
    document.body.appendChild(album);

    // Permitir scroll sólo dentro del álbum en móvil
    const albumContent = album.querySelector('#album-content');
    if (albumContent) {
        albumContent.addEventListener('touchmove', function(e) {
            e.stopPropagation();
        }, { passive: false });
    }

    document.getElementById('close-album').addEventListener('click', function() {
        album.remove();
        document.body.style.overflow = ''; // Restaurar scroll del body
        finishPlaying(true);
    });
    console.log("Álbum de fotos mostrado exitosamente");
}

// Mostrar notificación de desbloqueo de imagen
function showUnlockNotification(image) {
    console.log("Mostrando notificación de desbloqueo para:", image.name);
    
    // Crear elemento para la notificación
    const notification = document.createElement('div');
    notification.className = 'unlock-notification';
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
        padding: 25px;
        border-radius: 20px;
        box-shadow: 0 8px 25px rgba(0,0,0,0.4);
        z-index: 1001;
        max-width: 85vw;
        text-align: center;
        border: 3px solid #FF8C00;
        animation: unlockBounce 0.6s ease-out;
    `;
    
    // Contenido de la notificación
    notification.innerHTML = `
        <div style="color: white; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
            <h2 style="margin-bottom: 15px; font-size: 24px;">🎉 ¡Recuerdo Desbloqueado! 🎉</h2>
            <p style="margin-bottom: 20px; font-size: 18px; font-weight: bold;">${image.name}</p>
            <div style="margin-bottom: 20px;">
                <div style="
                    width: 120px;
                    height: 120px;
                    background: linear-gradient(45deg, #87CEEB, #98E4FF);
                    border-radius: 15px;
                    margin: 0 auto;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 60px;
                    border: 3px solid white;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                ">📷</div>
            </div>
            <div style="display: flex; justify-content: center; gap: 10px;">
                <button id="view-album" style="
                    background: linear-gradient(45deg, #4CAF50, #45A049);
                    border: none;
                    padding: 10px 20px;
                    border-radius: 20px;
                    color: white;
                    cursor: pointer;
                    font-weight: bold;
                    transition: all 0.3s ease;
                    box-shadow: 0 3px 6px rgba(0,0,0,0.2);
                ">Ver Álbum Completo</button>
                <button id="close-notification" style="
                    background: linear-gradient(45deg, #f44336, #d32f2f);
                    border: none;
                    padding: 10px 20px;
                    border-radius: 20px;
                    color: white;
                    cursor: pointer;
                    font-weight: bold;
                    transition: all 0.3s ease;
                    box-shadow: 0 3px 6px rgba(0,0,0,0.2);
                ">Continuar</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Añadir animación CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes unlockBounce {
            0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
            60% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.8; }
            100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    // Manejar eventos de botones
    document.getElementById('close-notification').addEventListener('click', () => {
        document.body.removeChild(notification);
        document.head.removeChild(style);
    });
    
    document.getElementById('view-album').addEventListener('click', () => {
        document.body.removeChild(notification);
        document.head.removeChild(style);
        showPhotoAlbum();
    });
}

// Guardar el estado de recompensas
function saveRewardsState() {
    const rewardsToSave = {
        experience: REWARDS_SYSTEM.experience,
        level: REWARDS_SYSTEM.level,
        unlockedImages: REWARDS_SYSTEM.unlockedImages
    };
    
    localStorage.setItem('rachelTamagotchiRewards', JSON.stringify(rewardsToSave));
    console.log("Estado de recompensas guardado:", rewardsToSave);
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
    
    console.log("Valores actualizados - H:", gameState.hunger, "F:", gameState.happiness, "E:", gameState.energy);
}

// Guardar el estado del juego
function saveGameState() {
    const stateToSave = {
        ...gameState,
        lastUpdate: Date.now()
    };
    
    localStorage.setItem('rachelTamagotchiState', JSON.stringify(stateToSave));
    console.log("Estado del juego guardado");
}

// Verificar fechas especiales
function checkSpecialDates() {
    const today = new Date();
    const month = today.getMonth() + 1; // Los meses en JS van de 0-11
    const day = today.getDate();
    
    const dateKey = `${month}-${day}`;
    
    if (anniversaryMessages[dateKey]) {
        console.log("Fecha especial detectada:", dateKey);
        // Mostrar mensaje de fecha especial
        setTimeout(() => {
            showMessage(`${anniversaryMessages[dateKey].title} ${anniversaryMessages[dateKey].message}`, 8000);
        }, 2000);
    }
}

// Función para simular tiempo transcurrido mientras estaba ausente
function simulateTimeElapsed(timeDiff) {
    console.log("Simulando tiempo transcurrido:", timeDiff, "ms");
    
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
    
    console.log("Simulación completada - H:", gameState.hunger, "F:", gameState.happiness, "E:", gameState.energy);
}
// tamagotchi-fixed.js - PARTE 8: Inicialización y Event Listeners
console.log("Cargando PARTE 8 - Inicialización y Event Listeners...");

// Función para cargar el estado guardado
function loadGameState() {
    console.log("Cargando estado guardado del juego");
    
    // Cargar estado normal del juego
    const savedState = localStorage.getItem('rachelTamagotchiState');
    
    if (savedState) {
        try {
            const parsedState = JSON.parse(savedState);
            
            // Calcular tiempo transcurrido desde la última actualización
            const currentTime = Date.now();
            const timeDiff = currentTime - parsedState.lastUpdate;
            
            console.log("Tiempo transcurrido desde última sesión:", timeDiff, "ms");
            
            // Actualizar estado con valores guardados
            gameState = {
                ...parsedState,
                lastUpdate: currentTime
            };
            
            // Si pasó mucho tiempo (más de 8 horas), aplicar simulación del tiempo
            if (timeDiff > 8 * 60 * 60 * 1000) {
                console.log("Aplicando simulación de tiempo por ausencia prolongada");
                simulateTimeElapsed(timeDiff);
            }
            
            console.log("Estado cargado exitosamente:", gameState);
            
        } catch (e) {
            console.error("Error al cargar el estado guardado:", e);
            // Usar valores por defecto si hay un error
            resetGameState();
        }
    } else {
        console.log("No se encontró estado guardado, usando valores iniciales");
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
            console.log("Recompensas cargadas:", parsedRewards);
        } catch (e) {
            console.error("Error al cargar recompensas:", e);
        }
    }

    // --- AQUI SIEMPRE RESETEA EL ESTADO DE JUEGO ---
    gameState.isPlaying = false;
}

// Función para reiniciar el estado del juego
function resetGameState() {
    console.log("Reiniciando estado del juego a valores iniciales");
    
    gameState.hunger = CONFIG.initialHunger;
    gameState.happiness = CONFIG.initialHappiness;
    gameState.energy = CONFIG.initialEnergy;
    gameState.isSleeping = false;
    gameState.isPlaying = false;
    gameState.isEating = false;
    
    // Mostrar estado normal
    changeSprite(PET_STATES.NORMAL);
    
    // Mostrar mensaje de bienvenida
    setTimeout(() => {
        showMessage("¡Hola! Soy Rachel Bunny, tu conejo virtual. ¡Cuídame bien!", 4000);
    }, 1000);
}

// FUNCIÓN CORREGIDA: Configurar los event listeners para los botones
function setupEventListeners() {
    console.log("Configurando event listeners de los botones");

    try {
        // Referencias a los botones
        let feedBtn = document.getElementById('feed-btn');
        let playBtn = document.getElementById('play-btn');
        let sleepBtn = document.getElementById('sleep-btn');
        let specialBtn = document.getElementById('special-btn');

        // Verificar que todos los botones existen
        if (!feedBtn || !playBtn || !sleepBtn || !specialBtn) {
            console.error("Error: No se encontraron todos los botones necesarios");
            console.log("Botones encontrados:", {
                feed: !!feedBtn,
                play: !!playBtn,
                sleep: !!sleepBtn,
                special: !!specialBtn
            });
            return;
        }

        // --- ELIMINAR LISTENERS ANTERIORES mediante clonado y volver a asignar referencias ---
        feedBtn.replaceWith(feedBtn.cloneNode(true));
        playBtn.replaceWith(playBtn.cloneNode(true));
        sleepBtn.replaceWith(sleepBtn.cloneNode(true));
        specialBtn.replaceWith(specialBtn.cloneNode(true));

        // Volver a obtener las referencias a los nuevos botones
        feedBtn = document.getElementById('feed-btn');
        playBtn = document.getElementById('play-btn');
        sleepBtn = document.getElementById('sleep-btn');
        specialBtn = document.getElementById('special-btn');

        // Asignar event listeners SIN duplicados
        feedBtn.addEventListener('click', feedPet);
        playBtn.addEventListener('click', playWithPet);
        sleepBtn.addEventListener('click', toggleSleep);
        specialBtn.addEventListener('click', showSpecialMessage);

        console.log("Event listeners configurados exitosamente");

    } catch (error) {
        console.error("Error al configurar event listeners:", error);
    }
}
// FUNCIÓN CORREGIDA: Inicializar el juego
function initGame() {
    console.log("=== INICIANDO TAMAGOTCHI RACHEL ===");
    
    try {
        // Obtener referencias a elementos del DOM
        console.log("Obteniendo referencias del DOM...");
        hungerBar = document.getElementById('hunger-bar');
        happinessBar = document.getElementById('happiness-bar');
        energyBar = document.getElementById('energy-bar');
        petSprite = document.getElementById('pet-sprite');
        messageBubble = document.getElementById('message-bubble');
        levelDisplay = document.getElementById('experience-text');
        
        // Verificar que todos los elementos existen
        if (!hungerBar || !happinessBar || !energyBar || !petSprite || !messageBubble) {
            console.error("Error crítico: No se encontraron elementos esenciales del DOM");
            console.log("Elementos encontrados:", {
                hungerBar: !!hungerBar,
                happinessBar: !!happinessBar,
                energyBar: !!energyBar,
                petSprite: !!petSprite,
                messageBubble: !!messageBubble,
                levelDisplay: !!levelDisplay
            });
            return;
        }
        
        console.log("Elementos del DOM obtenidos exitosamente");
        
        // Cargar estado guardado
        loadGameState();
        
        // Asegurarse de que el estado visual sea correcto
        if (gameState.isSleeping) {
            changeSprite(PET_STATES.SLEEPING);
            
            // Actualizar texto del botón de dormir
            const sleepButton = document.getElementById('sleep-btn');
            if (sleepButton) {
                const btnText = sleepButton.querySelector('.btn-text');
                const btnIcon = sleepButton.querySelector('.btn-icon');
                
                if (btnText) btnText.textContent = 'Despertar con besitos';
                if (btnIcon) btnIcon.textContent = '🌞';
            }
        } else if (gameState.hunger <= CONFIG.sadThreshold || 
                  gameState.happiness <= CONFIG.sadThreshold || 
                  gameState.energy <= CONFIG.sadThreshold) {
            changeSprite(PET_STATES.SAD);
        } else {
            changeSprite(PET_STATES.NORMAL);
        }
        
        // Actualizar barras de estado
        updateStatusBars();
        
        // Configurar event listeners
        setupEventListeners();
        
        // Iniciar temporizador para disminuir valores
        console.log("Iniciando temporizadores...");
        timers.decrease = setInterval(decreaseValues, CONFIG.decreaseInterval);
        
        // Iniciar temporizador para mensajes aleatorios
        timers.randomMessage = setInterval(() => {
            if (Math.random() < 0.3 && 
                !gameState.isEating && 
                !gameState.isPlaying && 
                !gameState.isSleeping &&
                messageBubble && 
                messageBubble.classList.contains('hidden')) {
                showMessage(getRandomMessage(randomMessages));
            }
        }, 45000); // Cada 45 segundos
        
        // Iniciar temporizador de auto-guardado
        timers.autoSave = setInterval(() => {
            saveGameState();
            saveRewardsState();
        }, CONFIG.autoSaveInterval);
        
        // Verificar si hay fechas especiales
        checkSpecialDates();
        
        // Mostrar mensaje de bienvenida después de un momento
        setTimeout(() => {
            if (!gameState.isSleeping) {
                showMessage("¡Hola! Estoy muy feliz de verte de nuevo. ¡Juguemos juntas!", 4000);
            }
        }, 2000);
        
        console.log("=== TAMAGOTCHI INICIALIZADO CORRECTAMENTE ===");
        
    } catch (error) {
        console.error("Error crítico durante la inicialización:", error);
        // Intentar una recuperación básica
        alert("Error al inicializar el juego. Por favor, recarga la página.");
    }
}

// Función de limpieza cuando se cierra la página
function cleanup() {
    console.log("Limpiando recursos antes de cerrar...");
    
    // Limpiar todos los temporizadores
    Object.values(timers).forEach(timer => {
        if (timer) clearInterval(timer);
    });
    
    // Guardar estado final
    saveGameState();
    saveRewardsState();
}

// Event listeners para el ciclo de vida de la página
window.addEventListener('beforeunload', cleanup);
window.addEventListener('pagehide', cleanup);

// Función para debugging - solo para desarrollo
function debugInfo() {
    console.log("=== DEBUG INFO ===");
    console.log("Game State:", gameState);
    console.log("Rewards System:", REWARDS_SYSTEM);
    console.log("Active Timers:", Object.keys(timers));
    console.log("DOM References:", {
        hungerBar: !!hungerBar,
        happinessBar: !!happinessBar,
        energyBar: !!energyBar,
        petSprite: !!petSprite,
        messageBubble: !!messageBubble,
        levelDisplay: !!levelDisplay
    });
    console.log("==================");
}

// Función para reiniciar todo (solo para desarrollo)
function resetAllData() {
    if (confirm('¿Estás seguro/a de querer reiniciar todo el progreso? Esta acción no se puede deshacer.')) {
        localStorage.removeItem('rachelTamagotchiState');
        localStorage.removeItem('rachelTamagotchiRewards');
        alert('¡Datos reiniciados! Recarga la página para ver los cambios.');
        location.reload();
    }
}

// Inicializar el juego cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM completamente cargado, iniciando el juego...");
    
    // Esperar un poco para asegurarse de que todo se ha cargado
    setTimeout(() => {
        initGame();
    }, 500);
});

// Hacer que debugInfo esté disponible globalmente para debugging
window.debugInfo = debugInfo;
window.resetAllData = resetAllData;

console.log("=== TAMAGOTCHI RACHEL - TODAS LAS PARTES CARGADAS ===");

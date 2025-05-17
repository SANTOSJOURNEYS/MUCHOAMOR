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
// Función de utilidad para garantizar que getRandomMessage funcione incluso si no está disponible globalmente
function safeGetRandomMessage(messageArray) {
    console.log("safeGetRandomMessage: Usando array:", messageArray ? messageArray.length : "no disponible");
    
    // Usar una función segura que verifique primero si está disponible
    if (typeof window.getRandomMessage === 'function' && Array.isArray(messageArray) && messageArray.length > 0) {
        console.log("safeGetRandomMessage: Usando window.getRandomMessage");
        return window.getRandomMessage(messageArray);
    } else if (typeof getRandomMessage === 'function' && Array.isArray(messageArray) && messageArray.length > 0) {
        console.log("safeGetRandomMessage: Usando getRandomMessage del scope actual");
        return getRandomMessage(messageArray);
    } else if (Array.isArray(messageArray) && messageArray.length > 0) {
        // Implementar la función localmente si no está disponible
        console.log("safeGetRandomMessage: Usando implementación local");
        const randomIndex = Math.floor(Math.random() * messageArray.length);
        return messageArray[randomIndex];
    }
    console.log("safeGetRandomMessage: Usando mensaje predeterminado");
    return "¡Hola Rachel!";
}
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

// Función para configurar los event listeners
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
                // Usar safeGetRandomMessage en lugar de getRandomMessage
                let message = safeGetRandomMessage(sadMessages);
                showMessage(message);
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
    
    // Usar safeGetRandomMessage en lugar de getRandomMessage
    let message = safeGetRandomMessage(feedMessages);
    showMessage(message);
    
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
        showMessage("Zzz... Estoy soñando contigo, lúego hablamoos...");
        return;
    }
    
    // No permitir jugar si tiene poca energía
    if (gameState.energy <= CONFIG.criticalThreshold) {
        showMessage("ESTOY LOW BATTERY, ¿NOS ECHAMOS UNA SIESTA EN EL SOFA?...");
        return;
    }
    
    // Mostrar selector de juegos
    selectGame();
    
    gameState.isPlaying = true;
    
    // Cambiar sprite a jugando mientras selecciona
    changeSprite(PET_STATES.PLAYING);
    
    // Volver al estado normal después de un tiempo si no se selecciona nada
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
    }, 30000); // 30 segundos para seleccionar
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
        
        // Usar safeGetRandomMessage en lugar de getRandomMessage
        let message = safeGetRandomMessage(sleepMessages);
        showMessage(message);
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
        // Usar safeGetRandomMessage en lugar de getRandomMessage
        let message = safeGetRandomMessage(randomMessages);
        showMessage(message);
    }
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

// Iniciar el juego cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', initGame);
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
    
    // Verificar si se desbloquean imágenes
    const unlockedNewImages = REWARDS_SYSTEM.availableImages.filter(img => 
        REWARDS_SYSTEM.experience >= img.exp && 
        !REWARDS_SYSTEM.unlockedImages.includes(img.id)
    );
    
    if (unlockedNewImages.length > 0) {
        // Añadir a la lista de desbloqueados
        unlockedNewImages.forEach(img => {
            REWARDS_SYSTEM.unlockedImages.push(img.id);
        });
        
        // Mostrar notificación de desbloqueo
        showUnlockNotification(unlockedNewImages[0]);
    }
    
    // Guardar el estado de experiencia y desbloqueos
    localStorage.setItem('rachelTamagotchiRewards', JSON.stringify(REWARDS_SYSTEM));
}

// Mostrar notificación de desbloqueo de imagen
function showUnlockNotification(image) {
    // Crear elemento para la notificación
    const notification = document.createElement('div');
    notification.className = 'unlock-notification';
    notification.innerHTML = `
        <h3>¡Has desbloqueado una foto SUPER GUAY!</h3>
        <p>${image.name}</p>
        <div class="unlock-image">
            <img src="${image.url}" alt="${image.name}">
        </div>
        <button id="view-album">Ver álbum</button>
        <button id="close-notification">Cerrar</button>
    `;
    
    // Estilos para la notificación
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

// Mostrar álbum de fotos
function showPhotoAlbum() {
    // Crear álbum
    const album = document.createElement('div');
    album.className = 'photo-album';
    
    // Titulo
    let albumHTML = '<h2>Nuestro Álbum de Aventuras</h2>';
    
    // Contador de desbloqueos
    const unlockedCount = REWARDS_SYSTEM.unlockedImages.length;
    const totalCount = REWARDS_SYSTEM.availableImages.length;
    albumHTML += `<p>Has desbloqueado ${unlockedCount} de ${totalCount} aventuras</p>`;
    albumHTML += '<div class="album-grid">';
    
    // Mostrar imágenes desbloqueadas
    REWARDS_SYSTEM.availableImages.forEach(img => {
        const isUnlocked = REWARDS_SYSTEM.unlockedImages.includes(img.id);
        albumHTML += `<div class="album-item ${isUnlocked ? 'unlocked' : 'locked'}">`;
        
        if (isUnlocked) {
            albumHTML += `<img src="${img.url}" alt="${img.name}">`;
            albumHTML += `<p>${img.name}</p>`;
        } else {
            albumHTML += `<div class="locked-image">🔒</div>`;
            albumHTML += `<p>Desbloquea con ${img.exp} de experiencia</p>`;
        }
        
        albumHTML += '</div>';
    });
    
    albumHTML += '</div>';
    albumHTML += '<button id="close-album">Cerrar Álbum</button>';
    
    // Añadir estilos
    const albumStyle = document.createElement('style');
    albumStyle.textContent = `
        .photo-album {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 100;
            width: 90vw;
            max-width: 500px;
            max-height: 80vh;
            overflow-y: auto;
            text-align: center;
        }
        .album-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin: 15px 0;
        }
        .album-item {
            border-radius: 10px;
            padding: 10px;
            background: #f0f0f0;
        }
        .album-item.unlocked {
            background: #e6f7ff;
        }
        .album-item img {
            width: 100%;
            height: auto;
            border-radius: 8px;
        }
        .locked-image {
            height: 100px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 40px;
            background: #ddd;
            border-radius: 8px;
        }
        #close-album {
            background: #87CEEB;
            border: none;
            padding: 10px 20px;
            border-radius: 30px;
            color: white;
            font-weight: bold;
            cursor: pointer;
            margin-top: 10px;
        }
    `;
    
    document.head.appendChild(albumStyle);
    album.innerHTML = albumHTML;
    document.body.appendChild(album);
    
    // Evento para cerrar
    document.getElementById('close-album').addEventListener('click', () => {
        document.body.removeChild(album);
        document.head.removeChild(albumStyle);
    });
}
// Función para iniciar el sistema de selección de juegos
function selectGame() {
    const games = [
        { name: "Memoria", icon: "🧠", action: playMemoryGame },
        { name: "Piedra, Papel o Tijeras", icon: "✂️", action: playRockPaperScissors },
        { name: "Conejo volador", icon: "🐰", action: playFlappyRabbit },
        { name: "Ver Álbum", icon: "📷", action: showPhotoAlbum }
    ];
    
    // Crear HTML para el selector de juegos
    let gameHTML = '<div class="game-selector">';
    gameHTML += '<h3>¿A qué quieres jugar?</h3>';
    gameHTML += '<div class="game-options">';
    
    games.forEach(game => {
        gameHTML += `<button class="game-option" data-game="${game.name}">${game.icon} ${game.name}</button>`;
    });
    
    gameHTML += '</div></div>';
    
    // Mostrar selector
    const gameContainer = document.createElement('div');
    gameContainer.id = 'game-container';
    gameContainer.innerHTML = gameHTML;
    gameContainer.style.position = 'fixed';
    gameContainer.style.top = '50%';
    gameContainer.style.left = '50%';
    gameContainer.style.transform = 'translate(-50%, -50%)';
    gameContainer.style.background = 'white';
    gameContainer.style.padding = '20px';
    gameContainer.style.borderRadius = '15px';
    gameContainer.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
    gameContainer.style.zIndex = '100';
    
    document.body.appendChild(gameContainer);
    
    // Añadir estilos al selector
    const selectorStyle = document.createElement('style');
    selectorStyle.textContent = `
        .game-selector h3 {
            text-align: center;
            margin-bottom: 15px;
        }
        .game-options {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
        }
        .game-option {
            padding: 15px;
            background: #87CEEB;
            border: none;
            border-radius: 10px;
            color: white;
            font-weight: bold;
            font-size: 16px;
            cursor: pointer;
            transition: transform 0.2s, background 0.2s;
        }
        .game-option:hover {
            transform: scale(1.05);
            background: #4682B4;
        }
    `;
    document.head.appendChild(selectorStyle);
    
    // Añadir event listeners a las opciones
    const gameOptions = document.querySelectorAll('.game-option');
    gameOptions.forEach(option => {
        option.addEventListener('click', () => {
            const gameName = option.getAttribute('data-game');
            document.body.removeChild(gameContainer);
            document.head.removeChild(selectorStyle);
            
            // Iniciar el juego seleccionado
            const selectedGame = games.find(g => g.name === gameName);
            if (selectedGame) {
                selectedGame.action();
            }
        });
    });
}

// Juego de Memoria
function playMemoryGame() {
    const items = [
        { id: 1, emoji: '🐰', name: 'conejo' },
        { id: 2, emoji: '🎨', name: 'arte' },
        { id: 3, emoji: '💖', name: 'amor' },
        { id: 4, emoji: '🌈', name: 'arcoiris' },
        { id: 5, emoji: '🍷', name: 'vino' },
        { id: 6, emoji: '✈️', name: 'viaje' },
        { id: 7, emoji: '📱', name: 'teléfono' },
        { id: 8, emoji: '🎵', name: 'música' }
    ];
    
    // Duplicar los items para hacer pares
    const gameItems = [...items, ...items].sort(() => Math.random() - 0.5);
    
    // Crear HTML del juego
    let gameHTML = '<div class="memory-game">';
    gameHTML += '<h3>Juego de Memoria</h3>';
    gameHTML += '<p>Encuentra todos los pares</p>';
    gameHTML += '<div class="memory-grid">';
    
    gameItems.forEach((item, index) => {
        gameHTML += `<div class="memory-card" data-id="${item.id}" data-index="${index}">`;
        gameHTML += '<div class="memory-card-inner">';
        gameHTML += '<div class="memory-card-front">❓</div>';
        gameHTML += `<div class="memory-card-back">${item.emoji}</div>`;
        gameHTML += '</div></div>';
    });
    
    gameHTML += '</div>';
    gameHTML += '<button id="close-memory-game">Cerrar</button>';
    gameHTML += '</div>';
    
    // Estilos CSS para el juego
    const gameStyle = document.createElement('style');
    gameStyle.textContent = `
        .memory-game {
            width: 90vw;
            max-width: 500px;
            background: white;
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            text-align: center;
        }
        .memory-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            margin: 20px 0;
        }
        .memory-card {
            height: 60px;
            perspective: 1000px;
            cursor: pointer;
        }
        .memory-card-inner {
            width: 100%;
            height: 100%;
            transform-style: preserve-3d;
            transition: transform 0.5s;
            position: relative;
        }
        .memory-card.flipped .memory-card-inner {
            transform: rotateY(180deg);
        }
        .memory-card-front, .memory-card-back {
            position: absolute;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            background: #87CEEB;
            border: 2px solid #4682B4;
        }
        .memory-card-back {
            transform: rotateY(180deg);
        }
        #close-memory-game {
            background: #87CEEB;
            border: none;
            padding: 10px 20px;
            border-radius: 30px;
            color: white;
            font-weight: bold;
            cursor: pointer;
            margin-top: 10px;
        }
    `;
    
    document.head.appendChild(gameStyle);
    
    // Mostrar juego
    const gameContainer = document.createElement('div');
    gameContainer.id = 'memory-game-container';
    gameContainer.style.position = 'fixed';
    gameContainer.style.top = '50%';
    gameContainer.style.left = '50%';
    gameContainer.style.transform = 'translate(-50%, -50%)';
    gameContainer.style.zIndex = '100';
    gameContainer.innerHTML = gameHTML;
    
    document.body.appendChild(gameContainer);
    
    // Lógica del juego
    let flippedCards = [];
    let matchedPairs = 0;
    
    const cards = document.querySelectorAll('.memory-card');
    cards.forEach(card => {
        card.addEventListener('click', flipCard);
    });
    
    document.getElementById('close-memory-game').addEventListener('click', () => {
        document.body.removeChild(gameContainer);
        document.head.removeChild(gameStyle);
        
        // Aumentar felicidad al terminar de jugar
        gameState.happiness = Math.min(100, gameState.happiness + 15);
        gameState.energy = Math.max(0, gameState.energy - 5);
        updateStatusBars();
        saveGameState();
        
        showMessage("¡Illo q lista por mi madre! Tu sabe mucho.", 3000);
    });
    
    function flipCard() {
        // No permitir más de 2 cartas volteadas o cartas ya emparejadas
        if (flippedCards.length >= 2 || this.classList.contains('matched') || this.classList.contains('flipped')) {
            return;
        }
        
        this.classList.add('flipped');
        flippedCards.push(this);
        
        if (flippedCards.length === 2) {
            // Comprobar si es un par
            const firstId = flippedCards[0].getAttribute('data-id');
            const secondId = flippedCards[1].getAttribute('data-id');
            
            if (firstId === secondId) {
                // Es un par
                flippedCards[0].classList.add('matched');
                flippedCards[1].classList.add('matched');
                flippedCards = [];
                matchedPairs++;
                
                // Comprobar si ha ganado
                if (matchedPairs === items.length) {
                    setTimeout(() => {
                        showMessage("¡Ganaste! ¡Eres la mejor en este juego!", 3000);
                        
                        // Aumentar felicidad extra por ganar
                        gameState.happiness = Math.min(100, gameState.happiness + 10);
                        updateStatusBars();
                        saveGameState();
                        
                        // Añadir experiencia
                        addExperience(30);
                    }, 500);
                }
            } else {
                // No es un par, voltear de nuevo
                setTimeout(() => {
                    flippedCards[0].classList.remove('flipped');
                    flippedCards[1].classList.remove('flipped');
                    flippedCards = [];
                }, 1000);
            }
        }
    }
}
// Juego de Piedra, Papel o Tijeras
function playRockPaperScissors() {
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
    gameContainer.style.zIndex = '100';
    gameContainer.style.textAlign = 'center';
    gameContainer.style.width = '90%';
    gameContainer.style.maxWidth = '400px';
    
    // HTML del juego
    gameContainer.innerHTML = `
        <h3>Piedra, Papel o Tijeras</h3>
        <p id="rps-message">¡Elige lo que quieras gorda, no se perder!</p>
        <div id="rps-options">
            <button class="rps-option" data-choice="piedra">👊 Piedra</button>
            <button class="rps-option" data-choice="papel">✋ Papel</button>
            <button class="rps-option" data-choice="tijeras">✌️ Tijeras</button>
        </div>
        <div id="rps-result" style="display: none;">
            <p id="rps-choices"></p>
            <p id="rps-winner"></p>
            <p id="rps-score">Tu puntuación: 0</p>
            <button id="rps-play-again">Vamos a picarnos</button>
        </div>
        <button id="close-rps">Cerrar Juego</button>
    `;
    
    // Estilos del juego
    const gameStyle = document.createElement('style');
    gameStyle.textContent = `
        #rps-options {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin: 20px 0;
        }
        .rps-option {
            font-size: 18px;
            padding: 10px 15px;
            background: #87CEEB;
            border: none;
            border-radius: 10px;
            color: white;
            cursor: pointer;
            transition: transform 0.2s;
        }
        .rps-option:hover {
            transform: scale(1.1);
        }
        #rps-result {
            margin-top: 20px;
        }
        #rps-play-again {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 10px;
            cursor: pointer;
            margin-top: 10px;
        }
        #close-rps {
            background: #f44336;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 10px;
            cursor: pointer;
            margin-top: 20px;
        }
    `;
    
    document.head.appendChild(gameStyle);
    document.body.appendChild(gameContainer);
    
    // Variables del juego
    let score = 0;
    let rounds = 0;
    let choices = document.querySelectorAll('.rps-option');
    let playerChoice = '';
    let computerChoice = '';
    
    // Event listeners
    choices.forEach(choice => {
        choice.addEventListener('click', play);
    });
    
    document.getElementById('rps-play-again').addEventListener('click', reset);
    document.getElementById('close-rps').addEventListener('click', closeGame);
    
    // Jugar una ronda
    function play() {
        playerChoice = this.getAttribute('data-choice');
        const options = ['piedra', 'papel', 'tijeras'];
        computerChoice = options[Math.floor(Math.random() * options.length)];
        
        // Mostrar elecciones
        document.getElementById('rps-choices').textContent = 
            `Tu elección: ${getEmoji(playerChoice)} | Mi elección: ${getEmoji(computerChoice)}`;
        
        // Determinar ganador
        let result = determineWinner(playerChoice, computerChoice);
        
        // Actualizar puntuación
        if (result === 'player') {
            score += 10;
            document.getElementById('rps-winner').textContent = '¡Has ganado esta ronda!';
            document.getElementById('rps-winner').style.color = 'green';
        } else if (result === 'computer') {
            document.getElementById('rps-winner').textContent = '¡He ganado esta ronda!';
            document.getElementById('rps-winner').style.color = 'red';
        } else {
            document.getElementById('rps-winner').textContent = '¡Empate!';
            document.getElementById('rps-winner').style.color = 'blue';
        }
        
        // Actualizar contador y mostrar resultados
        rounds++;
        document.getElementById('rps-score').textContent = `Tu puntuación: ${score} (Ronda ${rounds})`;
        document.getElementById('rps-result').style.display = 'block';
        document.getElementById('rps-options').style.display = 'none';
        document.getElementById('rps-message').textContent = '¡Resultado!';
        
        // Comprobar si el juego ha terminado (5 rondas)
        if (rounds >= 5) {
            endGame();
        }
    }
    
    // Reiniciar para nueva ronda
    function reset() {
        if (rounds < 5) {
            document.getElementById('rps-result').style.display = 'none';
            document.getElementById('rps-options').style.display = 'flex';
            document.getElementById('rps-message').textContent = '¡Elige tu jugada!';
        } else {
            closeGame();
        }
    }
    
    // Finalizar el juego
    function endGame() {
        document.getElementById('rps-play-again').textContent = 'Finalizar';
        document.getElementById('rps-message').textContent = '¡Juego terminado!';
        
        // Mensaje según la puntuación
        let message = '';
        if (score >= 30) {
            message = 'Te la has sacao mano, si me mandas cap te debo un besito.';
        } else if (score >= 20) {
            message = 'Illo como sigas ganando te desinstalo el juego.';
        } else if (score >= 10) {
            message = 'Gorda, puedes con TODOOO.';
        } else {
            message = 'Sigue así, llegaras cerca!';
        }
        
        document.getElementById('rps-winner').textContent = message;
        document.getElementById('rps-winner').style.color = 'black';
        
        // Añadir experiencia basada en la puntuación
        addExperience(score);
    }
    
    // Cerrar el juego
    function closeGame() {
        document.body.removeChild(gameContainer);
        document.head.removeChild(gameStyle);
        
        // Aumentar felicidad según puntuación
        const happinessBoost = Math.min(20, score / 5 + 5);
        gameState.happiness = Math.min(100, gameState.happiness + happinessBoost);
        gameState.energy = Math.max(0, gameState.energy - 5);
        updateStatusBars();
        saveGameState();
        
        // Mensaje de despedida
        let gameResultMessage = '';
        if (score >= 30) {
            gameResultMessage = '¡Pon esta puntuntacion en tu CV te cogen seguro!';
        } else if (score >= 20) {
            gameResultMessage = '¡Buen juego! Que no se vuelva a repetir.';
        } else if (score >= 10) {
            gameResultMessage = 'Nos vemos cuando nos veamos gorda, un besito';
        } else {
            gameResultMessage = 'Aqui mandan las divinas porque somos gasolina.';
        }
        
        showMessage(gameResultMessage, 3000);
        
        // Terminar estado de juego
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
    }
    
    // Función auxiliar para obtener emojis
    function getEmoji(choice) {
        switch(choice) {
            case 'piedra': return '👊';
            case 'papel': return '✋';
            case 'tijeras': return '✌️';
            default: return '';
        }
    }
    
    // Determinar ganador
    function determineWinner(player, computer) {
        if (player === computer) {
            return 'tie';
        }
        
        if ((player === 'piedra' && computer === 'tijeras') ||
            (player === 'papel' && computer === 'piedra') ||
            (player === 'tijeras' && computer === 'papel')) {
            return 'player';
        } else {
            return 'computer';
        }
    }
}
// Juego estilo Flappy Bird pero con el conejo
function playFlappyRabbit() {
    // Crear el contenedor del juego
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
        <div id="flappy-game">
            <div id="flappy-score">0</div>
            <div id="flappy-rabbit"></div>
            <div id="flappy-start-message">Toca para saltar</div>
        </div>
        <button id="close-flappy">Cerrar Juego</button>
    `;
    
    // Añadir estilos
    const gameStyle = document.createElement('style');
    gameStyle.textContent = `
        #flappy-game {
            position: relative;
            width: 100%;
            height: 100%;
            overflow: hidden;
        }
        #flappy-score {
            position: absolute;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 40px;
            font-weight: bold;
            color: white;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            z-index: 10;
        }
        #flappy-rabbit {
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
        }
        .flappy-pipe {
            position: absolute;
            width: 60px;
            right: -60px;
            background-color: #4CAF50;
            border: 4px solid #2E7D32;
        }
        #flappy-start-message {
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
            display: block;
        }
        #close-flappy {
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
        }
    `;
    
    document.head.appendChild(gameStyle);
    document.body.appendChild(gameContainer);
    
    // Variables del juego
    let gameStarted = false;
    let gameOver = false;
    let score = 0;
    let gravity = 0.5;
    let velocity = 0;
    let rabbitPosition = 50;
    let pipes = [];
    let animationFrame;
    
    const rabbit = document.getElementById('flappy-rabbit');
    const scoreElement = document.getElementById('flappy-score');
    const startMessage = document.getElementById('flappy-start-message');
    
    // Iniciar el juego al hacer clic
    gameContainer.addEventListener('click', jump);
    document.getElementById('close-flappy').addEventListener('click', closeGame);
    
    // Salto del conejo
    function jump() {
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
        rabbit.style.top = rabbitPosition + 'px';
        
        // Comprobar colisiones
        const rabbitRect = rabbit.getBoundingClientRect();
        
        // Colisión con el suelo o techo
        if (rabbitPosition <= 0 || rabbitPosition >= gameContainer.clientHeight - 50) {
            endGame();
            return;
        }
        
        // Actualizar y comprobar colisiones con obstáculos
        pipes.forEach((pipe, index) => {
            const pipeElement = document.getElementById(pipe.id);
            
            if (pipeElement) {
                // Mover obstáculo
                pipe.x -= 2;
                pipeElement.style.right = -pipe.x + 'px';
                
                // Comprobar colisión
                const pipeRect = pipeElement.getBoundingClientRect();
                if (
                    rabbitRect.right > pipeRect.left &&
                    rabbitRect.left < pipeRect.right &&
                    (rabbitRect.bottom > pipeRect.top &&
                     rabbitRect.top < pipeRect.bottom)
                ) {
                    endGame();
                    return;
                }
                
                // Sumar punto si ha pasado obstáculo
                if (!pipe.passed && pipe.x > gameContainer.clientWidth - 50) {
                    pipe.passed = true;
                    score++;
                    scoreElement.textContent = score;
                }
                
                // Eliminar obstáculo si está fuera de pantalla
                if (pipe.x > gameContainer.clientWidth + 60) {
                    pipeElement.remove();
                    pipes.splice(index, 1);
                }
            }
        });
        
        // Crear nuevo obstáculo cada cierto tiempo
        if (pipes.length < 5 && Math.random() < 0.01) {
            createPipe();
        }
        
        if (!gameOver) {
            animationFrame = requestAnimationFrame(gameLoop);
        }
    }
    
    // Crear obstáculo
    function createPipe() {
        const pipeId = 'pipe-' + Date.now();
        const pipeHeight = Math.floor(Math.random() * 200) + 100;
        const pipeTop = Math.floor(Math.random() * (gameContainer.clientHeight - pipeHeight - 200)) + 50;
        
        // Crear obstáculo superior
        const pipeTop1 = document.createElement('div');
        pipeTop1.id = pipeId + '-top';
        pipeTop1.className = 'flappy-pipe';
        pipeTop1.style.height = pipeTop + 'px';
        pipeTop1.style.top = '0';
        
        // Crear obstáculo inferior
        const pipeBottom1 = document.createElement('div');
        pipeBottom1.id = pipeId + '-bottom';
        pipeBottom1.className = 'flappy-pipe';
        pipeBottom1.style.height = gameContainer.clientHeight - pipeTop - pipeHeight + 'px';
        pipeBottom1.style.bottom = '0';
        
        document.getElementById('flappy-game').appendChild(pipeTop1);
        document.getElementById('flappy-game').appendChild(pipeBottom1);
        
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
        startMessage.textContent = `Lo has hecho genial gorda. Puntuación: ${score}`;
        startMessage.style.display = 'block';
        
        // Añadir experiencia basada en la puntuación
        const expGained = score * 5;
        addExperience(expGained);
        
        setTimeout(() => {
            startMessage.textContent += `\n¡Has ganado ${expGained} 5 abrazos de tu amado!`;
        }, 1000);
    }
    
    // Cerrar juego
    function closeGame() {
        cancelAnimationFrame(animationFrame);
        document.body.removeChild(gameContainer);
        document.head.removeChild(gameStyle);
        
        // Aumentar felicidad al jugar
        gameState.happiness = Math.min(100, gameState.happiness + 10);
        gameState.energy = Math.max(0, gameState.energy - 5);
        updateStatusBars();
        saveGameState();
        
        // Terminar estado de juego
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
    }
}
// Código para depurar eventos de botones
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado');
    
    if (elements.feedButton) {
        console.log('Botón de alimentar encontrado');
        elements.feedButton.addEventListener('click', function() {
            console.log('Clic en alimentar');
            feedPet();
        });
    } else {
        console.log('Botón de alimentar NO encontrado');
    }
    
    if (elements.playButton) {
        console.log('Botón de jugar encontrado');
        elements.playButton.addEventListener('click', function() {
            console.log('Clic en jugar');
            playWithPet();
        });
    } else {
        console.log('Botón de jugar NO encontrado');
    }
    
    if (elements.sleepButton) {
        console.log('Botón de dormir encontrado');
    } else {
        console.log('Botón de dormir NO encontrado');
    }
    
    if (elements.specialButton) {
        console.log('Botón de mensaje especial encontrado');
    } else {
        console.log('Botón de mensaje especial NO encontrado');
    }
});
// Verificar y registrar mensajes en la consola
console.log("Game.js - Iniciando carga");

// Funciones de comprobación para asegurar que todo está disponible
function safeGetRandomMessage(array) {
    // Usar una función segura que verifique primero si está disponible
    if (typeof window.getRandomMessage === 'function' && Array.isArray(array) && array.length > 0) {
        return window.getRandomMessage(array);
    } else if (typeof getRandomMessage === 'function' && Array.isArray(array) && array.length > 0) {
        return getRandomMessage(array);
    } else if (Array.isArray(array) && array.length > 0) {
        // Implementar la función localmente si no está disponible
        const randomIndex = Math.floor(Math.random() * array.length);
        return array[randomIndex];
    }
    return "Mensaje predeterminado";
}

// Exponer las funciones cruciales globalmente al inicio
window.feedPet = feedPet;
window.playWithPet = playWithPet;
window.toggleSleep = toggleSleep;
window.showSpecialMessage = showSpecialMessage;
window.showMessage = showMessage;

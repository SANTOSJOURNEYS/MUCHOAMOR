// Sprites y estados para el conejo Tamagotchi
// Estas son constantes para los diferentes estados del conejo

// Estados disponibles del conejo
const PET_STATES = {
    NORMAL: 'normal',
    EATING: 'eating',
    PLAYING: 'playing',
    SLEEPING: 'sleeping',
    SAD: 'sad'
};

// Sprites para diferentes estados
// En esta versión usamos clases CSS para las animaciones
// Pero dejamos preparado el sistema para futuras mejoras con múltiples sprites

// Base64 del sprite del conejo (versión azul para Rachel)
// Esto es una representación del conejo blanco con elementos azules
// adaptado de la imagen de referencia
const BUNNY_SPRITE = 'data:image/png;base64,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';

// Función para cambiar el estado visual del conejo
function changeSprite(state) {
    const petSprite = document.getElementById('pet-sprite');
    
    // Primero removemos todas las clases de estados
    petSprite.classList.remove(
        PET_STATES.EATING,
        PET_STATES.PLAYING,
        PET_STATES.SLEEPING,
        PET_STATES.SAD
    );
    
    // Añadimos la clase correspondiente al nuevo estado
    if (state !== PET_STATES.NORMAL) {
        petSprite.classList.add(state);
    }
}

// Función para animar la transición entre estados
function animateStateChange(fromState, toState, duration = 1000) {
    changeSprite(toState);
    
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, duration);
    });
}

// Precarga de la imagen del conejo para evitar parpadeos
function preloadImages() {
    const img = new Image();
    img.src = BUNNY_SPRITE;
}

// Función para inicializar los sprites
function initSprites() {
    preloadImages();
    // Configurar el sprite inicial
    changeSprite(PET_STATES.NORMAL);
}
// Sprites y estados para el conejo Tamagotchi

// Estados disponibles del conejo
const PET_STATES = {
    NORMAL: 'normal',
    EATING: 'eating',
    PLAYING: 'playing',
    SLEEPING: 'sleeping',
    SAD: 'sad'
};

// Inicializar los sprites según el estado
function initSprites() {
    // Asegurarse de que el elemento del sprite existe
    const petSprite = document.getElementById('pet-sprite');
    if (!petSprite) return;
    
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
    
    // Configurar estado inicial
    changeSprite(PET_STATES.NORMAL);
}

// Cambiar el sprite según el estado
function changeSprite(state) {
    const petSprite = document.getElementById('pet-sprite');
    if (!petSprite) return;
    
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

// Hacer que las funciones y variables sean accesibles globalmente
window.PET_STATES = PET_STATES;
window.initSprites = initSprites;
window.changeSprite = changeSprite;

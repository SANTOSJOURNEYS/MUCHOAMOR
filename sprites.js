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

// Hacer que las funciones y variables sean accesibles globalmente
window.PET_STATES = PET_STATES;
window.initSprites = initSprites;
window.changeSprite = changeSprite;

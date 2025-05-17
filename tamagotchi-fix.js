// tamagotchi-fix.js - Corrige problemas de acceso a funciones
console.log("Inicializando arreglos para el Tamagotchi...");

// Script para ejecutarse inmediatamente
document.addEventListener('DOMContentLoaded', function() {
    // Hacer que todas las funciones estén disponibles globalmente
    if (typeof feedPet === 'function') window.feedPet = feedPet;
    if (typeof playWithPet === 'function') window.playWithPet = playWithPet;
    if (typeof toggleSleep === 'function') window.toggleSleep = toggleSleep;
    if (typeof showSpecialMessage === 'function') window.showSpecialMessage = showSpecialMessage;
    if (typeof showMessage === 'function') window.showMessage = showMessage;
    if (typeof changeSprite === 'function') window.changeSprite = changeSprite;

    // Exponer funciones y variables de messages.js
    if (typeof getRandomMessage === 'function') window.getRandomMessage = getRandomMessage;
    if (typeof checkSpecialDate === 'function') window.checkSpecialDate = checkSpecialDate;
    if (typeof isSpecialYear === 'function') window.isSpecialYear = isSpecialYear;
    
    // Exponer arrays de mensajes
    if (typeof randomMessages !== 'undefined') window.randomMessages = randomMessages;
    if (typeof feedMessages !== 'undefined') window.feedMessages = feedMessages;
    if (typeof playMessages !== 'undefined') window.playMessages = playMessages;
    if (typeof sleepMessages !== 'undefined') window.sleepMessages = sleepMessages;
    if (typeof sadMessages !== 'undefined') window.sadMessages = sadMessages;
    if (typeof specialMessages !== 'undefined') window.specialMessages = specialMessages;
    
    console.log("Comprobando disponibilidad de funciones:");
    console.log("feedPet disponible:", typeof window.feedPet === 'function');
    console.log("playWithPet disponible:", typeof window.playWithPet === 'function');
    console.log("toggleSleep disponible:", typeof window.toggleSleep === 'function');
    console.log("showSpecialMessage disponible:", typeof window.showSpecialMessage === 'function');
    console.log("getRandomMessage disponible:", typeof window.getRandomMessage === 'function');
    
    // Añadir controladores de eventos manualmente
    console.log("Agregando controladores de eventos manualmente...");
    const feedBtn = document.getElementById('feed-btn');
    const playBtn = document.getElementById('play-btn');
    const sleepBtn = document.getElementById('sleep-btn');
    const specialBtn = document.getElementById('special-btn');
    
    if (feedBtn) {
        feedBtn.addEventListener('click', function() { 
            console.log("Clic en alimentar");
            if (typeof window.feedPet === 'function') {
                window.feedPet();
            } else {
                console.error("Error: La función feedPet no está disponible");
            }
        });
    }
    
    if (playBtn) {
        playBtn.addEventListener('click', function() {
            console.log("Clic en jugar");
            if (typeof window.playWithPet === 'function') {
                window.playWithPet();
            } else {
                console.error("Error: La función playWithPet no está disponible");
            }
        });
    }
    
    if (sleepBtn) {
        sleepBtn.addEventListener('click', function() {
            console.log("Clic en dormir");
            if (typeof window.toggleSleep === 'function') {
                window.toggleSleep();
            } else {
                console.error("Error: La función toggleSleep no está disponible");
            }
        });
    }
    
    if (specialBtn) {
        specialBtn.addEventListener('click', function() {
            console.log("Clic en mensaje especial");
            if (typeof window.showSpecialMessage === 'function') {
                window.showSpecialMessage();
            } else {
                console.error("Error: La función showSpecialMessage no está disponible");
            }
        });
    }
});

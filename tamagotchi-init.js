// tamagotchi-init.js - Asegura el acceso a funciones entre archivos

// Inicializar variables y funciones globales
(function() {
    // Verificar que las funciones de messages.js estén disponibles globalmente
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Verificando disponibilidad de funciones...');
        
        // Verificar si getRandomMessage está disponible
        if (typeof window.getRandomMessage !== 'function') {
            console.error('Error: getRandomMessage no está disponible. Forzando disponibilidad desde messages.js');
            // Intentar forzar la disponibilidad si la función existe en el scope actual
            if (typeof getRandomMessage === 'function') {
                window.getRandomMessage = getRandomMessage;
                console.log('getRandomMessage ahora disponible globalmente');
            }
        } else {
            console.log('getRandomMessage disponible correctamente');
        }
        
        // Verificar si checkSpecialDate está disponible
        if (typeof window.checkSpecialDate !== 'function') {
            console.error('Error: checkSpecialDate no está disponible. Forzando disponibilidad desde messages.js');
            // Intentar forzar la disponibilidad si la función existe en el scope actual
            if (typeof checkSpecialDate === 'function') {
                window.checkSpecialDate = checkSpecialDate;
                console.log('checkSpecialDate ahora disponible globalmente');
            }
        } else {
            console.log('checkSpecialDate disponible correctamente');
        }
        
        // No crear respaldos, solo asegurar que existen las funciones originales
    });
})();

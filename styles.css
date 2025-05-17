* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
}

body {
    font-family: 'Arial Rounded MT Bold', 'Arial', sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f0f8ff;
    color: #333;
}

#game-container {
    position: relative;
    width: 100%;
    max-width: 400px;
    background: white;
    border-radius: 25px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    display: flex;
    flex-direction: column;
    height: 90vh;
    max-height: 700px;
    padding-bottom: 20px;
    border: 5px solid #87CEEB;
    transition: all 0.3s ease;
}

#status-bar {
    display: flex;
    justify-content: space-around;
    padding: 15px;
    background-color: #e6f7ff;
    border-bottom: 2px solid #d1e8ff;
}

.status-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 30%;
}

.status-label {
    font-size: 14px;
    margin-bottom: 5px;
    color: #555;
}

.status-value {
    width: 100%;
    height: 10px;
    background: #eee;
    border-radius: 5px;
    overflow: hidden;
}

.status-fill {
    height: 100%;
    border-radius: 5px;
    transition: width 0.5s ease;
}

#hunger-bar {
    background: linear-gradient(to right, #ff9966, #ff5e62);
    width: 80%;
}

#happiness-bar {
    background: linear-gradient(to right, #56CCF2, #2F80ED);
    width: 80%;
}

#energy-bar {
    background: linear-gradient(to right, #EECDA3, #EF629F);
    width: 80%;
}
#pet-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    padding: 20px;
    overflow: hidden;
    background: linear-gradient(to bottom, #e6f7ff 0%, #ffffff 100%);
}

#pet-name {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 15px;
    color: #4682B4;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
}

#pet-sprite {
    width: 200px;
    height: 200px;
    background-image: url('icon.png');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    transition: all 0.3s ease;
    filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
}

#message-bubble {
    position: absolute;
    top: 30px;
    background: white;
    padding: 10px 15px;
    border-radius: 20px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    max-width: 80%;
    text-align: center;
    transform-origin: bottom center;
    animation: bubble-in 0.3s ease-out;
    z-index: 10;
    border: 2px solid #87CEEB;
    font-size: 14px;
}

@keyframes bubble-in {
    0% {
        transform: scale(0);
        opacity: 0;
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}

#action-buttons {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    padding: 15px;
    background-color: #f5f5f5;
    border-top: 2px solid #e0e0e0;
}

.action-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 12px;
    border: none;
    border-radius: 15px;
    background: #87CEEB;
    color: white;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.action-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    background: #5CACEE;
}

.action-btn:active {
    transform: translateY(1px);
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.btn-icon {
    font-size: 24px;
    margin-bottom: 5px;
}

.btn-text {
    font-size: 12px;
}

.hidden {
    display: none !important;
}

/* Modal para fechas especiales */
#date-check {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.7);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 100;
}

#anniversary-message {
    background: white;
    padding: 30px;
    border-radius: 20px;
    max-width: 80%;
    text-align: center;
    animation: pop-in 0.5s ease-out;
    box-shadow: 0 5px 20px rgba(0,0,0,0.2);
    border: 5px solid #87CEEB;
}

#anniversary-message h2 {
    color: #4682B4;
    margin-bottom: 15px;
}

#anniversary-message p {
    font-size: 16px;
    line-height: 1.5;
}

#close-anniversary {
    margin-top: 20px;
    padding: 10px 20px;
    background: #87CEEB;
    border: none;
    border-radius: 30px;
    color: white;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s ease;
}

#close-anniversary:hover {
    background: #5CACEE;
    transform: scale(1.05);
}

@keyframes pop-in {
    0% {
        transform: scale(0.5);
        opacity: 0;
    }
    80% {
        transform: scale(1.1);
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}

/* Animaciones del Tamagotchi */
.normal {
    transform-origin: bottom center;
}

.eating {
    transform-origin: center;
}

.playing {
    transform-origin: bottom center;
}

.sleeping {
    transform-origin: center;
}

.sad {
    transform-origin: bottom center;
}

/* Responsive design */
@media (max-height: 700px) {
    #game-container {
        height: 85vh;
    }
    
    #pet-sprite {
        width: 150px;
        height: 150px;
    }
}

@media (max-width: 400px) {
    .status-label {
        font-size: 12px;
    }
    
    .btn-icon {
        font-size: 20px;
    }
    
    .btn-text {
        font-size: 10px;
    }
}

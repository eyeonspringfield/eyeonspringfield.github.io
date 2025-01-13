"use strict";
self.onmessage = function (event) {
    const { mouseX, mouseY, cardsData } = event.data;
    const boxShadows = cardsData.map((cardRect) => {
        const cardCenterX = cardRect.left + cardRect.width / 2;
        const cardCenterY = cardRect.top + cardRect.height / 2;
        const distanceX = mouseX - cardCenterX;
        const distanceY = mouseY - cardCenterY;
        const distance = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
        const maxDistance = 250;
        const glowIntensity = Math.max(0, Math.min(1, 1 - distance / maxDistance));
        const shadowStrength = glowIntensity * 50;
        return `${distanceX / 10}px ${distanceY / 10}px ${shadowStrength}px rgba(0, 255, 0, ${glowIntensity})`;
    });
    postMessage({ boxShadows });
};

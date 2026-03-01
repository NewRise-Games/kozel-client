export function animateCard(card) {
    card.x += (card.targetX - card.x) * 0.12;
    card.y += (card.targetY - card.y) * 0.12;
}
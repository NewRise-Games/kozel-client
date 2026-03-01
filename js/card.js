export class Card {
    constructor(suit, rank) {
        this.suit = suit;
        this.rank = rank;

        this.x = 550;
        this.y = 300;

        this.targetX = 550;
        this.targetY = 300;
    }

    getColor() {
        return (this.suit === "♥" || this.suit === "♦") ? "red" : "black";
    }
}
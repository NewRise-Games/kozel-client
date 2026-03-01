import { Card } from "./card.js";

export class Deck {
    constructor() {
        this.cards = [];
        this.suits = ["♠","♥","♦","♣"];
        this.ranks = ["6","7","8","9","10","J","Q","K","A"];
    }

    create() {
        for (let suit of this.suits) {
            for (let rank of this.ranks) {
                this.cards.push(new Card(suit, rank));
            }
        }
    }

    shuffle() {
        this.cards.sort(() => Math.random() - 0.5);
    }

    draw() {
        return this.cards.pop();
    }
}
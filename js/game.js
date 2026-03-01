import { Deck } from "./deck.js";
import { animateCard } from "./animation.js";

export class Game {
    constructor(ctx, canvas, nickname = "Player") {
        this.ctx = ctx;
        this.canvas = canvas;

        this.playerNames = [
            nickname,
            "Player 2",
            "Player 3",
            "Player 4"
        ];

        this.deck = new Deck();
        this.players = [[], [], [], []];

        this.scores = [0, 0];
        this.currentPlayer = 0;
        this.tableCards = [];
        this.trumpSuit = null;

        this.isResolving = false;
        this.isFinished = false;
        this.turnPulse = 0;
        this.lastWinner = null;

        /* ================= ONLINE ================= */

        this.playerId = null;

        this.socket = new WebSocket("wss://kozel-server.onrender.com");

        this.socket.onopen = () => {
            console.log("Connected to server");
        };

        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("Server:", data);

            if (data.type === "joined") {
                this.playerId = data.id;
                console.log("My ID:", this.playerId);
            }

            if (data.type === "start") {
                console.log("Game started by server");
            }

            if (data.type === "play") {
                this.handleRemotePlay(data);
            }
        };

        this.initEvents();
    }

    /* ================= EVENTS ================= */

    initEvents() {
        this.canvas.addEventListener("click", (e) => {

            if (this.playerId !== 0) return; // поки тільки 1 гравець керує
            if (this.currentPlayer !== 0 || this.isResolving) return;

            const rect = this.canvas.getBoundingClientRect();
            const mx = e.clientX - rect.left;
            const my = e.clientY - rect.top;

            const hand = this.players[0];

            for (let i = 0; i < hand.length; i++) {
                const c = hand[i];
                if (
                    mx >= c.x && mx <= c.x + 90 &&
                    my >= c.y && my <= c.y + 130
                ) {
                    this.playCard(0, i);
                    break;
                }
            }
        });
    }

    /* ================= PLAY ================= */

    playCard(playerIndex, cardIndex) {

        const card = this.players[playerIndex][cardIndex];

        // відправляємо на сервер
        this.socket.send(JSON.stringify({
            type: "play",
            player: playerIndex,
            card: card
        }));

        // локально поки відображаємо
        this.players[playerIndex].splice(cardIndex, 1);
        card.targetX = 505;
        card.targetY = 260;

        this.tableCards.push({ player: playerIndex, card });

        this.currentPlayer = (playerIndex + 1) % 4;
    }

    handleRemotePlay(data) {
        console.log("Remote play:", data);
        // тут пізніше буде повна синхронізація
    }

    /* ================= START (локальний) ================= */

    start() {
        this.deck.create();
        this.deck.shuffle();

        this.trumpSuit = this.deck.cards[0].suit;

        for (let i = 0; i < 6; i++) {
            for (let p = 0; p < 4; p++) {
                this.players[p].push(this.deck.draw());
            }
        }

        this.layoutHands();
    }

    layoutHands() {
        this.players[0].forEach((card, i) => {
            card.targetX = 250 + i * 120;
            card.targetY = 480;
        });

        this.players[2].forEach((card, i) => {
            card.targetX = 250 + i * 120;
            card.targetY = 40;
        });

        this.players[1].forEach((card, i) => {
            card.targetX = 50;
            card.targetY = 150 + i * 40;
        });

        this.players[3].forEach((card, i) => {
            card.targetX = 960;
            card.targetY = 150 + i * 40;
        });
    }

    /* ================= UPDATE ================= */

    update() {
        this.turnPulse += 0.05;

        [
            ...this.players.flat(),
            ...this.tableCards.map(t => t.card)
        ].forEach(card => animateCard(card));
    }

    /* ================= RENDER ================= */

    render() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, 1100, 650);

        ctx.fillStyle = "white";
        ctx.font = "18px Arial";
        ctx.fillText("Online Mode", 20, 25);

        for (let p = 1; p < 4; p++) {
            for (let card of this.players[p]) {
                this.drawBack(card);
            }
        }

        for (let card of this.players[0]) {
            this.drawCard(card);
        }

        for (let t of this.tableCards) {
            this.drawCard(t.card);
        }
    }

    /* ================= DRAW ================= */

    drawCard(card) {
        const ctx = this.ctx;

        ctx.fillStyle = "white";
        ctx.fillRect(card.x, card.y, 90, 130);
        ctx.strokeRect(card.x, card.y, 90, 130);

        ctx.fillStyle =
            card.suit === "♥" || card.suit === "♦" ? "red" : "black";

        ctx.font = "22px Arial";
        ctx.fillText(card.rank + card.suit, card.x + 10, card.y + 30);
    }

    drawBack(card) {
        const ctx = this.ctx;

        ctx.fillStyle = "#1e3c72";
        ctx.fillRect(card.x, card.y, 90, 130);
        ctx.strokeRect(card.x, card.y, 90, 130);
    }
}
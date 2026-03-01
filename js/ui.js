export class UI {
    constructor(canvas) {
        this.canvas = canvas;
        this.state = "menu"; // menu | nickname | game | gameover
        this.nickname = "";
    }

    drawMenu(ctx) {
        ctx.fillStyle = "white";
        ctx.font = "48px Arial";
        ctx.fillText("КОЗЕЛ ONLINE", 350, 200);

        ctx.font = "28px Arial";
        ctx.fillText("Натисни ENTER", 430, 300);
    }

    drawNicknameInput(ctx) {
        ctx.fillStyle = "white";
        ctx.font = "32px Arial";
        ctx.fillText("Введи нікнейм:", 400, 250);

        ctx.strokeStyle = "white";
        ctx.strokeRect(350, 280, 400, 50);

        ctx.font = "26px Arial";
        ctx.fillText(this.nickname, 370, 315);
    }

    drawGameOver(ctx, scores) {
        ctx.fillStyle = "white";
        ctx.font = "40px Arial";
        ctx.fillText("ГРА ЗАВЕРШЕНА", 380, 250);

        ctx.font = "28px Arial";
        ctx.fillText("Team A: " + scores[0], 450, 320);
        ctx.fillText("Team B: " + scores[1], 450, 360);

        ctx.fillText("ENTER — Нова гра", 400, 420);
    }
}
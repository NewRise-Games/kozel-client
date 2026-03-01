import { Game } from "./game.js";
import { UI } from "./ui.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const ui = new UI(canvas);
let game = null;

window.addEventListener("keydown", (e) => {
    if (ui.state === "menu" && e.key === "Enter") {
        ui.state = "nickname";
    }
    else if (ui.state === "nickname") {
        if (e.key === "Enter") {
            ui.state = "game";
            game = new Game(ctx, canvas, ui.nickname);
            game.start();
        }
        else if (e.key === "Backspace") {
            ui.nickname = ui.nickname.slice(0, -1);
        }
        else if (e.key.length === 1) {
            ui.nickname += e.key;
        }
    }
    else if (ui.state === "gameover" && e.key === "Enter") {
        ui.state = "menu";
    }
});

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (ui.state === "menu") {
        ui.drawMenu(ctx);
    }
    else if (ui.state === "nickname") {
        ui.drawNicknameInput(ctx);
    }
    else if (ui.state === "game") {
        game.update();
        game.render();

        if (game.isFinished) {
            ui.state = "gameover";
        }
    }
    else if (ui.state === "gameover") {
        ui.drawGameOver(ctx, game.scores);
    }

    requestAnimationFrame(loop);
}

loop();
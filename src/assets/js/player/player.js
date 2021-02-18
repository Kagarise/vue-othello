import GameConfig from '@/assets/js/othello/game_config';

export default class Player {
    // player类型
    id;
    // player执子颜色
    color;

    constructor(id, color) {
        this.id = id;
        this.color = color;
    }

    getParams(board) {
        return {
            board: board,
            color: this.color,
            player: this.id
        }
    }

    execute(color) {
        return this.color === color;
    }

    isHuman() {
        return this.id === GameConfig.HUMAN_PLAYER;
    }

    toString() {
        return {"id": this.id, "color": this.color === GameConfig.BLACK ? "黑" : "白"};
    }
}
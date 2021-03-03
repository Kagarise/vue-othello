const BLACK = 1;
const WHITE = -1;
const EMPTY = 0;
const DIR = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]
const WEIGHT = [
    [20, -3, 11, 8, 8, 11, -3, 20],
    [-3, -7, -4, 1, 1, -4, -7, -3],
    [11, -4, 2, 2, 2, 2, -4, 11],
    [8, 1, 2, -3, -3, 2, 1, 8],
    [8, 1, 2, -3, -3, 2, 1, 8],
    [11, -4, 2, 2, 2, 2, -4, 11],
    [-3, -7, -4, 1, 1, -4, -7, -3],
    [20, -3, 11, 8, 8, 11, -3, 20]
]
const EMPTY_BOARD = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, -1, 1, 0, 0, 0],
    [0, 0, 0, 1, -1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
]

const HUMAN_PLAYER = "human";
const RANDOM_PLAYER = "random";
const GREEDY_NUMBER_PLAYER = "number";
const GREEDY_SCORE_PLAYER = "score";
const ALPHA_BETA_PLAYER = "alpha_beta";
const UCT_PLAYER = "uct";
const DEEP_LEARNING_PLAYER = "deep_learning";

const LOCAL_PLAY = "local";
const ONLINE_PLAY = "online";

const CREATE_ROOM = "create";
const JOIN_ROOM = "join";
export default {
    BLACK,
    WHITE,
    EMPTY,
    DIR,
    WEIGHT,
    EMPTY_BOARD,
    HUMAN_PLAYER,
    RANDOM_PLAYER,
    GREEDY_NUMBER_PLAYER,
    GREEDY_SCORE_PLAYER,
    ALPHA_BETA_PLAYER,
    UCT_PLAYER,
    DEEP_LEARNING_PLAYER,
    LOCAL_PLAY,
    ONLINE_PLAY,
    CREATE_ROOM,
    JOIN_ROOM
}
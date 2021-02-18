let dir = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]

function place(board, color, x, y, check_only = false) {
    if (x < 0 || y < 0 || x >= 8 || y >= 8 || board[x][y] !== 0)
        return false;
    let valid = false;
    for (let d = 0; d < 8; d++) {
        let i = x + dir[d][0];
        let j = y + dir[d][1];
        while (i >= 0 && i < 8 && j >= 0 && j < 8 && board[i][j] === -color) {
            i += dir[d][0];
            j += dir[d][1];
        }
        if (i >= 0 && i < 8 && j >= 0 && j < 8 && board[i][j] === color) {
            // eslint-disable-next-line no-constant-condition
            while (true) {
                i -= dir[d][0];
                j -= dir[d][1];
                if (i === x && j === y)
                    break;
                if (check_only)
                    return true;
                valid = true;
                board[i][j] = color;
            }
        }
    }
    if (check_only || valid === false)
        return false;
    else {
        board[x][y] = color;
        return board;
    }
}

function get_valid_moves(board, color) {
    let moves = []
    for (let i = 0; i < 8; i++)
        for (let j = 0; j < 8; j++)
            if (place(board, color, i, j, true))
                moves.push([i, j]);
    return moves;
}

export {
    place,
    get_valid_moves,
}
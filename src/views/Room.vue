<template>
    <div id="bg">
        <div class="pop">
            <transition name="pop">
                <div v-if="pop_type === this.PageConfig.SETTING" class="pop-bg"></div>
                <div v-else-if="pop_type === this.PageConfig.MENU" class="pop-bg"></div>
            </transition>
            <transition name="fade">
                <!-- 设置-->
                <div v-if="pop_type === this.PageConfig.SETTING" class="popup">
                    <p class="pop-title">设置</p>
                    <div class="select">
                        <span class="pop-title">提示</span>
                        <el-select v-model="tips_value" placeholder="请选择" style="width: 70%">
                            <el-option
                                    v-for="item in tips_list"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value"
                                    :disabled="item.disabled">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="btn" @click="revert()">
                        <svg class="icon" aria-hidden="true">
                            <use :xlink:href="btn_id"></use>
                        </svg>
                        <span>返回</span>
                    </div>
                </div>
                <!-- 菜单-->
                <div v-else-if="pop_type === this.PageConfig.MENU" class="popup">
                    <p class="pop-title">菜单</p>
                    <div class="btn-group-column">
                        <div class="btn" @click="to_index()">
                            <svg class="icon" aria-hidden="true">
                                <use :xlink:href="btn_id"></use>
                            </svg>
                            <span>返回首页</span>
                        </div>
                        <div class="btn" @click="retract()">
                            <svg class="icon" aria-hidden="true">
                                <use :xlink:href="btn_id"></use>
                            </svg>
                            <span>悔棋</span>
                        </div>
                        <div class="btn" @click="revert()">
                            <svg class="icon" aria-hidden="true">
                                <use :xlink:href="btn_id"></use>
                            </svg>
                            <span>返回</span>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
        <div v-if="!is_start" class="room">
            <p class="room-title">房间：{{ room_id }}</p>
            <div class="room-table">
                <div v-for="(val, idx) in user_list" :key="idx">{{ user_info(val) }}</div>
            </div>
            <div class="btn-group-column" v-if="user_list[0] === user_id">
                <div class="btn" @click="start_game()">
                    <svg class="icon" aria-hidden="true">
                        <use :xlink:href="btn_id"></use>
                    </svg>
                    <span>开始游戏</span>
                </div>
            </div>
        </div>
        <div v-else class="container">
            <div class="header">
                <div class="show current-black">
                    <span>{{ chess_cnt(1) }}</span>
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-black-chess"></use>
                    </svg>
                </div>
                <div class="show current-chess">
                    <span v-if="is_finish && judge_winner() !== 0">WINNER</span>
                    <span v-else-if="is_finish">DRAW</span>
                    <span v-else>Round:{{ past_step.length + 1 }}</span>
                    <svg class="icon" aria-hidden="true">
                        <use v-if="is_finish && judge_winner() > 0" xlink:href="#icon-black-chess"></use>
                        <use v-else-if="is_finish && judge_winner() < 0" xlink:href="#icon-white-chess"></use>
                        <use v-else-if="is_finish" xlink:href="#icon-candy"></use>
                        <use v-else-if="this.color === 1" xlink:href="#icon-black-chess"></use>
                        <use v-else-if="this.color === -1" xlink:href="#icon-white-chess"></use>
                    </svg>
                </div>
                <div class="show current-white">
                    <span>{{ chess_cnt(-1) }}</span>
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-white-chess"></use>
                    </svg>
                </div>
            </div>
            <div class="main">
                <div class="board">
                    <div class="row" v-for="(row, x) in current_board" :key="x">
                        <div class="cell" v-for="(cell, y) in row" :key="y" @click="local_operator(x, y)"
                             :class="{'choose':choose(x, y)}">
                            <svg v-if="tips_value !== '无' && valid_chess(x,y)" class="icon valid-chess"
                                 aria-hidden="true">
                                <use :xlink:href="tips_value"></use>
                            </svg>
                            <transition name="chess-reverse">
                                <div v-if="cell === -1" class="chess white-chess"></div>
                            </transition>
                            <transition name="chess-reverse">
                                <div v-if="cell === 1" class="chess black-chess"></div>
                            </transition>
                        </div>
                    </div>
                </div>
            </div>
            <div class="footer">
                <div class="tools">
                    <svg class="icon setting" aria-hidden="true" @click="setting()">
                        <use xlink:href="#icon-setting"></use>
                    </svg>
                    <svg class="icon menu" aria-hidden="true" @click="menu()">
                        <use xlink:href="#icon-menu"></use>
                    </svg>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {io} from 'socket.io-client'
import {get_valid_moves, place} from "@/assets/js/othello/game";
import Player from "@/assets/js/player/player";
import $ from "jquery";

export default {
    name: "Room",
    data() {
        return {
            btn_id: "#icon-title",
            is_start: false,
            socket: "undefined",
            room_id: "undefined",
            user_id: "undefined",
            user_list: ["", ""],
            is_dynamic: false,

            pop_type: this.PageConfig.DEFAULT,
            play_type: "undefined",
            player1_type: "undefined",
            player2_type: "undefined",
            player1: "undefined",
            player2: "undefined",
            my_color: "undefined",
            dir: [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]], // 方向向量
            is_finish: true, // 是否结束
            moves: [], // 可行解集
            past_board: [], // 记录棋盘状态
            current_board: [], // 当前棋盘状态
            past_step: [],// 记录落子地点
            x: -1, // 当前选中x坐标
            y: -1, // 当前选中y坐标
            color: this.GameConfig.BLACK, // 当前执子颜色
            operator_lock: true, // 操作锁
            tips_value: "#icon-firecrackers", // 提示下标
            tips_list: [{ // 提示集合
                name: "无",
                value: "无"
            }, {
                name: "猫爪",
                value: "#icon-ram_horn"
            }, {
                name: "柠檬",
                value: "#icon-lemon"
            }, {
                name: "汉堡包",
                value: "#icon-hamburg"
            }, {
                name: "雪花(冬季限定)",
                value: "#icon-snowflake"
            }, {
                name: "牛(牛年限定)",
                value: "#icon-ox"
            }, {
                name: "四叶草(春季限定)",
                value: "#icon-clover"
            }, {
                name: "鞭炮(春节限定)",
                value: "#icon-firecrackers"
            }, {
                name: "爱心(情人节限定)",
                value: "#icon-love"
            },],
        }
    },
    created() {
        this.get_params();
        this.init_socket();
    },
    mounted() {
    },
    beforeDestroy() {
        this.leave()
    },
    computed: {
        user_info() {
            return (val) => {
                return val === "" ? "NONE" : val;
            }
        },
        // 判断胜者
        judge_winner() {
            return () => {
                let b = this.chess_cnt(this.GameConfig.BLACK);
                let w = this.chess_cnt(this.GameConfig.WHITE);
                return b - w;
            }
        },
        // 可行解
        valid_chess() {
            return (x, y) => {
                for (let i = 0; i < this.moves.length; i++)
                    if (this.moves[i][0] === x && this.moves[i][1] === y)
                        return true;
                return false;
            }
        },
        // 选中点
        choose() {
            return (x, y) => {
                return this.x === x && this.y === y;
            }
        },
        // 棋子数量
        chess_cnt() {
            return (color) => {
                let cnt = 0;
                for (let i = 0; i < this.current_board.length; i++)
                    for (let j = 0; j < this.current_board[i].length; j++)
                        if (color === this.current_board[i][j])
                            cnt++;
                return cnt;
            }
        }
    },
    methods: {
        init_socket: function () {
            this.socket = io(this.$api.socket.room_socket);
            // 获得连接信息user_id，尝试进入房间
            this.socket.on('response_connect', (res) => {
                console.log('response_connect', res);
                this.user_id = res.user_id;
                this.join();
            });
            // 进入房间，将user_id加入到user_list
            this.socket.on('response_join', (res) => {
                console.log('response_join', res);
                if (res.code === 200) {
                    // 将个人信息加入房间玩家信息
                    this.user_list = JSON.parse(JSON.stringify(res.user_list));
                    console.log(res.msg)
                    console.log(this.user_list)
                } else {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'error',
                    });
                }
            })
            // 离开房间，更新list信息
            this.socket.on('response_leave', (res) => {
                console.log('response_leave', res)
                this.user_list = res.user_list;
            })
            // 开始游戏
            this.socket.on('response_start_game', () => {
                this.play_type = this.GameConfig.ONLINE_PLAY;
                this.player1_type = this.user_list[0] === this.user_id ? this.GameConfig.HUMAN_PLAYER : this.GameConfig.REMOTE_PLAYER;
                this.player2_type = this.user_list[1] === this.user_id ? this.GameConfig.HUMAN_PLAYER : this.GameConfig.REMOTE_PLAYER;
                this.my_color = this.player1_type === this.GameConfig.HUMAN_PLAYER ? this.GameConfig.BLACK : this.GameConfig.WHITE;
                console.log({
                    "start_game": {
                        "player1": this.player1_type,
                        "player2": this.player2_type,
                        "my_color": this.my_color,
                    }
                })
                this.init_game();
                this.is_start = true;
                this.get_background_image();
            })
            // 行动
            this.socket.on('response_action', (res) => {
                console.log('response_action', res);
                this.current_board = res.current_board;
                this.color = res.color;
                this.past_board = res.past_board;
                this.past_step = res.past_step;
                this.moves = res.moves;
                this.x = res.x;
                this.y = res.y;
                this.is_finish = res.is_finish;
                if (this.is_finish)
                    return;
                if (this.color === this.my_color)
                    this.operator_lock = false;
                if (!this.is_dynamic)
                    this.dynamic_board()
                this.is_dynamic = true;
            })
        },
        get_params: function () {
            this.room_id = this.$route.params.room_id;
        },
        join: function () {
            this.socket.emit('join', {'user_id': this.user_id, 'room_id': this.room_id})
        },
        leave: function () {
            this.socket.emit('leave', {'user_id': this.user_id, 'room_id': this.room_id})
        },
        start_game: function () {
            for (let i in this.user_list) {
                if (this.user_list[i] === '') {
                    this.$message({
                        showClose: true,
                        message: '房间人未满',
                        type: 'error',
                    });
                    return;
                }
            }
            this.socket.emit('start_game', {'room_id': this.room_id})
        },
        get_background_image: function () {
            $("#bg").css("background-image", "url(" + this.$api.img.othello_bg + ")");
        },
        dynamic_board: function () {
            console.log($('.main').height());
            this.cal_size();
            window.onresize = () => {
                return (() => {
                    this.cal_size();
                })()
            }
        },
        cal_size: function () {
            let _main = $(".main");
            let main_size = Math.min(_main.width(), _main.height());
            $(".header").css("width", main_size);
            $(".footer").css("width", main_size);
            let board_size = Math.ceil(main_size * 0.9);
            let _board = $(".board");
            _board.css("width", board_size);
            _board.css("height", board_size);
            let _row = $(".row");
            _row.css("height", board_size / 8);
            let _cell = $(".cell");
            _cell.css("width", board_size / 8);
            _cell.css("height", board_size / 8);
        },
        init_game: function () {
            this.is_finish = false;
            this.current_board = JSON.parse(JSON.stringify(this.GameConfig.EMPTY_BOARD));
            this.x = -1;
            this.y = -1;
            this.past_board = [];
            this.past_board.push(JSON.parse(JSON.stringify(this.current_board)));
            this.past_step = [];
            this.color = this.GameConfig.BLACK;
            this.operator_lock = true;
            this.moves = get_valid_moves(this.current_board, this.color);
            this.player1 = new Player(this.player1_type, this.GameConfig.BLACK);
            this.player2 = new Player(this.player2_type, this.GameConfig.WHITE);
            this.action();
        },
        // 更新游戏状态
        update_status: function () {
            // 更新棋盘数据
            this.current_board = JSON.parse(JSON.stringify(this.current_board));
            // 记录棋盘状态
            this.past_board.push(JSON.parse(JSON.stringify(this.current_board)));
            this.past_step.push([this.x, this.y])
            // 变换执子颜色
            this.color = -this.color;
            // 获取可行解
            this.moves = get_valid_moves(this.current_board, this.color);
            // 输出状态信息
            console.log({
                'board': this.current_board,
                'color': this.color === this.GameConfig.BLACK ? '黑' : '白',
                'moves': this.moves,
                'past_board': this.past_board,
                'past_step': this.past_step,
                'position': {'x': this.x, 'y': this.y}
            });
            // 若无可行解
            if (this.moves.length === 0) {
                this.no_move()
                this.past_board.push(JSON.parse(JSON.stringify(this.current_board)));
                this.past_step.push([this.x, this.y])
                this.color = -this.color;
            }
            if (this.is_finish)
                return;
            // 打开操作锁
            this.operator_lock = true;
            this.action();
        },
        // 悔棋
        retract: function () {
            let flag = true;
            if (this.operator_lock || this.is_finish) {
                flag = false;
            } else {
                let revert_cnt = 1;
                if (this.play_type === this.GameConfig.ONLINE_PLAY)
                    revert_cnt = 2;
                while (revert_cnt--) {
                    if (this.past_board.length === 1 || this.past_step.length === 0) {
                        flag = false;
                        break;
                    }
                    this.color = -this.color;
                    this.past_board.pop();
                    this.past_step.pop();
                    this.current_board = this.past_board[this.past_board.length - 1];
                    let x = -1, y = -1;
                    let len = this.past_step.length;
                    if (len !== 0) {
                        x = this.past_step[len - 1][0];
                        y = this.past_step[len - 1][1];
                    }
                    this.x = x;
                    this.y = y;
                    console.log({
                        "type": "retract",
                        "board": this.current_board,
                        "pos": this.x + ',' + this.y
                    })
                }
                this.current_board = JSON.parse(JSON.stringify(this.current_board));
                this.moves = get_valid_moves(this.current_board, this.color);
                this.action()
            }
            if (!flag) {
                this.$message({
                    showClose: true,
                    message: 'You can\'t retract!',
                    type: 'error'
                });
            } else {
                this.revert();
            }
        },
        // 行动
        action: function () {
            this.socket.emit('action', {
                'room_id': this.room_id,
                'current_board': this.current_board,
                'color': this.color,
                'past_board': this.past_board,
                'past_step': this.past_step,
                'moves': this.moves,
                'x': this.x,
                'y': this.y,
                'is_finish': this.is_finish,
            })
        },
        // 本地操作
        local_operator: function (x, y) {
            if (this.operator_lock || x < 0 || y < 0 || x >= 8 || y >= 8)
                return false;
            if (this.x !== x || this.y !== y) {
                this.x = x;
                this.y = y;
                console.log({'color': this.color === this.GameConfig.BLACK ? '黑' : '白', 'x:': this.x, 'y': this.y});
                return false;
            }
            let new_board = place(this.current_board, this.color, this.x, this.y);
            if (new_board === false) {
                this.$message({
                    showClose: true,
                    message: 'You can\'t place here!',
                    type: 'error'
                });
            } else {
                this.current_board = new_board;
                this.update_status();
            }
            this.action();
        },
        // 网络操作
        // online_operator: function (params) {
        //     let sleep_time = 800;
        //     let start_time = Date.now();
        //     // this.$api.othello.test_get_move(params)
        //     this.$api.othello.get_move(params)
        //             .then((response) => {
        //                 if (response.status === 200 && response.data.code === 200) {
        //                     console.log(response.data.data)
        //                     this.x = response.data.data.x;
        //                     this.y = response.data.data.y;
        //                 } else {
        //                     this.$message({
        //                         showClose: true,
        //                         message: '请求错误',
        //                         type: 'error'
        //                     });
        //                 }
        //                 if (this.x !== null && this.y !== null) {
        //                     if (this.x === -1 && this.y === -1) {
        //                         this.update_status();
        //                     } else {
        //                         let new_board = place(this.current_board, this.color, this.x, this.y);
        //                         if (new_board === false) {
        //                             this.$message({
        //                                 showClose: true,
        //                                 message: 'Place ERROR!',
        //                                 type: 'error'
        //                             });
        //                         } else {
        //                             this.current_board = new_board;
        //                             this.update_status();
        //                         }
        //                     }
        //                 }
        //                 while (Date.now() - start_time < sleep_time) ;
        //             })
        // },
        // 无可行解
        no_move: function () {
            // 判定是否结束
            this.x = -1;
            this.y = -1;
            this.moves = get_valid_moves(this.current_board, -this.color);
            if (this.moves.length === 0) {
                // this.$message({
                //     showClose: true,
                //     message: '游戏结束! 黑子:' + this.chess_cnt(this.GameConfig.BLACK) + ', 白子:' + this.chess_cnt(this.GameConfig.WHITE),
                //     type: 'success',
                //     duration: 0
                // });
                this.is_finish = true;
            } else {
                // 若未结束，再次更新状态
                this.$message({
                    showClose: true,
                    message: '当前' + (this.color === this.GameConfig.BLACK ? '黑' : '白') + '子无处可下',
                    type: 'info',
                    duration: 0
                });
            }
        },
        setting: function () {
            this.pop_type = this.PageConfig.SETTING;
        },
        menu: function () {
            this.pop_type = this.PageConfig.MENU;
        },
        revert: function (page = this.PageConfig.DEFAULT) {
            this.pop_type = page;
        },
        to_index: function () {
            if (this.is_finish === false) {
                this.$message({
                    showClose: true,
                    message: '游戏进行中，无法返回',
                    type: 'error'
                });
            } else {
                this.$router.push({name: "Index"});
            }
        },
    },
}
</script>

<style scoped src="../assets/css/room.css"></style>
<style scoped src="../assets/css/bg.css"></style>
<style scoped src="../assets/css/btn-group.css"></style>
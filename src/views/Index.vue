<template>
    <div id="bg">
        <!-- 弹出页面-->
        <div class="pop">
            <!-- bg-->
            <transition name="pop">
                <div v-if="pop_type === this.PageConfig.START" class="pop-bg start-bg"></div>
                <div v-else-if="pop_type === this.PageConfig.MODEL_ONE" class="pop-bg model-one-bg"></div>
                <div v-else-if="pop_type === this.PageConfig.MODEL_TWO" class="pop-bg model-two-bg"></div>
                <div v-else-if="pop_type === this.PageConfig.MODEL_ROOM" class="pop-bg model-room-bg"></div>
                <div v-else-if="pop_type === this.PageConfig.ABOUT" class="pop-bg about-bg"></div>
            </transition>
            <!-- 开始-->
            <transition name="fade">
                <!-- 选择模式：单人/双人-->
                <div v-if="pop_type === this.PageConfig.START" class="popup">
                    <p class="pop-title">选择模式</p>
                    <div class="btn-group-column">
                        <div v-for="(val, idx) in model_list" :key="idx" class="btn" @click="toPage(val.value)">
                            <svg class="icon" aria-hidden="true">
                                <use :xlink:href="btn_id"></use>
                            </svg>
                            <span>{{ val.name }}</span>
                        </div>
                        <div class="btn" @click="revert()">
                            <svg class="icon" aria-hidden="true">
                                <use :xlink:href="btn_id"></use>
                            </svg>
                            <span>返回</span>
                        </div>
                    </div>
                </div>
                <!-- 单人：选择难度-->
                <div v-else-if="pop_type === this.PageConfig.MODEL_ONE" class="popup">
                    <p class="pop-title">选择难度</p>
                    <div class="btn-group-column">
                        <div v-for="(val, idx) in level_list" :key="idx" class="btn" @click="chooseLevel(val.value)">
                            <svg class="icon" :style="{'fill': val.style}" aria-hidden="true">
                                <use :xlink:href="btn_id"></use>
                            </svg>
                            <span style="color: white; font-family: 'Sitka Banner', serif">{{ val.name }}</span>
                        </div>
                        <div class="btn" @click="revert(1)">
                            <svg class="icon" aria-hidden="true">
                                <use :xlink:href="btn_id"></use>
                            </svg>
                            <span>返回</span>
                        </div>
                    </div>
                </div>
                <!-- 双人：选择方式-->
                <div v-else-if="pop_type === this.PageConfig.MODEL_TWO" class="popup">
                    <p class="pop-title">选择方式</p>
                    <div class="btn-group-column">
                        <div v-for="(val, idx) in way_list" :key="idx" class="btn" @click="chooseWay(val.value)">
                            <svg class="icon" aria-hidden="true">
                                <use :xlink:href="btn_id"></use>
                            </svg>
                            <span>{{ val.name }}</span>
                        </div>
                        <div class="btn" @click="revert(1)">
                            <svg class="icon" aria-hidden="true">
                                <use :xlink:href="btn_id"></use>
                            </svg>
                            <span>返回</span>
                        </div>
                    </div>
                </div>
                <div v-else-if="pop_type === this.PageConfig.MODEL_ROOM" class="popup">
                    <p class="pop-title">选择房间</p>
                    <div class="btn-group-column">
                        <div v-for="(val, idx) in room_list" :key="idx" class="btn" @click="chooseRoom(val.value)">
                            <svg class="icon" aria-hidden="true">
                                <use :xlink:href="btn_id"></use>
                            </svg>
                            <span>{{ val.name }}</span>
                        </div>
                        <el-input class="pop-input"
                                  placeholder="请输入房间号"
                                  v-model="room_id">
                        </el-input>
                        <div class="btn" @click="revert(4)">
                            <svg class="icon" aria-hidden="true">
                                <use :xlink:href="btn_id"></use>
                            </svg>
                            <span>返回</span>
                        </div>
                    </div>
                </div>
                <!-- 关于-->
                <div v-if="pop_type === this.PageConfig.ABOUT" class="popup">
                    <p class="pop-title">关于游戏</p>
                    <div class="pop-content">
                        <p>设计:&nbsp;<a href="https://github.com/kagarise" target="_blank">kagarise</a></p>
                        <p>程序:&nbsp;<a href="https://github.com/kagarise" target="_blank">kagarise</a></p>
                        <p>接口:&nbsp;<a href="https://github.com/kagarise" target="_blank">kagarise</a></p>
                    </div>
                    <div class="btn-group-column">
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
        <!-- 主页面-->
        <transition name="fade">
            <div v-if="pop_type === this.PageConfig.DEFAULT" class="main">
                <!--         标题-->
                <div class="title"><span>Memories<br/>of<br/>Conflict</span></div>
                <!--         按钮：开始/关于-->
                <div class="content">
                    <div class="btn-group-column">
                        <div class="btn" @click="start()">
                            <svg class="icon" aria-hidden="true">
                                <use :xlink:href="btn_id"></use>
                            </svg>
                            <span>开始游戏</span>
                        </div>
                        <div class="btn" @click="about()">
                            <svg class="icon" aria-hidden="true">
                                <use :xlink:href="btn_id"></use>
                            </svg>
                            <span>关于</span>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import $ from 'jquery'

export default {
    name: "Index",
    data() {
        return {
            btn_id: "#icon-title",
            pop_type: this.PageConfig.DEFAULT,
            model_list: [{
                name: "单人模式",
                value: this.PageConfig.MODEL_ONE,
            }, {
                name: "双人模式",
                value: this.PageConfig.MODEL_TWO,
            },],
            level_list: [{
                name: "Lethe",
                value: this.GameConfig.RANDOM_PLAYER,
                style: "yellow"
            }, {
                name: "Saya",
                value: this.GameConfig.GREEDY_NUMBER_PLAYER,
                style: "green"
            }, {
                name: "Eto",
                value: this.GameConfig.GREEDY_SCORE_PLAYER,
                style: "blue"
            }, {
                name: "Luna",
                value: this.GameConfig.UCT_PLAYER,
                style: "purple"
            }, {
                name: "Kou",
                value: this.GameConfig.ALPHA_BETA_PLAYER,
                style: "red"
            }, {
                name: "Tempest",
                value: this.GameConfig.DEEP_LEARNING_PLAYER,
                style: "black"
            },],
            way_list: [{
                name: "本地双人",
                value: this.GameConfig.LOCAL_PLAY,
            }, {
                name: "在线双人",
                value: this.GameConfig.ONLINE_PLAY,
            },],
            room_list: [{
                name: "创建房间",
                value: this.GameConfig.CREATE_ROOM,
            }, {
                name: "加入房间",
                value: this.GameConfig.JOIN_ROOM,
            }],
            room_id: '',
        }
    },
    created() {
    },
    mounted() {
        $("#bg").css("background-image", "url(" + this.$api.img.index_bg + ")")
    },
    methods: {
        start: function () {
            this.pop_type = this.PageConfig.START;
        },
        about: function () {
            this.pop_type = this.PageConfig.ABOUT;
        },
        revert: function (page = this.PageConfig.DEFAULT) {
            this.pop_type = page;
        },
        toPage: function (pop_type) {
            this.pop_type = pop_type;
        },
        chooseLevel: function (level_type) {
            if (level_type !== this.GameConfig.RANDOM_PLAYER
                    && level_type !== this.GameConfig.GREEDY_SCORE_PLAYER
                    && level_type !== this.GameConfig.GREEDY_NUMBER_PLAYER
                    && level_type !== this.GameConfig.UCT_PLAYER
                    && level_type !== this.GameConfig.ALPHA_BETA_PLAYER) {
                this.$message({
                    showClose: true,
                    message: '暂未开放',
                    type: 'info',
                });
            } else {
                this.$router.push({
                    name: "Othello",
                    params: {
                        play_type: this.GameConfig.ONLINE_PLAY,
                        player1_type: this.GameConfig.HUMAN_PLAYER,
                        player2_type: level_type,
                    }
                });
            }
        },
        chooseWay: function (way_type) {
            switch (way_type) {
                case this.GameConfig.LOCAL_PLAY:
                    this.$router.push({
                        name: "Othello",
                        params: {
                            play_type: this.GameConfig.LOCAL_PLAY,
                            player1_type: this.GameConfig.HUMAN_PLAYER,
                            player2_type: this.GameConfig.HUMAN_PLAYER,
                        }
                    });
                    break;
                case this.GameConfig.ONLINE_PLAY:
                    this.pop_type = this.PageConfig.MODEL_ROOM;
                    break;
                default:
                    this.$message({
                        showClose: true,
                        message: '选择方式错误',
                        type: 'error',
                    });
            }
        },
        chooseRoom: function (room_type) {
            switch (room_type) {
                case this.GameConfig.CREATE_ROOM:
                    // this.$api.othello.test_create_room()
                    this.$api.othello.create_room()
                            .then((response) => {
                                if (response.status === 200 && response.data.code === 200) {
                                    console.log(response.data.data)
                                    let room_id = response.data.data.room_id;
                                    this.$router.push({
                                        name: "Room",
                                        params: {
                                            room_id: room_id
                                        }
                                    });
                                } else {
                                    this.$message({
                                        showClose: true,
                                        message: '创建房间请求错误',
                                        type: 'error'
                                    });
                                }
                            })
                    break;
                case this.GameConfig.JOIN_ROOM:
                    if (this.room_id.length !== 6) {
                        this.$message({
                            showClose: true,
                            message: '房间号为六位',
                            type: 'error'
                        });
                        break;
                    }
                    // eslint-disable-next-line no-case-declarations
                    let i = 0;
                    for (; i < this.room_id.length; i++)
                        if (!(this.room_id[i] >= '0' && this.room_id[i] <= '9') && !(this.room_id[i] >= 'a' && this.room_id[i] <= 'z')) {
                            this.$message({
                                showClose: true,
                                message: '房间号只包含数字和小写字母',
                                type: 'error'
                            });
                            break;
                        }
                    if (i >= this.room_id.length) {
                        this.$router.push({
                            name: "Room",
                            params: {
                                room_id: this.room_id
                            }
                        });
                    }
                    break;
                default:
                    this.$message({
                        showClose: true,
                        message: '选择房间错误',
                        type: 'error',
                    })
            }
        }
    }
}
</script>

<style scoped src="../assets/css/index.css"></style>
<style scoped src="../assets/css/bg.css"></style>
<style scoped src="../assets/css/btn-group.css"></style>
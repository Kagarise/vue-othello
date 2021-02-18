<template>
    <div id="bg">
        <!-- 弹出页面-->
        <div class="pop">
            <!-- bg-->
            <transition name="pop">
                <div v-if="pop_type === this.PageConfig.START" class="pop-bg start-bg"></div>
                <div v-else-if="pop_type === this.PageConfig.MODEL_ONE" class="pop-bg model-one-bg"></div>
                <div v-else-if="pop_type === this.PageConfig.MODEL_TWO" class="pop-bg model-two-bg"></div>
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
                <!-- 关于-->
                <div v-if="pop_type === this.PageConfig.ABOUT" class="popup">
                    <p class="pop-title">关于游戏</p>
                    <div class="pop-content">
                        <p>设计:&nbsp;<a href="https://github.com/Kagarise" target="_blank">kagarise</a></p>
                        <p>程序:&nbsp;<a href="https://github.com/Kagarise" target="_blank">kagarise</a></p>
                        <p>接口:&nbsp;<a href="https://github.com/Kagarise" target="_blank">kagarise</a></p>
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
                value: this.GameConfig.GREEDY_NUMBER_PLAYER,
                style: "yellow"
            }, {
                name: "Saya",
                value: this.GameConfig.RANDOM_PLAYER,
                style: "green"
            }, {
                name: "Eto",
                value: this.GameConfig.GREEDY_SCORE_PLAYER,
                style: "blue"
            }, {
                name: "Luna",
                value: this.GameConfig.MINIMAX_PLAYER,
                style: "purple"
            }, {
                name: "Kou",
                value: this.GameConfig.UCT_PLAYER,
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
            if (level_type !== this.GameConfig.GREEDY_SCORE_PLAYER && level_type !== this.GameConfig.RANDOM_PLAYER && level_type !== this.GameConfig.GREEDY_NUMBER_PLAYER) {
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
                    this.$message({
                        showClose: true,
                        message: '暂未开放',
                        type: 'info',
                    });
                    // this.$router.push({
                    //     name: "Othello",
                    //     params: {
                    //         play_type: this.GameConfig.ONLINE_PLAY,
                    //         player1: this.GameConfig.HUMAN_PLAYER,
                    //         player2: this.GameConfig.HUMAN_PLAYER,
                    //     }
                    // });
                    break;
                default:
                    this.$message({
                        showClose: true,
                        message: '选择方式错误',
                        type: 'error',
                    });
            }
        },
    }
}
</script>

<style scoped src="../assets/css/index.css"></style>
<style scoped src="../assets/css/bg.css"></style>
<style scoped src="../assets/css/btn-group.css"></style>
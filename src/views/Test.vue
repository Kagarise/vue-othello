<template>
    <div id="test">
        <button @click="test">click</button>
    </div>
</template>

<script>

export default {
    name: "Test",
    data() {
        return {
            lock: false,
            x: -1,
            y: -1,
            d_test: [1, 1, 1, 1, 1]
        }
    },
    created() {
        console.log(this.d_test === false)
    },
    mounted() {
    },
    methods: {
        getXY: function () {
            this.lock = true;
            let params = {
                board: this.GameConfig.EMPTY_BOARD,
                color: this.GameConfig.BLACK,
                player: this.GameConfig.GREEDY_NUMBER_PLAYER
            }
            this.$api.othello.get_move(params)
                    .then((response) => {
                        if (response.status === 200)
                            console.log(response.data.msg);
                        if (response.status === 200 && response.data.code === 200) {
                            console.log(response.data.data)
                            this.x = response.data.data.x;
                            this.y = response.data.data.y;
                        } else {
                            this.$message({
                                showClose: true,
                                message: '请求错误',
                                type: 'error'
                            });
                        }
                        this.lock = false;
                    })
        },
        test: function () {
            this.$router.push({
                name: "Othello",
                params: {
                    play_type: this.GameConfig.ONLINE_PLAY,
                    player1_type: this.GameConfig.MINIMAX_PLAYER,
                    player2_type: this.GameConfig.RANDOM_PLAYER,
                }
            });
        }
    }
}
</script>

<style scoped>
#test {
    height: 100%;
    width: 100%;
    background: url("https://othello-1304519045.cos.ap-nanjing.myqcloud.com/img/bg/index.jpg") no-repeat center;
    background-size: cover;
    position: fixed;
}
</style>
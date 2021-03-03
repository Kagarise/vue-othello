<template>
    <div id="bg">
        <p class="room-title">房间：{{ room_id }}</p>
        <div class="room-table">
            <div v-for="(val, idx) in user_list" :key="idx">{{ user_info(val) }}</div>
        </div>
    </div>
</template>

<script>
import {io} from 'socket.io-client'

export default {
    name: "Room",
    data() {
        return {
            socket: "undefined",
            room_id: "undefined",
            user_id: "undefined",
            user_list: ["", ""]
        }
    },
    created() {
        this.get_params();
    },
    mounted() {
        this.init_socket();
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
            // this.socket.on('response_leave', (res) => {
            //     console.log('response_leave', res)
            //     this.user_list = res.user_list;
            // })
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
        to_index: function () {
            this.$router.push({
                name: "Index"
            });
        },
    },
}
</script>

<style scoped>

</style>
import base from './base'
import axios from "@/api/http";

const othello = {
    get_move(params) {
        return axios.post(`${base.ray}/action`, params);
    },
    create_room() {
        return axios.post(`${base.ray}/create_room`);
    },
    test_get_move(params) {
        return axios.post(`${base.test_ray}/action`, params);
    },
    test_create_room() {
        return axios.post(`${base.test_ray}/create_room`);
    }
}
export default othello;
import base from './base'
import axios from "@/utils/http";

const othello = {
    get_move(params) {
        return axios.post(`${base.ray}/action`, params);
    },
    test_get_move(params) {
        return axios.post(`${base.test_ray}/action`, params);
    }
}
export default othello;
import base from './base'
import axios from "@/utils/http";

const othello = {
    get_move(params) {
        return axios.post(`${base.ray}/action`, params);
    },
}
export default othello;
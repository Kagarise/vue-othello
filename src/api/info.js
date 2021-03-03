import base from './base'
import axios from "@/api/http";

const info = {
    get_info() {
        return axios.get(`${base.ray}/info`);
    },
    test_get_info() {
        return axios.get(`${base.test_ray}/info`)
    }
}
export default info;
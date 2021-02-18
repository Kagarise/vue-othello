import axios from "axios";

let instance = axios.create({timeout: 1000 * 10});

instance.defaults.headers.post['Content-Type'] = 'application/json';

export default instance;
import '@/assets/css/reset.css';

import Vue from 'vue';
import App from './App.vue';

Vue.config.productionTip = false;

import axios from 'axios';
import router from "@/router";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/iconfont/iconfont.css'
import '@/assets/iconfont/iconfont'

Vue.use(ElementUI);

import api from '@/api';
import GameConfig from '@/assets/js/othello/game_config';
import PageConfig from '@/assets/js/othello/page_config';

Vue.prototype.$api = api;
Vue.prototype.GameConfig = GameConfig;
Vue.prototype.PageConfig = PageConfig;

new Vue({
    render: h => h(App),
    router,
    axios
}).$mount('#app')

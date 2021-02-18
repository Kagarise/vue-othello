import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
    routes: [{
        path: '/index',
        name: 'Index',
        component: () => import('@/views/Index')
    }, {
        path: '/othello',
        name: 'Othello',
        component: () => import('@/views/Othello'),
        hidden: true
    }, {
        path: '/test',
        name: 'Test',
        component: () => import('@/views/Test'),
        hidden: true
    }, {
        path: "*",
        redirect: "/index"
    }]
})
export default router
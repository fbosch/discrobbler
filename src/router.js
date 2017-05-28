import Vue from 'vue'
import VueRouter from 'vue-router'
import containers from './containers'
import reduce from 'lodash.reduce'

Vue.use(VueRouter)

export const views = {
    login: {
        path: '/login',
        component: containers.Login
    },
    dashboard: {
        path: '/dashboard',
        component: containers.Dashboard
    },
    release: {
        path: '/release/:id',
        component: containers.Release
    },
    authenticate: {
        path: '/authenticate/:auth',
        component: containers.Login
    }
}

export const routes = reduce(views, (accum, val, key) => [...accum, { ...val, name: key }], [])

export default new VueRouter({
    mode: 'history',
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { x: 0, y: 0 }
        }
    }
})
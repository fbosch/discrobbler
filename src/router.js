import Vue from 'vue'
import VueRouter from 'vue-router'
import containers from './containers'
import reduce from 'lodash.reduce'
import { isLoggedIn } from './utils'

Vue.use(VueRouter)

export const views = {
    login: {
        path: '/login',
        component: containers.Login
    },
    authenticate: {
        path: '/authenticate/:auth',
        component: containers.Login
    },
    dashboard: {
        path: '/dashboard',
        component: containers.Dashboard,
        meta: { requiresAuth: true }
    },
    release: {
        path: '/release/:id',
        component: containers.Release,
        meta: { requiresAuth: true }        
    }
}

export const routes = reduce(views, (accum, val, key) => [...accum, { ...val, name: key }], [])
const router = new VueRouter({
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

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!isLoggedIn()) {
            next(views.login)
        } else {
            next()
        }
    } else {
        next()
    }
})

export default router
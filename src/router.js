import Vue from 'vue'
import VueRouter from 'vue-router'
import containers from './containers'
import reduce from 'lodash.reduce'
import { isLoggedIn } from './utils'
import store from './store'
import * as pageActions from './store/actions/page.actions'

Vue.use(VueRouter)

export const views = {
    home: {
        path: '/',
        component: containers.Home,
        meta: { showInSideNav: true }
    },
    login: {
        path: '/login',
        component: containers.Login,
        meta: { 
            showInSideNav: true,
            icon: 'settings'
        }
    },
    authenticate: {
        path: '/authenticate/:auth',
        component: containers.Login,
    },
    collection: {
        path: '/collection',
        component: containers.Collection,
        meta: { 
            requiresAuth: true,
            showInSideNav: true,
            icon: 'library_music'
        }
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
    requestAnimationFrame(store.dispatch(pageActions.closeSideNav()))
})

export default router
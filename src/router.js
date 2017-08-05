import Vue from 'vue'
import VueRouter from 'vue-router'
import containers from './containers'
import reduce from 'lodash.reduce'
import { isLoggedIn } from './utils'
import store from './store'
import get from 'lodash.get'
import * as pageActions from './store/actions/page.actions'
import * as routerActions from './store/actions/router.actions'

export function getRouteIcon(route) {
    if (route.meta && route.meta.icon) {
        return route.meta.icon
    }
    return route.name
}

export const views = {
    home: {
        path: '/',
        component: containers.Home,
        meta: { 
            showInSideNav: true, 
            showInBottomBar: true 
        }
    },
    login: {
        path: '/login',
        component: containers.Login,
        meta: { 
            showInSideNav: true,
            showInBottomBar: false,
            hideWhenAuth: true,
            icon: 'lock'
        }
    },
    authenticate: {
        path: '/authenticate/:auth',
        component: containers.Login,
    },
    collection: {
        path: '/collection',
        component: containers.Collection,
        // beforeEnter: containers.Collection.prototype.constructor.options.methods.beforeRouteEnter,
        meta: { 
            requiresAuth: true,
            showInSideNav: true,
            showInBottomBar: true,
            icon: 'library_music'
        }
    },
    release: {
        path: '/release/:id',
        component: containers.Release,
        // beforeEnter: containers.Release.prototype.constructor.options.methods.beforeRouteEnter,
        meta: { requiresAuth: true }        
    },
    logout: {
        path: '/logout',
        component: containers.Logout,
        meta: { 
            requiresAuth: true, 
            showInSideNav: true,
            icon: 'exit_to_app'
        }

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
    requestAnimationFrame(() => store.dispatch(pageActions.closeSideNav()))
})


router.onReady(() => {
    router.afterEach((to, from) => store.dispatch(routerActions.changeCurrentLocation(to)))    
    store.subscribe(() => {
        const routeFromState = get(store.getState(), 'route.currentRoute', null)
        if (routeFromState && routeFromState.name !== router.currentRoute.name) {
            router.push(routeFromState)
        }
    })
})


export default router
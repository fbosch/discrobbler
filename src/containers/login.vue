<script>
import Vue from 'vue'
import store from '../store'
import { Component, Watch } from 'vue-property-decorator'
import router, { views } from '../router'
import get from 'lodash.get'
import keys from '../keys'
import lastfm from '../api/lastfm'
import * as discogsActions from '../store/actions/discogs.actions'
import * as lastFmActions from '../store/actions/lastfm.actions'
import * as pageActions from '../store/actions/page.actions'
import queryString from 'query-string'
import viewports from '../viewports'

@Component
export default class Login extends Vue {
    discogsUser = Login.getDiscogsUser()
    discogsUsername = Login.getDiscogsUsername()
    lastfmSession = Login.getLastfmSession()

    static getLastfmSession = () => get(store.getState(), 'lastfm.session', null)
    static getDiscogsUser = () => get(store.getState(),'discogs.user', null)
    static getDiscogsUsername = () => get(store.getState(),'discogs.user.username', null)

    mounted() {
        const parsedQueryString = queryString.parse(location.search)
        if (router.currentRoute.name === 'authenticate' && parsedQueryString.token !== null) {
            switch (router.currentRoute.params.auth) {
                case 'lastfm':
                    store.dispatch(lastFmActions.setAuthenticationToken(parsedQueryString.token))
                    break
            }
        }
        const lastfmToken = store.getState().lastfm.authenticationToken
        const lastfmSession = store.getState().lastfm.session
        if (lastfmToken && !lastfmSession) store.dispatch(lastFmActions.getSession(lastfmToken))
        this.beforeDestroy = store.subscribe(() => {
            this.lastfmSession = Login.getLastfmSession()
            this.discogsUser = Login.getDiscogsUser()
        })
    }

    get isMobile() {
        return this.$currentViewport._windowWidth <= viewports.mobile
    }

    authorizeLastfm() {
        store.dispatch(pageActions.clearMessage())
        store.dispatch(lastFmActions.authenticateUser())
    }

    authorizeDiscogs() {
        if (this.discogsUsername || this.discogsUsername !== '') {
            store.dispatch(discogsActions.fetchUser(this.discogsUsername))
                .then(response => {
                    if(response.error) {
                        store.dispatch(pageActions.showMessage('An error occured when retrieving the given discogs user: '+ this.discogsUsername  ))
                    } else {
                        store.dispatch(lastFmActions.getRecentTracks(store.getState().lastfm.session.name))
                        router.push(views.home)
                    }
                })
        }
    }

    unauthorize() {
        store.dispatch(discogsActions.clearState())
        store.dispatch(lastFmActions.clearState())
    }
}

</script>
<template>
<section class="login">
    <md-toolbar class="md-accent md-large">
        <transition name="fade">
            <md-icon class="md-size-3x" v-if="discogsUser">
                lock_open
            </md-icon>
            <md-icon class="md-size-3x" v-else>
                lock_outline
            </md-icon>
        </transition>
    </md-toolbar>
    <md-layout md-align="center" class="login__stepper small-container">
        <md-stepper md-elevation="1" :md-vertical="isMobile" @completed="authorizeDiscogs">
            <md-step md-label="Last.fm" :md-continue="!!lastfmSession">
                <md-button class="md-raised md-default" @click.native="authorizeLastfm" v-if="!lastfmSession">
                    Connect to Last.fm
                </md-button>
                <div v-if="lastfmSession">
                    <md-icon>
                        <img src="https://res.cloudinary.com/discrobbler/image/upload/v1502580345/lastfm-logo_y75msg.svg" alt="lastfm">
                    </md-icon>
                    Authorized as {{ lastfmSession.name }} <br>
                    <md-button class="md-default md-dense" @click.native="unauthorize">
                        Unauthorize Last.fm
                    </md-button>
                </div>
            </md-step>
            <md-step md-label="Discogs">
                <md-layout>
                    <md-input-container>
                        <label>Discogs Username</label>
                        <md-input v-model="discogsUsername" @keyup.enter="authorizeDiscogs" :required="true"></md-input>
                    </md-input-container>
                </md-layout>
            </md-step>
        </md-stepper>
    </md-layout>
</section>
</template>
<style lang="scss">
.login {
	&__stepper {
		margin-top: -40px;
		padding: 20px;
	}

	.md-toolbar {
		height: 128px;
		transition: height .5s linear;
		padding-bottom: 20px;
		&.is-logged-in {
			height: 100vh;
		}
	}
	.md-whiteframe {
		background-color: white;
	}
}</style>

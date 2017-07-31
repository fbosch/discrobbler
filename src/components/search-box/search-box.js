import Vue from 'vue'
import Component from 'vue-class-component'
import { Watch } from 'vue-property-decorator'
import * as pageActions from '../../store/actions/page.actions'
import router, { views } from '../../router'
import store from '../../store'
import debounce from 'lodash.debounce'
import isNil from 'lodash.isnil'

@Component
export default class SearchBox extends Vue {
    open = false
    searchQuery = null
    
    @Watch('searchQuery')
    onSearchChanges = debounce(newVal => {
        if (newVal !== null) {
            store.dispatch(pageActions.search(newVal))
            this.goToDashboard()
        }
    }, 350)

    goToDashboard() {
        if (router.currentRoute.name !== 'dashboard' ) {
            router.push(views.dashboard)
        }
    }

    openIfClosedOrClear() {
        if (!this.open) {
            this.open = true
        } else {
            if (this.searchQuery !== null) {
                this.searchQuery = null
            } else {
                this.open = false
            }
        }
        this.$refs.searchInput.focus()                        
    }

    closeSearchBox() {
        this.open = false
    }

}

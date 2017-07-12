import Vue from 'vue'
import Component from 'vue-class-component'
import { Watch } from 'vue-property-decorator'
import { search } from '../../store/actions/page.actions'
import router, { views } from '../../router'
import store from '../../store'
import debounce from 'lodash.debounce'


@Component
export default class SearchBox extends Vue {
    searchQuery = store.getState().page.search || null

    @Watch('searchQuery')
    onSearchChanges = debounce(newVal => {
        if (router.currentRoute.name === 'dashboard') {
            store.dispatch(search(newVal))
        }
    }, 350)

    performQuery() {
        if (router.currentRoute.name !== 'dashboard') {
            router.push(views.dashboard)
        }
        store.dispatch(search(this.searchQuery))
    }

}

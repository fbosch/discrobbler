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
    
}

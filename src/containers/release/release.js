import Vue from 'vue'
import Component from 'vue-class-component'
import router from '../../router'


@Component
export default class Release extends Vue {

    mounted() {
        console.log(router.currentRoute.params.id)
    }

}
import Vue from 'vue'
import Component from 'vue-class-component'
import { Watch } from 'vue-property-decorator'
import cloudinary from '../../cloudinary'
import viewports from '../../viewports'
import getAverageColor from 'get-average-color'

@Component
export default class Home extends Vue {
	localStorageKey = `last-splash-image_discrobbler-${process.env.VERSION}`
	imageName = 'vinyl-wallpaper.jpg'
	splashImage = localStorage.getItem(this.localStorageKey) || []
	lastImageMediaQuery = null

	mounted() {
		setTimeout(() => this.getSplashImage(), 0)
	}
	
	@Watch('$mq.resize')
	getSplashImage() {
		console.log(this.$currentViewport)
		if (this.lastImageMediaQuery !== this.$currentViewport.value) {
			const isDesktop = this.$currentViewport.value >= viewports.desktop
			cloudinary.image(this.imageName, {
				gravity: 'auto',
				height: this.$el.offsetHeight,
				width: this.$currentViewport.value ? this.$currentViewport.value : this.$currentViewport._windowWidth,
				crop: 'lfill',
				fetch_format: 'auto',
				quality: isDesktop ? 100 : 80
			}).onload = event => {
				this.lastImageMediaQuery = this.$currentViewport.value
				this.splashImage = `url(${event.target.src})`
				localStorage.setItem(this.localStorageKey, this.splashImage)
			}
		}
	}



}
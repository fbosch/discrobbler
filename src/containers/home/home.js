import Vue from 'vue'
import Component from 'vue-class-component'
import { Watch } from 'vue-property-decorator'
import cloudinary from '../../cloudinary'
import viewports from '../../viewports'
import getAverageColor from 'get-average-color'

@Component
export default class Home extends Vue {
	imageName = 'vinyl-wallpaper.jpg'
	splashImage = null
	lastImageMediaQuery = null

	mounted() {
		this.getSplashImage()
	}

	@Watch('$mq.resize')
	getSplashImage() {
		if (this.lastImageMediaQuery !== this.$currentViewport.value) {
			const isDesktop = this.$currentViewport.value >= viewports.desktop
			cloudinary.image(this.imageName, {
				gravity: 'auto',
				height: this.$el.offsetHeight,
				width: this.$currentViewport.value,
				crop: 'crop',
				fetch_format: 'auto',
				quality: isDesktop ? 100 : 80
			}).onload = event => {
				this.lastImageMediaQuery = this.$currentViewport.value
				this.splashImage = `url(${event.target.src})`
			}
		}
	}



}
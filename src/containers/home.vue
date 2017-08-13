<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import { Watch } from 'vue-property-decorator'
import cloudinary from '../cloudinary'
import viewports from '../viewports'
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
</script>
<template>
<section class="home" :style="{ backgroundImage: splashImage }" >
	<div class="container">
		<md-card class="md-primary">
			<md-card-header >
				<md-card-header-text>
					<div class="md-title">Discrobbler</div>
					<div class="md-subheading">Scrobble your physical music collection</div>
				</md-card-header-text>
				 <md-card-media>
					<img src="https://res.cloudinary.com/discrobbler/image/upload/v1501941829/logo.svg" alt="Discrobbler">
				</md-card-media> 
			</md-card-header>
		</md-card>
	</div>
</section>
</template>
<style lang="scss">
.home {
	padding: 20px 15px 0 15px;
	background-color: #678cb2;
	height: calc(100vh - 70px);
	background-size: cover;
	background-position: center;
	margin-bottom: -70px;
}
</style>

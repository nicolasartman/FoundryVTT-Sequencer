const SequencerFileCache = {

	_videos: {},

	async loadVideo(inSrc){
		let src = this._videos[inSrc];
		if(!src){
			src = await fetch(inSrc)
				.then(r => r.blob());
			if(!src || src?.type !== "video/webm") return false;
			this._videos[inSrc] = src;
		}
		return src;
	},

	_loader: false,

	get loader(){
		if(!this._loader){
			this._loader = new TextureLoader();
		}
		return this._loader;
	},

	async loadImage(inSrc){
		let src = await this.loader.getCache(inSrc);

		if(!src) {
			src = await this._loader.loadTexture(inSrc);
		}

		return src;
	},

	isAudioFile(inSrc){
		return inSrc.toLowerCase().endsWith(".ogg")
			|| inSrc.toLowerCase().endsWith(".mp3")
			|| inSrc.toLowerCase().endsWith(".flac")
			|| inSrc.toLowerCase().endsWith(".wav");
	},

	async loadFile(inSrc){
		return new Promise(async (resolve, reject) => {
			let file;
			if (inSrc.toLowerCase().endsWith(".webm")) {
				file = await this.loadVideo(inSrc);
			}else if(this.isAudioFile(inSrc)){
				file = await AudioHelper.preloadSound(inSrc);
			}else{
				file = await this.loadImage(inSrc);
			}
			if(file){
				resolve(inSrc, file);
			}else{
				reject(inSrc);
			}
		})
	}

}

export default SequencerFileCache;
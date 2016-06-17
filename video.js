pc.script.attribute('materials','asset',[],{
    type:'material'
});
pc.script.attribute('videoUrl','string','');

pc.script.create('video', function (app) {
    // Creates a new Video instance
    var Video = function (entity) {
        this.entity = entity;
    };

    Video.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            var videoTexture = new pc.Texture(app.graphicsDevice,{
                format:pc.PIXELFORMAT_R5_G6_B5,
                autoMipmap:false
            });
            videoTexture.minFilter = pc.FILTER_LINEAR;
            videoTexture.magFilter = pc.FILTER_LINEAR;
            videoTexture.addressU = pc.ADDRESS_CLAMP_TO_EDGE;
            videoTexture.addressV = pc.ADDRESS_CLAMP_TO_EDGE;
            
            var video = document.createElement('video');
            video.addEventListener('canplay',function(e) {
                videoTexture.setSource(video);
            });
            video.src = this.videoUrl;
            video.crossOrigin = 'anonymous';
            video.loop = true;
            video.play();
            
            for(var i=0;i<this.materials.length;i++) {
                var material = app.assets.get(this.materials[i]).resource;
                material.emissiveMap = videoTexture;
                material.update();
            }
            
            this.videoTexture = videoTexture;
            
            this.upload = true;
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            //this.upload = !this.upload;
            if(this.upload) {
                this.videoTexture.upload();
            }
        }
    };

    return Video;
});
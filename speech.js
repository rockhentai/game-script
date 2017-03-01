pc.script.attribute('line1','string','',{
    displayName:'Line 1'
});

pc.script.attribute('line2','string','',{
    displayName:'Line 2'
});

pc.script.attribute('line3','string','',{
    displayName:'Line 3'
});

pc.script.attribute('line4','string','',{
    displayName:'Line 4'
});

pc.script.attribute('line5','string','',{
    displayName:'Line 5'
});

pc.script.create('speech', function (app) {
    // Creates a new Speech instance
    var Speech = function (entity) {
        this.entity = entity;
        this.textLength = 0;
        this.speechDelay = 5;
        this.speechIndex = 1;
        this.speechTimer = 0;
    };

    Speech.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            for(var i = 1;i < 6;i++) {
                if(this['line'+i] !== '') {
                    this.textLength = i;
                }
            }
            
            var textCanvas = document.createElement('canvas');
            textCanvas.height = 256;
            textCanvas.width = 1024;
            this.textContext = textCanvas.getContext('2d');
            
            this.textTexture = new pc.Texture(app.graphicsDevice,{
                format:pc.PIXELFORMAT_R5_G6_B5,
                autoMipmap:true
            });
            
            this.textTexture.setSource(textCanvas);
            this.textTexture.minFilter = pc.FILTER_LINEAR_MIPMAP_LINEAR;
            this.textTexture.magFilter = pc.FILTER_LINEAR;
            this.textTexture.addressU = pc.ADDRESS_CLAMP_TO_EDGE;
            this.textTexture.addressV = pc.ADDRESS_CLAMP_TO_EDGE;
            
            this.entity.model.material.emissiveMap = this.textTexture;
            this.entity.model.material.update();
        },
        
        // Called every frame, dt is time in seconds since last update
        update:function(dt) {
            if(this.textLength > 1) {
                this.speechTimer += dt;
                
                if(this.speechTimer > this.speechDelay) {
                    this.speechTimer = 0;
                    this.speechIndex++;
                    
                    if(this.speechIndex > this.textLength) {
                        this.speechIndex = 1;
                    }
                }
            }
            
            this.updateText();
        },

        updateText: function () {
            this.textContext.fillStyle = 'rgba(0,0,0,0.1)';
            this.textContext.fillRect(0,0,this.textContext.canvas.width,this.textContext.canvas.height);
            
            this.textContext.fillStyle = '#ffe995';
            this.textContext.lineWidth = 15;
            this.textContext.strokeStyle = 'black';
            this.textContext.save();
            this.textContext.font = 'bold 90px Verdana';
            this.textContext.textAlign = 'center';
            this.textContext.textBaseline = 'middle';
            
            var leftOffset = this.textContext.canvas.width/2;
            var topOffset = this.textContext.canvas.height/2;
            
            this.textContext.strokeText(this['line' + this.speechIndex],leftOffset,topOffset);
            this.textContext.fillText(this['line' + this.speechIndex],leftOffset,topOffset);
            this.textContext.restore();
            
            //画canvas边框
            this.textContext.strokeStyle = '#ffe995';
            this.textContext.beginPath();
            this.textContext.lineWidth = 25;
            this.textContext.rect(0,0,this.textContext.canvas.width,this.textContext.canvas.height);
            this.textContext.stroke();
            
            this.textTexture.upload();
        }
    };

    return Speech;
});
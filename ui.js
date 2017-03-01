pc.script.create('ui', function (app) {
    // Creates a new Ui instance
    var Ui = function (entity) {
        this.entity = entity;
        this.starPaper = null;
        this.screenPos = new pc.Vec3();
        this.bossPaper = null;
        
        this.defaultFontColour = '#ffe995';
        this.creditPaper = null;
        
    };

    Ui.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.updateScores();
            
            this.camera = app.root.findByName('center');
            this.player = app.root.findByName('robot');
            
            var that = this;
            $(window).resize(function() {
                that.getWindowSizes();
            });
            
            this.creditPaper = Raphael(this.widthMargin,this.screenHeight-75,250,75);
            var tSize = ((this.subWidth*0.15)-2)/10;
            this.creditPaper.text(tSize,tSize,'Game by rockhentai').attr({
                font:20 + 'px Arial, Charcoal, sans-serif',
                fill:this.defaultFontColour,
                'text-anchor':'Start',
                opacity:0.75
            });
//             this.creditPaper.text(tSize,tSize*2,'Music by rockhentai').attr({
//                 font:20 + 'px Arial, Charcoal, sans-serif',
//                 fill:this.defaultFontColour,
//                 'text-anchor':'Start',
//                 opacity:0.75
//             });
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
        },
        
        updateScores:function() {
            this.clearPaper(this.starPaper);
            
            var textSize = ((this.subWidth*0.25)-2)/10;
            this.starPaper = Raphael(this.widthMargin,15,this.subWidth*0.25,textSize*1.5);
            
            this.starPaper.text(textSize/2,textSize,'Scores: ' + window.game.scores).attr({
                font:textSize + 'px Impact, Charcoal, sans-serif',
                fill:this.defaultFontColour,
                'text-anchor':'Start',
                opacity:0.75
            });
        },
        
        collectStar:function(value) {
            var fill = this.defaultFontColour;
            
            if(value === 3) {
                fill = '#ff9900';
            }
            
            this.camera.camera.worldToScreen(this.player.getPosition(),this.screenPos);
            
            var paperWidth = 30;
            var collectPaper = Raphael(this.screenWidth/2-paperWidth/2,Math.round(this.screenPos.y)-250,paperWidth,paperWidth*10);
            var text = collectPaper.text(15,paperWidth*10-15,'+'+value).attr({
                font:'28px Impact, Charcoal, sans-serif',
                fill:fill
            });
            
            text.animate({transform:'0,-270'},799);
            setTimeout(function() {
                collectPaper.remove();
            },800);
        },
        
        clearPaper:function(specificPaper) {
            if(specificPaper) {
                specificPaper.remove();
            } else {
                if(this.starPaper) {
                    this.starPaper.remove();
                } 
                if(this.bossPaper) {
                    this.bossPaper.remove();
                }
            }
            
            if(!this.subWidth) {
                this.getWindowSizes();
            }
        },
        
        getWindowSizes:function() {
            this.subWidth = app.graphicsDevice.width;
            this.subHeight = app.graphicsDevice.height;
            this.screenWidth = $(window).width();
            this.screenHeight = $(window).height();
            this.widthMargin = (this.screenWidth-this.subWidth)/2;
        },
        
        bossSay:function(text) {
            this.clearPaper(this.bossPaper);
            var textSize = ((this.subWidth*0.25)-2)/10;
            this.bossPaper = Raphael(this.widthMargin + this.subWidth*0.25,15,this.subWidth*0.5,textSize*1.5);
            this.bossPaper.text(textSize/2,textSize,text).attr({
                font:textSize + 'px Impact, Charcoal, sans-serif',
                fill:this.defaultFontColour,
                'text-anchor':'Start',
                opacity:0.75
            });
        }
    };

    return Ui;
});
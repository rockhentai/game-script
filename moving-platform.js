pc.script.attribute('originalPos','vector',[0,0,0],{
    displayName:'Move From'
});

pc.script.attribute('endPos','vector',[0,0,0],{
    displayName:'Move To'
});

pc.script.attribute('movingSpeed','number',1);

pc.script.create('moving_platform', function (app) {
    // Creates a new Moving_platform instance
    var Moving_platform = function (entity) {
        this.entity = entity;
        
        this.player = null;
        this.lib = null;
        this.setup = false;
        this.countdown = 1;
        this.tweenRunning = true;
    };

    Moving_platform.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            if(!this.setup) {
                this.doSetup();
            }
            
            this.countdown -= dt;
            if(this.countdown < 0) {
               
                if(!this.player) {
                    this.player = app.root.findByName('robot');
                }
                
                if(!this.lib) {
                    this.lib = app.root.findByName('Root').script.lib;
                }
                
                var d = this.lib.distance3(this.player.getPosition(),this.entity.getPosition());
                
                
                
                if(d > 15) {
                    //console.log(11);
                    //stop if running
                    if(this.tweenRunning && this.tween) {
                        //console.log(11);
                        TWEEN.remove(this.tween);
                        this.tweenRunning = false;
                    }
                } else {
                    //restart if not running
                    if(!this.tweenRunning && this.tween) {
                        this.startTween(this.originalPos,this.endPos,true);
                        this.tweenRunning = true;
                    }
                }
                
                this.countdown = 1;
            }
        },
        
        doSetup:function() {
           this.setup = true;
           this.startTween(this.entity.getPosition(),this.endPos,true);
        },
        
        startTween:function(from,to,toEnd) {
            console.log('start tween');
            var self = this;
            
            this.tween = new TWEEN.Tween({
                x:from.x,
                y:from.y,
                z:from.z
            }).to({
                x:to.x,
                y:to.y,
                z:to.z
            },5000/self.movingSpeed)
            .onUpdate(function() {
                console.log(this.x);
                self.entity.setLocalPosition(this.x,from.y,from.z);
                
                if(self.entity.rigidbody) {
                    self.entity.rigidbody.syncEntityToBody();
                }
            }).onComplete(function() {
                if(toEnd) {
                    self.startTween(self.entity.getPosition(),self.originalPos,false);
                } else {
                    self.startTween(self.entity.getPosition(),self.endPos,true);
                }
            }).start();
        }
    };

    return Moving_platform;
});
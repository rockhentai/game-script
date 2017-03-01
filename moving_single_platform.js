pc.script.attribute('originalPos', 'vector', [0,0,0], {
    displayName: "Move From"
});
pc.script.attribute('endPosition', 'vector', [0,0,0], {
    displayName: "Move To"
});
pc.script.attribute("movingSpeed", "number", 1);

pc.script.create('moving_single_platform', function (app) {
    // Creates a new Moving_single_platform instance
    var Moving_single_platform = function (entity) {
        this.entity = entity;
        
        this.setup = false;
        this.player, this.lib;
        
        this.countdown = 1;
        this.tweenRunning = true;
    };

    Moving_single_platform.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
        },

        update: function (dt) {
            if(this.setup){
                
                //Pause/Unpause tween depending if player is in range
                this.countdown-=dt;
                
                if(this.countdown < 0){
                    this.countdown = 1;
                }
            }
            
        },
        
        doSetup: function(){
            this.setup = true;
            this.startTween(this.entity.getPosition(), this.endPosition, true);
        },
        
        startTween: function (from, to) {
            var self = this;
            
            this.tween = new TWEEN.Tween({
                x: from.x,
                y: from.y,
                z: from.z
            }).to({
                x: to.x,
                y: to.y,
                z: to.z
            },5000/self.movingSpeed)
            .onUpdate(function () {
                self.entity.setLocalPosition(this.x, from.y, from.z);
                
                if(self.entity.rigidbody){
                    self.entity.rigidbody.syncEntityToBody();
                }
                    
            }).onComplete(function () {
                self.entity.destroy();
            }).start();
        }
    };

    return Moving_single_platform;
});
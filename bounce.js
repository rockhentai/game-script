pc.script.attribute('bounceImpusle','number',1.5);

pc.script.create('bounce', function (app) {
    // Creates a new Bounce instance
    var Bounce = function (entity) {
        this.entity = entity;
        this.bouncing = false;
        
        this.targetPosition = new pc.Vec3();
        
        this.transferStart = new pc.Vec3();
        this.transferEnd = new pc.Vec3();
        this.transferProgress = 1.01;
        
        this.defaultPos = new pc.Vec3();
        this.bouncePos = new pc.Vec3();
    };

    Bounce.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.entity.collision.on('contact',this.onCollisionStart,this);
            this.defaultPos.copy(this.entity.getPosition());
            this.bouncePos.copy(this.entity.getPosition());
            this.bouncePos.y -= 0.75;
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            if(app.keyboard.wasPressed(pc.KEY_F)) {
                this.bouncing = true;
                this.startTween(this.defaultPos,this.bouncePos,this.bouncing);
            }
        },
        
        onCollisionStart:function(result) {
            if(result.other.rigidbody) {
                result.other.script.platform_character_controller.jump(this.bounceImpusle);
                if(!this.bouncing) {
                    this.bouncing = true;
                    this.startTween(this.defaultPos,this.bouncePos,this.bouncing);
                }
            }
        },
        
        startTween:function(from,to,bouncing) {
            var self = this;
            
            this.tween = new TWEEN.Tween({
                x:from.x,
                y:from.y,
                z:from.z
            }).to({
                x:to.x,
                y:to.y,
                z:to.z
            },150).easing(TWEEN.Easing.Back.out).onUpdate(function() {
                self.entity.setLocalPosition(this.x,this.y,this.z);
                if(self.entity.rigidbody) {
                    self.entity.rigidbody.syncEntityToBody();
                }
            }).onComplete(function() {
                if(bouncing) {
                    self.startTween(self.bouncePos,self.defaultPos,false);
                } else {
                    self.bouncing = false;
                }
            }).start();
        }
    };

    return Bounce;
});
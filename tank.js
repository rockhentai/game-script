pc.script.attribute('gun','entity');
pc.script.attribute('particles','entity');

pc.script.create('tank', function (app) {
    var pos = new pc.Vec3();
    // Creates a new Tank instance
    var Tank = function (entity) {
        this.entity = entity;
        this.animationTimer = 0;
        this.gunPosition = new pc.Vec3();
        this.shootInterval = 0;
    };

    Tank.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
//             if(app.touch) {
//                 app.touch.on('touchstart',this.shoot,this);
//             } else {
//                 app.mouse.on('mousedown',this.shoot,this);
//             }
            
            this.gunPosition.copy(this.gun.getLocalPosition());
            this.shootInterval = 5;
        },
        
        shoot:function() {
            this.animationTimer = 1.5;
            this.entity.sound.play('shoot');
            
            this.particles.particlesystem.reset();
            this.particles.particlesystem.play();
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            //check if animation is finished
            if(this.animationTimer <= 0) return;
            this.animationTimer -= dt*2;
            
            pos.x = 0;
            pos.y = 0;
            pos.z = -Math.sin(this.animationTimer)*0.1;
            pos.add(this.gunPosition);
            
            this.gun.setLocalPosition(pos);
        }
    };

    return Tank;
});
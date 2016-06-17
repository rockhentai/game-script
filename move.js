pc.script.attribute('camera','entity',null);
pc.script.attribute('power','number',5000);
pc.script.attribute('lookSpeed','number',0.5);

pc.script.create('move', function (app) {
    // Creates a new Move instance
    //var pos = new pc.Vec3(0,0,0);
    var force = new pc.Vec3();
    
    var Move = function (entity) {
        this.entity = entity;
        //this.tankPos = new pc.Vec3();
        this.eulers = new pc.Vec3();
    };

    Move.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            //this.tankPos.copy(this.entity.getLocalPosition());
            this.torque = 7;
            app.keyboard.on(pc.input.EVENT_KEYDOWN,this.onKeyDown,this);
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            
            //var forward = this.camera.forward;
            //var right = this.camera.right;
            
            var x = 0;
            var z = 0;

            this.playerPos = this.entity.getLocalPosition();
            
            if(app.keyboard.isPressed(pc.input.KEY_LEFT)) {
                this.entity.rigidbody.applyImpulse(-0.1,0,0);
                //x -= right.x;
                //z -= right.z;
            }
            if(app.keyboard.isPressed(pc.input.KEY_RIGHT)) {
                this.entity.rigidbody.applyImpulse(0.1,0,0);
                //x += right.x;
                //z += right.z;
            }
            if(app.keyboard.isPressed(pc.input.KEY_UP)) {
                this.entity.rigidbody.applyImpulse(0,0,-0.1);
                //x += forward.x;
                //z += forward.z;
            }
            if(app.keyboard.isPressed(pc.input.KEY_DOWN)) {
                this.entity.rigidbody.applyImpulse(0,0,0.1);
                //x -= forward.x;
                //z -= forward.z;
            }
            if(app.keyboard.wasPressed(pc.input.KEY_SPACE)) {
                this.entity.rigidbody.applyImpulse(0,5,0);
                this.entity.sound.play('jump');
            }
            if(app.keyboard.isPressed(pc.input.KEY_A)) {
                this.entity.rigidbody.applyTorque(0,this.torque,0);
            }
            if(app.keyboard.isPressed(pc.input.KEY_D)) {
                this.entity.rigidbody.applyTorque(0,-this.torque,0);
            }
            if(app.keyboard.isPressed(pc.input.KEY_Q)) {
                this.entity.rigidbody.applyTorque(-this.torque,0,0);
            }
            if(app.keyboard.isPressed(pc.input.KEY_E)) {
                this.entity.rigidbody.applyTorque(this.torque,0,0);
            }
            
            if(this.playerPos.x < -4.0) {
                this.entity.rigidbody.teleport(4.0,this.playerPos.y,this.playerPos.z);
            }
            if(this.playerPos.x > 4.0) {
                this.entity.rigidbody.teleport(-4.0,this.playerPos.y,this.playerPos.z);
            }
            
            if(app.keyboard.wasPressed(pc.input.KEY_R)) {
                this.reset();
            }
        },
        
        onKeyDown:function(event) {
            event.event.preventDefault();
        },
        
        reset:function() {
            this.entity.rigidbody.teleport(0,2,0);
            this.entity.rigidbody.linearVelocity = pc.Vec3.ZERO;
            this.entity.rigidbody.angularVelocity = pc.Vec3.ZERO;
        }
    };

    return Move;
});
pc.script.create('collide', function (app) {
    // Creates a new Collide instance
    var Collide = function (entity) {
        this.entity = entity;
    };

    Collide.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.entity.collision.on('triggerenter',this.onTriggerEnter,this);
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
        },
        
        onTriggerEnter:function(result) {
            //console.log('trigger');
            //console.log(result.name);
            if(result.name === "robot") {
                this.entity.destroy();
                //console.log(this.entity.sound);
                //this.entity.sound.play('score');
            }
        }
    };

    return Collide;
});
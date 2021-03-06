pc.script.attribute('worth','number',1);

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
            if(result.name === "robot") {
                result.script.platform_character_controller.maxJump = 2;
                this.entity.model.enabled = false;
                this.entity.collision.enabled = false;
                window.game.collectStars(this.worth);
            }
        }
    };

    return Collide;
});
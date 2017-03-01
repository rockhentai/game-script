pc.script.attribute('worth','number',-1);

pc.script.create('mushroom', function (app) {
    // Creates a new Mushroom instance
    var Mushroom = function (entity) {
        this.entity = entity;
    };

    Mushroom.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.entity.collision.on('triggerenter',this.onTriggerEnter,this);
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
        },
        
        onTriggerEnter:function(other) {
            if(other.name === 'robot') {
                other.script.platform_character_controller.maxJump = 1;
                other.sound.play('weak');
                this.entity.model.enabled = false;
                this.entity.collision.enabled = false;
                window.game.collectStars(this.worth);
            }
        }
    };

    return Mushroom;
});
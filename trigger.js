pc.script.attribute('platform','string','',{displayName:'Platform Name'});

pc.script.create('trigger', function (app) {
    // Creates a new Trigger instance
    var Trigger = function (entity) {
        this.entity = entity;
    };

    Trigger.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.entity.collision.on('triggerenter',this.onTriggerEnter,this);
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
        },
        
        onTriggerEnter:function(other) {
            if(other.getName() === 'robot') {
                this.entity.collision.enabled = false;
                app.root.findByName(this.platform).destroy();
            }
        }
    };

    return Trigger;
});
pc.script.create('camera', function (app) {
    // Creates a new Camera instance
    var Camera = function (entity) {
        this.entity = entity;
        app.mouse.on(pc.EVENT_MOUSEWHEEL,this.onMouseWheel,this);
    };

    Camera.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
        },
        
        onMouseWheel:function(e) {
            var fov = this.entity.camera.fov;
            if(e.wheel == 1) {
                fov += 0.16;
            }
            if(e.wheel == -1) {
                fov -= 0.16;
            }
            
            this.entity.camera.fov = fov;
        }
    };

    return Camera;
});
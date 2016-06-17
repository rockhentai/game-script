pc.script.create('camera_manager', function (app) {
    // Creates a new Camera_manager instance
    var Camera_manager = function (entity) {
        this.entity = entity;
        
        this.activeCamera = null;
    };

    Camera_manager.prototype = {
        setCamera:function(cameraName) {
            this.activeCamera.enabled = false;
            
            this.activeCamera = app.root.findByName(cameraName);
            this.activeCamera.enabled = true;
        },
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.activeCamera = this.entity.findByName('center');
            app.keyboard.on(pc.EVENT_KEYDOWN,this.onKeyDown,this);
        },
        
        onKeyDown:function(e) {
            e.event.preventDefault();
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            if(app.keyboard.wasPressed(pc.KEY_C)) {
                this.setCamera('center');
            } else if(app.keyboard.wasPressed(pc.KEY_L)) {
                this.setCamera('left');
            } else if(app.keyboard.wasPressed(pc.KEY_P)) {
                this.setCamera('personal');
            }
        }
    };

    return Camera_manager;
});
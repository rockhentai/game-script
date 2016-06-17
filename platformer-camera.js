pc.script.attribute('playerEntityName','string','',{displayName:'Player Entity Name'});
pc.script.attribute('height','number',3.5,{displayName:'Height'});
pc.script.attribute('lead','number',3.5,{displayName:'Lead'});
pc.script.attribute('transferSpeed','number',2.5,{displayName:'Transfer Speed'});
pc.script.attribute('lowerLimit','number',-5,{displayName:'Camera Lower Limit'});
pc.script.attribute('firstGround','entity',null);

pc.script.create('platformer_camera', function (app) {
    var STATE_LOCKED_BOTTOM = 0;
    var STATE_LOCKED_PLATFORM = 1;
    var STATE_TRANSFER = 2;
    
    var temp = new pc.Vec3();
    // Creates a new Platformer_camera instance
    var Platformer_camera = function (entity) {
        this.entity = entity;
        
        this.state = STATE_LOCKED_PLATFORM;
        this.player = null;
        
        this.targetPosition = new pc.Vec3();
        
        this.transferStart = new pc.Vec3();
        this.transferEnd = new pc.Vec3();
        this.transferProgress = 1.01;
        
        this.lastGroundEntity = null;
    };

    Platformer_camera.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.player = app.root.findByName(this.playerEntityName);
            if(!this.player) {
                logERROR('PlatformerCamera cant find player entity:' + this.playerEntityName);
            }
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            if(!this.player) {
                return;
            }
            
            if(this.state === STATE_LOCKED_BOTTOM) {
                this.updateLockedBottom(dt);
            } else if(this.state === STATE_LOCKED_PLATFORM) {
                this.updateLockedPlatform(dt);
            }
            
            this.updateCameraPosition(dt);
        },
        
        updateLockedBottom:function(dt) {
            var pp = this.player.getPosition();
            
            var pos = this.entity.getPosition();
            pos.x = pp.x;
            
            this.targetPosition.copy(pos);
        },
        
        updateLockedPlatform:function(dt) {
            var ground = this.player.script.platform_character_controller.getGround();
            var pp = this.player.getPosition();
            var pos = temp.copy(this.entity.getPosition());
            
            pos.x = pp.x;
            
            if(ground || this.lastGroundEntity) {
                if(ground && ground !== this.lastGroundEntity) {
                    this.transfer(pos);
                    this.lastGroundEntity = ground;
                }
                var gp = this.lastGroundEntity.getPosition();
                var platformHalfHeight = this.lastGroundEntity.collision.halfExtents.y;
                
                //摄像机的y坐标 = 地板的y坐标 + 地板的碰撞半径 + 高度
                pos.y = gp.y + platformHalfHeight + this.height;
                
                //如果角色y坐标低于地板y坐标，就把镜头转到角色y坐标那个位置
                if(pp.y < gp.y) {
                    pos.y = pp.y;
                    this.transfer(pos);
                }
            }
            
            if(pos.y < this.lowerLimit) {
                pos.y = this.lowerLimit;
            }
            this.targetPosition.copy(pos);
        },
        
        transfer:function(target) {
            this.transferStart.copy(this.entity.getPosition());
            this.transferEnd.copy(target);
            this.transferProgress = 0;
        },
        
        updateCameraPosition:function(dt) {
            if(this.transferProgress < 1) {
                this.transferProgress += this.transferSpeed * dt;
                if(this.transferProgress > 1) {
                    this.transferProgress = 1.01;
                }
                
                var t = this.transferProgress;
                var progress = --t * t * t + 1;
                
                temp.sub2(this.targetPosition,this.transferStart).scale(progress).add(this.transferStart);
            } else {
                temp.copy(this.targetPosition);
            }
            
            this.entity.setPosition(temp);
        }
    };

    return Platformer_camera;
});
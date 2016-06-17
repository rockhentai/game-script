pc.script.attribute('speed','number',2);
pc.script.attribute('turnSpeed','number',90);

pc.script.create('enemy', function (app) {
    var RAYCAST_RAY = new pc.Vec3(0,-0.6,0);
    
    var STATE_IDLE = 0;
    var STATE_MOVE = 1;
    var STATE_TURN = 2;
    // Creates a new Enemy instance
    var Enemy = function (entity) {
        this.entity = entity;
        
        this.speed = 5;
        this._speed = null;//暂停时存储的当前的速度
        
        this.direction = 1;
        this.movementState = STATE_MOVE;
        this.turningAngle = 0;
        
        this.platform = null;
        this.minX = 0;
        this.maxX = 0;
        this.halfWidth = 0.5;
    };

    Enemy.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.entity.collision.on('collisionstart',this.onTrigger,this);
            
            setTimeout(function() {
                this.setupPlatform();
            }.bind(this),0);
            
            this.halfWidth = this.entity.collision.radius;
            this.turningAngle = this.entity.getEulerAngles().y;
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            if(!this.platform) {
                //alert('no');
                return;
            }
            
            if(this.movementState === STATE_IDLE) {
                
            } else if(this.movementState === STATE_MOVE) {
                this.entity.translate(this.direction * this.speed * dt,0,0);
                var pos = this.entity.getPosition();
                if(pos.x > this.maxX && this.direction > 0) {
                    this.direction *= -1;
                    this.setState(STATE_TURN);
                } else if(pos.x < this.minX && this.direction < 0) {
                    this.direction *= -1;
                    this.setState(STATE_TURN);
                }
            } else if(this.movementState === STATE_TURN) {
                if(this.direction > 0) {
                    this.turningAngle -= this.turnSpeed*dt;
                    if(this.turningAngle < -90) {
                        this.turningAngle = -90;
                        this.setState(STATE_MOVE);
                    }
                } else if(this.direction < 0) {
                    this.turningAngle += this.turnSpeed*dt;
                    if(this.turningAngle > 90) {
                        this.turningAngle = 90;
                        this.setState(STATE_MOVE);
                    }
                }
                this.entity.setEulerAngles(0,this.turningAngle,0);
            }
        },
        
        setupPlatform:function() {
            var raycastStart = this.entity.getPosition();
            var raycastEnd = new pc.Vec3();
            
            raycastEnd.add2(raycastStart,RAYCAST_RAY);
            
            app.systems.rigidbody.raycastFirst(raycastStart,raycastEnd,function(result) {
                if(result.entity && pc.string.startsWith(result.entity.getName(),'ground')) {
                    this.setPlatform(result.entity);
                } else {
                    logERROR('Enemy found non-platform width raycast');
                }
            }.bind(this));
        },
        
        setPlatform:function(entity) {
            this.platform = entity;
            
            //计算坦克在平台上的最小x和最大x
            var x = this.platform.getPosition().x;
            var platformHalfWidth = this.platform.collision.halfExtents.x;
            this.minX = x - platformHalfWidth + this.halfWidth;
            this.maxX = x + platformHalfWidth - this.halfWidth;
        },
        
        setState:function(state) {
            this.movementState = state;
        },
        
        pause:function() {
            this._speed = this.speed;
            this.speed = 0;
        },
        
        unpause:function() {
            if(this._speed) {
                this.speed = this._speed;
                this._speed = null;
            }
        },
        
        onTrigger:function(result) {
            if(result.other.script && result.other.script.damage) {
                console.log('do damage');
                result.other.script.damage.doDamage(10,this.entity);
            }
        }
    };

    return Enemy;
});
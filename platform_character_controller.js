pc.script.attribute('moveImpulse','number',0.5,{displayName:'Move Impulse'});
pc.script.attribute('jumpImpulse','number',15,{displayName:'Jump Impulse'});
pc.script.attribute('minRunSpeed','number',1,{displayName:'Min Run Speed'});
pc.script.attribute('jumpGraceTime','number',0.1,{displayName:'Jump Grace Time'});

pc.script.create('platform_character_controller', function (app) {
    var CHECK_GROUND_RAY = new pc.Vec3(0,-0.7,0);
    
    var ANIMATIONS = {
        'idle':'Playbot_idle',
        'run':'Playbot_run',
        'jump':'Playbot_jump',
        'die':'Playbot_die'
    };
    
    //动画状态
    var STATE_IDLE = 0;
    var STATE_RUNNING = 1;
    var STATE_JUMPING = 2;
    
    var raycastEnd = new pc.Vec3();
    // Creates a new Platform_character_controller instance
    var Platform_character_controller = function (entity) {
        this.entity = entity;
        
        this.onGround = false;
        this.groundEntity = null;
        
        this.jumpTimer = 0;
        this.fallTimer = 0;
        
        this.model = null;
        
        this.origin = null;
        
        this.dead = false;
        
        this.animationState = STATE_IDLE;
        
        this.jTime = 0;
        this.maxJump = 1;
        
        this.levels = null;
        
        this.isShrunken = false;
        this.isGrown = false;
    };

    Platform_character_controller.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.origin = new pc.Vec3().copy(this.entity.getPosition());
            
            this.model = this.entity.findByName('Model');
            
            this.entity.script.damage.on('killed',this.onKilled,this);
            
            this.levels = app.root.findByName('levels');
            //console.log(this.bgm.sound.slots['8bit']);
            
            this.level = this.getCurrentLevel();
            this.curBgm = this.level.findByName('bgm');
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            if(this.dead) {
                return;
            }
            
            this.jumpTimer -= dt;
            this.fallTimer -= dt;
            
            //检测player是否在地上
            this.checkOnGround();
            
            var vel = this.entity.rigidbody.linearVelocity;
            var speed = vel.length();
            
            if(Math.abs(vel.x) > 0) {
                vel.x = vel.x * 0.9;
                this.entity.rigidbody.linearVelocity = vel;
            }
            
            this.updateAnimation(vel,dt);
        },
        
        getCurrentLevel:function() {
            if(this.levels) {
                var children = this.levels.getChildren();
                for(var i=0;i<children.length;i++) {
                    if(children[i].enabled) {
                        return children[i];
                    }
                }
            }
            return null;
        },
        
        updateAnimation:function(vel,dt) {
            var speed = Math.sqrt(vel.x*vel.x + vel.z*vel.z);
            if(this.animationState === STATE_IDLE) {
                if(speed > this.minRunSpeed) {
                    this.run();
                }
            } else if(this.animationState === STATE_RUNNING) {
                if(speed <this.minRunSpeed) {
                    this.idle();
                }
            }
        },
        
        moveLeft:function() {
            if(!this.dead) {
                var vel = this.entity.rigidbody.linearVelocity;
                var speed = vel.length();
                //console.log(speed);
                if(speed<=6.4) {
                    this.entity.rigidbody.applyImpulse(-this.moveImpulse,0,0);
                    this.model.setEulerAngles(0,-90,0);
                }
            }
        },
        
        moveRight:function() {
            if(!this.dead) {
                var vel = this.entity.rigidbody.linearVelocity;
                var speed = vel.length();
                if(speed<=6.4) {
                    this.entity.rigidbody.applyImpulse(this.moveImpulse,0,0);
                    this.model.setEulerAngles(0,90,0);
                }
            }
        },
        
        jump:function(impulse) {
            if(!impulse) {
                impulse = this.jumpImpulse;
            }
            if(!this.dead && this.jumpTimer < 0) {
                if(this.jTime < this.maxJump) {
                    this.entity.sound.play('jump');
                    this.entity.rigidbody.applyImpulse(0,impulse,0);
                    
                    //开始jump动画
                    this.model.animation.play(ANIMATIONS.jump,0.1);
                    this.model.animation.speed = 1;
                    this.model.animation.loop = false;
                    
                    this.animationState = STATE_JUMPING;
                    this.jumpTimer = 0.1;
                    
                    this.jTime += 1;
                }
            }
        },
        
        run:function() {
            this.model.animation.play(ANIMATIONS.run,0.1);
            this.model.animation.speed = 1;
            this.model.animation.loop = true;
            this.animationState = STATE_RUNNING;
        },
        
        idle:function() {
            this.model.animation.play(ANIMATIONS.idle,0.1);
            this.model.animation.speed = 1;
            this.model.animation.loop = true;
            this.animationState = STATE_IDLE;
        },
        
        land:function() {
            this.model.animation.play(ANIMATIONS.idle,0.1);
            this.model.animation.speed = 1;
            this.model.animation.loop = true;
            this.animationState = STATE_IDLE;
        },
        
        checkOnGround:function() {
            if(this.jumpTimer > 0) {
                return;
            }
            
            var raycastStart = this.entity.getPosition();
            raycastEnd.add2(raycastStart,CHECK_GROUND_RAY);
            
            var wasOnGround = this.onGround;
            this.onGround = false;
            this.groundEntity = null;
            
            app.systems.rigidbody.raycastFirst(raycastStart,raycastEnd,function(result) {
                if(result.entity) {
                    this.onGround = true;
                    this.groundEntity = result.entity;
                    if(this.animationState === STATE_JUMPING) {
                        this.land();
                        this.jTime = 0;
                    }
                    if(wasOnGround) {
                        this.fallTimer = this.jumpGraceTime;
                    }
                }
            }.bind(this));
        },
        
        getGround:function() {
            return this.groundEntity;
        },
        
        onKilled:function(killer) {
            if(!this.dead) {
                window.game.death += 1;
                this.curBgm.sound.pause('8bit');
                this.model.animation.play(ANIMATIONS.die,0.1);
                this.model.animation.speed = 1.5;
                this.model.animation.loop = false;
                this.dead = true;
                var v = this.entity.rigidbody.linearVelocity;
                v.x = 0;
                this.entity.rigidbody.friction = 1;
                this.entity.sound.play('die');
                
                setTimeout(function() {
                    this.reset(this.origin);
                }.bind(this),2000);
            }
            
        },
        
        reset:function(origin) {
            this.resetSize();
            this.entity.setPosition(origin);
            this.entity.rigidbody.syncEntityToBody();
            this.entity.rigidbody.linearVelocity = pc.Vec3.ZERO;
            this.entity.rigidbody.friction = 0;
            this.dead = false;
            this.jTime = 0;
            this.idle();
            //重置破碎的block
            game.fire('reset');
            var self = this;
            setTimeout(function() {
                self.curBgm.sound.resume('8bit');
            },1500);
        },
        
        shrink:function() {
            if(!this.isShrunken) {
                this.isShrunken = true;
                this.entity.setLocalScale(0.5,0.5,0.5);
                this.entity.collision.height = 0.625;
                this.entity.collision.radius = 0.15;
                CHECK_GROUND_RAY.y = -0.35;
                //this.isGrown = false;
                this.jumpImpulse = 4;
                this.entity.sound.play('shrink');
            } else {
                this.entity.sound.play('grow');
                this.resetSize();
            }
        },
        
        resetSize:function() {
            //this.isGrown = false;
            this.isShrunken = false;
            this.entity.setLocalScale(1,1,1);
            this.entity.collision.height = 1.15;
            this.entity.collision.radius = 0.3;
            CHECK_GROUND_RAY.y = -0.7;
            this.jumpImpulse = 4.7;
        }
    };

    return Platform_character_controller;
});
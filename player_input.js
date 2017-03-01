pc.script.create('player_input', function (app) {
    // Creates a new Player_input instance
    var Player_input = function (entity) {
        this.entity = entity;
    };
    
    //PlayerInput.LEFT = 'left';
    //PlayerInput.RIGHT = 'right';
    //PlayerInput.JUMP = 'jump';

    Player_input.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            app.controller = new pc.input.Controller(document);
            
            //注册键盘输入
            app.controller.registerKeys('left',[pc.input.KEY_A,pc.input.KEY_LEFT]);
            app.controller.registerKeys('right',[pc.input.KEY_D,pc.input.KEY_RIGHT]);
            //app.controller.registerKeys('jump',[pc.input.KEY_SPACE]);
            
            this.origin = new pc.Vec3().copy(this.entity.getPosition());
            
            this.playerScript = this.entity.script.platform_character_controller;
            
            this.startX = 0;
            this.startY = 0;
            
            this.moveEndX = 0;
            this.moveEndY = 0;
            
            this.X = 0;
            this.Y = 0;
            
            //移动端输入
            if(app.touch) {
                var css = function() { /*
                    #touchUI {
                        position:absolute;
                        bottom:140px;
                        color:#fff;
                        font-size:24px;
                        z-index:999;
                        width:100%;
                    }
                    .btn {
                        float:left;
                        width:48px;
                        height:48px;
                        margin-left:20px;
                    }
                    .left {
                        background:url(https://o8cc0hg6o.bkt.clouddn.com/l.png);
                    }
                    .right {
                        background:url(https://o8cc0hg6o.bkt.clouddn.com/r.png);
                    }
                    .jump {
                        float:right;
                        background:url(https://o8cc0hg6o.bkt.clouddn.com/up.png);
                    }
                    .shrink {
                        float:right;
                        background:url(https://o8cc0hg6o.bkt.clouddn.com/d.png);
                    }
                    
                */}.toString().trim();
                css = css.slice(css.indexOf('/*') + 2).slice(0,-3);
                $('<style/>').text(css).appendTo($('head'));
                this.touchUi = $('<div />').attr('id','touchUI').appendTo($('body'));
                this.initTouchController();
            }
            
        },
        
        initTouchController:function() {
            this.btnLeft = $('<div />').addClass('btn left').appendTo(this.touchUi);
            this.btnRight = $('<div />').addClass('btn right').appendTo(this.touchUi);
            this.btnJump = $('<div />').addClass('btn jump').appendTo(this.touchUi);
            this.btnShrink = $('<div />').addClass('btn shrink').appendTo(this.touchUi);
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            if(app.controller.isPressed('left')) {
                this.playerScript.moveLeft();
            } else if(app.controller.isPressed('right')) {
                this.playerScript.moveRight();
            }
            
            if(app.keyboard.wasPressed(pc.input.KEY_SPACE)) {
                this.playerScript.jump();
            }
            
            if(app.touch) {
                var self = this;
                var a = true;
                app.touch.on('touchstart',function(e) {
//                     self.startX = e.touches[0].x;
//                     self.startY = e.touches[0].y;
                    //self.playerScript.jump();
                    //console.log(e.touches[0].x);
                });
                this.btnLeft.on('touchend',function(e) {
                    if( a === true) {
                       self.playerScript.moveLeft();
                    }
                    a = false;
                });
                this.btnRight.on('touchend',function(e) {
                    if(a===true) {
                        self.playerScript.moveRight(); 
                    }
                   a = false;
                });
                this.btnJump.on('touchstart',function(e) {
                   self.playerScript.jump(); 
                });
                this.btnShrink.on('touchstart',function(e) {
                   self.playerScript.shrink();
                });
//                 app.touch.on('touchmove',function(e) {
//                     e.event.preventDefault();
//                     this.moveEndX = e.touches[0].x;
//                     this.moveEndY = e.touches[0].y;
                    
//                     self.X = self.moveEndX - self.startX;
//                     self.Y = self.moveEndY - self.startY;
//                 });
//                 app.touch.on('touchend',function() {
//                     if(self.X > 0) {
//                         self.playerScript.moveRight();
//                     } else if(self.X < 0) {
//                         self.playerScript.moveLeft();
//                     }
//                 });
            }
            
            if(app.keyboard.wasPressed(pc.input.KEY_R)) {
                this.playerScript.reset(this.origin);
            }
            if(app.keyboard.wasPressed(pc.input.KEY_S)) {
                this.playerScript.shrink();
            }
        },
        
        touchControll:function(e) {
            
        }
    };

    return Player_input;
});
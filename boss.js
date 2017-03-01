pc.script.create('boss', function (app) {
    // Creates a new Boss instance
    var Boss = function (entity) {
        this.entity = entity;
        this.possiblePositions = [new pc.Vec3(4,1.1,0),new pc.Vec3(4,0.5,0),new pc.Vec3(4,0,0)];
        
        this.platforms = 0;
        this.start = false;
    };

    Boss.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.mplatform = app.root.findByName('Boss_p1');
            this.bplatform = app.root.findByName('Boss_p2');
            this.splatform = app.root.findByName('Boss_p3');
            this.lib = app.root.findByName('Root').script.lib;
            
            var that = this;
            setTimeout(function() {
                that.startText();
            },2000);
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            if(this.start === true && this.platforms <= 0) {
                var ui = app.root.findByName('Root').script.ui;
                ui.bossSay('Time is up. You win this round');
                this.entity.findByName('goal').enabled = true;
                
                setTimeout(function() {
                    ui.bossSay('');
                },3000);
            }
        },
        
        startPlatforms:function() {
            var ui = app.root.findByName('Root').script.ui;
            
            var that = this;
            var timesRun = 0;
            var difficulty = 0;
            var time = 1300;
            var maxTimes = window.game.scores + 15;
            var lastPlatform = -1;
            var interval = setInterval(function() {
                var p = that.lib.randomNum(0,2,true);
                
                if(p === lastPlatform) {
                    p = that.lib.randomNum(0,2,true);
                }
                
                that.newPlatform(p);
                
                timesRun += 1;
                if(timesRun === maxTimes) {
                    clearInterval(interval);
                }
                
                that.platforms--;
                ui.bossSay('Platforms Left: ' + that.platforms);
                lastPlatform = p;
            },time);
        },
        
        startText:function() {
            var ui = app.root.findByName('Root').script.ui;
            ui.bossSay('Ah, welcome!');
            
            var that = this;
            setTimeout(function() {
                ui.bossSay('I see you stole ' + window.game.scores + ' of my stars');
            },3000);
            
            setTimeout(function() {
                that.platforms = 15;
                ui.bossSay('Then that is ' + window.game.scores + ' extra platforms to avoid');
                
                that.platforms += window.game.scores;
            },6000);
            
            setTimeout(function() {
                ui.bossSay('Prepare to be pummelled by platforms!');
            },9000);
            
            setTimeout(function() {
                that.startPlatforms();
                that.start = true;
            },12000);
        },
        
        releaseTheHounds:function() {
            var amount = window.game.scores;
            console.log(amount);
        },
        
        newPlatform:function(pos) {
            var e;
            if(pos === 2) {
                e = this.bplatform.clone();
            } else if(pos === 0) {
                if(this.lib.randomNum(0,2,true) === 0) {
                    e = this.mplatform.clone();
                } else {
                    e = this.splatform.clone();
                }
            } else {
                e = this.mplatform.clone();
            }
            
            e.setPosition(this.possiblePositions[pos]);
            e.setName('Boss_Platform_Moving');
            this.entity.addChild(e);
            e.script.moving_single_platform.originPos = this.possiblePositions[pos].clone();
            e.script.moving_single_platform.endPosition = this.possiblePositions[pos].clone();
            e.script.moving_single_platform.endPosition.x -= 30;
            e.script.moving_single_platform.movingSpeed = 0.75;
            e.script.moving_single_platform.doSetup();
        }
    };

    return Boss;
});
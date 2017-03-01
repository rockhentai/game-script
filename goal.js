pc.script.attribute('nextLevelEntityName','string','level one',{displayName:'Next Level Entity Name'});

pc.script.create('goal', function (app) {
    // Creates a new Goal instance
    var Goal = function (entity) {
        this.entity = entity;
        
        this.levels = null;
        this.trigger = null;
    };

    Goal.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            
            this.trigger = this.entity.findByName('goalTrigger');
            if(this.trigger && this.trigger.collision) {
                this.trigger.collision.on('triggerenter',this.onTrigger,this);
            }
            
            this.levels = app.root.findByName('levels');
        },
        
        getCurrentLevel:function() {
            if(this.levels) {
                var i;
                var children = this.levels.getChildren();
                for(i=0;i<children.length;i++) {
                    if(children[i].enabled) {
                        return children[i];
                    }
                }
            }
            return null;
        },
        
        onTrigger:function(other) {
            //判断entity是否有platform_character_controller脚本，如果有就是游戏角色
            if(other.script && other.script.platform_character_controller) {
                other.sound.play('pipe');
                //把当前关卡disable
                var currentLevel = this.getCurrentLevel();
                if(currentLevel) {
                    var curBgm = currentLevel.findByName('bgm');
                    curBgm.sound.stop('8bit');
                    currentLevel.enabled = false;
                } else {
                    console.error("Goal can't find current level");
                }
                
                //enable新关卡
                var nextLevel = app.root.findByName(this.nextLevelEntityName);
                if(nextLevel) {
                    nextLevel.enabled = true;
                    
                    //获取到新关卡的开始位置
                    var playerStart = nextLevel.findByName('PlayerStart');
                    if(playerStart) {
                        other.script.platform_character_controller.reset(playerStart.getPosition());
                        other.script.platform_character_controller.maxJump = 1;
                    } else {
                        console.error("Goal can't find PlayerStart entity in " + this.nextLevelEntityName);
                    }
                } else {
                    console.error("Goals can't find next level");
                }
            }
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
        }
    };

    return Goal;
});
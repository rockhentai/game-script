pc.script.attribute('normalBlock','asset',[],{
    type:'model',
    max:1
});

pc.script.attribute('damagedBlock','asset',[],{
    type:'model',
    max:1
});

pc.script.attribute('delay','number',1.5);

pc.script.create('break', function (app) {
    // Creates a new Break instance
    var Break = function (entity) {
        this.entity = entity;
        this.timeout = null;
    };

    Break.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            //绑定collisionstart事件
            this.entity.collision.on('collisionstart',this.preCollision,this);
            game.on('reset',this.reset,this);
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
        },
        
        reset:function() {
            var entity = this.entity;
            entity.enabled = true;
            entity.collision.enabled = true;
            entity.animation.currentTime = 0;
            entity.animation.speed = 0;
            
            //entity.model.asset = this.normalBlock[0];
            if(this.timeout) {
                clearTimeout(this.timeout);
                this.timeout = null;
            }
        },
        
        preCollision:function(other) {
            var that = this;
            //this.entity.model.asset = this.damagedBlock[0];
            
            setTimeout(function(other) {
                that.onCollision(other);
            },this.delay*1000);
        },
        
        onCollision:function(other) {
            var entity = this.entity;
            
            entity.collision.enabled = false;
            
            //play damage animation
            //console.log('break start');
            entity.animation.play('Block_Damg');
            entity.sound.play('break');
            //console.log(entity.animation);
            entity.animation.speed = 1;
            
            this.timeout = setTimeout(function() {
                entity.enabled = false;
            },entity.animation.duration*1000);
        }
    };

    return Break;
});
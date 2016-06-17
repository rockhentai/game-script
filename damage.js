//设置血量
pc.script.attribute('health','number',5);

pc.script.create('damage', function (app) {
    // Creates a new Damage instance
    var Damage = function (entity) {
        this.entity = entity;
        
        pc.events.attach(this);
    };

    Damage.prototype = {
        
        initialize:function() {
            this.playerScript = this.entity.script.platform_character_controller;
        },
        
        doDamage:function(amount,dealer) {
            this.health -= amount;
            if(this.health < 0) {
                //this.playerScript.onKilled();
                this.fire('killed',dealer);
            }
        },
        
        kill:function(killer) {
            this.health = 0;
            this.fire('killed',killer);
        },
        
        update:function(dt) {
            var pos = this.entity.getLocalPosition();
            //console.log(pos.y);
            if(pos.y < -1) {
                //this.playerScript.onKilled();
                this.fire('killed');
            }
        }
    };

    return Damage;
});
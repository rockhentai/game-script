pc.script.create('game', function (app) {
    // Creates a new Game instance
    var Game = function (entity) {
        this.entity = entity;
        window.game = this;
        this.scores = 0;
        this.death = 0;
    };

    Game.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            TWEEN.update();
             /*if(app.keyboard.wasPressed(pc.KEY_R)) {
                 this.fire('reset');
             }*/
        },
        
        collectStars:function(amount) {
            if(amount) {
                this.scores+=amount;
                if(amount == 1) {
                    this.entity.sound.play('score');
                } else if(amount == -1) {
                    this.entity.sound.play('weak');
                }
            } else {
                this.scores++;
            }
            
            this.entity.script.ui.updateScores();
            this.entity.script.ui.collectStar(amount);
            
        }
    };

    return Game;
});
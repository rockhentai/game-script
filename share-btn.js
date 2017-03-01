pc.script.create('share_btn', function (app) {
    // Creates a new Share_btn instance
    var Share_btn = function (entity) {
        this.entity = entity;
    };

    Share_btn.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            var css = function() { /*
                .socialShare {
                    display:block;
                    width:54px;
                    height:54px;
                    position:absolute;
                    bottom:80px;
                    left:30px;
                    z-index:999;
                }
                .socialShare .msb_main {
                    display:block;
                    width:46px;
                    height:46px;
                    position:absolute;
                    top:0;
                    left:0;
                    z-index:999;
                    cursor:pointer;
                    text-indent:-9999px;
                    border:4px solid #fff;
                    border-radius:36px;
                }
                .socialShare .msb_main:hover {
                    box-shadow: 0 0 5px #bbb;
                }
                .socialShare .msb_main img {
                    width:46px;
                    height:46px;
                    cursor:pointer;
                    border-radius:23px;
                    border:none;
                    float:left;
                }
                .socialShare .msb_network_button {
                    width:31px;
                    height:31px;
                    position:absolute;
                    top:9px;
                    left:92px;
                    z-index:998;
                    cursor:pointer;
                    text-indent:-9999px;
                    display:none;
                    background:no-repeat;
                    border:6px solid #f5f5f5;
                    border-radius:50%;
                }
                .socialShare .msb_network_button.sina {
                    background:url(https://o8cc0hg6o.bkt.clouddn.com/social.png) no-repeat -130px -87px;
                }
                .socialShare .msb_network_button.tQQ {
                    background:url(https://o8cc0hg6o.bkt.clouddn.com/social.png) no-repeat -185px -20px;
                }
                .socialShare .msb_network_button.qZone {
                    background:url(https://o8cc0hg6o.bkt.clouddn.com/social.png) no-repeat -73px -20px;
                }
                .socialShare .msb_network_button.douban {
                    background:url(https://o8cc0hg6o.bkt.clouddn.com/social.png) no-repeat -130px -151px;
                }
                .socialShare .msb_network_button.weixin {
                    background:url(https://o8cc0hg6o.bkt.clouddn.com/social.png) no-repeat -73px -87px;
                }
                .socialShare .msb_network_button:hover {
                    transition:-moz-transform 2s ease-out 0s;
                    border:6px solid #eee;
                }
            */}.toString().trim();
            css = css.slice(css.indexOf('/*') + 2).slice(0,-3);
            $('<style/>').text(css).appendTo($('head'));
            this.btnGroup = $('<div />').attr('id','socialShare').appendTo($('body'));
            this.initBtn();
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
//             var curScores = window.game.scores;
//             if(curScores != window.game.scores) {
//                 this.initBtn();
//             }
        },
        
        initBtn:function() {
            $('#socialShare').socialShare({
                content:'super robot boy',
                url:'https://playcanv.as/p/bzWjSfud/',
                title:'这个游戏真好玩，一起来玩游戏吧@林水游'
            });
        }
    };

    return Share_btn;
});
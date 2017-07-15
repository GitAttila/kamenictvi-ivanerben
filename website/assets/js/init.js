$(function(global){
    
    // var scene = document.getElementById('parallax-scene');
    // var parallax = new Parallax(scene);

    $('.loader-wrapper').hide();
    
    var btnInterval = setInterval(function(){
            $(".btn-down").animateCss("bounce");
        },3000);

    // ---------- JQUERY ANIMATE EXTENSION ----------
    $.fn.extend({
        animateCss: function (animationName, callBackFunc) {
            var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
            this.addClass('animated ' + animationName).one(animationEnd, function() {
                $(this).removeClass('animated ' + animationName);
                if ($.isFunction(callBackFunc)) {
                    callBackFunc();
                }
            });
            return this;
        }
    });

    initCarousels = function() {
        console.log("carousels initialized");
        var carouselsSetup = [
                {
                    carousel: "#main-carousel",
                    interval:7000,
                    pause: "none"
                },
                {
                    carousel: "#about-carousel",
                    interval:5000,
                    pause: "none"
                },
                {
                    carousel: "#carouselTombstones",
                    interval:3000,
                    pause: "none"
                },
                {
                    carousel: "#carouselGarden",
                    interval:3000,
                    pause: "none"
                },
                {
                    carousel: "#carouselRestorations",
                    interval:3000,
                    pause: "none"
                },
                {
                    carousel: "#CarouselMonuments",
                    interval:3000,
                    pause: "none"
                }
        ]
        // ---------- CAROUSELS SETUP ----------
        for (var i=0; i<carouselsSetup.length-1;i++) {
            $(carouselsSetup[i]['carousel']).carousel({
                interval: carouselsSetup[i]['interval']
            });
        }
    };

    global.initCarousels = initCarousels;

}(window));


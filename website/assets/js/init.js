$(function(global){

    if (typeof global.mySite!== "object") {
        global.mySite ={};
    }

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
    ];

    $('.loader-wrapper').hide();

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

    // ---------- CAROUSELS SETUP ----------
    initCarousels = function(carSetup) {
        for (var i=0; i<carSetup.length-1;i++) {
            $(carSetup[i]['carousel']).carousel({
                interval: carSetup[i]['interval']
            });
        }
        console.log("carousels initialized");
    };

    global.mySite.carouselsSetup = carouselsSetup;
    global.mySite.initCarousels = initCarousels;

}(window));

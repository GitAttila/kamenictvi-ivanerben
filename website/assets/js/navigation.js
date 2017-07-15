// ---------- NAVIGATION ----------

$(function(global){
	var controller, parallax1, parallax2;
	global.mySite ={};

	function is_mobile() {
	    var agents = ['android', 'webos', 'iphone', 'ipad', 'blackberry'];
	    for(i in agents) {
	        if((navigator.userAgent.toLowerCase().search(agents[i])>-1) && (window.orientation!==undefined)) {
	            return true;
	        }
	    }
	    return false;
	};

	var isMobileFlag = is_mobile();
	global.mySite.isMobileFlag = isMobileFlag;

	//console.log("isMobileFlag: "+isMobileFlag);

	if (isMobileFlag===true) {
		$("body").addClass("isMobile");
	}

	function navMenuInit() {
	    
	    $('#mainNavbar').on('show.bs.collapse', function () {
  			$(".hamburger__menu-icon").addClass("hamburger__menu-icon--close-x");
		})
 		$('#mainNavbar').on('hide.bs.collapse', function () {
  			$(".hamburger__menu-icon").removeClass("hamburger__menu-icon--close-x");
		})

	    $('.nav-link').on( 'click', function(e) {
	        e.preventDefault();
	        var url = this.href.trim().toLowerCase();   
	        var menuName = this.pathname.trim().toLowerCase();
			
	        $(this).siblings(".nav-link").removeClass("active");
	        $(this).addClass("active");

			if (controller!==undefined && controller!==null) {
				controller = controller.destroy(true);
			}
	        //console.log("url :  " + url);
	        //console.log(menuName); 

			//close the mobile menu if it is opened
			$('#mainNavbar').collapse('hide');
	        $('.loader-wrapper').show();

	        $('#ajax-container').animateCss('fadeOutDown', function(){
	        	
	        	var self = this;
	        	$("body,html").stop().animate({scrollTop:0}, '50');

	        	$('#ajax-content').load(url + ' #ajax-container', function(result,status){
	        		
	        		if (status === "success") {
					
						$(self).remove();
	        			$('#ajax-content').hide();
		        		$('.loader-wrapper').hide();
		        		$('#ajax-content').show();
		        		$('#ajax-content').animateCss('fadeInUp');
		        		
		        		placeContactListeners();
		        		placeButtonMoveUpListener();
		        		placeLangSwitchListener(true);
		        		if (menuName.search("realisations.html")>-1) {
		        			initCommisionsGallery();
		        		} else if (menuName.search("contact.html")>-1) {
		        			initContactMap();
		        			initContactFormListener();
		        		} else if (menuName.search("index.html")>-1) {
		        			initCarousels();
		        			linkToGallery();
		        			if (!isMobileFlag) {
					        	controller = new ScrollMagic.Controller({globalSceneOptions: {triggerHook: "onEnter", duration: "100%"}});
					        	parallax1 = new ScrollMagic.Scene({triggerElement: "#parallax1"})
					            	.setTween("#parallax1 > div", {y: "50%", ease: Linear.easeNone})
					            	//.addIndicators()
					            	.addTo(controller);
					        }

		        		} else if (menuName.search("about.html")>-1) {
		        			initCarousels();
		        			if (!isMobileFlag) {
			        			controller = new ScrollMagic.Controller({globalSceneOptions: {triggerHook: "onEnter", duration: "100%"}});
			        			parallax2 = new ScrollMagic.Scene({triggerElement: "#parallax2"})
							    	.setTween("#parallax2 > div", {y: "50%", ease: Linear.easeNone})
							    	//.addIndicators()
							    	.addTo(controller);
							}
		        		} else if (menuName.search("pricing.html")>-1) {
		        			initPricingGallery();
		        		}
	        		} else if (status === "error") {
	        			$('.loader-wrapper').hide();
	        			console.log("Error loading from server...");
	        		}
	        	}); // end of ajax load function
	        });  // end of animateCss function

	    }); // end of click listener
	   
	}

	function placeContactListeners() {
		$(".btn-map").on("click", function(e){
			e.preventDefault();
			var $this=$(this);

			window.addEventListener("orientationchange", function() {
				if ($this.children().hasClass("fa-expand")) {
					if (window.matchMedia("(orientation: landscape)").matches && window.innerWidth<767) {
						$("#contact-map").animate({
							height: "75vh"
						},500, function(){
							google.maps.event.trigger(myMap, "resize");
							myMap.setCenter(myPosition);
							myMap.panBy(0,(-$("nav.navbar").height()));
						});
					} else {
						$("#contact-map").animate({
							height: "50vh"
						},500, function(){
							google.maps.event.trigger(myMap, "resize");
							myMap.setCenter(myPosition);
							myMap.panBy(0,(-$("nav.navbar").height()));
						});
					}
				}
			}, false);

			if ($this.children().hasClass("fa-expand")) {
				$this.children().removeClass("fa-expand").addClass("fa-compress");
				$("#contact-map").animate({
					height: "100vh"
				},500, function(){
					google.maps.event.trigger(myMap, "resize");
					myMap.setCenter(myPosition);
					myMap.panBy(0,(-$("nav.navbar").height()));
				});
				return;
			} else if ($this.children().hasClass("fa-compress")) {
				$this.children().removeClass("fa-compress").addClass("fa-expand");
				if (window.matchMedia("(orientation: landscape)").matches && window.innerWidth<767) {
					$("#contact-map").animate({
						height: "75vh"
					},500, function(){
						google.maps.event.trigger(myMap, "resize");
						myMap.setCenter(myPosition);
						myMap.panBy(0,(-$("nav.navbar").height()));
					});
				} else {
					$("#contact-map").animate({
						height: "50vh"
					},500, function(){
						google.maps.event.trigger(myMap, "resize");
						myMap.setCenter(myPosition);
						myMap.panBy(0,(-$("nav.navbar").height()));
					});
				}
			}
		})
	}

	function placeButtonMoveUpListener() {
		
		var offSetY=0;
		$(window).on("scroll", function(){
			var actualHeight = $(window).height();
			var actualScrollPos = $(window).scrollTop();

			offSetY = actualHeight/5;
			
			if (actualScrollPos<0) {actualScrollPos=0};

			//console.log(actualHeight,actualScrollPos);
			//console.log(actualHeight-offSetY,actualScrollPos);

			if (((actualHeight-offSetY)/actualScrollPos)>1) {
				if ($('.btn-move-up').is(":visible")) {
					$(".btn-move-up").animateCss('bounceOut', function(){
						$(".btn-move-up").hide();
						$(".btn-down").show().animateCss('bounceIn');
						//$(".btn-down").animateCss('bounceIn');
					});
				}
				
			} else {
				if (!$('.btn-move-up').is(":visible")) {
 					$(".btn-down").animateCss('bounceOut',function(){
 						$(".btn-down").hide();
 						$(".btn-move-up").show();
 						$(".btn-move-up").animateCss('bounceIn');
 					});
 				}
			}
		});
		$(".btn-move-up").on("click", function(){
			$("body,html").stop().animate({scrollTop:0}, '700', "swing");
		});
		$(".btn-down").on("click", function(e){
			console.log(e);
			e.preventDefault();
			var jumpHash = e.currentTarget.hash;
			var jumpPoint = $(jumpHash).offset().top;
			$("body,html").stop().animate({scrollTop:jumpPoint}, '700', "swing");
		});
		
	}

	function placeLangSwitchListener(update) {
		var update = update || false;
		var activeLang = $(".lang-switcher>span").text().trim();

		if (update) {LNG$(activeLang).switchLang(activeLang);}

		$(".lang-switcher>span").on("click", function(){
			if (activeLang === "cz") {
				activeLang = "en";
				$(".lang-switcher>span").text(activeLang);
				LNG$(activeLang).switchLang(activeLang);
			} else if (activeLang === "en") {
				activeLang = "cz";
				$(".lang-switcher>span").text(activeLang);
				LNG$(activeLang).switchLang(activeLang);
			}
			$(this).animateCss("bounceIn");
		});
	}

	function linkToGallery(){

		$(".btn-site").on('click',function(e){
			e.preventDefault;
			var galLink = $(this).data('link').trim();
			var url = window.location.href;
			if (url.search("index.html") >= 0 ) {
				url = url.replace("index.html","realisations.html");
			} else {
				url = url + "realisations.html";
			}
			//console.log("url : "+ url);

	        $('#ajax-container').animateCss('fadeOutDown', function(){
	        	$('#ajax-content').hide();
	        	$('#ajax-content').load(url + ' #ajax-container', function(){
	        		$(".navbar-nav>.nav-link").removeClass("active");
	        		$(".navbar-nav>.nav-link[href='realisations.html']").addClass("active");
	        		
	        		$('#ajax-content').show();
	        		$('#ajax-content').animateCss('fadeInUp');
	        		placeContactListeners();
	        		placeButtonMoveUpListener();
	        		placeLangSwitchListener();
	        		initCommisionsGallery(function(){
		        		$(".filter-item").each(function(i){
		        			if ($(this).text().toLowerCase().trim() === galLink) {
		        				$(this).trigger('click');
		        				return;
		        			}
		        		});

	        		});
	        	});
	        });
		});
	}

	if (!isMobileFlag) {
        var controller = new ScrollMagic.Controller({globalSceneOptions: {triggerHook: "onEnter", duration: "100%"}});
        var parallax1 = new ScrollMagic.Scene({triggerElement: "#parallax1"})
            .setTween("#parallax1 > div", {y: "50%", ease: Linear.easeNone})
            //.addIndicators()
            .addTo(controller);
    }


	linkToGallery();
	navMenuInit();
	placeContactListeners();
	placeButtonMoveUpListener();
	placeLangSwitchListener();
	//initParallax();

	global.mySite.navMenuInit = navMenuInit;
	global.mySite.placeContactListeners = placeContactListeners;
	global.mySite.placeButtonMoveUpListener = placeButtonMoveUpListener;
	global.mySite.placeLangSwitchListener = placeLangSwitchListener;

}(window));
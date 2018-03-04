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
			var cachedPage={};
			$cachedItems = $("#mainNavbar [data-menuitem]");
			$($cachedItems).each(function(index,value){
				cachedPage[$(value).data('menuitem')] = "";
			});
			global.mySite.cachedPage = cachedPage;

			placeButtonMoveUpListener();
			placeLangSwitchListener(true);

			//helper function to load google maps script
			function addScript( src, el,callbackF ) {
				if (typeof callbackF!=="function") {
					callbackF=function(){};
				}
				$(el).append($("<script />", {
  				src: src,
					async: true,
					defer: true
				}));
				callbackF();
			}
			//helper function to update the page when clicking on menu
			function updatePage(callbackFunc){
				if (typeof callbackFunc!== 'function') {
						callbackFunc = function(){};
				}
				$('#ajax-container').show();
				$('#ajax-content').hide();
				$('.loader-wrapper').hide();
				$('#ajax-content').show();
				$('#ajax-content').fadeIn(500,function(){
					callbackFunc();
				});
			}

		  $('#mainNavbar').on('show.bs.collapse', function () {
	  			$(".hamburger__menu-icon").addClass("hamburger__menu-icon--close-x");
			})
	 		$('#mainNavbar').on('hide.bs.collapse', function () {
	  			$(".hamburger__menu-icon").removeClass("hamburger__menu-icon--close-x");
			})

	    $('.nav-link').on( 'click', function(e) {
	        e.preventDefault();
	        var url = this.href.trim().toLowerCase();
	        var menuName = $(this).data('menuitem').trim().toLowerCase();
					var initLang = $(".lang-switcher>span").text().trim();

	        $(this).siblings(".nav-link").removeClass("active");
	        $(this).addClass("active");

					if (controller!==undefined && controller!==null) {
						controller = controller.destroy(true);
					}

					//close the mobile menu if it is opened
					$('#mainNavbar').collapse('hide');

	        $('.loader-wrapper').show();
	        $('#ajax-container').fadeOut(500, function(){

	        	$("body,html").stop().animate({scrollTop:0}, '50');
						$(this).remove();

						if (mySite.cachedPage[menuName]==='') {
							// do the following if the page needs to be laoded for the first time(not cached yet)
							// start of the ajax load function
		        	$('#ajax-content').load(url + ' #ajax-container', function(result,status){
								if (status === "success") {
									console.log("Loaded '" + menuName + "' from SERVER...");
									updatePage(function(){
										LNG$(initLang).switchLang(initLang);
									});

			        		if (menuName==="realisations") {
										cachedPage[menuName]=$(result).find("#ajax-container");
			        			initCommisionsGallery(function(){
												LNG$(initLang).switchLang(initLang);
										});
			        		} else if (menuName==="contact") {
										cachedPage[menuName]=$(result).find("#ajax-container");
										addScript( // kamenictvi-erben.cz google maps key ="AIzaSyDsSU84WoixvvCZ6EV48Bt1777N2NLKHms"
											"https://maps.googleapis.com/maps/api/js?key=AIzaSyA0qVKpndfcoIgP5nwuJxmH5q0v5TSvEc4&callback=initContactMap",
											"body",
											function(){
												$(function(){
												   $(window).load(function(){
														 	initContactMap();
															initContactFormListener();
															placeContactListeners();
												   });
												});

											});

			        		} else if (menuName==="main") {
										cachedPage[menuName]=$(result).find("#ajax-container");
			        			initCarousels();
			        			linkToGallery();
			        			if (!isMobileFlag) {
						        	controller = new ScrollMagic.Controller({globalSceneOptions: {triggerHook: "onEnter", duration: "100%"}});
						        	parallax1 = new ScrollMagic.Scene({triggerElement: "#parallax1"})
						            	.setTween("#parallax1 > div", {y: "50%", ease: Linear.easeNone})
						            	//.addIndicators()
						            	.addTo(controller);
						        }

			        		} else if (menuName==="about") {
										cachedPage[menuName]=$(result).find("#ajax-container");
			        			initCarousels();
			        			if (!isMobileFlag) {
				        			controller = new ScrollMagic.Controller({globalSceneOptions: {triggerHook: "onEnter", duration: "100%"}});
				        			parallax2 = new ScrollMagic.Scene({triggerElement: "#parallax2"})
								    	.setTween("#parallax2 > div", {y: "50%", ease: Linear.easeNone})
								    	//.addIndicators()
								    	.addTo(controller);
										}
			        		} else if (menuName==="pricing") {
										cachedPage[menuName]=$(result).find("#ajax-container");
			        			initPricingGallery(function(){
											LNG$(initLang).switchLang(initLang);
										});
			        		}
		        		} else if (status === "error") {
		        			$('.loader-wrapper').hide();
		        			console.log("Error loading from server...");
		        		}

		        	}); // end of ajax load function

						} else {
							//if the page is already cached...
							console.log("Loaded '" + menuName + "' from CACHE...");
							$(mySite.cachedPage[menuName]).appendTo('#ajax-content');

							updatePage(function(){
								LNG$(initLang).switchLang(initLang);
							});

						}
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
			e.preventDefault();
			var jumpHash = e.currentTarget.hash;
			var jumpPoint = $(jumpHash).offset().top;
			$("body,html").stop().animate({scrollTop:jumpPoint}, '700', "swing");
		});

	}

	function placeLangSwitchListener(update) {
		var update = update || false;
		var activeLanguages =[];
		var languages = {
			"cz":false,
			"fr":false,
			"en":true,
			"de":true,
			"es":false
		};
		$.each(languages, function(index,value){
			if (value) {
				activeLanguages.push(index);
			}
		})
		var activeLang = $(".lang-switcher>span").text().trim();
		if (update) {
			LNG$(activeLang).switchLang(activeLang);
		}

		$(".lang-switcher>span").on("click", function(){
			var next = activeLanguages.indexOf(activeLang)+1;
			if (!isLangDefined(activeLanguages,activeLang)) {
				return;
			}
			next === activeLanguages.length ? next=0 : next=next;
			activeLang = activeLanguages[next];
			$(".lang-switcher>span").text(activeLang);
			LNG$(activeLang).switchLang(activeLang);
			$(this).animateCss("bounceIn");
		});

		function isLangDefined(activeLangs,langToCheck){
			if (typeof activeLangs !=='object') {
				activeLangs = activeLangs || [];
			}
			if (typeof langToCheck !=='string') {
				langToCheck = langToCheck || "";
			}
			var isDefined = false;
			var ind = activeLangs.indexOf(activeLang);
			if (ind === -1) {
				console.log("error: language: '"+ langToCheck +"' within 'index.html' file is not compatible with languages defined.");
			} else {
				isDefined = true;
			}
			return isDefined;
		}
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

	function initParallax() {
		if (!isMobileFlag) {
	        var controller = new ScrollMagic.Controller({globalSceneOptions: {triggerHook: "onEnter", duration: "100%"}});
	        var parallax1 = new ScrollMagic.Scene({triggerElement: "#parallax1"})
	            .setTween("#parallax1 > div", {y: "50%", ease: Linear.easeNone})
	            //.addIndicators()
	            .addTo(controller);
	    }
	}

	$(window).load(function(){
		linkToGallery();
		navMenuInit();
		placeContactListeners();
		placeButtonMoveUpListener();
		placeLangSwitchListener();
		initParallax();
	});


	global.mySite.navMenuInit = navMenuInit;
	global.mySite.placeContactListeners = placeContactListeners;
	global.mySite.placeButtonMoveUpListener = placeButtonMoveUpListener;
	global.mySite.placeLangSwitchListener = placeLangSwitchListener;

}(window));

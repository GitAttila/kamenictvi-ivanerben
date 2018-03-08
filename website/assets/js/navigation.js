// ---------- NAVIGATION ----------

$(function(global){
	var controller, parallax1, parallax2;
	var initLang="";
	// kamenictvi-erben.cz google maps key ="AIzaSyDsSU84WoixvvCZ6EV48Bt1777N2NLKHms"
	// steinmetz-erben.de google maps key ="AIzaSyA0qVKpndfcoIgP5nwuJxmH5q0v5TSvEc4"
	var APIkey = "AIzaSyA0qVKpndfcoIgP5nwuJxmH5q0v5TSvEc4";
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

			var pageCallbackFunc = {
				main: function(){
					initCarousels();
					linkToGallery();
					if (!isMobileFlag) {
						initParallax("#parallax1","#parallax1 > div");
					}
				},
				about: function(){
					initCarousels();
					if (!isMobileFlag) {
						initParallax("#parallax2","#parallax2 > div");
					}
				},
				realisations: function(){
					initCommisionsGallery(function(){
						LNG$(initLang).switchLang(initLang);
					});
				},
				pricing: function(){
					initPricingGallery(function(){
						LNG$(initLang).switchLang(initLang);
					});
				},
				contact: function(runMapInitScript){
					runMapInitScript = runMapInitScript || false;
					if (runMapInitScript) {
						addScript(
							"https://maps.googleapis.com/maps/api/js?key=" + APIkey + "&callback=MapModule.initContactMap",
							"body",
							function(){
								MapModule.placeContactListeners();
								ContactFormModule.initContactFormListener();
							});
					} else {
						MapModule.initContactMap();
						MapModule.placeContactListeners();
						ContactFormModule.initContactFormListener();
					}
				}
			}

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
				$('.loader-wrapper').hide();
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
					initLang = $(".lang-switcher>span").text().trim();
	        $(this).siblings(".nav-link").removeClass("active");
	        $(this).addClass("active");

					console.log(controller);
					if (controller!==undefined && controller!==null) {

						controller = controller.destroy(true);
					}

					//close the mobile menu if it is opened
					$('#mainNavbar').collapse('hide');


	        $('#ajax-container').fadeOut(500, function(){
						$('#ajax-content').hide();
						$('.loader-wrapper').fadeIn(500);
	        	$("body,html").stop().animate({scrollTop:0}, '50');
						$(this).remove();

						if (mySite.cachedPage[menuName]==='') {
							// do the following if the page needs to be loaded for the first time(not cached yet)
							// start of the ajax load function
		        	$('#ajax-content').load(url + ' #ajax-container', function(result,status){
								if (status === "success") {
									console.log("Loaded '" + menuName + "' from SERVER...");
									updatePage(function(){
										LNG$(initLang).switchLang(initLang);
										cachedPage[menuName]=$(result).find("#ajax-container");
										menuName ==='contact' ? mapInitFlag = true : mapInitFlag = false;
										pageCallbackFunc[menuName](mapInitFlag);
									});

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
								pageCallbackFunc[menuName]();
							});
						}
	        });  // end of animateCss function
	    }); // end of click listener

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
	        $('#ajax-container').fadeOut(500, function(){
	        	$('#ajax-content').hide();
						$('.loader-wrapper').show();
						$(".navbar-nav>.nav-link").removeClass("active");
						$(".navbar-nav>.nav-link[href='realisations.html']").addClass("active");

						if (mySite.cachedPage['realisations']==='') {
		        	$('#ajax-content').load(url + ' #ajax-container', function(){
								$('.loader-wrapper').hide();
		        		$('#ajax-content').fadeIn(500);
		        		placeButtonMoveUpListener();
		        		placeLangSwitchListener();
		        		initCommisionsGallery(function(){
									LNG$(initLang).switchLang(initLang);
			        		$(".filter-item").each(function(i){
										if ($(this).data('lang') !== undefined) {
			        				if ($(this).data('lang').toLowerCase().trim() === galLink) {
			        					$(this).trigger('click');
			        					return;
			        				}
										}
			        		});
		        		});
		        	});
						} else {
							console.log("Loaded 'realisations' with quick link from CACHE...");
							$(mySite.cachedPage['realisations']).appendTo('#ajax-content');
							$('.loader-wrapper').hide();
							$('#ajax-content').fadeIn(500);
							placeButtonMoveUpListener();
							placeLangSwitchListener();
							initCommisionsGallery(function(){
								LNG$(initLang).switchLang(initLang);
								$(".filter-item").each(function(i){
									if ($(this).data('lang').toLowerCase().trim() === galLink) {
										$(this).trigger('click');
										return;
									}
								});
							});
						}
	        });
		});
	}

	function initParallax(triggerElement,tweenElement) {
		triggerElement = triggerElement || "";
		tweenElement = tweenElement || "";
		if (!isMobileFlag) {
	        var controller = new ScrollMagic.Controller({globalSceneOptions: {triggerHook: "onEnter", duration: "100%"}});
	        var parallax1 = new ScrollMagic.Scene({triggerElement: triggerElement})
	            .setTween(tweenElement, {y: "50%", ease: Linear.easeNone})
	            //.addIndicators({name: triggerElement})
	            .addTo(controller);
	    }
	}

	$(window).load(function(){
		linkToGallery();
		navMenuInit();
		placeButtonMoveUpListener();
		placeLangSwitchListener();
		initParallax("#parallax1","#parallax1 > div");
	});

	global.mySite.navMenuInit = navMenuInit;
	global.mySite.placeButtonMoveUpListener = placeButtonMoveUpListener;
	global.mySite.placeLangSwitchListener = placeLangSwitchListener;
	global.mySite.initParallax = initParallax;

}(window));

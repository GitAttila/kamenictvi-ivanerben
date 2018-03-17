// ---------- NAVIGATION ----------

$(function(global){
	var activeLang='';
	var pageSwitchingActive=false;
	// kamenictvi-erben.cz google maps key ="AIzaSyDsSU84WoixvvCZ6EV48Bt1777N2NLKHms"
	// steinmetz-erben.de google maps key ="AIzaSyA0qVKpndfcoIgP5nwuJxmH5q0v5TSvEc4"
	var APIkey = "AIzaSyA0qVKpndfcoIgP5nwuJxmH5q0v5TSvEc4";

	if (typeof global.mySite!== "object") {
  	global.mySite ={};
  }

	var pageCallbackFunc = {
		main: function(callbackF){
			if (typeof callbackF!=='function') {
				callbackF = function(){};
			}
			mySite.initCarousels(mySite.carouselsSetup);
			placeJumpButtonListeners();
			linkToGallery();
			if (!isMobileFlag) {
				initParallax("#parallax1","#parallax1 > div");
			}
			callbackF();
			pageSwitchingActive = false;
		},
		about: function(callbackF){
			if (typeof callbackF!=='function') {
				callbackF = function(){};
			}
			mySite.initCarousels(mySite.carouselsSetup);
			placeJumpButtonListeners();
			if (!isMobileFlag) {
				initParallax("#parallax2","#parallax2 > div");
			}
			callbackF();
			pageSwitchingActive = false;
		},
		realisations: function(callbackF){
			if (typeof callbackF!=='function') {
				callbackF = function(){};
			}
			mySite.initCommisionsGallery(function(){
				var lang = LNG$().getSelectedLang();
				LNG$(lang).switchLang(lang);
				placeJumpButtonListeners();
				callbackF();
				pageSwitchingActive = false;
			});
		},
		pricing: function(callbackF){
			if (typeof callbackF!=='function') {
				callbackF = function(){};
			}
			mySite.initPricingGallery(function(){
				var lang = LNG$().getSelectedLang();
				LNG$(lang).switchLang(lang);
				placeJumpButtonListeners();
				callbackF();
				pageSwitchingActive = false;
			});
		},
		contact: function(callbackF,runMapInitScript){
			if (typeof callbackF!=='function') {
				callbackF = function(){};
			}
			runMapInitScript = runMapInitScript || false;
			if (runMapInitScript) {
				ContactFormModule.initContactFormListener();
				addScript(
					"https://maps.googleapis.com/maps/api/js?key=" + APIkey + "&callback=MapModule.initContactMap",
					"body",
					function(){
						MapModule.placeContactListeners();
						callbackF();
						pageSwitchingActive = false;
					});
			} else {
				MapModule.initContactMap();
				MapModule.placeContactListeners();
				ContactFormModule.initContactFormListener();
				callbackF();
				pageSwitchingActive = false;
			}
		}
	}

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
			console.log("navMenu initialized");
			var cachedPage={};
			$cachedItems = $("#mainNavbar [data-menuitem]");
			$($cachedItems).each(function(index,value){
				cachedPage[$(value).data('menuitem')] = "";
			});
			global.mySite.cachedPage = cachedPage;

			//placeLangSwitchListener(true);
		  $('#mainNavbar').on('show.bs.collapse', function () {
					$('.navbar .navbar-collapse').removeClass('order-2').addClass('order-5');
	  			$(".hamburger__menu-icon").addClass("hamburger__menu-icon--close-x");
			})
			$('#mainNavbar').on('hidden.bs.collapse', function () {
					$('.navbar .navbar-collapse').removeClass('order-5').addClass('order-2');
			})
	 		$('#mainNavbar').on('hide.bs.collapse', function () {
	  			$(".hamburger__menu-icon").removeClass("hamburger__menu-icon--close-x");
			})

	    $('.nav-item').on( 'click', function(e) {
	        e.preventDefault();
					if (!pageSwitchingActive) {
	        	var url = $(this).children('.nav-link').attr('href').trim().toLowerCase();
	        	var menuName = $(this).children('.nav-link').data('menuitem').trim().toLowerCase();
						navItemClickCallback(menuName,this,url);
					}
	    }); // end of click listener
	}

	function navItemClickCallback (memuItemName,elem,url,callbackFunc) {
		//console.log(memuItemName,elem,url,callbackFunc);
		pageSwitchingActive = true;
		if (typeof menuItemName !== 'string') {menuItemName=''};
		lang = LNG$().getSelectedLang();
		elem = elem || '';
		url = url || '';
		if (typeof callbackFunc!=='function') {
			callbackFunc = function(){};
		}
		$(elem).parent().children('.nav-item').removeClass("active");
		$(elem).addClass("active");

		//close the mobile menu if it is opened
		$('#mainNavbar').collapse('hide');

		$('#ajax-container').fadeOut(500, function(){
			$('#ajax-content').hide();
			$('.loader-wrapper').fadeIn(500);
			$("body,html").stop().animate({scrollTop:0}, '50');
			$(this).remove();

			if (mySite.cachedPage[memuItemName]==='') {
				// do the following if the page needs to be loaded for the first time(not cached yet)
				// start of the ajax load function
				$('#ajax-content').load(url + ' #ajax-container', function(result,status){
					if (status === "success") {
						console.log("Loaded '" + memuItemName + "' from SERVER...");
						updatePage(function(){
							LNG$(lang).switchLang(lang);
							mySite.cachedPage[memuItemName]=$(result).find("#ajax-container");
							memuItemName ==='contact' ? mapInitFlag = true : mapInitFlag = false;
							pageCallbackFunc[memuItemName](callbackFunc,mapInitFlag);
						});

					} else if (status === "error") {
						$('.loader-wrapper').hide();
						console.log("Error loading from server...");
					}

				}); // end of ajax load function

			} else {
				//if the page is already cached...
				console.log("Loaded '" + memuItemName + "' from CACHE...");
				$(mySite.cachedPage[memuItemName]).appendTo('#ajax-content');
				updatePage(function(){
					LNG$(lang).switchLang(lang);
					pageCallbackFunc[memuItemName](callbackFunc);
				});
			}
		});  // end of fadeOut function
	} // end of navItemClickCallback function

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

	function placeJumpButtonListeners() {
		clearInterval(mySite.btnInterval);
		mySite.btnInterval = setInterval(function(){
          $(".btn-down").animateCss("bounce");
    },3000);

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

	function placeLangSwitchListener() {
		var activeLanguages =[];
		var languages = {
			"cz":false,
			"en":true,
			"de":true
		};
		activeLang = LNG$().getSelectedLang();

		$.each(languages, function(index,value){
			if (value) {
				activeLanguages.push(index);
			}
		})

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
			var ind = activeLangs.indexOf(langToCheck);
			if (ind === -1) {
				console.log("error: language: '"+ langToCheck +"' within 'index.html' file is not compatible with languages defined.");
			} else {
				isDefined = true;
			}
			return isDefined;
		}
	}

	function linkToGallery(){
		console.log('links to gallery initialized...');
		$(".btn-site").on('click',function(e){
			e.preventDefault;
			var activeLang = LNG$().getSelectedLang();
			var galLink = $(this).data('link').toLowerCase().trim();
			var $elem = $("[data-menuitem='realisations']");
			var url = window.location.href;
			if (url.search("index.html") >= 0 ) {
				url = url.replace("index.html","realisations.html");
			} else {
				url = url + "realisations.html";
			}

			navItemClickCallback('realisations',$elem,url,function(){
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

	}

	function initParallax(triggerElement,tweenElement) {
		console.log("parallax '"+ triggerElement +"' initialized");
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

	$(window).on('load',function(){
		linkToGallery();
		navMenuInit();
		placeJumpButtonListeners();
		placeLangSwitchListener();
		initParallax("#parallax1","#parallax1 > div");
	});

	global.mySite.navMenuInit = navMenuInit;
	global.mySite.linkToGallery = linkToGallery;
	global.mySite.navItemClickCallback = navItemClickCallback;
	global.mySite.placeJumpButtonListeners = placeJumpButtonListeners;
	global.mySite.placeLangSwitchListener = placeLangSwitchListener;
	global.mySite.initParallax = initParallax;

}(window));

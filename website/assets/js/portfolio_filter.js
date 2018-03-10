// ---------- PORTFOLIO FILTER ----------
$(function(global){

	function initCommisionsGallery(callbackFunc){
		var activeLang = LNG$().getSelectedLang();
		console.log("initCommisionsGallery called");
		typeof callbackFunc==="function" ? callbackFunc = callbackFunc : callbackFunc = function(){};

		var brokenCount = 0;

		$(".grid-item>.img-result-wrapper").hide();
		$(".grid-item>.img-loader-wrapper").show();
		$(".grid>.grid-item").addClass("hover-off");

		$('#portfolios').imagesLoaded()
		  .always( function( instance ) {
		    console.log("all images of 'Commisions menu' loaded");

			instantiateIsotopeGallery(".grid",{
		  		itemSelector: '.grid-item',
		  		stagger: 30
			});

		    buildImgCategories("#filter-portfolio","#portfolio-gallery .grid-item");
		    placeFilterListeners(".grid");

			$(".grid-item>.img-result-wrapper").fadeOut(1000);
		    $(".img-loader>.img-loader-text").text("images loaded");
		    $(".img-loader-bar").css("background-color","green");
		    $(".img-loader").delay(3000).slideUp(1000);
		    $(".grid>.grid-item").removeClass("hover-off");

		    //callbackFunc();

		  })
		  .done( function() {
		    console.log("all images of 'Commisions menu' successfully loaded");
				LNG$(activeLang).switchLang(activeLang);
				callbackFunc();
		  })
		  .fail( function() {
		    console.log( brokenCount + " of 'Commisions menu' images have broken links. Check your image paths.");
		    $(".img-loader").delay(3000).slideUp(1000);
		  })
		.progress( function( instance, image ) {

		    if (image.isLoaded) {
		    	$(image.img).siblings(".img-loader-wrapper").hide();
		    	$(image.img).siblings(".img-result-wrapper").animateCss("bounceIn").show();
				$(".img-loader-bar").width((instance.progressedCount/instance.images.length)*100 + "%");
			} else {
				brokenCount++;
				$(image.img).parent().remove();
			}

		});
	}

	function initPricingGallery(callbackFunc){
		typeof callbackFunc==="function" ? callbackFunc = callbackFunc : callbackFunc = function(){};

		var brokenCount = 0;
		$(".grid-pricing>.grid-item-pricing").addClass("hover-off");

		$("#pricing").imagesLoaded()
		 	.always( function( instance ) {
		    	console.log("all images of 'Pricing menu' loaded");

		   		instantiateIsotopeGallery(".grid-pricing",{
		  			itemSelector: '.grid-item-pricing',
		  			stagger: 30
				});

		    	buildImgCategories("#filter-pricelist","#pricing-gallery .grid-item-pricing");
		    	placeFilterListeners(".grid-pricing");
		    	$(".grid-pricing>.grid-item-pricing").removeClass("hover-off");

					callbackFunc();

		  	})
		  	.done( function() {
		    	console.log("All images of 'Pricing menu' successfully loaded");

		  	})
		  	.fail( function() {
		    	console.log( brokenCount + " of 'Pricing menu' images have broken links. Check your image paths.");
		  	})
			.progress( function( instance, image ) {

		    	if (!image.isLoaded) {
					brokenCount++;
					$(image.img).parent().remove();
				}
			});
	}


	function instantiateIsotopeGallery(el,options){
		$(el).isotope(options);
		$(el).isotope( 'on', 'layoutComplete', function(){
			if (el==='.grid') {
				$(el+" :visible img").animateCss('pulse');
			} else if (el==='.grid-pricing') {
				$(el+" :visible").animateCss('pulse');
			}
		});
	}

	function buildImgCategories(listElement,imgContainers) {

		var $imgContainers = $(imgContainers);
		var $buttons = $(listElement);
		var tagged = {};

		$buttons.children().remove();

		$imgContainers.each(function(){
			var imgContainer=this;
			var tags = $(this).data('portfolio-tags');

			if (tags) {
				tags.split(",").forEach(function(tagName){
					tagName = tagName.trim();
					if (tagged[tagName]==null) {
						tagged[tagName]=[];
					}
					tagged[tagName].push(imgContainer);
				});
			}
		})

		$buttons.addClass("filter-wrapper");
		$("<li/>").appendTo($buttons);

		$("<a/>", {
			text: "Vše",
			class: "filter-item selected",
			click: function(){
				$(this).addClass("selected").parent().siblings().children().removeClass("selected");
			}
		}).appendTo($buttons.children().eq(0)).attr('data-lang','Vše');

		$("<li><a class='filter-item filter-portfolio-divider'>&nbsp;</a></li>").appendTo($buttons);

		$.each(tagged, function(tagName) {
			$("<li/>").appendTo($buttons);

			$("<a/>", {
				text: tagName,
				class: "filter-item",
				click: function(){
					$(this).addClass("selected").parent().siblings().children().removeClass("selected");
				}
			}).appendTo($buttons.children().last()).attr('data-lang',tagName);
		})
	};

	function placeFilterListeners(gridEl) {   // ".grid"
	    $('.filter-wrapper').on( 'click', '.filter-item', function() {
	    	var filterValue = $(this).data('lang');
	    	 // console.log("--------");
	    	 // console.log(filterValue);

	    	if (filterValue === $($(".filter-item")[0]).data('lang')) {
	    		$(gridEl).isotope({
				  	filter: function() {
				  		return true;
			  	  	}
					});
	    	} else {
					$(gridEl).isotope({
					  	filter: function() {
					  		tagText= $(this).data('portfolioTags');
					  		found = tagText.search(filterValue);
						  	if (found> -1) {
						  		return true
						  	}   else {
						  		return false
						  	}
				  	  	}
					});
				}

	    });

		$(gridEl + ' .grid-item').on( 'click', function(e) {
			e.preventDefault();
			if ($(this).hasClass('grid-item-selected')) {
				$(this).removeClass('grid-item-selected');
			} else {
				$(gridEl + ' .grid-item').removeClass('grid-item-selected');
				$(this).addClass('grid-item-selected');
			}
			$(gridEl).isotope('layout');
			// console.log('grid item clicked');
			// console.log($(this));
		});

	}

	global.mySite.initCommisionsGallery = initCommisionsGallery;
	global.mySite.initPricingGallery = initPricingGallery;

}(window));

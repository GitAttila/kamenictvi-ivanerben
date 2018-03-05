// ---------- GOOGLE MAP ----------
var MapModule = (function() {

  var myMap;
  var myPosition = {lat: 50.048822, lng: 15.200242};

  var initContactMap = function(){

      // Specify features and elements to define styles.
      var styleArray = [
        {
          "featureType": "all",
          "elementType": "all",
          "stylers": [
              {
                  "saturation": -100
              },
              {
                  "gamma": 0.5
              }
          ]
        }
      ];

      // Create a map object and specify the DOM element for display.
      var map = new google.maps.Map(document.getElementById("contact-map"), {
          center: myPosition,
          scrollwheel: false,
          streetViewControl: true,
          streetViewControl: {
            position: google.maps.ControlPosition.LEFT_BOTTOM
          },
          mapTypeControl: true,
          mapTypeControlOptions: {
              position: google.maps.ControlPosition.BOTTOM_LEFT
          },
          zoomControl: true,
          zoomControlOptions: {
            position: google.maps.ControlPosition.LEFT_CENTER
          },
          // Apply the map style array to the map.
          styles: styleArray,
          zoom: 10
      });

      myMap = map;
      // Create a marker and set its position.

      var marker = new google.maps.Marker({
        map: map,
        position: myPosition,
        title: 'Kamenictví Erben',
        icon: {
          url: "assets/images/IE_logo_rounded_pointer.png",
          scaledSize: new google.maps.Size(150, 150)
        }
      });

      myMap.panBy(0,(-$("nav.navbar").height()));

    }

    var placeContactListeners = function(){
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

    return {
        initContactMap:initContactMap,
        placeContactListeners:placeContactListeners
    }

})();

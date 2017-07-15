// ---------- GOOGLE MAP ----------


  var myMap;
  var myPosition = {lat: 50.048822, lng: 15.200242};

  function initContactMap() {
    
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
        zoom: 14
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

  };

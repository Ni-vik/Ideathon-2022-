// icon for pump location
const iconPng = "icons8-purple-circle-24.png";
// this is the intial function and this will get called
function initMap() {
  // distance matrix service provider
  const serviceDis = new google.maps.DistanceMatrixService();
  // direction service provider
  const directionsService = new google.maps.DirectionsService();
  // direction service route provider

  const directionsRenderer = new google.maps.DirectionsRenderer({
    //  route line style options
    polylineOptions: {
      strokeColor: "purple",
      strokeWeight: 4,
    },
    // hiding point a point b marker
    suppressMarkers: true,
  });
  // function to fetch current location of user based using gecodin api
  async function fetchData() {
    const respose = await fetch(
      "https://www.googleapis.com/geolocation/v1/geolocate?key=API-KEY-HERE",
      {
        method: "POST",
      }
    );

    const currentUserLocation = await respose.json();
    // current location of user in normal form
    const currentLatLng = { ...currentUserLocation.location };
    // current location of user for getting routes and nearby pump locationn
    const orignUser = new google.maps.LatLng(
      currentLatLng.lat,
      currentLatLng.lng
    );
    // this is the map function and this genrators the map in the div with id #map
    const map = new google.maps.Map(document.getElementById("map"), {
      //  this is the zoom level
      zoom: 15.2,
      // this are the current points of the current map
      center: currentLatLng,
      // ṭhis is to disable the current ui
      disableDefaultUI: true,
    });
    // this is the the part which specifies on which map the route polyline should be displayed on
    directionsRenderer.setMap(map);
    // this is for the current user marker
    const userMarker = new google.maps.Marker({
      position: currentLatLng,
      map: map,
      // this is the user icon png
      icon: "icons8-centre-point-99.png",
    });

    // this is the entire cofig array which speficy how different elements will be loaded
    const hideClutter = [
      {
        elementType: "geometry",
        stylers: [
          {
            color: "#242f3e",
          },
        ],
      },
      {
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#746855",
          },
        ],
      },
      {
        elementType: "labels.text.stroke",
        stylers: [
          {
            color: "#242f3e",
          },
        ],
      },
      {
        featureType: "administrative",
        elementType: "geometry",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        featureType: "administrative.land_parcel",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#d59563",
          },
        ],
      },
      {
        featureType: "administrative.neighborhood",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        featureType: "poi",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#d59563",
          },
        ],
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [
          {
            color: "#263c3f",
          },
        ],
      },
      {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#6b9a76",
          },
        ],
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [
          {
            color: "#38414e",
          },
        ],
      },
      {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [
          {
            color: "#212a37",
          },
        ],
      },
      {
        featureType: "road",
        elementType: "labels",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        featureType: "road",
        elementType: "labels.icon",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#9ca5b3",
          },
        ],
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [
          {
            color: "#746855",
          },
        ],
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [
          {
            color: "#1f2835",
          },
        ],
      },
      {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#f3d19c",
          },
        ],
      },
      {
        featureType: "transit",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        featureType: "transit",
        elementType: "geometry",
        stylers: [
          {
            color: "#2f3948",
          },
        ],
      },
      {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#d59563",
          },
        ],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [
          {
            color: "#17263c",
          },
        ],
      },
      {
        featureType: "water",
        elementType: "labels.text",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#515c6d",
          },
        ],
      },
      {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [
          {
            color: "#17263c",
          },
        ],
      },
    ];
    // this is the method to specify the differnt styles and it takes the above hideClutter array and sets styles accordingly
    map.setOptions({
      styles: hideClutter,
    });
    // ignore
    // const pyrmont = new google.maps.LatLng(
    //   currentUserLocation.location.lat,
    //   currentUserLocation.location.lng
    // );

    // this are the requirements for the geeting the different pumps in the user area
    const RequiredPumpInfo = {
      // this is center of user location
      location: orignUser,

      // this is the radius upto which all the pump info will be fetched
      radius: "1500",
      // this specifies the type of place we want info about
      type: "gas_station",
    };

    const service = new google.maps.places.PlacesService(map);
    // this is the nearby searcg method
    service.nearbySearch(RequiredPumpInfo, DataProcessorFunction);
    // this is the function that gets called the results arrive from the maps api it gets the response and the status of the requestion
    function DataProcessorFunction(results, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        // this loop loops over array of results containing object which containes the information about indivudal pumops
        for (var i = 0; i < results.length; i++) {
          // this marker adds one marker for each pump location
          const petrolPumpMarker = new google.maps.Marker({
            position: {
              lat: { ...results[i].geometry.location }.lat(),
              lng: { ...results[i].geometry.location }.lng(),
            },
            icon: iconPng,
            map: map,
          });
          // this is the events listener that listens for cliks ion the markers and if thehy are cliked it does the following code

          petrolPumpMarker.addListener("click", (e) => {
            const currentPump = new google.maps.LatLng(
              e.latLng.lat(),
              e.latLng.lng()
            );
            // this is to get the place id of the currently cliked and active pumpm
            const [idHolder] = results.filter((element) => {
              return element.geometry.location.lat() === currentPump.lat();
            });
            // this is the request to fetch addtional information about the buisness using the getDetails method below
            let request = {
              placeId: `${idHolder.place_id}`,
              fields: [
                "name",
                "rating",
                "formatted_phone_number",
                "price_level",
                "opening_hours",
                "formatted_address",
              ],
            };
            // this is the actual method it takes as param the request and also a callback function which it calls after response is rcived
            service.getDetails(request, callbacker);
            // this is the call back function
            function callbacker(response) {
              // this sets the name of the pump in infowindow
              document.querySelector(
                `.pumpName`
              ).textContent = `${response.name}`;
              // this sets the time in infowindow
              document.querySelector(`.openTill`).textContent =
                response.opening_hours.weekday_text[new Date().getDay() - 1];
              //  this sets the adress in info window
              document.querySelector(`.adressDisplay`).textContent =
                response.formatted_address;
            }
            // this is the request for getting info about distance and duration to the pump form current postion
            const requestDis = {
              origins: [currentLatLng],
              destinations: [currentPump],
              travelMode: google.maps.TravelMode.DRIVING,
              unitSystem: google.maps.UnitSystem.METRIC,
              avoidHighways: false,
              avoidTolls: false,
            };

            // this is the method to get the distance matrix
            serviceDis.getDistanceMatrix(requestDis).then((response) => {
              document.querySelector(`.distance`).textContent =
                response.rows[0].elements[0].distance.text;
              console.log(response);
              document.querySelector(`.duration`).textContent =
                response.rows[0].elements[0].duration.text;
            });

            // this is the function which will get the route data and will also diplay current postion
            function calculateAndDisplayRoute(
              directionsService,
              directionsRenderer
            ) {
              directionsService
                .route({
                  origin: orignUser,
                  destination: currentPump,
                  travelMode: google.maps.TravelMode.DRIVING,
                })
                .then((response) => {
                  directionsRenderer.setDirections(response);
                })
                .catch((e) => {
                  window.alert("Directions request failed due to " + status);
                });
            }

            calculateAndDisplayRoute(directionsService, directionsRenderer);
          });
        }
      }
    }
  }

  fetchData();
}

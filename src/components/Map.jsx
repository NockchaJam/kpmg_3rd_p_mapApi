import { useEffect, useRef, useCallback } from 'react';

const Map = ({ onLocationSelect, radius, selectedType }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const storeMarkers = useRef([]);
  const currentMarker = useRef(null);
  const currentCircle = useRef(null);

  const clearCurrentMarkerAndCircle = useCallback(() => {
    if (currentMarker.current) {
      currentMarker.current.setMap(null);
      currentMarker.current = null;
    }
    if (currentCircle.current) {
      currentCircle.current.setMap(null);
      currentCircle.current = null;
    }
  }, []);

  // 좌표로부터 주소를 얻는 함수
  function getAddressFromCoordinates(lat, lng) {
    const geocoder = new window.google.maps.Geocoder();
    const location = { lat, lng };

    geocoder.geocode({ location: location }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const roadAddress = results.find(result => 
          result.types.includes('route') || result.types.includes('street_address')
        ) || results[0];

        console.log('도로명 주소:', roadAddress.formatted_address);
      } else {
        console.error('Reverse geocode was not successful for the following reason:', status);
      }
    });
  }

  useEffect(() => {
    if (!window.google || !mapRef.current) return;

    const initMap = new window.google.maps.Map(mapRef.current, {
      center: { lat: 37.5665, lng: 126.9780 },
      zoom: 14,
    });

    mapInstance.current = initMap;

    // 테스트를 위한 주제 좌표로 도로명 주소 가져오기
    getAddressFromCoordinates(37.5665, 126.9780);

    const clickListener = initMap.addListener('click', (event) => {
      clearCurrentMarkerAndCircle();

      const marker = new window.google.maps.Marker({
        position: event.latLng,
        map: initMap,
      });
      currentMarker.current = marker;

      const circle = new window.google.maps.Circle({
        map: initMap,
        center: event.latLng,
        radius: radius,
        fillColor: '#FF0000',
        fillOpacity: 0.2,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        clickable: false,
      });
      currentCircle.current = circle;

      storeMarkers.current.forEach(marker => marker.setMap(null));
      storeMarkers.current = [];

      const service = new window.google.maps.places.PlacesService(initMap);
      const request = {
        location: event.latLng,
        radius: radius,
        type: selectedType,
      };

      service.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          results.forEach(place => {
            const storeMarker = new window.google.maps.Marker({
              position: place.geometry.location,
              map: initMap,
              icon: {
                url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
              },
              title: place.name,
            });
            storeMarkers.current.push(storeMarker);
          });
        }
      });

      const location = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      };

      const geocoder = new window.google.maps.Geocoder();
      // 클릭한 위치의 좌표를 주소로 변환
      geocoder.geocode({ location: location }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const roadAddress = results.find(result => 
            result.types.includes('route') || result.types.includes('street_address')
          ) || results[0];

          onLocationSelect({
            address: roadAddress.formatted_address,
            coordinates: location,
            radius: radius
          });
        }
      });
    });

    return () => {
      window.google.maps.event.removeListener(clickListener);
      clearCurrentMarkerAndCircle();
    };
  }, [clearCurrentMarkerAndCircle, radius, onLocationSelect, selectedType]);

  useEffect(() => {
    if (currentCircle.current) {
      currentCircle.current.setRadius(radius);
    }
  }, [radius]);

  return (
    <div>
      <div ref={mapRef} style={{ width: '100%', height: '100vh' }} />
    </div>
  );
};

export default Map;
import React, { useEffect, useRef, useCallback } from 'react';

const Map = ({ onLocationSelect, radius, selectedType, onSearch }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const storeMarkers = useRef([]);
  const currentMarker = useRef(null);
  const currentCircle = useRef(null);
  const selectedLocationRef = useRef(null);

  const clearCurrentMarkerAndCircle = useCallback(() => {
    if (currentMarker.current) {
      currentMarker.current.setMap(null);
      currentMarker.current = null;
    }
    if (currentCircle.current) {
      currentCircle.current.setMap(null);
      currentCircle.current = null;
    }
    storeMarkers.current.forEach(marker => marker.setMap(null));
    storeMarkers.current = [];
  }, []);

  const performSearch = useCallback(() => {
    if (!selectedLocationRef.current) return;

    const circle = new window.google.maps.Circle({
      map: mapInstance.current,
      center: selectedLocationRef.current,
      radius: radius,
      fillColor: '#FF0000',
      fillOpacity: 0.2,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      clickable: false,
    });
    currentCircle.current = circle;

    const service = new window.google.maps.places.PlacesService(mapInstance.current);
    const request = {
      location: selectedLocationRef.current,
      radius: radius,
      type: selectedType,
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
        results.forEach(place => {
          const storeMarker = new window.google.maps.Marker({
            position: place.geometry.location,
            map: mapInstance.current,
            icon: {
              url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            },
            title: place.name,
          });
          storeMarkers.current.push(storeMarker);
        });
      }
    });
  }, [radius, selectedType]);

  useEffect(() => {
    if (!window.google || !mapRef.current) return;

    const initMap = new window.google.maps.Map(mapRef.current, {
      center: { lat: 37.5665, lng: 126.9780 },
      zoom: 14,
    });

    mapInstance.current = initMap;

    const clickListener = initMap.addListener('click', (event) => {
      clearCurrentMarkerAndCircle();

      const marker = new window.google.maps.Marker({
        position: event.latLng,
        map: initMap,
      });
      currentMarker.current = marker;
      
      const location = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      };
      selectedLocationRef.current = location;

      const geocoder = new window.google.maps.Geocoder();
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
  }, [clearCurrentMarkerAndCircle, radius, onLocationSelect]);

  useEffect(() => {
    if (onSearch) {
      onSearch.current = performSearch;
    }
  }, [onSearch, performSearch]);

  return (
    <div>
      <div ref={mapRef} style={{ width: '100%', height: '100vh' }} />
    </div>
  );
};

export default Map;
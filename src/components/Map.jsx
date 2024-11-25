import { useEffect, useRef, useState, useCallback } from 'react';

const Map = ({ onLocationSelect, radius }) => {
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
        type: ['convenience_store'],
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
      geocoder.geocode({ location: location }, (results, status) => {
        if (status === 'OK' && results[0]) {
          onLocationSelect({
            address: results[0].formatted_address,
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

  const handleRadiusChange = useCallback((e) => {
    const newRadius = Number(e.target.value);
    e.preventDefault();

    if (currentCircle.current) {
      currentCircle.current.setRadius(newRadius);

      const position = currentMarker.current.getPosition();
      const location = {
        lat: position.lat(),
        lng: position.lng()
      };

      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: location }, (results, status) => {
        if (status === 'OK' && results[0]) {
          onLocationSelect({
            address: results[0].formatted_address,
            coordinates: location,
            radius: newRadius
          });
        }
      });
    }
  }, [onLocationSelect]);

  return (
    <div>
      <div ref={mapRef} style={{ width: '100%', height: '90vh' }} />
    </div>
  );
};

export default Map;
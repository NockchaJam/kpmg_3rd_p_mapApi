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

  const getCircleOptions = (industry) => {
    let fillColor;
    
    if (industry === '공실') {  // industry가 '공실'인 경우
      fillColor = '#FFFFFF';  // 흰색 채우기
    } else if (industry === selectedType) {  // 선택된 업종
      fillColor = '#0000FF';  // 파란색 채우기
    } else {  // 다른 업종
      fillColor = '#000000';  // 검은색 채우기
    }

    return {
      fillColor,  // 원 내부 색상
      fillOpacity: 0.5,  // 내부 투명도 (0~1)
      strokeWeight: 0,  // 테두리 두께를 0으로 설정하여 테두리 제거
      scale: 0.2
    };
  };

  const performSearch = useCallback(async () => {
    if (!selectedLocationRef.current) return;

    // 기존 바운더리 원 제거
    if (currentCircle.current) {
      currentCircle.current.setMap(null);
    }

    // 바운더리 원 표시
    const circle = new window.google.maps.Circle({
      map: mapInstance.current,
      center: selectedLocationRef.current,
      radius: radius,
      fillColor: '#FF0000',
      fillOpacity: 0.1,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      clickable: false,
    });
    currentCircle.current = circle;

    try {
      // 백엔드 API 호출
      const response = await fetch(
        `http://localhost:8000/api/locations/search?` +
        `lat=${selectedLocationRef.current.lat}&` +
        `lng=${selectedLocationRef.current.lng}&` +
        `radius=${radius}&` +
        `type=${selectedType}`
      );
      
      if (!response.ok) throw new Error('API 요청 실패');
      
      const locations = await response.json();
      
      // 기존 마커 제거
      storeMarkers.current.forEach(marker => marker.setMap(null));
      storeMarkers.current = [];

      // 새로운 위치 표시
      locations.forEach(location => {
        const circle = new window.google.maps.Circle({
          map: mapInstance.current,
          center: { lat: location.latitude, lng: location.longitude },
          radius: 10,  // 원의 크기를 20에서 10미터로 줄임
          ...getCircleOptions(location.industry)
        });
        storeMarkers.current.push(circle);
      });

      // 검색 결과를 상위 컴포넌트로 전달할 때 기존 위치 정보 유지
      if (onLocationSelect) {
        onLocationSelect({
          address: selectedLocationRef.current.address,  // 기존 주소 정보 유지
          coordinates: {  // 기존 좌표 정보 유지
            lat: selectedLocationRef.current.lat,
            lng: selectedLocationRef.current.lng
          },
          searchResults: locations  // 검색 결과 추가
        });
      }
    } catch (error) {
      console.error('검색 실패:', error);
    }
  }, [radius, selectedType, onLocationSelect]);

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
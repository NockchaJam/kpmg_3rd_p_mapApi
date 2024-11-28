const LocationInfo = ({ locationData, onClose }) => {
  if (!locationData) return null;

  return (
    <div className="location-info">
      <div className="location-header">
        <h3>위치 정보</h3>
        <button onClick={onClose} className="close-btn">×</button>
      </div>
      <div className="location-content">
        {/* 2024-03-19: 위치 정보 내용 임시 제거
        <p><strong>주소:</strong> {locationData.address}</p>
        <p><strong>위도:</strong> {locationData.coordinates.lat.toFixed(6)}</p>
        <p><strong>경도:</strong> {locationData.coordinates.lng.toFixed(6)}</p>
        <p><strong>설정 반경:</strong> {(locationData.radius / 1000).toFixed(2)}km</p>
        */}
      </div>
    </div>
  );
};

export default LocationInfo; 
import React, { useEffect, useRef } from 'react';
import './VacantList.css';

const VacantList = ({ searchResults, highlightedLocation, onItemClick, locationScores }) => {
  const listRef = useRef(null);
  const groupRefs = useRef({});

  const formatPrice = (price) => {
    if (!price) return '0';
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // 검색 결과를 위치별로 그룹화
  const groupedResults = searchResults.reduce((acc, result) => {
    const key = `${result.latitude},${result.longitude}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(result);
    return acc;
  }, {});

  // highlightedLocation이 변경될 때 해당 요소로 스크롤
  useEffect(() => {
    if (highlightedLocation && groupRefs.current[highlightedLocation]) {
      const element = groupRefs.current[highlightedLocation];
      const container = listRef.current;
      
      if (element && container) {
        const elementRect = element.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        // 요소가 컨테이너의 뷰포트를 벗어나는지 확인
        if (elementRect.top < containerRect.top || elementRect.bottom > containerRect.bottom) {
          element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    }
  }, [highlightedLocation]);

  // 주소를 간단하게 포맷하는 함수 추가
  const formatAddress = (address) => {
    // 첫 번째 결과의 주소를 사용
    const firstResult = groupedResults[address][0];
    return firstResult.address;
  };

  const getScoreClass = (score) => {
    return `score-${Math.floor(score/20)}`;
  };

  // 점수에 따른 등수 표시를 위한 함수
  const getRankLabel = (locationKey) => {
    if (!locationScores) return null;
    
    // 점수가 있는 위치들만 추출하여 정렬
    const sortedLocations = Object.entries(locationScores)
      .sort(([, a], [, b]) => b - a); // 점수 높은 순으로 정렬
    
    // 현재 위치의 등수 찾기
    const rank = sortedLocations.findIndex(([key]) => key === locationKey) + 1;
    
    // 3등까지만 표시
    if (rank <= 3) {
      return <span className={`rank-label rank-${rank}`}>{rank}등</span>;
    }
    return null;
  };

  return (
    <div ref={listRef}>
      <div className="vacant-list-header">
        <h3>공실 목록 ({searchResults.length}개)</h3>
      </div>
      <div className="vacant-list">
        {Object.entries(groupedResults).map(([locationKey, locations]) => {
          const [lat, lng] = locationKey.split(',').map(Number);
          const address = formatAddress(locationKey);
          const score = locationScores?.[locationKey];
          const rankLabel = getRankLabel(locationKey);
          
          return (
            <div 
              key={locationKey} 
              ref={el => groupRefs.current[locationKey] = el}
              className={`vacant-group ${highlightedLocation === locationKey ? 'highlighted' : ''}`}
              onClick={() => onItemClick(lat, lng)}
            >
              <div className="vacant-group-header">
                <div className="vacant-group-title">
                  이 위치의 공실
                  <span className="vacant-group-count">{locations.length}개</span>
                  {score !== undefined && (
                    <div className="score-container">
                      <span className={`area-score ${getScoreClass(score)}`}>
                        점수: {score}
                      </span>
                      {rankLabel}
                    </div>
                  )}
                </div>
                <div className="vacant-group-address">{address}</div>
              </div>

              {locations.map((result, index) => (
                <div key={index} className="vacant-item">
                  <div className="vacant-item-header">
                    <div className="vacant-item-header-top">
                      <span className="property-type">{result.property_type}</span>
                      <span className="floor-info">{result.floor_info}</span>
                    </div>
                  </div>
                  <div className="vacant-item-price">
                    <div className="price-row">
                      <span className="price-label">보증금</span>
                      <span className="price-value">{formatPrice(result.deposit)}만원</span>
                    </div>
                    <div className="price-row">
                      <span className="price-label">월세</span>
                      <span className="price-value">{formatPrice(result.monthly_rent)}만원</span>
                    </div>
                  </div>
                  <div className="vacant-item-details">
                    <div className="detail-row">
                      <span className="detail-label">면적</span>
                      <span className="detail-value">{result.area1}㎡ ({Math.floor(result.area1 * 0.3025)}평)</span>
                    </div>
                    {result.description && (
                      <div className="description">
                        {result.description}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VacantList; 
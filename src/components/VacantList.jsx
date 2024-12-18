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
        
        // 요소가 컨테이너의 뷰포트를 벗어���는지 확인
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

  // 매출등급에 따른 등수 표시를 위한 함수
  const getRankLabel = (locationKey) => {
    if (!locationScores) return null;
    
    // 매출등급 순위 계산 (상 > 중 > 하 순서로)
    const salesLevelRank = {
      '상': 3,
      '중': 2,
      '하': 1
    };
    
    const sortedLocations = Object.entries(locationScores)
      .sort(([, a], [, b]) => {
        // 먼저 매출등급으로 정렬
        const rankDiff = salesLevelRank[b.salesLevel] - salesLevelRank[a.salesLevel];
        if (rankDiff !== 0) return rankDiff;
        // 매출등급이 같으면 주변 상가 수로 정렬
        return b.count - a.count;
      });
    
    const rank = sortedLocations.findIndex(([key]) => key === locationKey) + 1;
    
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
        {searchResults.map((vacant, index) => {
          const locationKey = `${vacant.latitude},${vacant.longitude}`;
          const locationScore = locationScores?.[locationKey];
          
          return (
            <div 
              key={index}
              className={`vacant-item ${highlightedLocation === locationKey ? 'highlighted' : ''}`}
              onClick={() => onItemClick(vacant.latitude, vacant.longitude)}
            >
              <div className="vacant-header">
                <span className="vacant-location">위치 {index + 1}</span>
                {locationScore && (
                  <span className="sales-level">
                    평균 매출등급: {locationScore.avgSalesLevel}
                    {locationScore.count > 0 && ` (주변 상가 ${locationScore.count}개)`}
                  </span>
                )}
              </div>
              <div className="vacant-content">
                <div className="vacant-distance">
                  <span className="label">거리:</span>
                  <span className="value">{Math.round(vacant.distance)}m</span>
                </div>
                <div className="vacant-coordinates">
                  <span className="label">좌표:</span>
                  <span className="value">
                    {vacant.latitude.toFixed(6)}, {vacant.longitude.toFixed(6)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VacantList; 
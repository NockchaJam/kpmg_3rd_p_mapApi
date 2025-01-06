import React, { useEffect, useRef, useState } from 'react';
import './VacantList.css';

const VacantList = ({ searchResults, highlightedLocation, onItemClick, locationScores }) => {
  const listRef = useRef(null);
  const groupRefs = useRef({});
  const [analysisResult, setAnalysisResult] = useState(null);
  const [storeAnalysisResults, setStoreAnalysisResults] = useState({});  // 각 공실별 상가 분석 결과
  const [expandedAnalysis, setExpandedAnalysis] = useState(null);  // 확장된 분석 결과 추적

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

  const handleReportGeneration = async () => {
    if (!searchResults || searchResults.length === 0) return;

    try {
      const response = await fetch('http://localhost:8000/api/save-vacant-report/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lat: searchResults[0].latitude,
          lng: searchResults[0].longitude,
          vacant_data: searchResults,
          selected_business_type: locationScores?.[`${searchResults[0].latitude},${searchResults[0].longitude}`]?.nearbyBusinesses?.[0]?.industry_category || null,
          search_radius: locationScores?.[`${searchResults[0].latitude},${searchResults[0].longitude}`]?.searchRadius || 500
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || '리포트 저장 실패');
      }
      
      const result = await response.json();
      console.log('리포트가 저장되었습니다:', result.filename);
      alert('리포트가 성공적으로 저장되었습니다!');
      
      setAnalysisResult(result.analysis);
      
    } catch (error) {
      console.error('리포트 생성 중 오류:', error);
      alert('리포트 저장 중 오류가 발생했습니다: ' + error.message);
    }
  };

  const handleStoreAnalysis = async (vacant, locationScore) => {
    try {
      const response = await fetch('http://localhost:8000/api/save-store-report/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lat: vacant.latitude,
          lng: vacant.longitude,
          selected_business_type: locationScore?.nearbyBusinesses?.[0]?.industry_category,
          search_radius: locationScore?.searchRadius || 500
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || '상가 분석 리포트 저장 실패');
      }
      
      const result = await response.json();
      console.log('상가 분석 리포트가 저장되었습니다:', result.filename);
      alert('상가 분석 리포트가 성공적으로 저장되었습니다!');
      
      // 해당 공실의 분석 결과 저장
      const locationKey = `${vacant.latitude},${vacant.longitude}`;
      setStoreAnalysisResults(prev => ({
        ...prev,
        [locationKey]: result.analysis
      }));
      
    } catch (error) {
      console.error('상가 분석 리포트 생성 중 오류:', error);
      alert('상가 분석 리포트 저장 중 오류가 발생했습니다: ' + error.message);
    }
  };

  // 분석 결과 클릭 핸들러
  const handleAnalysisClick = (locationKey) => {
    setExpandedAnalysis(expandedAnalysis === locationKey ? null : locationKey);
  };

  // 평균 매출 등급 계산 함수 추가
  const calculateAvgSalesLevel = (businesses) => {
    if (!businesses || businesses.length === 0) return null;
    
    const validSalesLevels = businesses
      .map(business => business.sales_level)
      .filter(level => level && level.toString().match(/^\d+$/));
    
    if (validSalesLevels.length === 0) return null;
    
    const sum = validSalesLevels.reduce((acc, level) => acc + parseInt(level), 0);
    return (sum / validSalesLevels.length).toFixed(2);
  };

  return (
    <div className="vacant-list-container" ref={listRef}>
      <div className="analysis-section">
        <button 
          className="report-button"
          onClick={handleReportGeneration}
        >
          공실 추천 받기
        </button>
        
        {/* 공실 분석 결과 표시 */}
        {analysisResult && (
          <div 
            className={`analysis-result ${expandedAnalysis === 'main' ? 'expanded' : ''}`}
            onClick={() => handleAnalysisClick('main')}
          >
            <h4>분석 결과</h4>
            <p>{analysisResult}</p>
          </div>
        )}
      </div>

      <div className="vacant-list-header">
        <h3>공실 목록 ({searchResults.length}개)</h3>
      </div>
      <div className="vacant-list">
        {searchResults.map((vacant, index) => {
          const locationKey = `${vacant.latitude},${vacant.longitude}`;
          const locationScore = locationScores?.[locationKey];
          const avgSalesLevel = locationScore?.nearbyBusinesses ? 
            calculateAvgSalesLevel(locationScore.nearbyBusinesses) : null;
          
          return (
            <div 
              key={index}
              className={`vacant-item ${highlightedLocation === locationKey ? 'highlighted' : ''}`}
              onClick={() => onItemClick(vacant.latitude, vacant.longitude, {
                title: `위치 ${index + 1}`,
                deposit: vacant.deposit,
                monthly_rent: vacant.monthly_rent,
                area: vacant.area,
                address: vacant.address
              })}
            >
              <div className="vacant-header">
                <span className="vacant-location">위치 {index + 1}</span>
                {locationScore && avgSalesLevel && (
                  <span className="sales-level">
                    평균 매출등급: {avgSalesLevel}
                    {locationScore.nearbyBusinesses && ` (주변 상가 ${locationScore.nearbyBusinesses.length}개)`}
                  </span>
                )}
              </div>
              <div className="vacant-content">
                <div className="vacant-distance">
                  <span className="label">거리:</span>
                  <span className="value">{Math.round(vacant.distance)}m</span>
                </div>
                
                {/* 주변 시설 정보 */}
                <div className="facilities-info">
                  <h4>주변 시설 정보</h4>
                  <div className="facility-item">
                    <span className="label">기업체 수 (3km):</span>
                    <span className="value">{vacant.num_of_company || 0}개</span>
                  </div>
                  <div className="facility-item">
                    <span className="label">대기업 수 (1km):</span>
                    <span className="value">{vacant.num_of_large || 0}개</span>
                  </div>
                  <div className="facility-item">
                    <span className="label">버스정류장 (500m):</span>
                    <span className="value">{vacant.num_of_bus_stop || 0}개</span>
                  </div>
                  <div className="facility-item">
                    <span className="label">병원 수 (1km):</span>
                    <span className="value">{vacant.num_of_hospital || 0}개</span>
                  </div>
                  <div className="facility-item">
                    <span className="label">학교 수 (500m):</span>
                    <span className="value">{vacant.num_of_school || 0}개</span>
                  </div>
                </div>

                {/* 지하철 정보 */}
                <div className="subway-info">
                  <h4>지하철 정보</h4>
                  <div className="facility-item">
                    <span className="label">가장 가까운 역:</span>
                    <span className="value">{vacant.nearest_subway_name || '없음'}</span>
                  </div>
                  <div className="facility-item">
                    <span className="label">역까지 거리:</span>
                    <span className="value">
                      {vacant.nearest_subway_distance ? 
                        `${Math.round(vacant.nearest_subway_distance)}m` : 
                        '정보 없음'}
                    </span>
                  </div>
                  <div className="facility-item">
                    <span className="label">500m 내 역 수:</span>
                    <span className="value">{vacant.num_of_subway || 0}개</span>
                  </div>
                </div>

                {/* 기타 시설 정보 */}
                <div className="other-facilities">
                  <h4>기타 시설 정보</h4>
                  <div className="facility-item">
                    <span className="label">관공서 (500m):</span>
                    <span className="value">{vacant.num_of_gvn_office || 0}개</span>
                  </div>
                  <div className="facility-item">
                    <span className="label">공원:</span>
                    <span className="value">{vacant.parks_within_500m || 0}개</span>
                  </div>
                  <div className="facility-item">
                    <span className="label">주차장:</span>
                    <span className="value">{vacant.parking_lots_within_500m || 0}개</span>
                  </div>
                </div>

                {/* 좌변 상가 정보 표시 */}
                {locationScore?.nearbyBusinesses && locationScore.nearbyBusinesses.length > 0 && (
                  <div className="nearby-businesses">
                    <div className="nearby-businesses-header">
                      <span className="label">주변 상가 목록:</span>
                    </div>
                    <div className="nearby-businesses-list">
                      {locationScore.nearbyBusinesses.map((business, idx) => (
                        <div key={idx} className="nearby-business-item">
                          <span className="business-type">{business.industry_category}</span>
                          <span className="business-sales">매출등급: {business.sales_level}</span>
                          <span className="business-distance">{business.distance}m</span>
                        </div>
                      ))}
                    </div>
                    <button 
                      className="analyze-business-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStoreAnalysis(vacant, locationScore);
                      }}
                    >
                      업종 추천 받기
                    </button>
                    
                    {/* 상가 분석 결과 표시 */}
                    {storeAnalysisResults[locationKey] && (
                      <div 
                        className={`analysis-result ${expandedAnalysis === locationKey ? 'expanded' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();  // 상위 요소로의 이벤트 전파 중지
                          handleAnalysisClick(locationKey);
                        }}
                      >
                        <h4>상가 분석 결과</h4>
                        <p onClick={e => e.stopPropagation()}>{storeAnalysisResults[locationKey]}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VacantList; 
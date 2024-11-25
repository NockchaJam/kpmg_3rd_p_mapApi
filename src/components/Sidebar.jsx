const Sidebar = ({ radius, setRadius }) => {
  return (
    <div className="sidebar">
      <div className="logo">NICE bizmap</div>
      <div className="menu-item">
        <i className="icon">📍</i>
        한 위치
      </div>
      <div className="menu-item">
        <i className="icon">📊</i>
        기본보고서
      </div>
      <div className="menu-item">
        <label>
          반경 설정 (미터):
          <input 
            type="number" 
            value={radius} 
            onChange={(e) => setRadius(Number(e.target.value))}
            style={{ marginLeft: '10px', width: '100px' }}
            min="-1"
          />
        </label>
      </div>
    </div>
  );
};

export default Sidebar; 
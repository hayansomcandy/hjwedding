import React, { useState, useEffect } from 'react';

// Note: To use Kakao Maps, you must provide your JavaScript Key in the script tag in index.html
// or use the SDK's Provider. For simplicity of the layout, we show the structure.

const Location = () => {
    const [location, setLocation] = useState({
        name: '그랜드 하우스',
        address: '인천광역시 미추홀구 주안로 103-18',
        trafficSubway: '1호선 주안역 1번 출구 도보 3분',
        trafficBus: '주안역 환승센터 하차',
        trafficParking: '건물 내 지하주차장 이용 (2시간 무료)'
    });

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('wedding_info'));
        if (saved) {
            setLocation({
                name: saved.locationName || '그랜드하우스',
                address: saved.locationAddress || '상세 주소를 입력해주세요',
                mapImage: saved.mapImage,
                linkTmap: saved.linkTmap,
                linkKakao: saved.linkKakao,
                linkNaver: saved.linkNaver,
                trafficSubway: saved.trafficSubway,
                trafficBus: saved.trafficBus,
                trafficParking: saved.trafficParking
            });
        }
    }, []);

    return (
        <div className="section">
            <h3>오시는 길</h3>
            <p style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>{location.name}</p>
            <p>{location.address}</p>

            {/* Map Container */}
            <div
                id="map"
                onClick={() => location.linkNaver ? window.open(location.linkNaver) : alert('네이버 지도 링크가 설정되지 않았습니다.')}
                style={{
                    width: '100%',
                    minHeight: '300px', // Restore height to prevent collapse
                    backgroundColor: '#eee',
                    margin: '20px 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    cursor: location.linkNaver ? 'pointer' : 'default'
                }}
            >
                <img
                    src={location.mapImage || 'https://via.placeholder.com/400x300?text=Map+Image'}
                    alt="약도"
                    onError={(e) => {
                        e.target.onerror = null; // Prevent infinite loop
                        e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                    }}
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button className="btn" style={{ flex: 1 }} onClick={() => location.linkTmap ? window.open(location.linkTmap) : alert('링크가 설정되지 않았습니다.')}>T-Map</button>
                <button className="btn" style={{ flex: 1 }} onClick={() => location.linkKakao ? window.open(location.linkKakao) : alert('링크가 설정되지 않았습니다.')}>Kakao Navi</button>
                <button className="btn" style={{ flex: 1 }} onClick={() => location.linkNaver ? window.open(location.linkNaver) : alert('링크가 설정되지 않았습니다.')}>Naver Map</button>
            </div>

            <div style={{ marginTop: '30px', textAlign: 'left', padding: '0 10px' }}>
                {(location.trafficSubway || location.trafficBus || location.trafficParking) && (
                    <>
                        <h4 style={{ fontSize: '16px', color: '#d77', marginBottom: '15px' }}>교통편 안내</h4>

                        {location.trafficSubway && (
                            <div style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
                                <div style={{ fontSize: '20px', minWidth: '24px' }}>🚇</div>
                                <div>
                                    <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px' }}>지하철</div>
                                    <div style={{ fontSize: '14px', color: '#555', lineHeight: '1.5', whiteSpace: 'pre-line' }}>{location.trafficSubway}</div>
                                </div>
                            </div>
                        )}

                        {location.trafficBus && (
                            <div style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
                                <div style={{ fontSize: '20px', minWidth: '24px' }}>🚌</div>
                                <div>
                                    <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px' }}>버스</div>
                                    <div style={{ fontSize: '14px', color: '#555', lineHeight: '1.5', whiteSpace: 'pre-line' }}>{location.trafficBus}</div>
                                </div>
                            </div>
                        )}

                        {location.trafficParking && (
                            <div style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
                                <div style={{ fontSize: '20px', minWidth: '24px' }}>🅿️</div>
                                <div>
                                    <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px' }}>주차</div>
                                    <div style={{ fontSize: '14px', color: '#555', lineHeight: '1.5', whiteSpace: 'pre-line' }}>{location.trafficParking}</div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Location;

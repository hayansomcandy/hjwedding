import React, { useState, useEffect } from 'react';

const Hero = () => {
    const [info, setInfo] = useState({
        groomName: '임진오',
        brideName: '신하솜',
        date: '2026년 2월 8일 일요일',
        message: '"저희 두 사람, \n사랑으로 하나 되어 시작합니다."'
    });

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('wedding_info'));
        if (saved) setInfo(saved);
    }, []);

    return (
        <div className="section" style={{ padding: '60px 20px', backgroundColor: '#fff' }}>
            <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>{info.groomName} & {info.brideName}</h1>
            <p style={{ fontSize: '16px', color: '#666' }}>{info.date}</p>

            <div style={{
                width: '100%',
                height: '400px',
                backgroundColor: '#eee',
                margin: '30px 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px'
            }}>
                {/* Replace with <img> tag */}
                <span style={{ color: '#aaa' }}>Main Photo Area</span>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <button className="btn" onClick={() => {
                    if (navigator.share) {
                        navigator.share({
                            title: `${info.groomName} & ${info.brideName} 결혼식`,
                            text: '저희 결혼식에 초대합니다.',
                            url: window.location.href,
                        });
                    } else {
                        navigator.clipboard.writeText(window.location.href);
                        alert('링크가 복사되었습니다.');
                    }
                }}>💌 카카오톡/링크 공유하기</button>
            </div>

            <p style={{ whiteSpace: 'pre-line' }}>{info.message}</p>
        </div>
    );
};

export default Hero;

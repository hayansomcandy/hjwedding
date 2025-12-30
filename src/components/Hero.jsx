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
        <div className="section" style={{
            position: 'relative',
            padding: '100px 20px',
            backgroundColor: '#fff',
            overflow: 'hidden',
            minHeight: '600px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#333'
        }}>
            {/* Background Image */}
            {info.mainImage && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(${info.mainImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: info.mainImageOpacity || 0.6,
                    zIndex: 0
                }} />
            )}

            {/* Content Overlay */}
            <div style={{ position: 'relative', zIndex: 1, width: '100%', textAlign: 'center' }}>
                <p style={{ fontSize: '18px', letterSpacing: '2px', marginBottom: '20px', textTransform: 'uppercase', color: '#555' }}>Wedding Invitation</p>

                <h1 style={{ fontSize: '32px', marginBottom: '15px', fontWeight: 'bold' }}>
                    {info.groomName} <span style={{ fontSize: '24px', fontWeight: 'normal' }}>&</span> {info.brideName}
                </h1>

                <p style={{ fontSize: '18px', color: '#444', marginBottom: '40px', fontWeight: '500' }}>{info.date}</p>

                <div style={{ marginBottom: '40px' }}>
                    <p style={{ whiteSpace: 'pre-line', fontSize: '16px', lineHeight: '2', color: '#333' }}>{info.message}</p>
                </div>

                <div style={{ marginTop: '20px' }}>
                    <button className="btn" style={{ backgroundColor: 'rgba(255,255,255,0.8)', border: '1px solid #ccc', color: '#333' }} onClick={() => {
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
            </div>
        </div>
    );
};

export default Hero;

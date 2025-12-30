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
            <div style={{ position: 'relative', zIndex: 1, width: '100%', textAlign: 'center', color: info.heroTextColor || '#333' }}>
                <p style={{
                    fontSize: '18px',
                    letterSpacing: '2px',
                    marginBottom: '20px',
                    textTransform: 'uppercase',
                    color: info.heroTextColor ? info.heroTextColor : '#555',
                    fontFamily: info.heroFontFamily || 'inherit',
                    opacity: 0.8
                }}>Wedding Invitation</p>

                <h1 style={{
                    fontSize: `${info.heroTitleFontSize || 32}px`,
                    marginBottom: '15px',
                    fontWeight: 'bold',
                    fontFamily: info.heroFontFamily || 'inherit'
                }}>
                    {info.groomName} <span style={{ fontSize: `${(info.heroTitleFontSize || 32) * 0.75}px`, fontWeight: 'normal' }}>&</span> {info.brideName}
                </h1>

                <p style={{
                    fontSize: `${info.heroDateFontSize || 18}px`,
                    color: info.heroTextColor || '#444',
                    marginBottom: '40px',
                    fontWeight: '500',
                    fontFamily: info.heroFontFamily || 'inherit'
                }}>{info.date}</p>

                <div style={{ marginBottom: '40px' }}>
                    <p style={{
                        whiteSpace: 'pre-line',
                        fontSize: `${info.heroMessageFontSize || 16}px`,
                        lineHeight: '2',
                        color: info.heroTextColor || '#333',
                        fontFamily: info.heroFontFamily || 'inherit'
                    }}>{info.message}</p>
                </div>


            </div>
        </div>
    );
};

export default Hero;

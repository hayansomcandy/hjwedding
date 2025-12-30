import React, { useState, useEffect } from 'react';
import { database } from '../firebase';
import { ref, onValue } from "firebase/database";

const Profiles = () => {
    const [info, setInfo] = useState({
        groomName: '임진오',
        brideName: '신하솜',
        groomImage: '',
        brideImage: '',
        groomHashtags: '',
        brideHashtags: '',
        groomIntro: '',
        brideIntro: ''
    });

    useEffect(() => {
        const infoRef = ref(database, 'wedding_info');
        onValue(infoRef, (snapshot) => {
            const data = snapshot.val();
            if (data) setInfo(prev => ({ ...prev, ...data }));
        });
    }, []);

    if (!info.groomImage && !info.brideImage) return null;

    return (
        <div className="section" style={{ backgroundColor: '#fafafa', padding: '60px 20px', textAlign: 'center' }}>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '40px',
                maxWidth: '800px',
                margin: '0 auto'
            }}>
                {/* Groom */}
                <div className="fade-in-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{
                        width: '100%',
                        maxWidth: '300px',
                        aspectRatio: '1/1',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        marginBottom: '20px',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                        backgroundColor: '#eee'
                    }}>
                        {info.groomImage ? (
                            <img src={info.groomImage} alt="Groom" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa' }}>No Image</div>
                        )}
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <span style={{ fontSize: '14px', color: '#0066cc', fontWeight: 'bold', marginRight: '5px' }}>신랑</span>
                        <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>{info.groomName}</span>
                    </div>
                    {info.groomBirth && (
                        <p style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>{info.groomBirth}</p>
                    )}
                    {info.groomRegion && (
                        <p style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>{info.groomRegion}</p>
                    )}
                    {info.groomHashtags && (
                        <p style={{ color: '#0066cc', fontSize: '14px', marginBottom: '10px', wordBreak: 'keep-all' }}>{info.groomHashtags}</p>
                    )}
                    <p style={{
                        fontSize: '15px',
                        lineHeight: '1.6',
                        color: '#555',
                        whiteSpace: 'pre-line',
                        wordBreak: 'keep-all',
                        fontFamily: "'Gowun Dodum', sans-serif"
                    }}>
                        {info.groomIntro}
                    </p>
                </div>

                {/* Bride */}
                <div className="fade-in-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', animationDelay: '0.2s' }}>
                    <div style={{
                        width: '100%',
                        maxWidth: '300px',
                        aspectRatio: '1/1',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        marginBottom: '20px',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                        backgroundColor: '#eee'
                    }}>
                        {info.brideImage ? (
                            <img src={info.brideImage} alt="Bride" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa' }}>No Image</div>
                        )}
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <span style={{ fontSize: '14px', color: '#ff6699', fontWeight: 'bold', marginRight: '5px' }}>신부</span>
                        <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>{info.brideName}</span>
                    </div>
                    {info.brideBirth && (
                        <p style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>{info.brideBirth}</p>
                    )}
                    {info.brideRegion && (
                        <p style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>{info.brideRegion}</p>
                    )}
                    {info.brideHashtags && (
                        <p style={{ color: '#ff6699', fontSize: '14px', marginBottom: '10px', wordBreak: 'keep-all' }}>{info.brideHashtags}</p>
                    )}
                    <p style={{
                        fontSize: '15px',
                        lineHeight: '1.6',
                        color: '#555',
                        whiteSpace: 'pre-line',
                        wordBreak: 'keep-all',
                        fontFamily: "'Gowun Dodum', sans-serif"
                    }}>
                        {info.brideIntro}
                    </p>
                </div>
            </div>
            {/* Divider */}
            <hr style={{ width: '50px', border: '1px solid #eee', margin: '60px auto 0' }} />
        </div>
    );
};

export default Profiles;

import React, { useState, useEffect } from 'react';

const Gallery = () => {
    const [images, setImages] = useState([]);

    useEffect(() => {
        // Load images from LocalStorage or use defaults
        const saved = JSON.parse(localStorage.getItem('gallery_images') || '[]');
        if (saved.length === 0) {
            // Default placeholders if empty
            const defaults = [
                'https://via.placeholder.com/300x300?text=Photo+1',
                'https://via.placeholder.com/300x300?text=Photo+2',
                'https://via.placeholder.com/300x300?text=Photo+3',
                'https://via.placeholder.com/300x300?text=Photo+4',
            ];
            // We don't save defaults to LS automatically to allow "empty" state if desired, 
            // but for display we show them.
            setImages(defaults);
        } else {
            setImages(saved);
        }
    }, []);

    if (images.length === 0) return null;

    return (
        <div className="section">
            <h3>갤러리</h3>
            <p style={{ marginBottom: '20px' }}>우리의 아름다운 순간들</p>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '10px',
                padding: '0 10px'
            }}>
                {images.map((url, idx) => (
                    <div key={idx} style={{
                        aspectRatio: '1/1',
                        backgroundColor: '#eee',
                        borderRadius: '8px',
                        overflow: 'hidden'
                    }}>
                        <img
                            src={url}
                            alt={`Gallery ${idx}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => e.target.style.display = 'none'}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Gallery;

import React, { useState, useEffect } from 'react';
import { database } from '../firebase';
import { ref, onValue } from "firebase/database";

const Gallery = () => {
    const [images, setImages] = useState([]);

    useEffect(() => {
        const galleryRef = ref(database, 'gallery_images');
        onValue(galleryRef, (snapshot) => {
            const saved = snapshot.val();
            if (!saved || saved.length === 0) {
                // Default placeholders if empty
                const defaults = [
                    'https://via.placeholder.com/300x300?text=Photo+1',
                    'https://via.placeholder.com/300x300?text=Photo+2',
                    'https://via.placeholder.com/300x300?text=Photo+3',
                    'https://via.placeholder.com/300x300?text=Photo+4',
                ];
                setImages(defaults);
            } else {
                setImages(saved);
            }
        });
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

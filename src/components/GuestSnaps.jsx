import React, { useState, useEffect } from 'react';

const GuestSnaps = () => {
    const [snaps, setSnaps] = useState([]);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('guest_snaps') || '[]');
        setSnaps(saved);
    }, []);

    const handleUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Size check (Limit to 300KB for demo stability)
        if (file.size > 300 * 1024) {
            alert('사진 용량이 너무 큽니다. (300KB 이하만 가능)');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const newSnap = {
                id: Date.now(),
                url: reader.result,
                date: new Date().toLocaleDateString()
            };
            const updated = [newSnap, ...snaps];

            try {
                localStorage.setItem('guest_snaps', JSON.stringify(updated));
                setSnaps(updated);
                alert('소중한 사진이 공유되었습니다!');
            } catch (err) {
                alert('저장 공간이 부족하여 업로드할 수 없습니다.');
            }
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="section" style={{ backgroundColor: '#fff' }}>
            <h3>게스트 스냅 📷</h3>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
                여러분의 시선으로 담아주신 순간들을<br />
                함께 공유해주세요.
            </p>

            <label className="btn btn-point" style={{ display: 'inline-block', marginBottom: '30px', cursor: 'pointer' }}>
                📷 사진 올리기
                <input type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
            </label>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '5px'
            }}>
                {snaps.map((snap) => (
                    <div key={snap.id} style={{
                        aspectRatio: '1/1',
                        backgroundColor: '#eee',
                        overflow: 'hidden',
                        borderRadius: '4px'
                    }}>
                        <img
                            src={snap.url}
                            alt="Snap"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onClick={() => window.open(snap.url)} // Simple lightbox alternative
                        />
                    </div>
                ))}
            </div>
            {snaps.length === 0 && (
                <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', fontSize: '12px', color: '#999' }}>
                    아직 올라온 사진이 없습니다.<br />
                    첫 번째 사진의 주인공이 되어주세요!
                </div>
            )}
        </div>
    );
};

export default GuestSnaps;

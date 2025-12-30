import React, { useState, useEffect } from 'react';

const RSVP = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [checkStep, setCheckStep] = useState(true); // For edit mode: true=check phone, false=edit form
    const [checkMethod, setCheckMethod] = useState('name'); // 'name' or 'phone'

    // Form Data
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        count: 1,
        side: 'groom',
        meal: true // true: Attend, false: Not Attend
    });

    // Info for Modal Display
    const [info, setInfo] = useState({});

    useEffect(() => {
        const savedInfo = JSON.parse(localStorage.getItem('wedding_info'));
        if (savedInfo) setInfo(savedInfo);
        else {
            // Fallback if not yet saved in LS
            setInfo({
                groomName: '임진오',
                brideName: '신하솜',
                date: '2026년 11월 21일 토요일 오후 4시 40분',
                locationName: '그랜드 하우스',
                locationAddress: '인천광역시 미추홀구 주안로 103-18'
            });
        }
    }, [isOpen]);

    const openModal = (mode = 'new') => {
        setIsEditMode(mode === 'edit');
        setCheckStep(mode === 'edit');
        setFormData({ name: '', phone: '', count: 1, side: 'groom', meal: true });
        // Reset check method default
        setCheckMethod('name');
        setIsOpen(true);
        // Disable background scroll
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setIsOpen(false);
        document.body.style.overflow = 'auto';
    };

    const formatPhoneNumber = (value) => {
        return value
            .replace(/[^0-9]/g, '')
            .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, "$1-$2-$3")
            .replace(/(\-{1,2})$/g, "");
    };

    // Handle initial submission (New RSVP)
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation based on mode
        if (!formData.name || !formData.phone) {
            alert('이름과 전화번호를 모두 입력해주세요.');
            return;
        }

        const existingGuests = JSON.parse(localStorage.getItem('guests') || '[]');

        // Simple duplicate check for new entries
        if (!isEditMode) {
            const duplicate = existingGuests.find(g => g.name === formData.name && g.phone === formData.phone);
            if (duplicate) {
                alert('이미 등록된 정보가 있습니다. "수정하기"를 이용해주세요.');
                return;
            }
            const newGuest = { ...formData, id: Date.now(), date: new Date().toLocaleString() };
            localStorage.setItem('guests', JSON.stringify([...existingGuests, newGuest]));
            alert('참석 여부가 전달되었습니다. 감사합니다!');
        } else {
            // Update logic
            // We match by ID since we found them in the check step
            const updatedGuests = existingGuests.map(g =>
                g.id === formData.id ? { ...g, ...formData, date: new Date().toLocaleString() } : g
            );
            localStorage.setItem('guests', JSON.stringify(updatedGuests));
            alert('참석 정보가 수정되었습니다.');
        }

        closeModal();
    };

    // Handle "Check" for edit mode
    const handleCheck = () => {
        const existingGuests = JSON.parse(localStorage.getItem('guests') || '[]');
        let guest = null;

        if (checkMethod === 'name') {
            if (!formData.name) {
                alert('이름을 입력해주세요.');
                return;
            }
            guest = existingGuests.find(g => g.name === formData.name);
        } else {
            if (!formData.phone) {
                alert('연락처를 입력해주세요.');
                return;
            }
            guest = existingGuests.find(g => g.phone === formData.phone);
        }

        if (guest) {
            setFormData(guest);
            setCheckStep(false); // Move to edit form
        } else {
            alert('등록된 정보를 찾을 수 없습니다.');
        }
    };

    if (!isOpen) {
        return (
            <div className="section" style={{ backgroundColor: '#fafafa', padding: '40px 20px', textAlign: 'center' }}>
                <h3>참석 여부 전달</h3>
                <p>축하해주시는 마음 소중히 간직하겠습니다.</p>
                <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <button onClick={() => openModal('new')} className="btn btn-point" style={{ padding: '15px 30px', fontSize: '16px' }}>
                        참석 여부 전달하기
                    </button>
                    <button onClick={() => openModal('edit')} className="btn" style={{ padding: '15px 20px', backgroundColor: '#fff', border: '1px solid #ddd', color: '#666' }}>
                        수정하기
                    </button>
                </div>
            </div>
        );
    }

    // Modal UI
    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px'
        }}>
            <div style={{
                backgroundColor: 'white', borderRadius: '15px', width: '100%', maxWidth: '400px',
                maxHeight: '90vh', overflowY: 'auto', position: 'relative',
                padding: '40px 30px', textAlign: 'center', boxShadow: '0 5px 20px rgba(0,0,0,0.2)'
            }}>
                <button onClick={closeModal} style={{
                    position: 'absolute', top: '15px', right: '15px',
                    border: 'none', background: 'none', fontSize: '24px', cursor: 'pointer', color: '#999'
                }}>✕</button>

                {/* Header Content (Only show in Join mode or if checking) */}
                <h3 style={{ fontSize: '22px', marginBottom: '10px' }}>참석 여부 전달</h3>
                <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#555', marginBottom: '20px' }}>
                    결혼식에 참석해주시는 모든 분들을<br />
                    더욱 특별하게 모시고자 하오니,<br />
                    참석 여부 전달을 부탁드립니다.
                </p>

                <div style={{ borderTop: '1px dashed #ddd', margin: '20px 0' }}></div>

                {/* Info Section */}
                <div style={{ textAlign: 'left', fontSize: '15px', color: '#333', lineHeight: '2', marginBottom: '30px', paddingLeft: '10px' }}>
                    <div>❤️ 신랑 {info.groomName}, 신부 {info.brideName}</div>
                    <div>🗓️ {info.date}</div>
                    <div>📌 {info.locationName || '그랜드 하우스'}<br />
                        <span style={{ fontSize: '13px', color: '#666', paddingLeft: '24px' }}>({info.locationAddress || '주소 정보 없음'})</span>
                    </div>
                </div>

                {/* Form Section */}
                {isEditMode && checkStep ? (
                    <div style={{ textAlign: 'left' }}>
                        <h4 style={{ marginBottom: '10px' }}>내역 확인</h4>

                        <select
                            value={checkMethod}
                            onChange={(e) => setCheckMethod(e.target.value)}
                            style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                        >
                            <option value="name">이름으로 찾기</option>
                            <option value="phone">연락처로 찾기</option>
                        </select>

                        {checkMethod === 'name' ? (
                            <input
                                placeholder="성함 (예: 홍길동)"
                                style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        ) : (
                            <input
                                placeholder="연락처 (예: 010-0000-0000)"
                                style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: formatPhoneNumber(e.target.value) })}
                                maxLength={13}
                            />
                        )}

                        <button className="btn btn-point" style={{ width: '100%' }} onClick={handleCheck}>확인하기</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
                        <label>구분</label>
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                            <label><input type="radio" name="side" checked={formData.side === 'groom'} onChange={() => setFormData({ ...formData, side: 'groom' })} /> 신랑측</label>
                            <label><input type="radio" name="side" checked={formData.side === 'bride'} onChange={() => setFormData({ ...formData, side: 'bride' })} /> 신부측</label>
                        </div>

                        <label>성함</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="홍길동"
                            readOnly={isEditMode} // Cannot open name in edit mode to ensure ID match
                            style={{ backgroundColor: isEditMode ? '#eee' : '#fff' }}
                        />

                        <label>연락처</label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: formatPhoneNumber(e.target.value) })}
                            placeholder="010-0000-0000"
                            readOnly={isEditMode}
                            maxLength={13}
                            style={{ backgroundColor: isEditMode ? '#eee' : '#fff' }}
                        />

                        <label>참석 인원 (본인 포함)</label>
                        <select value={formData.count} onChange={(e) => setFormData({ ...formData, count: Number(e.target.value) })}>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => <option key={n} value={n}>{n}명</option>)}
                        </select>

                        <label>참석 여부</label>
                        <select value={formData.meal} onChange={(e) => setFormData({ ...formData, meal: (e.target.value === 'true') })}>
                            <option value="true">참석 예정</option>
                            <option value="false">참석 불가</option>
                        </select>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            <button type="submit" className="btn btn-point" style={{ flex: 1 }}>
                                {isEditMode ? '수정하기' : '참석 여부 전달'}
                            </button>
                            {isEditMode && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (window.confirm('정말 참석 내역을 삭제하시겠습니까?')) {
                                            const existingGuests = JSON.parse(localStorage.getItem('guests') || '[]');
                                            const updatedGuests = existingGuests.filter(g => g.id !== formData.id);
                                            localStorage.setItem('guests', JSON.stringify(updatedGuests));
                                            alert('삭제되었습니다.');
                                            closeModal();
                                        }
                                    }}
                                    className="btn"
                                    style={{ flex: 1, backgroundColor: '#666', color: '#fff' }}
                                >
                                    삭제하기 (참석 취소)
                                </button>
                            )}
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default RSVP;

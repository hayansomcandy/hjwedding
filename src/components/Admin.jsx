import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { database } from '../firebase';
import { ref, onValue, set } from "firebase/database";

const Admin = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [guests, setGuests] = useState([]);

    // Gallery State
    const [images, setImages] = useState([]);
    const [newImageUrl, setNewImageUrl] = useState('');

    // Info State
    const [info, setInfo] = useState({
        groomName: '임진오',
        brideName: '신하솜',
        date: '2026년 11월 21일 토요일 오후 4시 40분',
        message: '"저희 두 사람, \n사랑으로 하나 되어 시작합니다."',
        locationName: '그랜드 하우스',
        locationAddress: '인천광역시 미추홀구 주안로 103-18',
        mainImageOpacity: 0.6,
        heroTextColor: '#333333',
        heroTitleFontSize: 32,
        heroDateFontSize: 18,
        heroMessageFontSize: 16,
        heroFontFamily: '',
        shareTitle: '임진오&신하솜의 결혼식 초대장',
        shareDesc: '2026년 11월 21일, 소중한 분들을 초대합니다.',
        shareImage: ''
    });

    // Design State
    const [design, setDesign] = useState({
        primaryColor: '#333333',
        pointColor: '#ff9090',
        fontFamily: `'Apple SD Gothic Neo', sans-serif`
    });

    // Accounts State
    const [accounts, setAccounts] = useState({
        groom: [
            { bank: '국민은행', accountNumber: '123-456789-12-345', name: '임진오' }
        ],
        bride: [
            { bank: '우리은행', accountNumber: '1002-123-456789', name: '신하솜' }
        ]
    });

    useEffect(() => {
        // Real-time Listeners
        const guestsRef = ref(database, 'guests');
        const galleryRef = ref(database, 'gallery_images');
        const infoRef = ref(database, 'wedding_info');
        const designRef = ref(database, 'wedding_design');
        const accountsRef = ref(database, 'wedding_accounts');
        const connectedRef = ref(database, '.info/connected');

        onValue(connectedRef, (snap) => {
            if (snap.val() === true) {
                console.log("connected");
            } else {
                console.log("not connected");
            }
        });

        onValue(guestsRef, (snapshot) => {
            const data = snapshot.val();
            setGuests(data || []);
        });

        onValue(galleryRef, (snapshot) => {
            const data = snapshot.val();
            setImages(data || []);
        });

        onValue(infoRef, (snapshot) => {
            const data = snapshot.val();
            if (data) setInfo(prev => ({ ...prev, ...data }));
        });

        onValue(designRef, (snapshot) => {
            const data = snapshot.val();
            if (data) setDesign(prev => ({ ...prev, ...data }));
        });

        onValue(accountsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) setAccounts(prev => ({ ...prev, ...data }));
        });
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === 'ljoshs8524') {
            setIsAuthenticated(true);
        } else {
            alert('비밀번호가 올바르지 않습니다.');
        }
    };

    // --- Design Functions ---
    const handleDesignChange = (e) => {
        const { name, value } = e.target;
        setDesign(prev => ({ ...prev, [name]: value }));
    };

    const saveDesign = () => {
        set(ref(database, 'wedding_design'), design)
            .then(() => alert('디자인 설정이 저장되었습니다. (실시간 반영)'))
            .catch(err => alert('저장 실패: ' + err.message));
    };

    // --- Info Functions ---
    const handleInfoChange = (e) => {
        const { name, value } = e.target;
        setInfo(prev => ({ ...prev, [name]: value }));
    };

    const saveInfo = () => {
        set(ref(database, 'wedding_info'), info)
            .then(() => alert('기본 정보가 저장되었습니다. (실시간 반영)'))
            .catch(err => alert('저장 실패: ' + err.message));
    };

    // --- Account Functions ---
    const handleAccountChange = (side, index, field, value) => {
        const updatedSide = [...accounts[side]];
        updatedSide[index] = { ...updatedSide[index], [field]: value };
        setAccounts({ ...accounts, [side]: updatedSide });
    };

    const addAccount = (side) => {
        if (accounts[side].length >= 3) {
            alert('최대 3개까지만 등록 가능합니다.');
            return;
        }
        const updatedSide = [...accounts[side], { bank: '', accountNumber: '', name: '' }];
        setAccounts({ ...accounts, [side]: updatedSide });
    };

    const removeAccount = (side, index) => {
        const updatedSide = accounts[side].filter((_, i) => i !== index);
        setAccounts({ ...accounts, [side]: updatedSide });
    };

    const saveAccounts = () => {
        set(ref(database, 'wedding_accounts'), accounts)
            .then(() => alert('계좌 정보가 저장되었습니다. (실시간 반영)'))
            .catch(err => alert('저장 실패: ' + err.message));
    };

    // --- RSVP Functions ---
    const handleDownloadExcel = () => {
        if (guests.length === 0) {
            alert('데이터가 없습니다.');
            return;
        }
        const ws = XLSX.utils.json_to_sheet(guests);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Guests");
        XLSX.writeFile(wb, "wedding_guests.xlsx");
    };

    const clearData = () => {
        if (window.confirm('모든 RSVP 데이터(명단)를 삭제하시겠습니까? 데이터베이스에서 영구 삭제됩니다.')) {
            set(ref(database, 'guests'), [])
                .then(() => setGuests([]))
                .catch(err => alert('삭제 실패: ' + err.message));
        }
    }

    // --- Gallery Functions ---
    const handleAddImage = () => {
        if (!newImageUrl) return;
        const updated = [...images, newImageUrl];
        setImages(updated);
        set(ref(database, 'gallery_images'), updated)
            .catch(err => alert('저장 실패: ' + err.message));
        setNewImageUrl('');
    };

    const handleDeleteImage = (index) => {
        if (window.confirm('이 사진을 삭제하시겠습니까?')) {
            const updated = images.filter((_, i) => i !== index);
            setImages(updated);
            set(ref(database, 'gallery_images'), updated)
                .catch(err => alert('삭제 실패: ' + err.message));
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Limit size for Firebase Realtime Database
        if (file.size > 500 * 1024) {
            alert('500KB 이하의 이미지만 업로드 가능합니다.');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result;
            const updated = [...images, base64];
            set(ref(database, 'gallery_images'), updated)
                .then(() => setImages(updated))
                .catch(err => alert('업로드 실패 (용량 초과 가능성): ' + err.message));
        };
        reader.readAsDataURL(file);
    }


    if (!isAuthenticated) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#f5f5f5' }}>
                <div style={{ padding: '40px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                    <h2 style={{ marginBottom: '20px' }}>관리자 로그인</h2>
                    <form onSubmit={handleLogin}>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호 입력" style={{ width: '200px', marginBottom: '10px' }} autoFocus />
                        <br />
                        <button type="submit" className="btn btn-point" style={{ width: '200px' }}>로그인</button>
                    </form>
                    <a href="/" style={{ display: 'block', marginTop: '10px', color: '#888', textDecoration: 'none' }}>← 메인으로 돌아가기</a>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', paddingBottom: '100px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>관리자 모드</h2>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', padding: '5px 10px', borderRadius: '15px', backgroundColor: '#e0ffe0', color: '#006600', border: '1px solid #00cc00' }}>
                        🟢 서버 연결됨
                    </span>
                    <a href="/" className="btn">{'< 메인으로'}</a>
                </div>
            </div>

            {/* Design Section */}
            <section style={{ marginTop: '20px' }}>
                <h3>🎨 디자인 설정</h3>
                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #eee' }}>
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                        <div>
                            <label>메인 텍스트 색상</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input
                                    type="color"
                                    name="primaryColor"
                                    value={design.primaryColor.startsWith('#') ? design.primaryColor : '#000000'}
                                    onChange={handleDesignChange}
                                />
                                <input
                                    type="text"
                                    name="primaryColor"
                                    value={design.primaryColor}
                                    onChange={handleDesignChange}
                                    style={{ width: '100px', margin: 0, padding: '5px' }}
                                    placeholder="#000000 or RGB"
                                />
                            </div>
                        </div>
                        <div>
                            <label>포인트 색상 (버튼 등)</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input
                                    type="color"
                                    name="pointColor"
                                    value={design.pointColor.startsWith('#') ? design.pointColor : '#ff9090'}
                                    onChange={handleDesignChange}
                                />
                                <input
                                    type="text"
                                    name="pointColor"
                                    value={design.pointColor}
                                    onChange={handleDesignChange}
                                    style={{ width: '100px', margin: 0, padding: '5px' }}
                                    placeholder="#ff9090 or RGB"
                                />
                            </div>
                        </div>
                    </div>

                    <label style={{ marginTop: '15px', display: 'block' }}>폰트 스타일</label>
                    <select name="fontFamily" value={design.fontFamily} onChange={handleDesignChange}>
                        <option value="'Apple SD Gothic Neo', sans-serif">애플 고딕 (기본)</option>
                        <option value="'Nanum Myeongjo', serif">나눔 명조 (클래식)</option>
                        <option value="'Gowun Dodum', sans-serif">고운 돋움 (부드러운)</option>
                    </select>

                    <div style={{ marginTop: '15px' }}>
                        <button onClick={saveDesign} className="btn btn-point">디자인 저장하기</button>
                    </div>
                </div>
            </section>

            {/* Info Manage Section */}
            <section style={{ marginTop: '20px' }}>
                <h3>0. 기본 정보 수정</h3>
                {/* ... (Existing Info UI content remains but isn't repeated here to save space in prompt, only target what matches context) */}
                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #eee' }}>
                    <label>신랑 이름</label>
                    <input name="groomName" value={info.groomName} onChange={handleInfoChange} />

                    <label>신부 이름</label>
                    <input name="brideName" value={info.brideName} onChange={handleInfoChange} />

                    <label>날짜/시간 (표시용)</label>
                    <input name="date" value={info.date} onChange={handleInfoChange} placeholder="예: 2026년 2월 8일 토요일 오후 1시" />

                    <label>예식장 이름</label>
                    <input name="locationName" value={info.locationName || ''} onChange={handleInfoChange} placeholder="예: 그랜드하우스" />

                    <label>초대 문구</label>
                    <textarea name="message" value={info.message} onChange={handleInfoChange} rows={4} style={{ width: '100%', marginBottom: '15px' }} />

                    <div style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}><strong>배경 투명도 조절</strong> ({info.mainImageOpacity || 0.6})</label>
                        <input
                            type="range"
                            name="mainImageOpacity"
                            min="0.1"
                            max="1.0"
                            step="0.1"
                            value={info.mainImageOpacity || 0.6}
                            onChange={handleInfoChange}
                            style={{ width: '100%', cursor: 'pointer', accentColor: '#333' }}
                        />
                    </div>

                    <label>메인 사진 (배경)</label>
                    <div style={{ marginBottom: '10px' }}>
                        {info.mainImage && <img src={info.mainImage} alt="Main Preview" style={{ width: '100%', maxWidth: '200px', display: 'block', marginBottom: '5px', opacity: info.mainImageOpacity || 0.6 }} />}
                        <div style={{ display: 'flex', gap: '5px' }}>
                            <input
                                name="mainImage"
                                value={info.mainImage || ''}
                                onChange={handleInfoChange}
                                placeholder="이미지 주소 URL"
                                style={{ flex: 1, margin: 0 }}
                            />
                            <label className="btn" style={{ padding: '10px', margin: 0, fontSize: '14px', cursor: 'pointer', backgroundColor: '#666' }}>
                                파일 선택
                                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            setInfo(prev => ({ ...prev, mainImage: reader.result }));
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }} />
                            </label>
                        </div>
                    </div>

                    <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '2px solid #eee', position: 'relative', zIndex: 10, backgroundColor: '#fff' }}>
                        <h4 style={{ marginBottom: '15px', color: '#333' }}>메인 텍스트 스타일 설정</h4>

                        <label>글자 색상</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                            <input
                                type="color"
                                name="heroTextColor"
                                value={info.heroTextColor && info.heroTextColor.startsWith('#') ? info.heroTextColor : '#333333'}
                                onChange={handleInfoChange}
                            />
                            <input
                                type="text"
                                name="heroTextColor"
                                value={info.heroTextColor || '#333333'}
                                onChange={handleInfoChange}
                                style={{ width: '100px', margin: 0, padding: '5px' }}
                                placeholder="#333333 or RGB"
                            />
                        </div>

                        <label>메인 폰트 (선택 안 하면 기본값)</label>
                        <select name="heroFontFamily" value={info.heroFontFamily || ''} onChange={handleInfoChange} style={{ marginBottom: '10px' }}>
                            <option value="">기본 폰트 사용</option>
                            <option value="'Nanum Myeongjo', serif">나눔 명조 (클래식)</option>
                            <option value="'Gowun Dodum', sans-serif">고운 돋움 (부드러운)</option>
                            <option value="'Sunflower', sans-serif">선플라워 (귀여운)</option>
                            <option value="'Black Han Sans', sans-serif">검은고딕 (굵은)</option>
                            <option value="'Pinyon Script', cursive">영문 필기체 (Pinyon)</option>
                        </select>

                        <label>이름 크기 ({info.heroTitleFontSize || 32}px)</label>
                        <input type="range" name="heroTitleFontSize" min="20" max="60" value={info.heroTitleFontSize || 32} onChange={handleInfoChange} style={{ width: '100%' }} />

                        <label>날짜 크기 ({info.heroDateFontSize || 18}px)</label>
                        <input type="range" name="heroDateFontSize" min="12" max="30" value={info.heroDateFontSize || 18} onChange={handleInfoChange} style={{ width: '100%' }} />

                        <label>문구 크기 ({info.heroMessageFontSize || 16}px)</label>
                        <input type="range" name="heroMessageFontSize" min="12" max="24" value={info.heroMessageFontSize || 16} onChange={handleInfoChange} style={{ width: '100%' }} />
                    </div>

                    <label style={{ marginTop: '20px', display: 'block' }}>주소</label>
                    <input name="locationAddress" value={info.locationAddress || ''} onChange={handleInfoChange} placeholder="예: 서울 강남구..." />

                    <label>약도/지도 이미지</label>
                    <div style={{ marginBottom: '10px' }}>
                        {info.mapImage && <img src={info.mapImage} alt="Map Preview" style={{ width: '100%', maxWidth: '200px', display: 'block', marginBottom: '5px' }} />}
                        <div style={{ display: 'flex', gap: '5px' }}>
                            <input
                                name="mapImage"
                                value={info.mapImage || ''}
                                onChange={handleInfoChange}
                                placeholder="이미지 주소 URL"
                                style={{ flex: 1, margin: 0 }}
                            />
                            <label className="btn" style={{ padding: '10px', margin: 0, fontSize: '14px', cursor: 'pointer', backgroundColor: '#666' }}>
                                파일 선택
                                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            setInfo(prev => ({ ...prev, mapImage: reader.result }));
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }} />
                            </label>
                        </div>
                    </div>

                    <label style={{ marginTop: '15px', display: 'block' }}><strong>지도/내비게이션 링크</strong></label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <input name="linkTmap" value={info.linkTmap || ''} onChange={handleInfoChange} placeholder="T-Map 링크 URL" />
                        <input name="linkKakao" value={info.linkKakao || ''} onChange={handleInfoChange} placeholder="카카오내비 링크 URL" />
                        <input name="linkNaver" value={info.linkNaver || ''} onChange={handleInfoChange} placeholder="네이버지도 링크 URL" />
                    </div>

                    <label style={{ marginTop: '15px', display: 'block' }}><strong>교통편 안내 (지도 아래 표시)</strong></label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <textarea name="trafficSubway" value={info.trafficSubway || ''} onChange={handleInfoChange} placeholder="지하철 안내 (예: 1호선 주안역 1번 출구)" rows={2} style={{ width: '100%' }} />
                        <textarea name="trafficBus" value={info.trafficBus || ''} onChange={handleInfoChange} placeholder="버스 안내 (예: 10, 28, 62번 버스)" rows={2} style={{ width: '100%' }} />
                        <textarea name="trafficParking" value={info.trafficParking || ''} onChange={handleInfoChange} placeholder="주차 안내 (예: 지하 1층 ~ 6층 무료 주차)" rows={2} style={{ width: '100%' }} />
                    </div>



                    <label style={{ marginTop: '30px', display: 'block' }}><strong>SNS 공유 설정 (카카오톡/링크)</strong></label>
                    <div style={{ backgroundColor: '#eef', padding: '10px', borderRadius: '4px', marginBottom: '10px' }}>
                        <p style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
                            * 주의: 이곳의 설정을 변경해도, 카카오톡/네이버 서버의 <strong>캐시(기록)</strong> 때문에 바로 반영되지 않을 수 있습니다.<br />
                            * 변경 후에는 반드시 <a href="https://developers.kakao.com/tool/clear/og" target="_blank" rel="noreferrer">카카오 초기화 도구</a>를 사용해야 합니다.
                        </p>
                        <label>공유 제목</label>
                        <input name="shareTitle" value={info.shareTitle || ''} onChange={handleInfoChange} placeholder="예: 임진오&신하솜 결혼합니다" />

                        <label>공유 설명</label>
                        <input name="shareDesc" value={info.shareDesc || ''} onChange={handleInfoChange} placeholder="예: 2026년 11월 21일..." />

                        <label>공유 썸네일 이미지</label>
                        <div style={{ marginBottom: '10px' }}>
                            {info.shareImage && <img src={info.shareImage} alt="Share Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', display: 'block', marginBottom: '5px' }} />}
                            <div style={{ display: 'flex', gap: '5px' }}>
                                <input
                                    name="shareImage"
                                    value={info.shareImage || ''}
                                    onChange={handleInfoChange}
                                    placeholder="이미지 주소 URL"
                                    style={{ flex: 1, margin: 0 }}
                                />
                                <label className="btn" style={{ padding: '10px', margin: 0, fontSize: '14px', cursor: 'pointer', backgroundColor: '#666' }}>
                                    파일 선택
                                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                setInfo(prev => ({ ...prev, shareImage: reader.result }));
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }} />
                                </label>
                            </div>
                        </div>
                    </div>

                    <button onClick={saveInfo} className="btn btn-point" style={{ marginTop: '10px' }}>정보 저장하기</button>
                </div>
            </section>

            <hr style={{ margin: '40px 0', border: '0', borderTop: '1px dashed #ccc' }} />

            {/* Account Manage Section */}
            <section style={{ marginTop: '20px' }}>
                <h3>1. 계좌번호 (마음 전하실 곳)</h3>
                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #eee' }}>

                    {['groom', 'bride'].map(side => (
                        <div key={side} style={{ marginBottom: '30px' }}>
                            <h4 style={{ marginBottom: '10px', color: side === 'groom' ? '#555' : '#d77' }}>{side === 'groom' ? '신랑측' : '신부측'}</h4>
                            {accounts[side].map((acc, idx) => (
                                <div key={idx} style={{ display: 'flex', gap: '5px', marginBottom: '5px', alignItems: 'center' }}>
                                    <input
                                        placeholder="은행"
                                        value={acc.bank}
                                        onChange={(e) => handleAccountChange(side, idx, 'bank', e.target.value)}
                                        style={{ width: '80px', margin: 0 }}
                                    />
                                    <input
                                        placeholder="계좌번호"
                                        value={acc.accountNumber}
                                        onChange={(e) => handleAccountChange(side, idx, 'accountNumber', e.target.value)}
                                        style={{ flex: 1, margin: 0 }}
                                    />
                                    <select
                                        value={acc.relation || 'me'}
                                        onChange={(e) => handleAccountChange(side, idx, 'relation', e.target.value)}
                                        style={{ width: '80px', margin: 0, padding: '5px' }}
                                    >
                                        <option value="me">본인</option>
                                        <option value="father">아버지</option>
                                        <option value="mother">어머니</option>
                                        <option value="father_in_law">장인/시아버님</option>
                                        <option value="mother_in_law">장모/시어머님</option>
                                        <option value="other">기타</option>
                                    </select>
                                    <input
                                        placeholder="예금주"
                                        value={acc.name}
                                        onChange={(e) => handleAccountChange(side, idx, 'name', e.target.value)}
                                        style={{ width: '80px', margin: 0 }}
                                    />
                                    <button onClick={() => removeAccount(side, idx)} style={{ backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '5px 10px' }}>X</button>
                                </div>
                            ))}
                            {accounts[side].length < 3 && (
                                <button onClick={() => addAccount(side)} className="btn" style={{ padding: '5px 10px', fontSize: '12px', marginTop: '5px' }}>+ 계좌 추가</button>
                            )}
                        </div>
                    ))}

                    <button onClick={saveAccounts} className="btn btn-point" style={{ marginTop: '10px', width: '100%' }}>계좌 정보 저장하기</button>
                </div>
            </section>

            <hr style={{ margin: '40px 0', border: '0', borderTop: '1px dashed #ccc' }} />

            {/* Guest List Section */}
            <section style={{ marginTop: '40px' }}>
                <h3>2. RSVP (참석 여부) 관리</h3>
                <div style={{ margin: '10px 0', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '8px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span>총 {guests.reduce((acc, c) => acc + c.count, 0)}명 (접수 {guests.length}건)</span>
                    <div style={{ marginLeft: 'auto' }}>
                        <button onClick={handleDownloadExcel} className="btn btn-point">Excel 다운로드</button>
                        <button onClick={clearData} className="btn" style={{ backgroundColor: '#999', marginLeft: '10px' }}>초기화</button>
                    </div>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', fontSize: '14px' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #333', textAlign: 'left', backgroundColor: '#fafafa' }}>
                            <th style={{ padding: '8px' }}>구분</th>
                            <th style={{ padding: '8px' }}>이름</th>
                            <th style={{ padding: '8px' }}>연락처</th>
                            <th style={{ padding: '8px' }}>인원</th>
                            <th style={{ padding: '8px' }}>참석</th>
                            <th style={{ padding: '8px' }}>일시</th>
                        </tr>
                    </thead>
                    <tbody>
                        {guests.map((g) => (
                            <tr key={g.id} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: '8px' }}>{g.side === 'groom' ? '신랑' : '신부'}</td>
                                <td style={{ padding: '8px' }}>{g.name}</td>
                                <td style={{ padding: '8px' }}>{g.phone}</td>
                                <td style={{ padding: '8px' }}>{g.count}</td>
                                <td style={{ padding: '8px', fontWeight: g.meal ? 'bold' : 'normal', color: g.meal ? '#333' : '#aaa' }}>{g.meal ? '참석' : '불참'}</td>
                                <td style={{ padding: '8px' }}>{g.date.split(' ')[0]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            <hr style={{ margin: '40px 0', border: '0', borderTop: '1px dashed #ccc' }} />

            {/* Gallery Management Section */}
            <section>
                <h3>3. 갤러리 사진 관리</h3>
                <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
                    <p style={{ marginBottom: '10px', fontSize: '14px', color: '#666' }}>
                        * 사진 주소(URL)를 입력하거나 작은 이미지를 업로드하세요. <br />
                        * 서버 없이 브라우저에 저장되므로, 용량 제한으로 인해 <strong>URL 입력을 권장</strong>합니다.
                    </p>

                    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                        <input
                            type="text"
                            value={newImageUrl}
                            onChange={(e) => setNewImageUrl(e.target.value)}
                            placeholder="이미지 주소 (https://...)"
                            style={{ flex: 1, margin: 0 }}
                        />
                        <button onClick={handleAddImage} className="btn" style={{ margin: 0 }}>추가</button>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'inline-block', padding: '8px 16px', backgroundColor: '#fff', border: '1px solid #ccc', cursor: 'pointer', borderRadius: '4px' }}>
                            📁 내 컴퓨터에서 파일 선택 (작은 용량만)
                            <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
                        </label>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                        {images.map((url, idx) => (
                            <div key={idx} style={{ position: 'relative', aspectRatio: '1/1' }}>
                                <img src={url} alt="img" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
                                <button
                                    onClick={() => handleDeleteImage(idx)}
                                    style={{
                                        position: 'absolute', top: '5px', right: '5px',
                                        backgroundColor: 'red', color: 'white', border: 'none',
                                        width: '24px', height: '24px', borderRadius: '50%', cursor: 'pointer'
                                    }}
                                >X</button>
                            </div>
                        ))}
                    </div>
                    {images.length === 0 && <p style={{ textAlign: 'center', color: '#999' }}>등록된 사진이 없습니다.</p>}
                </div>
            </section>

            <hr style={{ margin: '40px 0', border: '0', borderTop: '1px dashed #ccc' }} />

            {/* Guest Snaps Management Section */}
            <GuestSnapsManager />

        </div>
    );
};

// Sub-component for Guest Snaps Management within Admin
const GuestSnapsManager = () => {
    const [snaps, setSnaps] = React.useState([]);

    React.useEffect(() => {
        const snapsRef = ref(database, 'guest_snaps');
        onValue(snapsRef, (snapshot) => {
            const data = snapshot.val();
            setSnaps(data || []);
        });
    }, []);

    const handleDelete = (id) => {
        if (window.confirm('이 사진을 정말 삭제하시겠습니까?')) {
            const updated = snaps.filter(s => s.id !== id);
            set(ref(database, 'guest_snaps'), updated)
                .catch(err => alert('삭제 실패: ' + err.message));
        }
    };

    const handleDownload = (snap) => {
        const a = document.createElement('a');
        a.href = snap.url;
        let ext = 'png';
        if (snap.url.startsWith('data:image/jpeg')) ext = 'jpg';
        else if (snap.url.startsWith('data:image/gif')) ext = 'gif';

        a.download = `guest_snap_${snap.id}.${ext}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <section>
            <h3>4. 게스트 스냅 관리</h3>
            <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '8px', border: '1px solid #eee' }}>
                <p>하객들이 올린 사진을 확인하고 삭제할 수 있습니다.</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginTop: '15px' }}>
                    {snaps.map((snap) => (
                        <div key={snap.id} style={{ position: 'relative', aspectRatio: '1/1', border: '1px solid #ddd' }}>
                            <img src={snap.url} alt="Snap" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <div style={{ position: 'absolute', top: '0', right: '0', display: 'flex' }}>
                                <button
                                    onClick={() => handleDownload(snap)}
                                    title="다운로드"
                                    style={{
                                        backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', border: 'none',
                                        width: '24px', height: '24px', cursor: 'pointer', fontSize: '14px'
                                    }}
                                >⬇</button>
                                <button
                                    onClick={() => handleDelete(snap.id)}
                                    title="삭제"
                                    style={{
                                        backgroundColor: 'red', color: 'white', border: 'none',
                                        width: '24px', height: '24px', cursor: 'pointer'
                                    }}
                                >X</button>
                            </div>
                        </div>
                    ))}
                </div>
                {snaps.length === 0 && <p style={{ textAlign: 'center', padding: '20px', color: '#999' }}>등록된 스냅 사진이 없습니다.</p>}
            </div>
        </section>
    );
}

export default Admin;

import React, { useState } from 'react';

const MoneyGift = () => {
    // Accordion state
    const [openIndex, setOpenIndex] = useState(null);

    // State for accounts
    const [accounts, setAccounts] = useState({
        groom: [{ bank: '국민은행', accountNumber: '123-456789-12-345', name: '임진오' }],
        bride: [{ bank: '우리은행', accountNumber: '1002-123-456789', name: '신하솜' }]
    });

    // Load accounts on mount
    React.useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('wedding_accounts'));
        if (saved) {
            setAccounts(saved);
        }
    }, []);

    const toggle = (side) => {
        setOpenIndex(openIndex === side ? null : side);
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            alert('계좌번호가 복사되었습니다.');
        }).catch(err => {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            alert('계좌번호가 복사되었습니다.');
        });
    };

    const renderAccountList = (list, sideLabel) => {
        if (!list || list.length === 0) return <div style={{ padding: '15px', color: '#999', fontSize: '14px' }}>등록된 계좌가 없습니다.</div>;

        const relationMap = {
            'father': '아버지',
            'mother': '어머니',
            'me': '', // Will handle specially
            'father_in_law': '장인/시아버님',
            'mother_in_law': '장모/시어머님',
            'other': '기타'
        };

        return list.map((acc, idx) => {
            let label = '';
            // Determine label
            if (acc.relation && acc.relation !== 'me' && acc.relation !== 'other') {
                label = `${sideLabel} ${relationMap[acc.relation] || acc.relation}`;
            } else if (acc.relation === 'me') {
                // If "me", usually just "Groom" or "Bride" alone, or no prefix if we want just Name.
                // User asked: "Groom side 1st menu is 'Groom' Accountholder: Name"
                // Let's just use the sideLabel ("신랑" or "신부") as the prefix/label.
                label = sideLabel;
            } else if (acc.relation === 'other') {
                label = '기타';
            }

            return (
                <div key={idx} style={{
                    padding: '15px',
                    borderBottom: idx < list.length - 1 ? '1px solid #eee' : 'none',
                    textAlign: 'left',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div>
                        <div style={{ fontSize: '14px', color: '#333', fontWeight: 'bold', marginBottom: '4px' }}>
                            {label && <span style={{ marginRight: '5px', color: '#d77' }}>{label}</span>}
                            <span style={{ color: '#555' }}>{acc.bank} {acc.accountNumber}</span>
                        </div>
                        <div style={{ fontSize: '13px', color: '#666' }}>예금주: {acc.name}</div>
                    </div>
                    <button
                        className="btn"
                        style={{ padding: '6px 12px', fontSize: '12px', minWidth: '50px', backgroundColor: '#f5f5f5', color: '#333', border: '1px solid #ddd', cursor: 'pointer' }}
                        onClick={() => handleCopy(acc.accountNumber)}
                    >
                        복사
                    </button>
                </div>
            );
        });
    };

    return (
        <div className="section" style={{ backgroundColor: '#fafafa', padding: '40px 20px', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '10px' }}>마음 전하실 곳</h3>
            <p style={{ marginBottom: '30px', fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
                참석이 어려우신 분들을 위해<br />
                계좌번호를 기재하였습니다.<br />
                너른 양해와 축하 부탁드립니다.
            </p>

            <div style={{ maxWidth: '350px', margin: '0 auto' }}>
                {/* Groom Side */}
                <div style={{ marginBottom: '10px' }}>
                    <button
                        onClick={() => toggle('groom')}
                        style={{
                            width: '100%',
                            padding: '15px',
                            backgroundColor: '#fff',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            fontSize: '16px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            cursor: 'pointer',
                            color: '#333'
                        }}
                    >
                        <span>신랑측 마음 전하는 곳</span>
                        <span>{openIndex === 'groom' ? '▲' : '▼'}</span>
                    </button>

                    {openIndex === 'groom' && (
                        <div style={{
                            backgroundColor: '#fff',
                            border: '1px solid #ddd',
                            borderTop: 'none',
                            marginTop: '-5px',
                            borderBottomLeftRadius: '8px',
                            borderBottomRightRadius: '8px',
                        }}>
                            {renderAccountList(accounts.groom, '신랑')}
                        </div>
                    )}
                </div>

                {/* Bride Side */}
                <div style={{ marginBottom: '10px' }}>
                    <button
                        onClick={() => toggle('bride')}
                        style={{
                            width: '100%',
                            padding: '15px',
                            backgroundColor: '#fff',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            fontSize: '16px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            cursor: 'pointer',
                            color: '#333'
                        }}
                    >
                        <span>신부측 마음 전하는 곳</span>
                        <span>{openIndex === 'bride' ? '▲' : '▼'}</span>
                    </button>

                    {openIndex === 'bride' && (
                        <div style={{
                            backgroundColor: '#fff',
                            border: '1px solid #ddd',
                            borderTop: 'none',
                            marginTop: '-5px',
                            borderBottomLeftRadius: '8px',
                            borderBottomRightRadius: '8px',
                        }}>
                            {renderAccountList(accounts.bride, '신부')}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MoneyGift;

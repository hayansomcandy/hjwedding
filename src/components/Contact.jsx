import React, { useState, useEffect } from 'react';
import { database } from '../firebase';
import { ref, onValue } from "firebase/database";

const Contact = () => {
    const [contacts, setContacts] = useState({
        groom: [],
        bride: []
    });

    useEffect(() => {
        const contactsRef = ref(database, 'wedding_contacts');
        onValue(contactsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) setContacts(data);
        });
    }, []);

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            alert(`번호가 복사되었습니다: ${text}`);
        }).catch(() => {
            // Fallback
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            alert(`번호가 복사되었습니다: ${text}`);
        });
    };

    const relationMap = {
        'father': '아버지',
        'mother': '어머니',
        'me': '신랑', // Default for 'me' on groom side, check logic below
        'father_in_law': '장인',
        'mother_in_law': '장모',
        'other': ''
    };

    const getLabel = (side, relation) => {
        if (relation === 'me') return side === 'groom' ? '신랑' : '신부';
        return relationMap[relation] || relation;
    };

    const renderContactList = (side, list) => {
        return (
            <div style={{ flex: 1 }}>
                <h4 style={{
                    marginBottom: '20px',
                    color: side === 'groom' ? '#0066cc' : '#ff6699',
                    fontSize: '16px'
                }}>
                    {side === 'groom' ? '신랑측' : '신부측'}
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', alignItems: 'center' }}>
                    {list.map((contact, idx) => (
                        <div key={idx} style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '15px', color: '#333', marginBottom: '8px' }}>
                                <span style={{ fontWeight: 'bold', marginRight: '5px' }}>
                                    {getLabel(side, contact.relation)}
                                </span>
                                <span>{contact.name}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                                <a href={`tel:${contact.phone}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', color: '#666' }}>
                                    <span style={{ fontSize: '20px' }}>📞</span>
                                </a>
                                <button
                                    onClick={() => handleCopy(contact.phone)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#888',
                                        cursor: 'pointer',
                                        fontSize: '13px',
                                        textDecoration: 'underline'
                                    }}
                                >
                                    복사
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    if (contacts.groom.length === 0 && contacts.bride.length === 0) return null;

    return (
        <div className="section" style={{ padding: '50px 20px', backgroundColor: '#fff', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '30px', color: '#333', fontSize: '18px' }}>혼주에게 연락하기</h3>
            <div style={{ display: 'flex', maxWidth: '600px', margin: '0 auto', justifyContent: 'space-between' }}>
                {renderContactList('groom', contacts.groom || [])}
                {renderContactList('bride', contacts.bride || [])}
            </div>
            <hr style={{ width: '50px', border: '1px solid #eee', margin: '40px auto 0' }} />
        </div>
    );
};

export default Contact;

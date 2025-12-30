import React, { useState, useEffect } from 'react';

import { database } from '../firebase';
import { ref, onValue } from "firebase/database";

const Calendar = () => {
    // Default target: 2026-11-21
    const [targetDate, setTargetDate] = useState(new Date(2026, 10, 21)); // Month is 0-indexed (10 = Nov)
    const [timeText, setTimeText] = useState("오후 4시 40분");

    useEffect(() => {
        const infoRef = ref(database, 'wedding_info');
        onValue(infoRef, (snapshot) => {
            const saved = snapshot.val();
            if (saved && saved.date) {
                // Parse "2026. 11. 21" or "2026년 11월 21일"
                // Match 4 digits, then 1-2 digits, then 1-2 digits
                const numbers = saved.date.match(/(\d{4})[.년]\s*(\d{1,2})[.월]\s*(\d{1,2})/);
                if (numbers) {
                    const year = parseInt(numbers[1]);
                    const month = parseInt(numbers[2]) - 1;
                    const day = parseInt(numbers[3]);
                    setTargetDate(new Date(year, month, day));
                }

                // Extract time part
                // Check for "오후" or "오전" + time
                if (saved.date.includes('오후') || saved.date.includes('오전')) {
                    // Simple split by space to find time part effectively might be hard, 
                    // so let's just grab everything after the date part if possible, 
                    // or just look for the "오후/오전" part
                    const timePart = saved.date.substring(saved.date.indexOf('오')); // Starts with '오' (오후/오전)
                    if (timePart) setTimeText(timePart);
                }
            }
        });
    }, []);

    const year = targetDate.getFullYear();
    const month = targetDate.getMonth(); // 0-indexed
    const date = targetDate.getDate();

    // Generate calendar grid
    const firstDay = new Date(year, month, 1).getDay(); // 0(Sun) - 6(Sat)
    const lastDate = new Date(year, month + 1, 0).getDate();

    const days = [];
    // Empty slots for previous month
    for (let i = 0; i < firstDay; i++) {
        days.push(null);
    }
    // Days of current month
    for (let i = 1; i <= lastDate; i++) {
        days.push(i);
    }

    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

    return (
        <div className="section" style={{ backgroundColor: '#fff', paddingBottom: '60px' }}>
            <h3 style={{ fontFamily: 'serif', letterSpacing: '2px', marginBottom: '30px' }}>
                {year}. {month + 1}. {date}
            </h3>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                maxWidth: '300px',
                margin: '0 auto',
                fontSize: '14px',
                rowGap: '30px'
            }}>
                {/* Header */}
                {dayNames.map((d, i) => (
                    <div key={d} style={{ color: i === 0 ? 'red' : (i === 6 ? 'blue' : '#333'), fontWeight: 'bold' }}>
                        {d}
                    </div>
                ))}

                {/* Days */}
                {days.map((d, i) => {
                    if (!d) return <div key={`empty-${i}`}></div>;

                    const isToday = d === date;
                    return (
                        <div key={d} style={{
                            position: 'relative',
                            color: (i % 7 === 0) ? 'red' : (i % 7 === 6 ? 'blue' : '#333'),
                            fontWeight: isToday ? 'bold' : 'normal',
                            zIndex: 1
                        }}>
                            {isToday && (
                                <div style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: '30px',
                                    height: '30px',
                                    backgroundColor: 'var(--point-color, #ff9090)',
                                    opacity: 0.3,
                                    borderRadius: '50%',
                                    zIndex: -1
                                }}></div>
                            )}
                            {d}
                            {isToday && (
                                <div style={{
                                    position: 'absolute',
                                    top: '28px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    fontSize: '10px',
                                    whiteSpace: 'nowrap',
                                    color: '#555',
                                    width: '100px',
                                    textAlign: 'center'
                                }}>
                                    {timeText || "오후 4시 40분"}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>


        </div>
    );
};

export default Calendar;

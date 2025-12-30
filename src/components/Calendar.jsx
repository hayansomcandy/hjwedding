import React, { useState, useEffect } from 'react';

const Calendar = () => {
    // Default target: 2026-11-21
    const [targetDate, setTargetDate] = useState(new Date(2026, 10, 21)); // Month is 0-indexed (10 = Nov)
    const [timeText, setTimeText] = useState("오후 4시 40분");

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('wedding_info'));
        if (saved && saved.date) {
            // Try to parse "2026년 11월 21일 ..." string
            // This is a simple regex for the format we are using
            const match = saved.date.match(/(\d{4})년\s(\d{1,2})월\s(\d{1,2})일/);
            if (match) {
                const year = parseInt(match[1]);
                const month = parseInt(match[2]) - 1;
                const day = parseInt(match[3]);
                setTargetDate(new Date(year, month, day));
            }

            // Extract time part if possible, or just use what comes after the date
            // Assuming format "YYYY년 M월 D일 X요일 TIME"
            const timeMatch = saved.date.split('요일');
            if (timeMatch.length > 1 && timeMatch[1].trim()) {
                setTimeText(timeMatch[1].trim());
            }
        }
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

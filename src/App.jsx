import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import Location from './components/Location';
import RSVP from './components/RSVP';
import Admin from './components/Admin';
import Gallery from './components/Gallery';
import Calendar from './components/Calendar';
import GuestSnaps from './components/GuestSnaps';
import MoneyGift from './components/MoneyGift';
import { database } from './firebase';
import { ref, onValue } from "firebase/database";

function App() {
    const [isAdmin, setIsAdmin] = useState(false);

    // Simple check: ?admin=true in URL to switch mode
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('admin') === 'true') {
            setIsAdmin(true);
        }

        // Apply Global Design (Real-time from Firebase)
        const designRef = ref(database, 'wedding_design');
        onValue(designRef, (snapshot) => {
            const design = snapshot.val();
            if (design) {
                document.documentElement.style.setProperty('--primary-color', design.primaryColor || '#333');
                document.documentElement.style.setProperty('--point-color', design.pointColor || '#ff9090');
                if (design.fontFamily) {
                    document.body.style.fontFamily = design.fontFamily;
                }
            }
        });
    }, []);

    return (
        <>
            {isAdmin ? (
                <Admin />
            ) : (
                <div className="app-container">
                    <Hero />
                    <Gallery />
                    <Calendar />
                    <Location />
                    <MoneyGift />
                    <RSVP />
                    <GuestSnaps />

                    <footer style={{ padding: '20px', textAlign: 'center', fontSize: '12px', color: '#999' }}>
                        <p>Copyright 2026 JinO HaSom Wedding Invite</p>
                        {/* Secret Admin Link */}
                        <a href="?admin=true" style={{ textDecoration: 'none', color: '#eee' }}>Admin</a>
                    </footer>
                </div>
            )}
        </>
    );
}

export default App;

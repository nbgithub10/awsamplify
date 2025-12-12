import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {GoogleOAuthProvider} from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <GoogleOAuthProvider clientId="1069041377668-ae51f99bcvan3vu8pee1nnlhde0fs5p2.apps.googleusercontent.com">
        <React.StrictMode>
            {/* Small top-level link to Home page - clicking will navigate within SPA without full reload */}
            <div style={{padding: 8, textAlign: 'center'}}>
                <a
                    href="/home"
                    onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/home'); window.dispatchEvent(new PopStateEvent('popstate')); }}
                    style={{textDecoration: 'none', color: '#0074e4', fontWeight: 600}}
                >
                    Animal2Rescue
                </a>
            </div>
            <App/>
        </React.StrictMode>
    </GoogleOAuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

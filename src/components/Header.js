import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import './Header.css';

export default function Header() {
    const navigate = useNavigate();
    const state = useStore();
    const { isAuthenticated, profile } = state.auth;

    return (
        <header className="common-header">
            <div className="header-inner">
                <div className="header-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                    <i className="fas fa-paw" />
                    <span>Animals2Rescue</span>
                </div>
                <div className="header-actions">
                    {isAuthenticated && profile ? (
                        <>
                            <span className="header-link" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {profile.picture && (
                                    <img
                                        src={profile.picture}
                                        alt={profile.name}
                                        style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                )}
                                <span>Welcome, {profile.name}!</span>
                            </span>
                            <a href="/login" className="header-cta">My Profile</a>
                        </>
                    ) : (
                        <>
                            <a href="/login" className="header-link">Sign In</a>
                            <a href="/register" className="header-cta">Join</a>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}


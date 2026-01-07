import React from 'react';
import { useNavigate } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';
import { useStore, useDispatch } from '../store/useStore';
import { logoutUser } from '../store/actions';
import './Header.css';

export default function Header() {
    const navigate = useNavigate();
    const state = useStore();
    const dispatch = useDispatch();
    const { isAuthenticated, profile } = state.auth;

    const handleLogout = () => {
        googleLogout();
        dispatch(logoutUser());
        navigate('/');
    };

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
                            <span className="header-link">
                                Welcome, {profile.name}!
                            </span>
                            <a href="/register" className="header-cta">My Profile</a>
                            <span
                                onClick={handleLogout}
                                className="header-link"
                                style={{ cursor: 'pointer' }}
                            >
                                Logout
                            </span>
                        </>
                    ) : (
                        <>
                            <a href="/login" className="header-cta">
                                <i className="fas fa-user" style={{ marginRight: '6px' }} />
                                Sign In / Join
                            </a>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}


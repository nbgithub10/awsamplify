import React, { useEffect } from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import { useStore, useDispatch } from '../store/useStore';
import { loginUser, logoutUser } from '../store/actions';

function UserProfile() {
    const navigate = useNavigate();
    const state = useStore();
    const dispatch = useDispatch();

    const { user, profile } = state.auth;

    // If already logged in, redirect to registration page
    useEffect(() => {
        if (profile && profile.name) {
            navigate('/register');
        }
    }, [profile, navigate]);

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => {
            // Fetch user profile and update store
            axios
                .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${codeResponse.access_token}`, {
                    headers: {
                        Authorization: `Bearer ${codeResponse.access_token}`,
                        Accept: 'application/json'
                    }
                })
                .then((res) => {
                    console.log(res);
                    dispatch(loginUser(codeResponse, res.data));
                    // Redirect to registration page after successful login
                    navigate('/register');
                })
                .catch((err) => console.log(err));
        },
        onError: (error) => console.log('Login Failed:', error)
    });

    // log out function to log the user out of google and set the profile to null
    const logOut = () => {
        googleLogout();
        dispatch(logoutUser());
    };

    return (
        <>
            <Header />
            <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            <h2>React Google Login</h2>
            <br />
            <br />
            {profile && profile.name ? (
                <div>
                    <img src={profile.picture} alt="user image" style={{ borderRadius: '50%', width: '100px', height: '100px' }} />
                    <h3>User Logged in</h3>
                    <p>Name: {profile.name}</p>
                    <p>Email Address: {profile.email}</p>
                    <br />
                    <br />
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button onClick={() => navigate('/')} style={{ padding: '10px 20px', cursor: 'pointer' }}>
                            Go to Home
                        </button>
                        <button onClick={logOut} style={{ padding: '10px 20px', cursor: 'pointer' }}>
                            Log out
                        </button>
                    </div>
                </div>
            ) : (
                <div>
                    <button onClick={login} style={{ padding: '12px 24px', fontSize: '16px', cursor: 'pointer' }}>
                        Sign in with Google 🚀
                    </button>
                    <br />
                    <br />
                    <button onClick={() => navigate('/')} style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#f0f0f0' }}>
                        Back to Home
                    </button>
                </div>
            )}
        </div>
        </>
    );
}

export default UserProfile;

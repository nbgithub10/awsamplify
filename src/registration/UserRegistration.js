import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import Header from '../components/Header';
import { useStore, useDispatch } from '../store/useStore';
import { loginUser } from '../store/actions';
import './UserRegistration.css';

function UserRegistration() {
  const formRef = useRef(null);
  const [successVisible, setSuccessVisible] = useState(false);
  const navigate = useNavigate();
  const state = useStore();
  const dispatch = useDispatch();
  const { profile, isAuthenticated } = state.auth;

  // Google login handler
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
        })
        .catch((err) => console.log(err));
    },
    onError: (error) => console.log('Login Failed:', error)
  });

  useEffect(() => {
    // Form listeners are no longer needed since volunteer availability section is removed
    return () => {};
  }, [isAuthenticated]);

  // Pre-populate form fields from Google profile
  useEffect(() => {
    if (profile && formRef.current) {
      const fullNameInput = formRef.current.querySelector('#fullName');
      const emailInput = formRef.current.querySelector('#email');

      if (fullNameInput && profile.name) {
        fullNameInput.value = profile.name;
      }
      if (emailInput && profile.email) {
        emailInput.value = profile.email;
      }
    }
  }, [profile]);

  // validators (kept similar to original)
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  function isValidPhone(phone) {
    return /^[+]?[(]?[0-9]{2,4}[)]?[-\s.]?[0-9]{3,4}[-\s.]?[0-9]{3,6}$/.test(phone.replace(/\s/g, ''));
  }
  function isValidURL(url) {
    if (!url) return true;
    try { new URL(url); return true; } catch(e){ return false; }
  }

  function showError(fieldId, errorId) {
    const field = formRef.current.querySelector(`#${fieldId}`);
    const err = formRef.current.querySelector(`#${errorId}`);
    if (field) field.parentElement.classList.add('error');
    if (err) err.classList.add('show');
  }
  function clearError(fieldId, errorId) {
    const field = formRef.current.querySelector(`#${fieldId}`);
    const err = formRef.current.querySelector(`#${errorId}`);
    if (field) field.parentElement.classList.remove('error');
    if (err) err.classList.remove('show');
  }

  function validateForm() {
    let valid = true;
    const form = formRef.current;

    // All fields are now optional - only validate format if field has value
    const email = form.querySelector('#email').value.trim();
    if (email && !isValidEmail(email)) {
      showError('email','emailError');
      valid=false;
    } else {
      clearError('email','emailError');
    }

    const phone = form.querySelector('#phone').value.trim();
    if (phone && !isValidPhone(phone)) {
      showError('phone','phoneError');
      valid=false;
    } else {
      clearError('phone','phoneError');
    }

    // Clear all other field errors since they're optional
    clearError('fullName','fullNameError');
    clearError('country','countryError');
    clearError('street','streetError');
    clearError('city','cityError');
    clearError('state','stateError');
    clearError('postalCode','postalCodeError');
    clearError('userType','userTypeError');
    clearError('experience','experienceError');
    clearError('volunteerSection','availabilityError');

    const socialIds = ['facebook','instagram','x','tiktok','youtube','website'];
    socialIds.forEach(id => {
      const v = form.querySelector(`#${id}`).value.trim();
      if (v && !isValidURL(v)) {
        showError(id, id+'Error');
        valid=false;
      } else {
        clearError(id, id+'Error');
      }
    });

    // Terms agreement is still required
    const terms = form.querySelector('#terms').checked;
    if (!terms) {
      showError('terms','termsError');
      valid=false;
    } else {
      clearError('terms','termsError');
    }

    return valid;
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return;

    const form = formRef.current;
    const formData = new FormData(form);

    // Capture all fields and create profile JSON
    const profileData = {
      fullName: formData.get('fullName'),
      phone: formData.get('phone'),
      country: formData.get('country'),
      address: {
        street: formData.get('street'),
        city: formData.get('city'),
        state: formData.get('state'),
        postalCode: formData.get('postalCode')
      },
      userType: formData.getAll('userType'),
      experience: formData.get('experience'),
      socialProfiles: {
        facebook: formData.get('facebook'),
        instagram: formData.get('instagram'),
        x: formData.get('x'),
        tiktok: formData.get('tiktok'),
        youtube: formData.get('youtube'),
        website: formData.get('website')
      },
      agreedToTerms: formData.get('terms') === 'on',
      subscribedToUpdates: formData.get('privacy') === 'on'
    };

    // Convert profile data to JSON string
    const profileJsonString = JSON.stringify(profileData);

    // Create final payload structure
    const payload = {
      email: formData.get('email'),
      profile: profileJsonString
    };

    console.log('Payload to be sent:', payload);

    try {
      // Make POST request to save user profile
      const response = await axios.put(
        'https://agus4uqwza.execute-api.ap-southeast-2.amazonaws.com/user',
        payload,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Check if response status is 200
      if (response.status === 200) {
        console.log('Profile saved successfully:', response.data);
        setSuccessVisible(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Keep the form data so user can see their saved information
        setTimeout(() => setSuccessVisible(false), 5000);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      // Show error message to user
      alert('Failed to save profile. Please try again. Error: ' + (error.response?.data?.message || error.message));
    }
  }

  return (
    <>
      <Header />
      <div className="container">
        <div className="header">
          <h1>🐾 Animals2Rescue</h1>
          <p>{isAuthenticated ? 'Complete Your Profile' : 'Login or Register'}</p>
        </div>

        {!isAuthenticated ? (
          // Show only Google login button when not logged in
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{
              maxWidth: '400px',
              margin: '0 auto',
              background: '#fff',
              padding: '40px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ marginBottom: '20px', color: '#222' }}>Welcome!</h2>
              <p style={{ marginBottom: '30px', color: '#666' }}>
                Sign in with your Google account to continue
              </p>
              <button
                onClick={login}
                style={{
                  padding: '12px 24px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  background: '#0073e6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  margin: '0 auto'
                }}
              >
                <i className="fab fa-google" style={{ fontSize: '18px' }}></i>
                Login/Register with Google Account
              </button>
            </div>
          </div>
        ) : (
          // Show full registration form when logged in
          <>
            <div id="successMessage" className={`success-message ${successVisible ? 'show' : ''}`}>✓ Profile has been saved successfully!</div>

            <form id="registrationForm" ref={formRef} onSubmit={onSubmit}>
        {/* Personal Information */}
        <div className="form-section">
          <div className="section-title">Personal Information</div>

          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input id="fullName" name="fullName" type="text" placeholder="Enter your full name" />
            <div id="fullNameError" className="error-message">Full name is required</div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input id="email" name="email" type="email" placeholder="Enter your email address" />
            <div id="emailError" className="error-message">Please enter a valid email address</div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input id="phone" name="phone" type="tel" placeholder="e.g., +1 (555) 123-4567" />
              <div id="phoneError" className="error-message">Please enter a valid phone number</div>
            </div>

            <div className="form-group">
              <label htmlFor="country">Country</label>
              <select id="country" name="country">
                <option value="">Select Country</option>
                <option>United States</option>
                <option>Canada</option>
                <option>United Kingdom</option>
                <option>Australia</option>
                <option>Germany</option>
                <option>France</option>
                <option>India</option>
                <option>Other</option>
              </select>
              <div id="countryError" className="error-message">Please select a country</div>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="form-section">
          <div className="section-title">Address Information</div>

          <div className="form-group">
            <label htmlFor="street">Street Address</label>
            <input id="street" name="street" type="text" placeholder="Enter your street address" />
            <div id="streetError" className="error-message">Street address is required</div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input id="city" name="city" type="text" placeholder="Enter your city" />
              <div id="cityError" className="error-message">City is required</div>
            </div>

            <div className="form-group">
              <label htmlFor="state">State/Province</label>
              <input id="state" name="state" type="text" placeholder="Enter your state or province" />
              <div id="stateError" className="error-message">State/Province is required</div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="postalCode">Postal Code</label>
              <input id="postalCode" name="postalCode" type="text" placeholder="Enter your postal code" />
              <div id="postalCodeError" className="error-message">Postal code is required</div>
            </div>
          </div>
        </div>

        {/* Profile */}
        <div className="form-section">
          <div className="section-title">Profile Information</div>


          <div className="form-group">
            <label>User Type (Select all that apply)</label>
            <div className="info-box">Select the categories that best describe your role with Animals2Rescue</div>
            <div className="radio-group">
              <div className="radio-item"><input id="rescuer" name="userType" type="checkbox" value="Rescuer" /><label htmlFor="rescuer">Rescuer - Help rescue and save animals</label></div>
              <div className="radio-item"><input id="volunteer" name="userType" type="checkbox" value="Volunteer" /><label htmlFor="volunteer">Volunteer - Willing to help and support</label></div>
              <div className="radio-item"><input id="boarding" name="userType" type="checkbox" value="Offer Boarding" /><label htmlFor="boarding">Offer Boarding - Provide temporary shelter for animals</label></div>
              <div className="radio-item"><input id="feeder" name="userType" type="checkbox" value="Feeder" /><label htmlFor="feeder">Feeder - Provide food and nutrition for animals</label></div>
              <div className="radio-item"><input id="shelter" name="userType" type="checkbox" value="Own a Shelter" /><label htmlFor="shelter">Own a Shelter - Manage a rescue shelter</label></div>
              <div className="radio-item"><input id="other" name="userType" type="checkbox" value="Other" /><label htmlFor="other">Other</label></div>
            </div>
            <div id="userTypeError" className="error-message">Please select a user type</div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="form-section">
          <div className="section-title">Additional Information</div>

          <div className="form-group">
            <label htmlFor="experience">Experience with Animals</label>
            <textarea id="experience" name="experience" placeholder="Tell us about your experience with animals, pet history, or why you want to join Animals2Rescue..."></textarea>
            <div id="experienceError" className="error-message">Please share your experience with animals (minimum 10 characters)</div>
          </div>
        </div>

        {/* Social Profile */}
        <div className="form-section">
          <div className="section-title">Social Profile</div>
          <div className="info-box">Share your social media profiles (optional) - helps us connect with you better</div>

          <div className="form-group">
            <label htmlFor="facebook">Facebook Profile</label>
            <input id="facebook" name="facebook" type="url" placeholder="https://www.facebook.com/yourprofile" />
            <div id="facebookError" className="error-message">Please enter a valid Facebook URL</div>
          </div>

          <div className="form-group">
            <label htmlFor="instagram">Instagram Profile</label>
            <input id="instagram" name="instagram" type="url" placeholder="https://www.instagram.com/yourprofile" />
            <div id="instagramError" className="error-message">Please enter a valid Instagram URL</div>
          </div>

          <div className="form-group">
            <label htmlFor="x">X Profile</label>
            <input id="x" name="x" type="url" placeholder="https://x.com/yourprofile" />
            <div id="xError" className="error-message">Please enter a valid X URL</div>
          </div>

          <div className="form-group">
            <label htmlFor="tiktok">TikTok Profile</label>
            <input id="tiktok" name="tiktok" type="url" placeholder="https://www.tiktok.com/@yourprofile" />
            <div id="tiktokError" className="error-message">Please enter a valid TikTok URL</div>
          </div>

          <div className="form-group">
            <label htmlFor="youtube">YouTube Channel</label>
            <input id="youtube" name="youtube" type="url" placeholder="https://www.youtube.com/c/yourchannel" />
            <div id="youtubeError" className="error-message">Please enter a valid YouTube URL</div>
          </div>

          <div className="form-group">
            <label htmlFor="website">Personal Website/Blog</label>
            <input id="website" name="website" type="url" placeholder="https://www.yourwebsite.com" />
            <div id="websiteError" className="error-message">Please enter a valid website URL</div>
          </div>
        </div>

        {/* Terms */}
        <div className="form-section">
          <div className="form-group">
            <div className="checkbox-item">
              <input id="terms" name="terms" type="checkbox" />
              <label htmlFor="terms" className="required">I agree to the <Link to="/terms">Terms and Conditions</Link></label>
            </div>
            <div id="termsError" className="error-message">You must agree to the Terms and Conditions</div>
          </div>

          <div className="form-group">
            <div className="checkbox-item"><input id="privacy" name="privacy" type="checkbox" /><label htmlFor="privacy">I agree to receive updates and communications from Animals2Rescue</label></div>
          </div>
        </div>

        <div className="button-group">
          <button type="submit" className="submit-btn">Register Now</button>
          <button type="reset" className="reset-btn">Clear Form</button>
          <button type="button" className="submit-btn" onClick={() => navigate('/')}>Back</button>
        </div>
      </form>
          </>
        )}
    </div>
    </>
  );
}

export default UserRegistration;

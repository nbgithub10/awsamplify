import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './UserRegistration.css';

function UserRegistration() {
  const formRef = useRef(null);
  const profilePictureRef = useRef(null);
  const [fileName, setFileName] = useState('');
  const [passwordMatch, setPasswordMatch] = useState('');
  const [showPasswordMatch, setShowPasswordMatch] = useState(false);
  const [showVolunteer, setShowVolunteer] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);

  useEffect(() => {
    const form = formRef.current;
    const profileInput = profilePictureRef.current;
    const passwordInput = form.querySelector('#password');
    const confirmPasswordInput = form.querySelector('#confirmPassword');

    function onUserTypeChange(e) {
      setShowVolunteer(e.target.value === 'Volunteer');
    }

    function onProfileChange() {
      const file = profileInput.files && profileInput.files[0];
      setFileName(file ? `Selected: ${file.name}` : '');
    }

    function onConfirmInput() {
      if (passwordInput.value && confirmPasswordInput.value) {
        setShowPasswordMatch(true);
        if (passwordInput.value === confirmPasswordInput.value) {
          setPasswordMatch('match');
        } else {
          setPasswordMatch('no-match');
        }
      } else {
        setShowPasswordMatch(false);
        setPasswordMatch('');
      }
    }

    // attach change listeners for radio group
    const userTypeRadios = form.querySelectorAll('input[name="userType"]');
    userTypeRadios.forEach(r => r.addEventListener('change', onUserTypeChange));
    profileInput.addEventListener('change', onProfileChange);
    confirmPasswordInput.addEventListener('input', onConfirmInput);

    // cleanup
    return () => {
      userTypeRadios.forEach(r => r.removeEventListener('change', onUserTypeChange));
      profileInput.removeEventListener('change', onProfileChange);
      confirmPasswordInput.removeEventListener('input', onConfirmInput);
    };
  }, []);

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
  function isValidFile(file) {
    if (!file) return { valid: true };
    const validTypes = ['image/jpeg','image/png'];
    const maxSize = 5*1024*1024;
    if (!validTypes.includes(file.type)) return { valid:false, error:'Please upload a valid JPG or PNG file' };
    if (file.size > maxSize) return { valid:false, error:'File size must be less than 5MB' };
    return { valid:true };
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
    const fullName = form.querySelector('#fullName').value.trim();
    if (!fullName) { showError('fullName','fullNameError'); valid=false; } else clearError('fullName','fullNameError');

    const email = form.querySelector('#email').value.trim();
    if (!email || !isValidEmail(email)) { showError('email','emailError'); valid=false; } else clearError('email','emailError');

    const phone = form.querySelector('#phone').value.trim();
    if (!phone || !isValidPhone(phone)) { showError('phone','phoneError'); valid=false; } else clearError('phone','phoneError');

    const country = form.querySelector('#country').value;
    if (!country) { showError('country','countryError'); valid=false; } else clearError('country','countryError');

    const street = form.querySelector('#street').value.trim();
    if (!street) { showError('street','streetError'); valid=false; } else clearError('street','streetError');

    const city = form.querySelector('#city').value.trim();
    if (!city) { showError('city','cityError'); valid=false; } else clearError('city','cityError');

    const state = form.querySelector('#state').value.trim();
    if (!state) { showError('state','stateError'); valid=false; } else clearError('state','stateError');

    const postal = form.querySelector('#postalCode').value.trim();
    if (!postal) { showError('postalCode','postalCodeError'); valid=false; } else clearError('postalCode','postalCodeError');

    const password = form.querySelector('#password').value;
    if (!password || password.length < 8) { showError('password','passwordError'); valid=false; } else clearError('password','passwordError');

    const confirmPassword = form.querySelector('#confirmPassword').value;
    if (password !== confirmPassword) { showError('confirmPassword','confirmPasswordError'); valid=false; } else clearError('confirmPassword','confirmPasswordError');

    const profileFile = profilePictureRef.current.files[0];
    const fv = isValidFile(profileFile);
    if (!fv.valid) { const el = form.querySelector('#profilePictureError'); if (el) el.textContent = fv.error; showError('profilePicture','profilePictureError'); valid=false; } else clearError('profilePicture','profilePictureError');

    const userType = form.querySelector('input[name="userType"]:checked');
    if (!userType) { showError('userType','userTypeError'); valid=false; } else clearError('userType','userTypeError');

    const experience = form.querySelector('#experience').value.trim();
    if (!experience || experience.length < 10) { showError('experience','experienceError'); valid=false; } else clearError('experience','experienceError');

    if (form.querySelector('input[value="Volunteer"]:checked')) {
      const any = form.querySelectorAll('input[name="availability"]:checked').length>0;
      if (!any) { showError('volunteerSection','availabilityError'); valid=false; } else clearError('volunteerSection','availabilityError');
    }

    const socialIds = ['facebook','instagram','x','tiktok','youtube','website'];
    socialIds.forEach(id => {
      const v = form.querySelector(`#${id}`).value.trim();
      if (v && !isValidURL(v)) { showError(id, id+'Error'); valid=false; } else clearError(id, id+'Error');
    });

    const terms = form.querySelector('#terms').checked;
    if (!terms) { showError('terms','termsError'); valid=false; } else clearError('terms','termsError');

    return valid;
  }

  function onSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return;

    const form = formRef.current;
    const formData = new FormData(form);
    const data = {
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      country: formData.get('country'),
      street: formData.get('street'),
      city: formData.get('city'),
      state: formData.get('state'),
      postalCode: formData.get('postalCode'),
      password: formData.get('password'),
      userType: formData.get('userType'),
      experience: formData.get('experience'),
      availability: formData.getAll('availability'),
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

    // in real app send to server; here just show success
    console.log('Registration Data:', data);
    setSuccessVisible(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    form.reset();
    setFileName('');
    setShowVolunteer(false);
    setShowPasswordMatch(false);
    setPasswordMatch('');
    setTimeout(() => setSuccessVisible(false), 5000);
  }

  return (
    <div className="container">
      <div className="header">
        <h1>🐾 Animals2Rescue</h1>
        <p>Create Your Account</p>
      </div>

      <div id="successMessage" className={`success-message ${successVisible ? 'show' : ''}`}>✓ Registration successful! Welcome to Animals2Rescue!</div>

      <form id="registrationForm" ref={formRef} onSubmit={onSubmit}>
        {/* Personal Information */}
        <div className="form-section">
          <div className="section-title">Personal Information</div>

          <div className="form-group">
            <label htmlFor="fullName" className="required">Full Name</label>
            <input id="fullName" name="fullName" type="text" placeholder="Enter your full name" />
            <div id="fullNameError" className="error-message">Full name is required</div>
          </div>

          <div className="form-group">
            <label htmlFor="email" className="required">Email Address</label>
            <input id="email" name="email" type="email" placeholder="Enter your email address" />
            <div id="emailError" className="error-message">Please enter a valid email address</div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone" className="required">Phone Number</label>
              <input id="phone" name="phone" type="tel" placeholder="e.g., +1 (555) 123-4567" />
              <div id="phoneError" className="error-message">Please enter a valid phone number</div>
            </div>

            <div className="form-group">
              <label htmlFor="country" className="required">Country</label>
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
            <label htmlFor="street" className="required">Street Address</label>
            <input id="street" name="street" type="text" placeholder="Enter your street address" />
            <div id="streetError" className="error-message">Street address is required</div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city" className="required">City</label>
              <input id="city" name="city" type="text" placeholder="Enter your city" />
              <div id="cityError" className="error-message">City is required</div>
            </div>

            <div className="form-group">
              <label htmlFor="state" className="required">State/Province</label>
              <input id="state" name="state" type="text" placeholder="Enter your state or province" />
              <div id="stateError" className="error-message">State/Province is required</div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="postalCode" className="required">Postal Code</label>
              <input id="postalCode" name="postalCode" type="text" placeholder="Enter your postal code" />
              <div id="postalCodeError" className="error-message">Postal code is required</div>
            </div>
          </div>
        </div>

        {/* Account Security */}
        <div className="form-section">
          <div className="section-title">Account Security</div>

          <div className="form-group">
            <label htmlFor="password" className="required">Password</label>
            <input id="password" name="password" type="password" placeholder="Enter a strong password (min. 8 characters)" />
            <div id="passwordError" className="error-message">Password must be at least 8 characters long</div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="required">Confirm Password</label>
            <input id="confirmPassword" name="confirmPassword" type="password" placeholder="Re-enter your password" />
            <div id="passwordMatch" className={`password-match-indicator ${showPasswordMatch ? 'show' : ''} ${passwordMatch === 'match' ? 'match' : ''} ${passwordMatch === 'no-match' ? 'no-match' : ''}`}></div>
            <div id="confirmPasswordError" className="error-message">Passwords do not match</div>
          </div>
        </div>

        {/* Profile */}
        <div className="form-section">
          <div className="section-title">Profile Information</div>

          <div className="form-group">
            <label htmlFor="profilePicture">Profile Picture</label>
            <label className="file-input-label" htmlFor="profilePicture">Choose File</label>
            <input ref={profilePictureRef} id="profilePicture" name="profilePicture" type="file" accept=".jpg,.jpeg,.png" />
            <div id="fileName" className="file-name">{fileName}</div>
            <div id="profilePictureError" className="error-message">Please upload a valid JPG or PNG file (max 5MB)</div>
          </div>

          <div className="form-group">
            <label className="required">User Type</label>
            <div className="info-box">Select the category that best describes your role with Animals2Rescue</div>
            <div className="radio-group">
              <div className="radio-item"><input id="rescuer" name="userType" type="radio" value="Rescuer" /><label htmlFor="rescuer">🚨 Rescuer - Help rescue and save animals</label></div>
              <div className="radio-item"><input id="volunteer" name="userType" type="radio" value="Volunteer" /><label htmlFor="volunteer">🤝 Volunteer - Willing to help and support</label></div>
              <div className="radio-item"><input id="boarding" name="userType" type="radio" value="Offer Boarding" /><label htmlFor="boarding">🏡 Offer Boarding - Provide temporary shelter for animals</label></div>
              <div className="radio-item"><input id="feeder" name="userType" type="radio" value="Feeder" /><label htmlFor="feeder">🍖 Feeder - Provide food and nutrition for animals</label></div>
              <div className="radio-item"><input id="shelter" name="userType" type="radio" value="Own a Shelter" /><label htmlFor="shelter">🏢 Own a Shelter - Manage a rescue shelter</label></div>
              <div className="radio-item"><input id="other" name="userType" type="radio" value="Other" /><label htmlFor="other">❓ Other</label></div>
            </div>
            <div id="userTypeError" className="error-message">Please select a user type</div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="form-section">
          <div className="section-title">Additional Information</div>

          <div className="form-group">
            <label htmlFor="experience" className="required">Experience with Animals</label>
            <textarea id="experience" name="experience" placeholder="Tell us about your experience with animals, pet history, or why you want to join Animals2Rescue..."></textarea>
            <div id="experienceError" className="error-message">Please share your experience with animals (minimum 10 characters)</div>
          </div>

          <div id="volunteerSection" className="form-group" style={{ display: showVolunteer ? 'block' : 'none' }}>
            <label className="required">Availability (for Volunteers)</label>
            <div className="info-box">Select the days and times you are available to volunteer</div>
            <div className="availability-grid">
              <div className="availability-item"><input id="monMorning" name="availability" type="checkbox" value="Monday Morning" /><label htmlFor="monMorning">Monday (AM)</label></div>
              <div className="availability-item"><input id="monEvening" name="availability" type="checkbox" value="Monday Evening" /><label htmlFor="monEvening">Monday (PM)</label></div>
              <div className="availability-item"><input id="tuesMorning" name="availability" type="checkbox" value="Tuesday Morning" /><label htmlFor="tuesMorning">Tuesday (AM)</label></div>
              <div className="availability-item"><input id="tuesEvening" name="availability" type="checkbox" value="Tuesday Evening" /><label htmlFor="tuesEvening">Tuesday (PM)</label></div>
              <div className="availability-item"><input id="wedMorning" name="availability" type="checkbox" value="Wednesday Morning" /><label htmlFor="wedMorning">Wednesday (AM)</label></div>
              <div className="availability-item"><input id="wedEvening" name="availability" type="checkbox" value="Wednesday Evening" /><label htmlFor="wedEvening">Wednesday (PM)</label></div>
              <div className="availability-item"><input id="thuMorning" name="availability" type="checkbox" value="Thursday Morning" /><label htmlFor="thuMorning">Thursday (AM)</label></div>
              <div className="availability-item"><input id="thuEvening" name="availability" type="checkbox" value="Thursday Evening" /><label htmlFor="thuEvening">Thursday (PM)</label></div>
              <div className="availability-item"><input id="friMorning" name="availability" type="checkbox" value="Friday Morning" /><label htmlFor="friMorning">Friday (AM)</label></div>
              <div className="availability-item"><input id="friEvening" name="availability" type="checkbox" value="Friday Evening" /><label htmlFor="friEvening">Friday (PM)</label></div>
              <div className="availability-item"><input id="satMorning" name="availability" type="checkbox" value="Saturday Morning" /><label htmlFor="satMorning">Saturday (AM)</label></div>
              <div className="availability-item"><input id="satEvening" name="availability" type="checkbox" value="Saturday Evening" /><label htmlFor="satEvening">Saturday (PM)</label></div>
              <div className="availability-item"><input id="sunMorning" name="availability" type="checkbox" value="Sunday Morning" /><label htmlFor="sunMorning">Sunday (AM)</label></div>
              <div className="availability-item"><input id="sunEvening" name="availability" type="checkbox" value="Sunday Evening" /><label htmlFor="sunEvening">Sunday (PM)</label></div>
            </div>
            <div id="availabilityError" className="error-message">Please select at least one availability slot</div>
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
        </div>
      </form>
    </div>
  );
}

export default UserRegistration;

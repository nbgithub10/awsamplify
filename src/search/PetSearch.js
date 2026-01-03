import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './petsearch.css';
import { filterReports, validatePostcode, validateImageFile, compressImage } from './searchUtils';

// Small sample lists for countries and states for dropdowns.
const COUNTRY_OPTIONS = ['India', 'Australia', 'United States'];
const STATE_OPTIONS = {
  India: ['Maharashtra', 'Karnataka', 'Delhi'],
  Australia: ['New South Wales', 'Victoria', 'Queensland'],
  'United States': ['California', 'New York', 'Texas']
};

const LS_KEY = 'pet_reports_v1';

export default function PetSearch() {
  // mode: 'search' | 'report'
  const [mode, setMode] = useState('search');
  const [country, setCountry] = useState('India');
  const [stateField, setStateField] = useState('Maharashtra');
  const [postcode, setPostcode] = useState('');

  const [includeLost, setIncludeLost] = useState(true);
  const [includeFound, setIncludeFound] = useState(true);

  const [results, setResults] = useState([]);
  const [message, setMessage] = useState('');

  // report form state
  const [reportType, setReportType] = useState('lost');
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [color, setColor] = useState('');
  const [lastSeen, setLastSeen] = useState('');
  const [contact, setContact] = useState('');
  const [details, setDetails] = useState('');
  // support multiple images
  const [imageFiles, setImageFiles] = useState([]); // array of File
  const [imagePreviews, setImagePreviews] = useState([]); // array of dataURLs

  // load persisted reports from localStorage (or seed sample data)
  const [reports, setReports] = useState(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      // ignore
    }
    return [
      { id: 'P-001', name: 'Bella', type: 'Dog', status: 'lost', country: 'India', state: 'Maharashtra', postcode: '400001', lastSeen: 'Park Street, Mumbai', contact: '+91 98765 43210' },
      { id: 'P-002', name: 'Milo', type: 'Cat', status: 'found', country: 'India', state: 'Karnataka', postcode: '560001', lastSeen: 'Lakeside', contact: '+91 98700 11122' }
    ];
  });

  useEffect(() => {
    // persist reports when they change
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(reports));
    } catch (e) {
      // ignore
    }
  }, [reports]);

  useEffect(() => {
    // when country changes, default stateField
    if (country && STATE_OPTIONS[country]) {
      setStateField(STATE_OPTIONS[country][0]);
    } else {
      setStateField('');
    }
  }, [country]);

  async function handleImageChange(e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const maxFiles = 3;
    const newFiles = [];
    const newPreviews = [];

    for (let i = 0; i < files.length && newFiles.length < maxFiles; i++) {
      const f = files[i];
      const v = validateImageFile(f);
      if (!v.ok) {
        setMessage(`Image ${f.name} rejected: ${v.reason}`);
        continue;
      }
      try {
        const compressed = await compressImage(f, 1200, 0.8);
        newFiles.push(f);
        newPreviews.push(compressed);
      } catch (err) {
        // fallback to dataURL without compression
        const reader = new FileReader();
        reader.onload = () => {
          newFiles.push(f);
          newPreviews.push(reader.result);
          setImageFiles(prev => {
            const merged = [...prev, ...newFiles].slice(0, maxFiles);
            return merged;
          });
          setImagePreviews(prev => {
            const merged = [...prev, ...newPreviews].slice(0, maxFiles);
            return merged;
          });
        };
        reader.readAsDataURL(f);
      }
    }

    if (newFiles.length > 0) {
      setImageFiles(prev => {
        const merged = [...prev, ...newFiles].slice(0, maxFiles);
        return merged;
      });
      setImagePreviews(prev => {
        const merged = [...prev, ...newPreviews].slice(0, maxFiles);
        return merged;
      });
      setMessage('');
    }
  }

  function removeImageAt(index) {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  }

  function handleSearch(e) {
    e && e.preventDefault();
    setMessage('');
    // Require at least one location field for search
    if (!country && !stateField && !postcode) {
      setResults([]);
      setMessage('Please enter at least one location field: Country, State or Post code.');
      return;
    }

    if (!includeLost && !includeFound) {
      setResults([]);
      setMessage('Please select at least one of "Include Lost" or "Include Found".');
      return;
    }

    if (!validatePostcode(postcode, country)) {
      setResults([]);
      setMessage('Post code appears invalid for the selected country.');
      return;
    }

    const filtered = filterReports(reports, { country, state: stateField, postcode, includeLost, includeFound });
    setResults(filtered);
    if (filtered.length === 0) setMessage('No matches found. Consider posting a report.');
  }

  function handleReportSubmit(e) {
    e.preventDefault();
    // Basic validation
    if (!reportType || (!name && !breed && !lastSeen) || !contact) {
      setMessage('Please fill at least contact and one identifying field (name, breed, or last seen).');
      return;
    }

    const newReport = {
      id: `R-${Math.random().toString(36).slice(2,8).toUpperCase()}`,
      name,
      breed,
      color,
      lastSeen,
      contact,
      details,
      status: reportType,
      country,
      state: stateField,
      postcode,
      images: imagePreviews.length ? imagePreviews.slice(0,3) : [],
      createdAt: new Date().toISOString()
    };

    setReports(prev => [newReport, ...prev]);
    setResults(prev => [newReport, ...prev]);
    setMessage('Report submitted and saved locally. Thank you.');

    // clear form
    setName(''); setBreed(''); setColor(''); setLastSeen(''); setContact(''); setDetails(''); setImageFiles([]); setImagePreviews([]);
  }

  return (
    <div className="petsearch-root">
      <div className="section-title">Lost & Found Pets / Animals</div>
      {mode === 'search' && <div className="section-subtitle">Search our database</div>}

      <div className="petsearch-actions">
        <button className={mode === 'search' ? 'active' : ''} onClick={() => { setMode('search'); setResults([]); setMessage(''); }}>Search our database</button>
        <button className={mode === 'report' ? 'active' : ''} onClick={() => { setMode('report'); setResults([]); setMessage(''); }}>Report Lost/Found</button>
        <Link to="/pet-missing" className="help-link">What to do if your pet goes missing</Link>
      </div>

      {mode === 'search' && (
        <form className="petsearch-form" onSubmit={handleSearch}>
          <div className="form-row">
            <select value={country} onChange={e => setCountry(e.target.value)}>
              {COUNTRY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={stateField} onChange={e => setStateField(e.target.value)}>
              {(STATE_OPTIONS[country] || []).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <input placeholder="Post code" value={postcode} onChange={e => setPostcode(e.target.value)} />
          </div>

          <div className="form-row">
            <label style={{ marginRight: 12 }}>
              <input type="checkbox" checked={includeLost} onChange={e => setIncludeLost(e.target.checked)} /> Include Lost
            </label>
            <label>
              <input type="checkbox" checked={includeFound} onChange={e => setIncludeFound(e.target.checked)} /> Include Found
            </label>
          </div>

          <div className="form-row">
            <button type="submit">Search our database</button>
          </div>
        </form>
      )}

      {mode === 'report' && (
        <form className="petsearch-form report-form" onSubmit={handleReportSubmit}>
          <div className="form-row">
            <label>
              <input type="radio" name="reportType" checked={reportType === 'lost'} onChange={() => setReportType('lost')} /> Lost
            </label>
            <label>
              <input type="radio" name="reportType" checked={reportType === 'found'} onChange={() => setReportType('found')} /> Found
            </label>
          </div>

          <div className="form-row">
            <input placeholder="Pet name (optional)" value={name} onChange={e => setName(e.target.value)} />
            <input placeholder="Breed (optional)" value={breed} onChange={e => setBreed(e.target.value)} />
          </div>

          <div className="form-row">
            <input placeholder="Color / markings (optional)" value={color} onChange={e => setColor(e.target.value)} />
            <input placeholder="Last seen / Found at (location)" value={lastSeen} onChange={e => setLastSeen(e.target.value)} />
          </div>

          <div className="form-row">
            <input placeholder="Your contact phone or email" value={contact} onChange={e => setContact(e.target.value)} />
          </div>

          <div className="form-row">
            <textarea placeholder="Additional details (reward, temperament, special needs)" value={details} onChange={e => setDetails(e.target.value)} />
          </div>

          <div className="form-row">
            <label>Photos (optional, up to 3): <input type="file" accept="image/*" multiple onChange={handleImageChange} /></label>
            <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'center' }}>
              {imagePreviews.map((p, idx) => (
                <div key={idx} style={{ position: 'relative' }}>
                  <img src={p} alt={`preview-${idx}`} style={{ maxWidth: 160, maxHeight: 120, objectFit: 'cover', borderRadius: 6 }} />
                  <button type="button" onClick={() => removeImageAt(idx)} style={{ position: 'absolute', top: 4, right: 4 }}>✕</button>
                </div>
              ))}
            </div>
          </div>

          <div className="form-row">
            <label>Country for this report:
              <select value={country} onChange={e => setCountry(e.target.value)}>
                {COUNTRY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
            <label>State:
              <select value={stateField} onChange={e => setStateField(e.target.value)}>
                {(STATE_OPTIONS[country] || []).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
            <input placeholder="Post code" value={postcode} onChange={e => setPostcode(e.target.value)} />
          </div>

          <div className="form-row">
            <button type="submit">Submit Report</button>
          </div>
        </form>
      )}

      <div className="petsearch-results">
        {message && <div className="message">{message}</div>}

        {results.length > 0 && (
          <ul>
            {results.map(r => (
              <li key={r.id} className="pet-item">
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  {r.images && r.images.length > 0 && <img src={r.images[0]} alt="report" style={{ width: 96, height: 96, objectFit: 'cover', borderRadius: 8 }} />}
                  <div>
                    <div><strong>{r.name || 'Unnamed'}</strong> {r.breed ? `(${r.breed})` : ''} — {r.status ? r.status.toUpperCase() : 'REPORT'}</div>
                    <div className="small">Location: {r.suburb ? `${r.suburb}, ` : ''}{r.state || ''} {r.postcode ? `(${r.postcode})` : ''}</div>
                    <div>Contact: {r.contact ? <a href={`tel:${r.contact}`}>{r.contact}</a> : 'N/A'}</div>
                    {r.details && <div className="small">{r.details}</div>}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

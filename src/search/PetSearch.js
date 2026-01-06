import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './petsearch.css';
import './search.css';
import { filterReports, validatePostcode, validateImageFile, compressImage } from './searchUtils';
import { searchByImage, hybridSearch } from './imageSearchUtils';

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

  // search image upload state
  const [searchImageFile, setSearchImageFile] = useState(null);
  const [searchImagePreview, setSearchImagePreview] = useState('');
  const [searchMode, setSearchMode] = useState('location'); // 'location' | 'image' | 'hybrid'
  const [isSearching, setIsSearching] = useState(false);

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
      {
        id: 'P-001',
        name: 'Bella',
        breed: 'Golden Retriever',
        type: 'Dog',
        status: 'lost',
        country: 'India',
        state: 'Maharashtra',
        suburb: 'Bandra',
        postcode: '400050',
        lastSeen: 'Bandra West, near Linking Road',
        contact: '+91 98765 43210',
        details: 'Golden coat, very friendly, wearing red collar. Reward offered!',
        color: 'Golden',
        images: ['data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="96" height="96"%3E%3Crect fill="%23f4a460" width="96" height="96"/%3E%3Ctext x="50%25" y="50%25" font-size="14" text-anchor="middle" dy=".3em" fill="%23fff"%3EGolden%0ARetriever%3C/text%3E%3C/svg%3E'],
        createdAt: '2026-01-02T10:30:00Z'
      },
      {
        id: 'P-002',
        name: 'Milo',
        breed: 'Persian Cat',
        type: 'Cat',
        status: 'found',
        country: 'India',
        state: 'Karnataka',
        suburb: 'Koramangala',
        postcode: '560034',
        lastSeen: 'Found near Koramangala 5th Block park',
        contact: '+91 98700 11122',
        details: 'White Persian cat, well groomed, seems to be someone\'s pet',
        color: 'White',
        images: ['data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="96" height="96"%3E%3Crect fill="%23e8e8e8" width="96" height="96"/%3E%3Ctext x="50%25" y="50%25" font-size="14" text-anchor="middle" dy=".3em" fill="%23666"%3EPersian%0ACat%3C/text%3E%3C/svg%3E'],
        createdAt: '2026-01-02T14:15:00Z'
      },
      {
        id: 'P-003',
        name: 'Max',
        breed: 'Labrador',
        type: 'Dog',
        status: 'lost',
        country: 'Australia',
        state: 'New South Wales',
        suburb: 'Sydney',
        postcode: '2000',
        lastSeen: 'Sydney CBD, near Hyde Park',
        contact: '+61 412 345 678',
        details: 'Black Labrador, 3 years old, answers to Max. Very friendly with children.',
        color: 'Black',
        images: ['data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="96" height="96"%3E%3Crect fill="%23333" width="96" height="96"/%3E%3Ctext x="50%25" y="50%25" font-size="14" text-anchor="middle" dy=".3em" fill="%23fff"%3ELabrador%3C/text%3E%3C/svg%3E'],
        createdAt: '2026-01-01T08:00:00Z'
      },
      {
        id: 'P-004',
        name: 'Luna',
        breed: 'Indie Dog',
        type: 'Dog',
        status: 'found',
        country: 'India',
        state: 'Delhi',
        suburb: 'Connaught Place',
        postcode: '110001',
        lastSeen: 'Found wandering in Connaught Place',
        contact: '+91 98123 45678',
        details: 'Brown indie dog, wearing blue collar with no tag. Looking for owner.',
        color: 'Brown',
        images: ['data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="96" height="96"%3E%3Crect fill="%23a0522d" width="96" height="96"/%3E%3Ctext x="50%25" y="50%25" font-size="14" text-anchor="middle" dy=".3em" fill="%23fff"%3EIndie%0ADog%3C/text%3E%3C/svg%3E'],
        createdAt: '2026-01-03T06:45:00Z'
      },
      {
        id: 'P-005',
        name: 'Whiskers',
        breed: 'Tabby Cat',
        type: 'Cat',
        status: 'lost',
        country: 'United States',
        state: 'California',
        suburb: 'Los Angeles',
        postcode: '90001',
        lastSeen: 'Hollywood area, near Sunset Boulevard',
        contact: '+1 323 555 0123',
        details: 'Orange tabby cat with white paws. Microchipped. Please contact if found!',
        color: 'Orange/White',
        images: ['data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="96" height="96"%3E%3Crect fill="%23ff8c42" width="96" height="96"/%3E%3Ctext x="50%25" y="50%25" font-size="14" text-anchor="middle" dy=".3em" fill="%23fff"%3ETabby%0ACat%3C/text%3E%3C/svg%3E'],
        createdAt: '2026-01-02T18:20:00Z'
      }
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
    // Initialize with all sample results on first load
    if (mode === 'search' && results.length === 0 && reports.length > 0) {
      setResults(reports);
      setMessage(`Showing ${reports.length} sample pet reports. Use filters to search.`);
    }
  }, [mode, reports]);

  useEffect(() => {
    // when country changes, default stateField
    if (country && STATE_OPTIONS[country]) {
      setStateField(STATE_OPTIONS[country][0]);
    } else {
      setStateField('');
    }
  }, [country]);

  async function handleSearchImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file, 5 * 1024 * 1024); // 5MB limit
    if (!validation.ok) {
      setMessage(`Image rejected: ${validation.reason}`);
      setSearchImageFile(null);
      setSearchImagePreview('');
      return;
    }

    try {
      const compressed = await compressImage(file, 1200, 0.8);
      setSearchImageFile(file);
      setSearchImagePreview(compressed);
      setMessage('');
    } catch (err) {
      // fallback to dataURL without compression
      const reader = new FileReader();
      reader.onload = () => {
        setSearchImageFile(file);
        setSearchImagePreview(reader.result);
        setMessage('');
      };
      reader.readAsDataURL(file);
    }
  }

  function removeSearchImage() {
    setSearchImageFile(null);
    setSearchImagePreview('');
  }

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

  async function handleSearch(e) {
    e && e.preventDefault();
    setIsSearching(true);
    setMessage('Searching...');

    try {
      // Determine search mode based on inputs
      const hasLocation = country || stateField || postcode;
      const hasImage = searchImagePreview;

      if (!hasLocation && !hasImage) {
        setResults([]);
        setMessage('Please enter location details or upload an image to search.');
        setIsSearching(false);
        return;
      }

      if (!includeLost && !includeFound) {
        setResults([]);
        setMessage('Please select at least one of "Include Lost" or "Include Found".');
        setIsSearching(false);
        return;
      }

      if (postcode && !validatePostcode(postcode, country)) {
        setResults([]);
        setMessage('City/Suburb appears invalid for the selected country.');
        setIsSearching(false);
        return;
      }

      let searchResults = [];
      let searchType = '';

      if (hasImage && hasLocation) {
        // Hybrid search: location + image
        searchType = 'hybrid';
        const locationFilter = { country, state: stateField, postcode, includeLost, includeFound };
        searchResults = await hybridSearch(reports, locationFilter, searchImagePreview);
        setMessage(searchResults.length > 0
          ? `Found ${searchResults.length} match(es) using location and image similarity.`
          : 'No matches found. Try adjusting location or uploading a different image.');
      } else if (hasImage) {
        // Image-only search
        searchType = 'image';
        // Filter by status first
        const statusFiltered = reports.filter(r =>
          (includeLost && r.status === 'lost') || (includeFound && r.status === 'found')
        );
        searchResults = await searchByImage(statusFiltered, searchImagePreview, 0.3);
        setMessage(searchResults.length > 0
          ? `Found ${searchResults.length} visually similar pet(s). Results ranked by similarity.`
          : 'No visually similar pets found. Try uploading a clearer image or search by location.');
      } else {
        // Location-only search (original functionality)
        searchType = 'location';
        searchResults = filterReports(reports, { country, state: stateField, postcode, includeLost, includeFound });
        setMessage(searchResults.length > 0
          ? `Found ${searchResults.length} match(es) in the specified location.`
          : 'No matches found. Consider posting a report.');
      }

      setSearchMode(searchType);
      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
      setMessage('An error occurred during search. Please try again.');
      setResults([]);
    } finally {
      setIsSearching(false);
    }
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <div className="section-title">Lost & Found Pets / Animals</div>
          {mode === 'search' && <div className="section-subtitle">Search our database</div>}
        </div>
      </div>

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
            <input placeholder="City/Suburb" value={postcode} onChange={e => setPostcode(e.target.value)} />
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
            <label style={{ display: 'block', marginBottom: 8 }}>
              Upload pet image (optional):
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleSearchImageChange}
                style={{ display: 'block', marginTop: 4 }}
              />
              <div style={{ fontSize: '0.85em', color: '#666', marginTop: 4 }}>
                Supported: JPEG, PNG, GIF, WebP (max 5MB)<br/>
                💡 <strong>Pro tip:</strong> Upload a clear photo to search by visual similarity!
                {!country && !stateField && !postcode && (
                  <span> You can search by image alone without location.</span>
                )}
              </div>
            </label>
            {searchImagePreview && (
              <div style={{ position: 'relative', marginTop: 8, display: 'inline-block' }}>
                <img
                  src={searchImagePreview}
                  alt="search preview"
                  style={{ maxWidth: 200, maxHeight: 150, objectFit: 'cover', borderRadius: 6, border: '2px solid #ddd' }}
                />
                <button
                  type="button"
                  onClick={removeSearchImage}
                  style={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    background: '#ff4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: 24,
                    height: 24,
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <div className="form-row">
            <button type="submit" disabled={isSearching}>
              {isSearching ? 'Searching...' : 'Search our database'}
            </button>
            {searchImagePreview && (
              <span style={{ marginLeft: 12, color: '#666', fontSize: '0.9em' }}>
                🔍 Image search enabled
              </span>
            )}
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
            <input placeholder="City/Suburb" value={postcode} onChange={e => setPostcode(e.target.value)} />
          </div>

          <div className="form-row">
            <button type="submit">Submit Report</button>
          </div>
        </form>
      )}

      <div className="petsearch-results" aria-live="polite">
        {message && <div className="message">{message}</div>}

        {results.length > 0 && (
          <>
            {(searchMode === 'image' || searchMode === 'hybrid') && (
              <div style={{ marginBottom: 12, padding: 8, backgroundColor: '#e3f2fd', borderRadius: 6, fontSize: '0.9em' }}>
                💡 <strong>Image Search Active:</strong> Results are ranked by visual similarity to your uploaded image.
                {searchMode === 'hybrid' && ' Location filters also applied.'}
              </div>
            )}

            <table className="results-table" role="table">
              <tbody>
                {results.map(r => (
                  <tr key={r.id} className="results-row">
                    <td className="result-cell">
                      <div className="result-top">
                        {r.images && r.images.length > 0 && (
                          <div style={{ marginRight: 12 }}>
                            <img src={r.images[0]} alt="report" style={{ width: 96, height: 96, objectFit: 'cover', borderRadius: 8 }} />
                          </div>
                        )}
                        <div className="result-main">
                          <div className="result-name">
                            {r.name || 'Unnamed'} {r.breed ? `(${r.breed})` : ''}
                            {r.similarityScore !== undefined && (
                              <span style={{
                                marginLeft: 8,
                                padding: '2px 8px',
                                backgroundColor: r.similarityScore > 0.7 ? '#4caf50' : r.similarityScore > 0.5 ? '#ff9800' : '#9e9e9e',
                                color: 'white',
                                borderRadius: 12,
                                fontSize: '0.85em',
                                fontWeight: 'normal'
                              }}>
                                {Math.round(r.similarityScore * 100)}% match
                              </span>
                            )}
                          </div>
                          <div className="result-type">{r.status ? r.status.toUpperCase() : 'REPORT'}</div>
                          <div className="result-mobile">
                            <a href={`tel:${r.contact ? r.contact.replace(/\s+/g, '') : ''}`}>{r.contact || 'N/A'}</a>
                          </div>
                        </div>
                        <div className="result-action">
                          <button
                            type="button"
                            className="view-btn"
                            onClick={() => console.log('view details', r)}
                            aria-label={`View details for ${r.name || 'Unnamed'}`}
                          >
                            View Details
                          </button>
                        </div>
                      </div>

                      <div className="result-bottom">
                        <div className="result-address">
                          Location: {r.suburb ? `${r.suburb}, ` : ''}{r.state || ''} {r.postcode ? `${r.postcode}` : ''}, {r.country || ''}
                        </div>
                        {r.lastSeen && <div className="result-email">Last Seen: {r.lastSeen}</div>}
                        {r.details && <div className="result-email">{r.details}</div>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}

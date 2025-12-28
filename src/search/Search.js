import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './search.css';

export default function Search() {
  const [county, setCounty] = useState('India');
  const [stateVal, setStateVal] = useState('');
  const [suburb, setSuburb] = useState('');
  const [postcode, setPostcode] = useState('');
  const [service, setService] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Small map of countries to states/regions for rendering a select on mobile.
  // Expand this as needed.
  const countryStates = {
    India: [
      'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
    ],
    'United States': [
      'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'
    ],
    Canada: ['Alberta','British Columbia','Manitoba','New Brunswick','Newfoundland and Labrador','Nova Scotia','Ontario','Prince Edward Island','Quebec','Saskatchewan','Northwest Territories','Nunavut','Yukon'],
    Australia: ['Australian Capital Territory','New South Wales','Northern Territory','Queensland','South Australia','Tasmania','Victoria','Western Australia']
  };

  useEffect(() => {
    // Prefill from query params when arriving from a card
    const params = new URLSearchParams(location.search);
    const s = params.get('service') || '';
    const c = params.get('county') || '';
    const st = params.get('state') || '';
    const sub = params.get('suburb') || '';
    const pc = params.get('postcode') || '';
    if (s) setService(s);
    if (c) setCounty(c);
    if (st) setStateVal(st);
    if (sub) setSuburb(sub);
    if (pc) setPostcode(pc);
  }, [location.search]);

  // Map service param to a nicer title fragment when present
  const serviceTitleMap = {
    Ambulance: 'Ambulance Services',
    Boarding: 'Paid Boarding',
    Veterinarians: 'Vet Services',
    Rescuers: 'Rescuers',
    Paravets: 'Paravet Services',
    Shelters: 'Shelters',
    Guides: 'Animal Care Guides',
    Lost: 'Lost & Found'
  };

  const displayTitle = service ? `Search ${serviceTitleMap[service] || service}` : 'Search Services';

  // Sample items to show below the search box (placeholder data)
  const sampleItems = [
    { id: 1, name: 'Happy Paws Rescue', type: 'Shelter', address: '12 Park Lane, Mumbai, MH', email: 'contact@happypaws.org', mobile: '+91 98765 43210' },
    { id: 2, name: 'City Vet Clinic', type: 'Veterinarian', address: '45 Green Rd, Delhi, DL', email: 'info@cityvet.in', mobile: '+91 91234 56789' },
    { id: 3, name: 'Rapid Rescue', type: 'Ambulance', address: '3 First Ave, Pune, MH', email: 'help@rapidrescue.com', mobile: '+91 99876 54321' },
    { id: 4, name: 'Kind Boarding', type: 'Boarding', address: '78 Lakeview, Bangalore, KA', email: 'stay@kindboarding.com', mobile: '+91 90123 45678' },
    { id: 5, name: 'ParaCare Team', type: 'Paravets', address: '9 Market St, Chennai, TN', email: 'team@paracare.in', mobile: '+91 90909 09090' }
  ];

  function handleSubmit(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (service) params.set('service', service);
    if (county) params.set('county', county);
    if (stateVal) params.set('state', stateVal);
    if (suburb) params.set('suburb', suburb);
    if (postcode) params.set('postcode', postcode);
    const q = params.toString();
    navigate(`/search${q ? `?${q}` : ''}`);
  }

  return (
    <div className="container search-container">
      <form id="searchForm" className="form-section" onSubmit={handleSubmit}>
        <div className="section-title">{displayTitle}</div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="country" className="required">Country</label>
            <select id="country" name="country" className="select" value={county} onChange={e=>{ setCounty(e.target.value); setStateVal(''); }}>
              {[
                "Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina","Armenia","Australia","Austria","Azerbaijan",
                "Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi",
                "Cabo Verde","Cambodia","Cameroon","Canada","Central African Republic","Chad","Chile","China","Colombia","Comoros","Congo, Democratic Republic of the","Congo, Republic of the","Costa Rica","Cote d'Ivoire","Croatia","Cuba","Cyprus","Czechia",
                "Denmark","Djibouti","Dominica","Dominican Republic",
                "Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia",
                "Fiji","Finland","France",
                "Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana",
                "Haiti","Honduras","Hungary",
                "Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy",
                "Jamaica","Japan","Jordan",
                "Kazakhstan","Kenya","Kiribati","Korea, North","Korea, South","Kosovo","Kuwait","Kyrgyzstan",
                "Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg",
                "Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar",
                "Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Macedonia","Norway",
                "Oman",
                "Pakistan","Palau","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal",
                "Qatar",
                "Romania","Russia","Rwanda",
                "Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria",
                "Taiwan","Tajikistan","Tanzania","Thailand","Timor-Leste","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Tuvalu",
                "Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan",
                "Vanuatu","Vatican City","Venezuela","Vietnam",
                "Yemen",
                "Zambia","Zimbabwe"
              ].map(cn => (
                <option key={cn} value={cn}>{cn}</option>
              ))}
            </select>
            <div id="countryError" className="error-message">Please select a country</div>
          </div>

          <div className="form-group">
            <label htmlFor="state" className="required">State / Region</label>
            {countryStates[county] ? (
              <select id="state" name="state" className="select" value={stateVal} onChange={e=>setStateVal(e.target.value)}>
                <option value="">All States / Regions</option>
                {countryStates[county].map(s=> <option key={s} value={s}>{s}</option>)}
              </select>
            ) : (
              <input id="state" name="state" className="input" value={stateVal} onChange={e=>setStateVal(e.target.value)} placeholder="State / Region" />
            )}
            <div id="stateError" className="error-message">Please enter a state or region</div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="suburb">Suburb</label>
            <input id="suburb" name="suburb" className="input" value={suburb} onChange={e=>setSuburb(e.target.value)} placeholder="Suburb" />
          </div>

          <div className="form-group">
            <label htmlFor="postcode">Postcode</label>
            <input id="postcode" name="postcode" className="input" value={postcode} onChange={e=>setPostcode(e.target.value)} placeholder="Postcode" />
          </div>
        </div>

        <div className="button-group">
          <button type="submit" className="submit-btn">Search</button>
          <button type="reset" className="reset-btn" onClick={() => { setService(''); setStateVal(''); setSuburb(''); setPostcode(''); setCounty('India'); }}>Clear</button>
        </div>
      </form>

      <div className="form-section results-section" aria-live="polite">
        <div className="section-title">Results</div>
        <div className="results-note">Showing sample items — integrate backend to show real results.</div>

        <table className="results-table" role="table">
          <tbody>
            {sampleItems.map(item => (
              <tr key={item.id} className="results-row">
                <td className="result-cell">
                  <div className="result-top">
                    <div className="result-main">
                      <div className="result-name">{item.name}</div>
                      <div className="result-type">{item.type}</div>
                      <div className="result-mobile"><a href={`tel:${item.mobile.replace(/\s+/g, '')}`}>{item.mobile}</a></div>
                    </div>
                    <div className="result-action">
                      <button type="button" className="view-btn" onClick={() => console.log('view details', item)} aria-label={`View details for ${item.name}`}>View Details</button>
                    </div>
                  </div>

                  <div className="result-bottom">
                    <div className="result-address">{item.address}</div>
                    <div className="result-email"><a href={`mailto:${item.email}`}>{item.email}</a></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

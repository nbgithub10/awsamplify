import { filterReports, validatePostcode, validateImageFile } from './searchUtils';

describe('validatePostcode', () => {
  test('valid India postcode', () => {
    expect(validatePostcode('400001', 'India')).toBe(true);
    expect(validatePostcode('560001', 'India')).toBe(true);
    expect(validatePostcode('40001', 'India')).toBe(false);
  });

  test('valid Australia postcode', () => {
    expect(validatePostcode('2000', 'Australia')).toBe(true);
    expect(validatePostcode('1234', 'Australia')).toBe(true);
    expect(validatePostcode('123', 'Australia')).toBe(false);
  });

  test('valid US postcode', () => {
    expect(validatePostcode('90210', 'United States')).toBe(true);
    expect(validatePostcode('12345-6789', 'United States')).toBe(true);
    expect(validatePostcode('1234', 'United States')).toBe(false);
  });

  test('fallback validation', () => {
    expect(validatePostcode('AB12', 'Unknown')).toBe(true);
    expect(validatePostcode('', null)).toBe(true);
  });
});

describe('filterReports', () => {
  const reports = [
    { id: '1', status: 'lost', country: 'India', state: 'Maharashtra', postcode: '400001' },
    { id: '2', status: 'found', country: 'India', state: 'Karnataka', postcode: '560001' },
    { id: '3', status: 'lost', country: 'Australia', state: 'New South Wales', postcode: '2000' }
  ];

  test('filter by country', () => {
    const res = filterReports(reports, { country: 'India', state: '', postcode: '', includeLost: true, includeFound: true });
    expect(res.length).toBe(2);
  });

  test('filter by state', () => {
    const res = filterReports(reports, { country: '', state: 'Karnataka', postcode: '', includeLost: true, includeFound: true });
    expect(res.length).toBe(1);
    expect(res[0].id).toBe('2');
  });

  test('filter by postcode and status', () => {
    const res = filterReports(reports, { country: '', state: '', postcode: '2000', includeLost: true, includeFound: false });
    expect(res.length).toBe(1);
    expect(res[0].id).toBe('3');
  });

  test('exclude statuses', () => {
    const res = filterReports(reports, { country: '', state: '', postcode: '', includeLost: false, includeFound: true });
    expect(res.length).toBe(1);
    expect(res[0].status).toBe('found');
  });
});

// Image validation tests
describe('validateImageFile', () => {
  function makeFile({ size = 1000, type = 'image/jpeg' } = {}) {
    // Create a minimal Blob and assign a type and size; Jest/Node environment can't create real File with size easily,
    // so we'll fake it with an object that has the fields validateImageFile expects (size and type).
    return { size, type, name: 'test.jpg' };
  }

  test('accept valid jpeg under size', () => {
    const f = makeFile({ size: 500 * 1024, type: 'image/jpeg' });
    expect(validateImageFile(f, 1024 * 1024).ok).toBe(true);
  });

  test('reject unsupported type', () => {
    const f = makeFile({ size: 100, type: 'application/pdf' });
    expect(validateImageFile(f).ok).toBe(false);
  });

  test('reject too large', () => {
    const f = makeFile({ size: 5 * 1024 * 1024, type: 'image/png' });
    expect(validateImageFile(f, 2 * 1024 * 1024).ok).toBe(false);
  });
});

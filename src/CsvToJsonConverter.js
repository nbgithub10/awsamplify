import './App.css';
import { useState } from 'react';

function CsvToJsonConverter() {
    const [csvInput, setCsvInput] = useState('');
    const [jsonOutput, setJsonOutput] = useState([]);
    const [error, setError] = useState('');

    const convertCsvToJson = (csv) => {
        try {
            // Split the CSV into rows
            const rows = csv.split('\n').filter(row => row.trim());

            // Get headers from first row
            const headers = rows[0].split(',').map(header =>
                header.trim().replace(/["']/g, '') // Remove quotes from headers
            );

            // Convert remaining rows to JSON
            const jsonData = rows.slice(1).map(row => {
                // Handle cases where a field might contain commas within quotes
                const values = [];
                let inQuotes = false;
                let currentValue = '';

                for (let char of row) {
                    if (char === '"') {
                        inQuotes = !inQuotes;
                    } else if (char === ',' && !inQuotes) {
                        values.push(currentValue.trim());
                        currentValue = '';
                    } else {
                        currentValue += char;
                    }
                }
                values.push(currentValue.trim());

                // Create object from headers and values
                const obj = {};
                headers.forEach((header, index) => {
                    let value = values[index] || '';
                    // Remove surrounding quotes if they exist
                    value = value.replace(/^["'](.*)["']$/, '$1');
                    obj[header] = value;
                });
                return obj;
            });

            setJsonOutput(jsonData);
            setError('');
        } catch (err) {
            setError('Error converting CSV to JSON. Please check your CSV format.');
            setJsonOutput([]);
        }
    };

    const handleInputChange = (e) => {
        setCsvInput(e.target.value);
    };

    const handleConvert = () => {
        if (!csvInput.trim()) {
            setError('Please enter some CSV data');
            return;
        }
        convertCsvToJson(csvInput);
    };

    return (
        <div className="container">
            <h1>CSV to JSON Converter</h1>

            <div className="converter-section">
                <h2>Input CSV</h2>
                <textarea
                    className="csv-input"
                    value={csvInput}
                    onChange={handleInputChange}
                    placeholder="Enter your CSV data here...&#10;Example:&#10;name,age,city&#10;John,30,New York&#10;Jane,25,Los Angeles"
                    rows="10"
                />

                <button className="convert-button" onClick={handleConvert}>
                    Convert to JSON
                </button>

                {error && <div className="error-message">{error}</div>}

                <h2>JSON Output</h2>
                <div className="json-output">
                    {jsonOutput.length > 0 && (
                        <pre>{JSON.stringify(jsonOutput, null, 2)}</pre>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CsvToJsonConverter;
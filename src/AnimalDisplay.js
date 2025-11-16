import './App.css';
import { useEffect, useState } from 'react';

function AnimalDisplay() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const parseValue = (value) => {
        if (typeof value !== 'string') return value;

        // First clean the escaped quotes
        const cleanedValue = value.replace(/\\"/g, '"');

        try {
            // Try to parse as JSON
            const parsedValue = JSON.parse(cleanedValue);
            return parsedValue;
        } catch (e) {
            // If parsing fails, return original cleaned value
            return cleanedValue;
        }
    };

    // Render complex values (objects/arrays)
    const renderValue = (value) => {
        if (value === null || value === undefined) return '';
        if (typeof value === 'object') {
            return (
                <div className="nested-object">
                    {Object.entries(value).map(([key, val]) => (
                        <div key={key} className="nested-row">
                            <span className="nested-key">{key}:</span>
                            <span className="nested-value">
                                {typeof val === 'object' ? JSON.stringify(val, null, 2) : val}
                            </span>
                        </div>
                    ))}
                </div>
            );
        }
        return value;
    };

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('https://agus4uqwza.execute-api.ap-southeast-2.amazonaws.com/animals');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = parseValue(await response.json());
                setPosts(data);
                console.log(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) return <div>Loading posts...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="container">
            <h1>User Data</h1>
            {posts.map((post = JSON.parse(post), index) => (
                <div key={post || index} className="data-card">
                    {Object.entries(JSON.parse(post)).map(([key, value]) => {
                        const parsedValue = parseValue(value);
                        if (parsedValue !== null && parsedValue !== "") {
                            return (
                                <div key={key} className="data-row">
                                    <span className="key">{key}:</span>
                                    <span className="value">
                                        {renderValue(parsedValue)}
                                    </span>
                                </div>
                            );
                        }
                        return null;
                    })}
                </div>
            ))}
        </div>
    );
}

export default AnimalDisplay;

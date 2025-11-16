import './App.css';
import { useState, useEffect } from 'react';

function AnimalDisplay() {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const parseValue = (value) => {
        if (typeof value !== 'string') return value;
        const cleanedValue = value.replace(/\\"/g, '"');
        try {
            return JSON.parse(cleanedValue);
        } catch (e) {
            return cleanedValue;
        }
    };

// Highlight matching text
    const highlightText = (text, searchTerm) => {
        if (!searchTerm || typeof text !== 'string') return text;

        const parts = text.toString().split(new RegExp(`(${searchTerm})`, 'gi'));
        return parts.map((part, index) =>
            part.toLowerCase() === searchTerm.toLowerCase() ?
                <mark key={index} className="highlight">{part}</mark> :
                part
        );
    };

    const renderValue = (value, searchTerm) => {
        if (value === null || value === undefined) return '';

        if (typeof value === 'object') {
            return (
                <div className="nested-object">
                    {Object.entries(value).map(([key, val]) => (
                        <div key={key} className="nested-row">
                            <span className="nested-key">{highlightText(key, searchTerm)}:</span>
                            <span className="nested-value">
                                {typeof val === 'object'
                                    ? highlightText(JSON.stringify(val, null, 2), searchTerm)
                                    : highlightText(val, searchTerm)}
                            </span>
                        </div>
                    ))}
                </div>
            );
        }
        return highlightText(value, searchTerm);
    };

    // Search functionality
    const handleSearch = (searchValue) => {
        setSearchTerm(searchValue);

        if (!searchValue.trim()) {
            setFilteredPosts(posts);
            return;
        }

        const searchTermLower = searchValue.toLowerCase();

        const filtered = posts.filter(post => {
            // Convert the entire post object to a string for searching
            const postString = JSON.stringify(post).toLowerCase();
            return postString.includes(searchTermLower);
        });

        setFilteredPosts(filtered);
    };

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('https://agus4uqwza.execute-api.ap-southeast-2.amazonaws.com/animals');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setPosts(data);
                setFilteredPosts(data); // Initialize filtered posts with all posts
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) return <div>Loading profiles...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="container">
            <h1>Awesome people's profile</h1>

            {/* Search Box */}
            <div className="search-container">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                />
                {searchTerm && (
                    <button
                        className="clear-search"
                        onClick={() => handleSearch('')}
                    >
                        ×
                    </button>
                )}
            </div>

            {/* Results count */}
            <div className="results-count">
                Found {filteredPosts.length} {filteredPosts.length === 1 ? 'result' : 'results'}
                {searchTerm && ` for "${searchTerm}"`}
            </div>

            {/* Display filtered records */}
            {filteredPosts.length === 0 ? (
                <div className="no-results">No matching records found</div>
            ) : (
                filteredPosts.map((post, index) => (
                    <div key={post.Record_Key || index} className="data-card">
                        {Object.entries(JSON.parse(post)).map(([key, value]) => {
                            const parsedValue = parseValue(value);
                            if (parsedValue !== null && parsedValue !== "") {
                                return (
                                    <div key={key} className="data-row">
                                        <span className="key">{key}:</span>
                                        <span className="value">
                                            {renderValue(parsedValue, searchTerm)}
                                        </span>
                                    </div>
                                );
                            }
                            return null;
                        })}
                    </div>
                ))
            )}
        </div>
    );
}

export default AnimalDisplay;

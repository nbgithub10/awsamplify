import './App.css';
import { useEffect, useState } from 'react';

function AnimalDisplay() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('https://agus4uqwza.execute-api.ap-southeast-2.amazonaws.com/animals');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setPosts(data);
                console.log(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []); // Empty dependency array means it runs once on mount

    if (loading) return <div>Loading posts...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <h1>Posts</h1>
            <ul>
                {posts.map((post) => (
                     <li key={post.animal_id}>{post.animalId} - {post.address}</li>
                ))}
            </ul>
        </div>
    );
};

export default AnimalDisplay;

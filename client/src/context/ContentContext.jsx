import { createContext, useContext, useState, useEffect } from 'react';
import { contentAPI } from '../utils/api';

const ContentContext = createContext();

export const useContent = () => useContext(ContentContext);

export const ContentProvider = ({ children }) => {
    const [content, setContent] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchContent = async () => {
        try {
            const response = await contentAPI.getAllContent();

            const contentMap = {};
            response.data.forEach(item => {
                let url = item.imageUrl;
                if (url && url.includes('http://localhost:5001')) {
                    url = url.replace('http://localhost:5001', '');
                }
                contentMap[item.key] = url;
            });
            setContent(contentMap);
        } catch (error) {
            console.error('Error fetching site content:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContent();
    }, []);

    const refreshContent = () => {
        fetchContent();
    };

    return (
        <ContentContext.Provider value={{ content, loading, refreshContent }}>
            {children}
        </ContentContext.Provider>
    );
};

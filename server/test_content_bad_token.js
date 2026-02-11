const axios = require('axios');

async function testContentWithBadToken() {
    try {
        console.log('Testing GET http://localhost:5001/api/content with BAD TOKEN...');
        const res = await axios.get('http://localhost:5001/api/content', {
            headers: {
                Authorization: 'Bearer invalid_token_12345'
            }
        });
        console.log('Status:', res.status);
        console.log('Data:', res.data.length, 'items');
    } catch (error) {
        console.error('Error:', error.response ? error.response.status : error.message);
        if (error.response && error.response.data) {
            console.error('Response Data:', error.response.data);
        }
    }
}

testContentWithBadToken();

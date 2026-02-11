const axios = require('axios');

async function testContent() {
    try {
        console.log('Testing GET http://localhost:5001/api/content...');
        const res = await axios.get('http://localhost:5001/api/content');
        console.log('Status:', res.status);
        console.log('Data:', res.data.length, 'items');
    } catch (error) {
        console.error('Error:', error.response ? error.response.status : error.message);
        if (error.response && error.response.data) {
            console.error('Response Data:', error.response.data);
        }
    }
}

testContent();

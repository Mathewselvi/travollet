const axios = require('axios');

async function testSubmit() {
  const formData = {
    vehicleType: 'MPV',
    price: 4500,
    description: 'Experience a comfortable ride',
    maxPassengers: 7,
    isActive: true,
    images: ['https://example.com/broken-img.jpg']
  };

  try {
    const res = await axios.post('http://localhost:5001/api/admin/airport-transfers', formData, {
      headers: { 'Authorization': `Bearer ${process.env.TEST_TOKEN}` } // Token will be ignored if adminAuth is missing, wait we need a token to hit /admin/airport-transfers
    });
    console.log("Success:", res.data);
  } catch (err) {
    console.error("Error:", err.response?.status, err.response?.data);
  }
}
testSubmit();

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function testUpload() {
  const form = new FormData();
  fs.writeFileSync('dummy2.jpg', 'fake image content');
  form.append('images', fs.createReadStream('dummy2.jpg'));

  try {
    const res = await axios.post('http://localhost:5001/api/admin/upload', form, {
      headers: form.getHeaders() // In Node script, this is how we set boundary
    });
    console.log("Success:", res.data);
  } catch (err) {
    console.error("Error:", err.response?.status, err.response?.data);
  }
}
testUpload();

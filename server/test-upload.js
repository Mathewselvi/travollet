const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function testUpload() {
  const form = new FormData();
  // Create a dummy file
  fs.writeFileSync('dummy.jpg', 'fake image content');
  form.append('images', fs.createReadStream('dummy.jpg'));

  // Get token (mock it by ignoring auth or if we need a token we might get 401, but we can see what error we get)
  try {
    const res = await axios.post('http://localhost:5001/api/admin/upload', form, {
      headers: form.getHeaders()
    });
    console.log("Success:", res.data);
  } catch (err) {
    console.error("Error:", err.response?.status, err.response?.data);
  }
}
testUpload();

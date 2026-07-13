import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

async function testUpload() {
  try {
    const formData = new FormData();
    // create a dummy file
    fs.writeFileSync('dummy.png', 'fake image data');
    formData.append('image', fs.createReadStream('dummy.png'));
    
    const res = await axios.post('http://localhost:5000/api/upload/conferences', formData, {
      headers: formData.getHeaders()
    });
    console.log('Upload Success:', res.data);
  } catch(e) {
    console.error('Upload Error:', e.response ? e.response.data : e.message);
  }
}
testUpload();

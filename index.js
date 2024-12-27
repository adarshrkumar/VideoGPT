const FormData = require('form-data');
const http = require('https');
const fs = require('fs');
const form = new FormData();

form.append('format', 'PNG');
form.append('output_type', 'cutout');
form.append('image_url', '../img/patterns/rm-0.png');

const options = {
  'method': 'POST',
  'hostname': 'api.picsart.io',
  'port':  null ,
  'path': '/tools/1.0/removebg',
  'headers': {
    'accept': 'application/json',
    'x-picsart-api-key': YOUR_ENTERED_API_KEY,
  }  
};

const req = http.request(options, function (res) {
  const chunks = [];
  res.on('data', function (chunk) {
    chunks.push(chunk);
  });
  res.on('end', function () {
    const body = Buffer.concat(chunks);
    // console.log(body.toString());
  });
});
req.on('error', (e) => {
  console.error(e);
});
form.pipe(req); 

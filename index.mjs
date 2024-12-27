import FormData from 'form-data';
import fetch from 'node-fetch';
import fs from 'fs';

import express from 'express';
const app = express();


app.get('/', (req, res) => {
  const form = new FormData();

  form.append('format', 'PNG');
  form.append('output_type', 'cutout');
  form.append('image_url', './test-image.jpg');

  fetch("https://api.picsart.io/tools/1.0/removebg", {
    method: "POST",
    headers: {
      'x-picsart-api-key': process.env.PICSART_API_KEY || 'eyJraWQiOiI5NzIxYmUzNi1iMjcwLTQ5ZDUtOTc1Ni05ZDU5N2M4NmIwNTEiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJhdXRoLXNlcnZpY2UtMTY0OTZmODYtOTJhZi00OGIyLTk4YWYtZTgwODg3MjUxNWE4IiwiYXVkIjoiNDY5NTk4NzIyMDE5MTAxIiwibmJmIjoxNzM1MjY3ODY5LCJzY29wZSI6WyJiMmItYXBpLmdlbl9haSIsImIyYi1hcGkuaW1hZ2VfYXBpIl0sImlzcyI6Imh0dHBzOi8vYXBpLnBpY3NhcnQuY29tL3Rva2VuLXNlcnZpY2UiLCJvd25lcklkIjoiNDY5NTk4NzIyMDE5MTAxIiwiaWF0IjoxNzM1MjY3ODY5LCJqdGkiOiI4NDVhZDMyNS1kMDE0LTQwMzItODIyZS04MzI5ZWQzNDRmYmQifQ.U9tz_pcIfDTG7gC5X9JXPXZnOZBhB2rPbeCHALGskcIobLJ-Jf4L7VfgI92w_ajiAPtEuyMIuESZbrjnRTg1vavPVCAOlr6UWEbzbyZYbaMhjqtJ4BSoZWc1Dk6WSB1YOq06PdpxzsympSwWsNT3BsDMFFvRa5EaXl8DW6LD6qEadIFteFTDwQ5n8qCBmJbzYWCB1-Xo8S6BVtoWQylJQCWcx44u2xk8x0M0fbqgSA5dpTroluCSoMLvFkRdCgNbhB05eJW1dkQw8ERiwN6E5owA6IsHCyqxdQnRQQS84cBMUeCKZTgEPvVf_E5UkQpWp7fKZiUlUGTAjZ14pSmrTA',
    },
    body: form
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Something went wrong.");
    })
    .then((response) => {
      res.send(response.data);
    })
    .catch((error) => console.error(error));
  
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
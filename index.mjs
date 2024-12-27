import FormData from 'form-data';
import fetch from 'node-fetch';
import fs from 'fs';

import express from 'express';
const app = express();

const url = "https://api.edenai.run/v2/workflow/9c7ef864-8d59-4ebf-87c6-3fde471dc10b/execution/"

async function getExecution(id, res) {
  const response = await fetch(`${url}/${id}`.replaceAll('//', '/'), {
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${process.env.TOKEN}`
    },
  })
  const result = await response.json();

  if (!result.content) result.content = {};
  if (!result.content.status) result.content.status = 'error';

  switch (result.content.status) {
    case 'succeded':
      res.send(result.content.result.results.image__background_removal);
      break;
    case 'processing': 
      setTimeout(() => getExecution(id, res), 5000);
      break
    default:
      res.send(result);

}

app.get('/', async (req, res) => {
  const form = new FormData();

  form.append('file', fs.createReadStream('./test-image.jpg'), 'test-image.jpg');

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      ...form.getHeaders(), // Add FormData headers
      'Authorization': `Bearer ${process.env.TOKEN}`
    },
    body: form
  })
    .then(response => response.json())
    .then(json  => getExecution(json.id, res))
});

app.get('/getExecution', async (req, res) => {
  getExecution(req.query.id, res)
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
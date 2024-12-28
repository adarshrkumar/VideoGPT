import FormData from 'form-data';

import request from 'request';
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
}

app.get('/', async (req, res) => {
  const form = new FormData();
  var fName = decodeURIComponent(req.query.url || 'default-image.png');

  if (!fs.existsSync('./temp')) fs.mkdirSync('./temp');

  if (fName === 'default-image.png') {
    fs.copyFileSync(`./default-image.png`, `./temp/${fName}`)
  }
  if (!fs.existsSync(fs.createWriteStream(`./temp/${fName}`))) {
    request(url).pipe(fs.createWriteStream(`./temp/${fName}`))
  }


  form.append('file', fs.createReadStream(`./temp/${fName}`), fName);

  await fetch(url, {
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

app.get('/base64Upload', async (req, res) => {
  var fPath = decodeURIComponent(req.query.path) || 'error';
  var path = fPath.replaceAll('/', '_')
  var content = req.query.b64content

  if (!fs.existsSync('./temp')) fs.mkdirSync('./temp');

  if (fName !== 'error') fs.writeFileSync(`./temp/${path}.png`, content, 'base64')

  res.json({status: 'success', message: `Wrote to file "${fPath}" please use that as the url param please`})
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
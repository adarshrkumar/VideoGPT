import RunwayML from '@runwayml/sdk';
import fetch from 'node-fetch';

import fs from 'fs';

import express from 'express';
const app = express();

import useErrorTemplate from './error.mjs';
import { url } from 'inspector';

async function getExecution(id, res, i) {
  const task = await client.tasks.retrieve(id);
  console.log(task);

  if (i > 60) {
    res.status(408).send(useErrorTemplate(408, `Session Timeout, please try again later.\nYou can get the execution again on its own by using the /getExecution endpoint with the id of the execution which is "${id}"`))
    return
  }

  // switch (result.content.status) {
  //   case 'succeded':
  //     res.send(result.content.result.results.image__background_removal);
  //     break;
  //   case 'processing': 
  //     setTimeout(() => getExecution(id, res, i++), 5000);
  //     break
  //   default:
      res.json(task);
  // }
}

app.get('/', async (req, res) => {

  // The env var RUNWAYML_API_SECRET is expected to contain your API key.
  const client = new RunwayML();
  
    const task = await client.imageToVideo.create({
      model: 'gen3a_turbo',
      promptImage: req.query.image_url,
      promptText: req.query.prompt,
    });
    res.json({id: task.id});

    // res.json(getExecution(task.id, res, 0))
});

app.get('/getExecution', (req, res) => {
  getExecution(req.query.id, res, 0)
});

app.get('/base64Upload', (req, res) => {
  var fPath = decodeURIComponent(req.query.path) || 'error';
  var path = fPath.replaceAll('/', '_')
  var content = req.query.b64content

  if (!fs.existsSync('./temp')) fs.mkdirSync('./temp');

  if (fName !== 'error') fs.writeFileSync(`./temp/${path}.png`, content, 'base64')

  res.json({status: 'success', message: `Wrote to file "${fPath}" please use that as the url param please`, url: `${req.protocol}//${req.host}/temp/${path}.png`})
});

app.get('/temp/:file', (req, res) => {
  if (!fs.existsSync(`/temp/${req.params.file}`)) {
    useErrorTemplate(404, `File not found`)
    return
  }

  res.sendFile(`/temp/${req.params.file}` , { root : '.' });
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
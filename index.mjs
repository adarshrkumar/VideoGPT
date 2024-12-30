import RunwayML from '@runwayml/sdk';
import fetch from 'node-fetch';

import fs from 'fs';

import express from 'express';
const app = express();

import useErrorTemplate from './error.mjs';

async function getExecution(id, res, i) {
  const task = await client.tasks.retrieve(id);
  res.json(task);
}

var storage = multer.diskStorage({
  destination: function (req, file, callback) {

    // Uploads is the Upload_folder_name
    callback(null, 'temp')
  },
  filename: function (req, file, callback) {
    fName = file.originalname
    callback(null, file.originalname)
  }
})

// Define the maximum size for uploading
// picture i.e. 1 MB. it is optional
const maxSize = 1000 * 1000 * 1000;

var upload = multer({
  storage: storage,
  limits: { fileSize: maxSize },
  fileFilter: function (req, file, callback) {

    // Set the filetypes, it is optional
    var filetypes = /jpeg|jpg|png|webp|gif/;
    var mimetype = filetypes.test(file.mimetype);

    var extname = path.extname(file.originalname).toLowerCase()
    extname = filetypes.test(extname);

    if (mimetype && extname) {
      fName = file.originalname
      return callback(null, fName);
    }

    callback('Error: File upload only supports the following filetypes - ' + filetypes, null);
  }
  // mypic is the name of file attribute
}).single('image');

app.get('/', (req, res) => {
  res.redirect('/generate');
})

app.get('/generate', async (req, res) => {
  // The env var RUNWAYML_API_SECRET is expected to contain your API key.
  const client = new RunwayML();
  
    const task = await client.imageToVideo.create({
      model: 'gen3a_turbo',
      promptImage: req.query.image_url,
      promptText: req.query.prompt,
    });
    res.json({id: task.id});
});

app.get('/getExecution', (req, res) => {
  getExecution(req.query.id, res)
});

app.get('/upload', (req, res) => {
  res.sendFile('/upload.html', { root: '.' });
});

app.post('/uploadFile', (req, res) => {
  // Error MiddleWare for multer file upload, so if any
  // error occurs, the image would not be uploaded!
  upload(req, res, function(err) {
    if(err) {
      // ERROR occurred (here it can be occurred due
      // to uploading image of size greater than
      // 1MB or uploading different file type)
      res.send(err)
    }
    else {
      // SUCCESS, image successfully uploaded
      // res.send(fName)
      var url = `/chat?`
      
      var hasParent = req.query.hasParent
      if (!!hasParent) url = `/upload?sucess=true&`
      
      url += `filelocation=temp-storage&name=${fName}`
      
      var p = req.query.p
      if (!!p) url += `&prompt=${p}`

      var t = req.query.t
      if (!!t) url += `&type=${t}`

      var isBulk = req.query.isBulk
      if (!!isBulk) url += `&isBulk=${isBulk}`
      
      res.redirect(url)
    }
  })
})

app.get('/temp/:file', (req, res) => {
  if (!fs.existsSync(`/temp/${req.params.file}`)) {
    useErrorTemplate(404, `File not found`)
    return
  }

  res.sendFile(`/temp/${req.params.file}` , { root : '.' });
});

app.get('*', (req, res) =>{
  var path = req.path
  if (path.startsWith('/')) path = path.slice(1)
  if (path.endsWith('/')) path = path.slice(0, -1)
  if (!path.includes('.')) path = `${path}.html`
  if (!fs.existsSync(`./${path}`)) {
    useErrorTemplate(404, `Page not found: ${path}`)
    return
  }
  res.sendFile(path, {root: '.'})
})

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
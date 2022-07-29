require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');

// Basic Configuration
const port = process.env.PORT || 3000;

let shorturlDB = [];
let urlError = { error: 'invalid url' };


app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


var urlencodedParser = bodyParser.urlencoded({ extended: false });
var urlVerify = (req, res, next) => {
  let url = req.body.url;
  if (url == undefined) {
    resstatus(400).json(urlError);
    return;
  }
  let urlParser;
  try {
    urlParser = new URL(url);
  } catch (error) {
    res.status(400).json(urlError);
    return;
  }

  const options = {
    all:true
  };
  dns.lookup(urlParser.host, options, 
    (err, address, family) => {
        if (err) {
          console.log(address, family);
          res.status(400).json(urlError);
        } else {
          next();
        }
    });
};
app.post('/api/shorturl', urlencodedParser, urlVerify, function(req, res) {
  let url = req.body.url;
  if (shorturlDB.includes(url)) {
    res.json({
      orig
  shorturlDB.push(url);
  res.json({
    original_url : url, 
    short_url : shorturlDB.length
  });
});

app.get('/api/shorturl/:short_url', function(req, res) {
  let short_url = Number(req.params.short_url);
  if (isNaN(short_url) || short_url < 1){
    res.status(400).json({"error":"Wrong format"});
    return;
  }
  short_url = short_url-1;
  if (shorturlDB[short_url] == undefined) {
    res.status(404).json({"error":"No short URL found for the given input"});
    return;
  }

  res.redirect(302, shorturlDB[short_url]);
});




app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

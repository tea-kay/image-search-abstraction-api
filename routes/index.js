var express = require('express');
var router = express.Router();
var fetch = require('isomorphic-fetch');
var mongoose = require('mongoose');

// const paginate = require("paginate-array");

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/recent-terms', {
  useMongoClient: true
})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/search/:term', function(req, res, next) {
  const BASE_URL = 'https://api.cognitive.microsoft.com/bing/v7.0/images/search'

  // Term.insert(
  //   new Term({
  //     term: req.params.term
  //   }));

  fetch(`${BASE_URL}/?q=${req.params.term}`, {
    headers: {
      'Ocp-Apim-Subscription-Key': process.env.AZURE_KEY_1
    }

  }).then((response) => {
    return response.json()
  }).then((results) => {
    var newValueArr = [];

    for(var i=0; i<results.value.length; i++) {
      var valueObj = {};
      var valueArr = results.value;

      valueObj.url = valueArr[i].contentUrl;
      valueObj.name = valueArr[i].name;
      valueObj.thumbnail = valueArr[i].thumbnailUrl;
      valueObj.context = valueArr[i].hostPageUrl;

      newValueArr.push(valueObj);
    }

    return res.send(newValueArr)
  })
})

router.get('recent/imagesearch', (req, res, next) => {

  res.send()
})

module.exports = router;

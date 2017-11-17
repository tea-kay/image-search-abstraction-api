var express = require('express');
var router = express.Router();
var fetch = require('isomorphic-fetch');
var mongoose = require('mongoose');
var Term = require('../model/term')
// const paginate = require("paginate-array");

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/recent-terms', {
  useMongoClient: true
})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('api/search/:term', function(req, res, next) {
  const BASE_URL = 'https://api.cognitive.microsoft.com/bing/v7.0/images/search'

  const newTerm = new Term({ term: req.params.term })

  newTerm.save(err => {
    if (err) return next(err)
    const newUrl = `${BASE_URL}/?q=${req.params.term}?offset=${req.query.offset}`;
    fetch(newUrl, {
      headers: {
        'Ocp-Apim-Subscription-Key': process.env.AZURE_KEY_1
      }
    }).then((response) => {
      return response.json()
    }).then((results) => {
      var newValueArr = results.value.map(({ contentUrl: url, name, thumbnailUrl: thumbnail, hostPageUrl: context }) => {
        return { url, name, thumbnail, context }
      })
      return res.send(newValueArr)
    })
  })
})

router.get('/imagesearch/', (req, res, next) => {

  Term.find({}, (err, result) => {
    var imageSearch = result.reduce((acc, term) => {
      var termObj = {};
      termObj['term'] = term['term']
      termObj['searched'] = term['createdAt']

      acc.push(termObj);

      return acc;
    }, [])
    return res.json(imageSearch);;
  })
})

module.exports = router;

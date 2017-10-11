const express = require('express');
const router = express.Router();

const Image = require('../modules/promises/imagePromises.js');

router.get('/:post_id', function(req, res){
  let postid = req.params.post_id;

  Image.fetchImageReadStreamByPostId(postid)
    .then(function(values){
      let data = values[0];
      let readstream = values[1];

      if(data && readstream){
        res.writeHead(200, {
          'Contnet-Type': res.contentType(data.filename[0]),
          'Content-Length': data.length
        });
        readstream.pipe(res);
        readstream.on('finish', function(){
          res.end();
        })
      }
      else{
        res.send('No-img');
      }
    })
    .catch(function(err){
      console.log(err);
      res.send('No-img');
    })
});

module.exports = router;

const express = require('express');
const router = express.Router();

const Image = require('../models/image.js');

router.get('/:post_id', function(req, res){
  let postid = req.params.post_id;

  Image.fetchImageReadStreamByPostId(postid, function(err, data, readstream){
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
});

module.exports = router;

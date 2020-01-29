const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const math = require('mathjs');

var fs = require('fs');
const WebSocket = require('ws');
var ws = new WebSocket("ws://192.168.100.246:9003");
const csvWriter = createCsvWriter({
  path: 'number_array.csv',
  header: [{id: 'array', title:'Image'}]
});
var count = 0;
module.exports = function (io){

  let nicknames = [];

  io.on('connection', socket =>{

    socket.on('new_img', data =>{
      // var vector = []
      // for (var i = 0; i < 640000; i++) {
      //   if(i==0 || i%4 ==0 ){
      //     vector.push(data.data[i]);
      //   }
      // }
      // vector = math.reshape(vector,[400,400]);
      // vector = math.resize(vector, [16,16]);
      // console.log(vector);
      try
          {
              // Decoding base-64 image
              // Source: http://stackoverflow.com/questions/20267939/nodejs-write-base64-image-file
              function decodeBase64Image(dataString)
              {
                var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
                var response = {};

                if (matches.length !== 3)
                {
                  return new Error('Invalid input string');
                }

                response.type = matches[1];
                response.data = new Buffer(matches[2], 'base64');

                return response;
              }

              // Regular expression for image type:
              // This regular image extracts the "jpeg" from "image/jpeg"
              var imageTypeRegularExpression      = /\/(.*?)$/;

              // Generate random string
              var crypto                          = require('crypto');
              var seed                            = crypto.randomBytes(20);
              var uniqueSHA1String                = crypto
                                                     .createHash('sha1')
                                                      .update(seed)
                                                       .digest('hex');

              //var base64Data = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAZABkAAD/4Q3zaHR0cDovL25zLmFkb2JlLmN...';

              var imageBuffer                      = decodeBase64Image(data);
              var userUploadedFeedMessagesLocation = '/home/eddy/Escritorio/database_tt/';

              var uniqueRandomImageName            = 'image-' + uniqueSHA1String;
              // This variable is actually an array which has 5 values,
              // The [1] value is the real image extension
              var imageTypeDetected                = imageBuffer
                                                      .type
                                                       .match(imageTypeRegularExpression);

              var userUploadedImagePath            = userUploadedFeedMessagesLocation +
                                                     uniqueRandomImageName +
                                                     '.' +
                                                     imageTypeDetected[1];

              // Save decoded binary image to disk

              try
              {
              require('fs').writeFile(userUploadedImagePath, imageBuffer.data,
                                      function()
                                      {
                                        console.log('DEBUG - feed:message: Saved to disk image attached by user:', userUploadedImagePath);
                                        var _entry = ""
                                        if(count == 0){
                                          _entry = "train|" + userUploadedImagePath;
                                        }else{
                                          _entry = "no_train|" + userUploadedImagePath;
                                        }
                                        count = count + 1
                                        ws.send(_entry);
                                        ws.close();
                                        ws = new WebSocket("ws://192.168.100.246:9003");
                                      });
              }
              catch(error)
              {
                  console.log('ERROR:', error);
              }

          }
          catch(error)
          {
              console.log('ERROR:', error);
          }
      // fs.writeFile('myfile.jpeg', imageBuffer , function (err) {
      //   if (err) return next(err)
      //     console.log('ok');
      // });


      //console.log((data.data[0]));
      //image_bin_values = math.reshape(data,160000);
      //console.log(image_bin_values);
      //   const records = [{array: data}];
      //   csvWriter
      //   .writeRecords(records)
      //   .then(()=> console.log('The CSV file was written successfully'));

    });
    socket.on('send message', function (data) {
      io.sockets.emit('new message', data);
    });


  });
}

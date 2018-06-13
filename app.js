var express = require('express');
var app = express();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');



app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(path.join(__dirname, 'uploads')));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'views/index.html'));
});


app.get('/download/*', function (req, res, next) {
    console.log(req.path);
    var name = req.path.substr(req.path.lastIndexOf('/') + 1);
    var filePath = path.join(__dirname, '/uploads'); // Or format the path using the `id` rest param
    var fileName = name; // The default name the browser will use
    console.log(filePath);
    console.log(fileName);
    console.log(name);
        if (fs.lstatSync(filePath+'/'+fileName).isDirectory()) {
        console.log('dir');
        }else{
            console.log('this is just fine');
        }
    res.download(path.resolve(filePath+'/'+ fileName),'mypic.jpg');    
});

app.post('/upload', function(req, res){

  // create an incoming form object
  var form = new formidable.IncomingForm();

  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = false;

  // store all uploads in the /uploads directory
  form.uploadDir = path.join(__dirname, '/uploads');

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function(field, file) {
      console.log('renaming file: \n');
      console.log('file: \n' + JSON.stringify(file));
    fs.rename(file.path, path.join(form.uploadDir, file.name),(error)=>{
        console.log('rename error' + error);
    });
  });

  form.on('field', function(name, value) {
      console.log('name+value');
});

  // log any errors that occur
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
      console.log('end');
        res.header("Access-Control-Allow-Origin", "*");
        res.send('{"url":"http://localhost:3030/download/viralimanjall-700x850.jpg"}');
  });

  // parse the incoming request containing the form data
  form.parse(req);

});


var server = app.listen(3030, function(){
  console.log('Server listening on port 3000');
});
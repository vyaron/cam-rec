const multipart = require("connect-multiparty");
const multipartMiddleware = multipart();
const path = require("path");
const os = require("os");
const fs = require("fs");

var express = require("express");
var app = express();
app.use(express.static("."));

app.get("/", function(req, res) {
  res.redirect("/index.html");
});


app.post("/", multipartMiddleware, function(req, res) {
  console.log("files", req.files.data.path);
  const fileName = `rec-${Date.now()}.webm`;
  // let location = path.join(os.tmpdir(), `rec-${Date.now()}.webm`);
  let location = path.join(__dirname, `uploads`, fileName);
  fs.rename(req.files.data.path, location, ()=>{
      console.log(`upload successful, file written to ${location}`);
      const url = `https://puki.ninja/uploads/${fileName}`
      res.end(`${url}`);
  });
});

app.listen(3000, function() {
  console.log("Example app listening on port 3000!");
});

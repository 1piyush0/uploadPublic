const express = require("express");
const fs = require("fs");
const multer = require('multer');

const app = express();
const port = 1337;


let data = fs.readFileSync('data.txt', 'utf8');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

app.post('/uploadFile', upload.single('data.txt'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({ message: 'File uploaded successfully', filename: req.file.filename });
});

// console.log(data)

 function pR(){
  var lines = data.split('\n');
  for (var line = 0; line < lines.length; line++) {
    lines[line]="R"+lines[line];
    // console.log(lines[line]);
  }
  return lines;
}

pR();


async function p2(){
  var lines = await pR(10);
  for (var line = 0; line < lines.length; line++) {
    lines[line]="2"+lines[line];
    console.log(lines[line]);
  }
}

p2();





app.post("/uploadFile", (req, res) => {
  const { date, time } = req.query;
  res.json(result);
});

app.listen(port, () => {
  console.log(`Server running at port : ${port}`);
});

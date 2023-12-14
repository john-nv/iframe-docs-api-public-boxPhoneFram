const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);


app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/', (req, res) => { res.sendFile(__dirname + './public') }); 


const PORT = process.env.PORT || 8002;
server.listen(PORT, () => {
  console.log(`=> http://localhost:${PORT}`);
});
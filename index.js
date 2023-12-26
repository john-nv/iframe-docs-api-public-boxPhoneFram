const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const engine = require('express-handlebars')
const path = require('path')

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   next();
// });

//template engine
app.engine('.hbs', engine.engine({
  extname: '.hbs',
}));

app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, '//resourses//views//'))

app.use(express.static(path.join(__dirname, 'public')))

// app.get('/', (req, res) => { res.sendFile(__dirname + './public') }); 

app.get('/docs', (req, res, next) => { return res.render('docs/index') })
app.get('/login', (req, res, next) => { return res.render('auth/login') })
app.get('/register', (req, res, next) => { return res.render('auth/register') })

app.get('/admin', (req, res, next) => { return res.render('admin') })
app.get('/home', (req, res, next) => { return res.render('user') })
app.get('/', (req, res, next) => { return res.render('user') })

const PORT = process.env.PORT || 8002;
server.listen(PORT, () => {
  console.log(`=> http://localhost:${PORT}`);
});
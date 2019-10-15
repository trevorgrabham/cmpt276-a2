const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;

const { Pool } = require('pg');
var pool = new Pool({connectionString: process.env.DATABASE_URL});


const app = express();
  app.use(express.static(path.join(__dirname, 'public')));
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');
  app.get('/', (req, res) => {
    var result = pool.query("SELECT * FROM tokimon", (error, result) => {
      if(result){console.table(result.rows);}
      var resRows = {rows: (result) ? result.rows : null};
      res.render('pages/tokimon', resRows);
    });
  });
  app.get('/newTokimon', (req, res) => res.render('pages/newTokimon'));
  app.post('/display/:name', (req, res) => {
    var name = req.params.name;
    var results = {"name": name}
    results.weight = 0;
    results.height = 0;
    results.fly = 0;
    results.fight = 0;
    results.fire = 0;
    results.water = 0;
    results.electric = 0;
    results.ice = 0;
    results.total = 0;
    res.render('pages/displayTokimon', results);
  });
  app.get('/add', (req, res) => res.render('pages/newTokimon'));
  app.post('/search', (req, res) => {
    var query = pool.query(`SELECT * FROM tokimon WHERE NAME=${req.body.search}`);
    if(query == null){
      res.render("/pages/error");
    }  else{
      res.render('pages/displayTokimon', query);
    }
  });
  app.post('/addNew', (req, res) => {
    var name = req.body.name;
    var weight = parseInt(req.body.weight);
    var height = parseInt(req.body.height);
    var fly = parseInt(req.body.fly);
    var fight = parseInt(req.body.fight);
    var fire = parseInt(req.body.fire);
    var water = parseInt(req.body.water);
    var electric = parseInt(req.body.electric);
    var ice = parseInt(req.body.ice);
    var total = fly + fight + fire + water + electric + ice;
    pool.query(`insert into tokimon values ('${name}', ${weight}, ${height}, ${fly},${fight},${fire},${water},${electric},${ice},${total})`);
    res.render('/pages/tokimon');
  });
  app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

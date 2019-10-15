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
    var res = pool.query("SELECT * FROM tokimon");
    if(res != null){
      var resRows = {'rows': res.rows};
    }
    else{
      var resRows = null;
    }
    res.render('pages/tokimon', resRows);
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
        // send error message
    }  else{
      res.render('pages/displayTokimon', query);
    }
  });
  app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

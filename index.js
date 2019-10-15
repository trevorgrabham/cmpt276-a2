const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;

const { Pool } = require('pg');
var pool = new Pool({connectionString: process.env.DATABASE_URL, ssl: true});


const app = express();
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false}));
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');
  app.get('/', async (req, res) => {
    try{
      const client = await pool.connect();
      const result = await client.query('select * from tokimon');
      if(result){console.table(result.rows);}
      var resRows = {rows: (result) ? result.rows : null};
      res.render('pages/tokimon', resRows);
      client.release();
    } catch(err) {
      console.error(err);
      res.send("Error " + err);
    }
  });
  app.get('/newTokimon', (req, res) => res.render('pages/newTokimon', {name: null}));

  app.get('/newTokimon/:name', (req, res) => {
    var name = req.params.name;
    var data = {name: name.slice(1,name.end)};
    res.render('pages/newTokimon', data);
  });
  app.get('/delete/:name',async (req, res) => {
    var name = req.params.name;
    name = name.slice(1,name.end);
    try{
      const client = await pool.connect();
      await client.query(`delete from tokimon where name='${name}'`);
      const result = await client.query('select * from tokimon');
      if(result){console.table(result.rows);}
      var resRows = {rows: (result) ? result.rows : null};
      res.render('pages/tokimon', resRows);
      client.release();
    } catch(err) {
      console.error(err);
      res.send("Error " + err);
    }
  });

  app.post('/display/:name', (req, res) => {
    var name = req.params.name;
    var results = {name: name}
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
    var query = pool.query(`SELECT * FROM tokimon WHERE NAME='${req.body.search}'`);
    if(query == null){
      res.render("/pages/error");
    }  else{
      res.render('pages/displayTokimon', query);
    }
  });
  app.post('/addNew', async (req, res) => {
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
    try{
      const client = await pool.connect();
      var test = await client.query(`select * from tokimon where name='${name}'`);
      console.log(test);
      if(test){
        client.query(`update tokimon set weight=${weight},height=${height},fly=${fly},fight=${fight},fire=${fire},water=${water},electric=${electric},ice=${ice},total=${total} where name='${name}'`);
      } else {
        client.query(`insert into tokimon values ('${name}', ${weight}, ${height}, ${fly},${fight},${fire},${water},${electric},${ice},${total})`);
      }
      const result = await client.query('select * from tokimon');
      if(result){console.table(result.rows);}
      var resRows = {rows: (result) ? result.rows : null};
      res.render('pages/tokimon', resRows);
      client.release();
    } catch(err) {
      console.error(err);
      res.send("Error " + err);
    }
  });
  app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

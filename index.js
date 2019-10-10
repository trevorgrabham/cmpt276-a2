const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;

const app = express();
  app.use(express.static(path.join(__dirname, 'public')));
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');
  app.get('/', (req, res) => res.render('pages/tokimon'));
  app.get('/newTokimon', (req, res) => res.render('pages/newTokimon'));
  app.post('/display', (req, res) => {
    var results = {name: "test"
      weight: 0
      height: 0
      fly: 0
      fight: 0
      fire: 0
      water: 0
      electric: 0
      ice: 0
      total: 0
    }
    res.render('pages/displayTokimon', results);
  });
  app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

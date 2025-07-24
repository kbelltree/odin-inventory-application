require('dotenv').config();

const express = require('express');
const app = express();
const index = require('./routes');
const path = require('node:path');
const viewDataManager = require('./controllers/viewDataManager');
const methodOverride = require('method-override');

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use(viewDataManager.setSizesAsLocals);

app.use('/', index);

app.use((req, res, next) => {
  res.status(404).send('404 - Page Not Found.');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('500 - Something went wrong.');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Inventory app - listening on port ${PORT}`);
});

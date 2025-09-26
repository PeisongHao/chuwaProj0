const express = require('express');
const connectDB = require('./db');
const productRouter = require('./controllers/product');

const app = express();

connectDB();
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api',productRouter);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

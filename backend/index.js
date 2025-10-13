const express = require('express');
const connectDB = require('./db');
const productRouter = require('./routers/product');
const authRouter = require('./routers/auth')
const errorHandlerMiddleware = require('./middlewares/errorHandler');
const app = express();

connectDB();
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api',productRouter);
app.use('/auth',authRouter);

app.use(errorHandlerMiddleware);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

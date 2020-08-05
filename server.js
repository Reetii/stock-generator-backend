const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');
const importStockSeedData = require('./bootstrap/stock-data');
const runStockCron = require('./background-processes/stockCron');
// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();
importStockSeedData();

// Route files

const stocks = require('./routes/stocks');


const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  //app.use(morgan('dev'));
}

// Enable CORS
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers

app.use('/api/v1/stocks', stocks);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
runStockCron();
const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  // server.close(() => process.exit(1));
});

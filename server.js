const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5001;

// Connect to Database
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Lab Gateway server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to connect to DB, server not started.', err);
  process.exit(1);
});

import express from 'express';
import setupSwagger from './swagger/swagger';
import restRouter from './rest/index';
import logger from '../src/logger/logger';

const app = express();
const PORT = process.env.PORT || 3000;

// Set up Swagger
setupSwagger(app);

// Use the rest router
app.use('', restRouter);

// Start the server
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`)
  console.log(`Server is running on port ${PORT}`);
});
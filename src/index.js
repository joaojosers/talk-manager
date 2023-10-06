const express = require('express');
const { app } = require('./app');

const router = express.Router();
const PORT = process.env.PORT || '3001';
const HTTP_OK_STATUS = 200;

app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.use('/api', router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

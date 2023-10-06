const express = require('express');
const { getAllTalkerManager, generateRandomToken, validateEmail } = require('./funcoes');

const app = express();
app.use(express.json());

// const router = express.Router();
const PORT = process.env.PORT || '3001';
const HTTP_OK_STATUS = 200;

app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get('/talker', async (req, res) => {
  console.log('LISTANDO TODOS OS PALESTRANTES.');
  const talkerManager = await getAllTalkerManager();
  if (talkerManager) return res.status(200).json(talkerManager);
  return res.status(404).json([]);
});

app.get('/talker/:id', async (req, res) => {
  const talkerId = Number(req.params.id);
  console.log(`BUSCANDO PALESTRANTE COM ID: ${talkerId}`);
  
  const talkerManager = await getAllTalkerManager();
  const talker = talkerManager.find((e) => e.id === talkerId);
  
  if (talker) {
    return res.status(200).json(talker);
  } 
  return res.status(404).json({
    message: 'Pessoa palestrante não encontrada',
  });
});

// const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

function validateLoginRequest(req, res, next) {
  const { email, password } = req.body;
  const errors = {
    'O campo "email" é obrigatório': !email || email.trim() === '',
    'O "email" deve ter o formato "email@email.com"': !validateEmail(email),
    'O campo "password" é obrigatório': !password || password.trim() === '',
    'O "password" deve ter pelo menos 6 caracteres': password.length < 6,
  };

  const errorMessages = Object.entries(errors)
    .filter(([_, condition]) => condition)
    .map(([_, message]) => message);

  if (errorMessages.length > 0) {
    return res.status(400).json({ message: errorMessages[0] });
  }

  next();
}

app.post('/login', validateLoginRequest, (req, res) => {
  const token = generateRandomToken();
  res.status(200).json({ token });
});
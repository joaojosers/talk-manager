const fs = require('fs').promises; // fs = file system
const { join } = require('path');
const express = require('express');

const app = express();
app.use(express.json());

const router = express.Router();
const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

const readTalkerManager = async () => {
  const path = './talker.json';

  try {
    const contentFile = await fs.readFile(join(__dirname, path), 'utf-8');
    return JSON.parse(contentFile);
  } catch (error) {
    return null;
  }
};

const getAllTalkerManager = async () => {
  const talkerManager = await readTalkerManager();
  return talkerManager;
};

app.get('/talker', async (req, res) => {
  console.log('LISTANDO TODOS OS PALESTRANTES.');
  const talkerManager = await getAllTalkerManager();
  if (talkerManager) return res.status(200).json(talkerManager);
  return res.status(404).json([]);
});

app.get('/talker/:id', async (req, res) => {
  // const talkerId = +req.params.id; // Obtém o ID da rota como um número inteiro
  const talkerId = Number(req.params.id); // Obtém o ID da rota como um número inteiro

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

const generateRandomToken = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 16; i += 1) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters[randomIndex];
  }
  return token;
};

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const token = generateRandomToken();
  console.log(email);
  console.log(password);
  res.status(200).json({ token });
});

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validateLoginRequest = (req, res, next) => {
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
};

router.post('/login', validateLoginRequest, (req, res) => {
  const token = generateRandomToken();
  res.status(200).json({ token });
});

app.use(express.json());
app.use('/api', router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = {
  getAllTalkerManager,
  // getChocolateById,
  // getChocolatesByBrand,
  // readCacauTrybeFile,
  // writeCacauTrybeFile,
  // createChocolate,
  // deleteChocolate,
};

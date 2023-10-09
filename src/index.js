const express = require('express');
const { 
  validateTalkerName, validateTalkerAge, validateTalkerTalk, validateTalkerRate, 
  validateTalkerWatchedAt, authenticateToken } = require('./middleware/validate'); 
  // #validateTalkerId

const { validateEmail, generateRandomToken, 
  readTalkerManager, writeTalkerManager, getAllTalkerManager } = require('./funcoes');

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
  if (!email) {
    return res.status(400).json({ message: 'O campo "email" é obrigatório' });
  }
  if (!password) {
    return res.status(400).json({ message: 'O campo "password" é obrigatório' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }
  if (!validateEmail(email)) {
    return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
  }

  next(); 
}

app.post('/login', validateLoginRequest, (req, res) => {
  const token = generateRandomToken();
  res.status(200).json({ token });
});

app.post('/talker', 
  authenticateToken, 
  validateTalkerName,
  validateTalkerAge,   
  validateTalkerTalk, 
  validateTalkerRate, 
  validateTalkerWatchedAt, 
  async (req, res) => {
    const { name, age, talk } = req.body;
    const talkers = await readTalkerManager();
    talkers.push({ id: talkers.length + 1, name, age, talk });
    await writeTalkerManager(talkers);
    res.status(201).json(talkers[talkers.length - 1]);
  });
// validateTalkerId
app.put('/talker/:id', authenticateToken, validateTalkerName, validateTalkerAge, 
  validateTalkerTalk, validateTalkerRate, validateTalkerWatchedAt, async (req, res) => {
    const { id } = req.params;
    const { name, age, talk } = req.body;
    const talkers = await readTalkerManager();
    const talkerIndex = talkers.findIndex((t) => t.id === parseInt(id, 10));

    if (talkerIndex === -1) {
      return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
    }
    const updatedTalker = {
      id: parseInt(id, 10),
      name,
      age,
      talk,
    };
    talkers[talkerIndex] = updatedTalker;
    await writeTalkerManager(talkers);

    res.status(200).json(updatedTalker);
  });

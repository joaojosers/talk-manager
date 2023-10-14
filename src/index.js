const express = require('express');
const { 
  validateTalkerName, validateTalkerAge, validateTalkerTalk, validateTalkerRate, 
  validateTalkerWatchedAt,
  authenticateToken } = require('./middleware/validate'); 
  // #validateTalkerId

const { validateEmail, generateRandomToken, readTalkerManager, writeTalkerManager, 
  getAllTalkerManager, filterTalkers, validateRateNumber } = require('./funcoes');

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

app.get('/talker/search', authenticateToken, async (req, res) => {
  const talkers = await readTalkerManager();
  const filteredTalkers = filterTalkers(req.query, talkers);
  if (req.query.q && filteredTalkers.length === 0) {
    return res.status(404)
      .json({ message: 'Nenhum palestrante encontrado com os critérios de pesquisa fornecidos' });
  }
  const w = req.query.rate && validateRateNumber(req.query.rate);
  if (w) {
    return res.status(w.status).json({ message: w.message });
  }
  return res.status(200).json(filteredTalkers);
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

// Importações e outras configurações...

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

app.delete('/talker/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const talkers = await readTalkerManager();
  const talkerIndex = talkers.findIndex((t) => t.id === parseInt(id, 10));
  
  if (talkerIndex === -1) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  
  // Remove o palestrante do array
  talkers.splice(talkerIndex, 1);
  
  // Escreve o arquivo atualizado no disco
  await writeTalkerManager(talkers);
  
  // Retorna resposta com status 204 (sem conteúdo)
  res.status(204).send();
});

// if (rate && (isNaN(rate) || rate < 1 || rate > 5 || !Number.isInteger(+rate))) {
//   return res.status(400).json({ message: 'O campo "rate" deve ser um número inteiro entre 1 e 5' });
// }
// if (rate < 1 || rate > 5 || !Number.isInteger(rate)) {
//   return resp.status(400)
//     .json({ message: 'O campo "rate" deve ser um número inteiro entre 1 e 5' });
// }
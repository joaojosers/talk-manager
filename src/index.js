const mysql = require('mysql2/promise');
const express = require('express');
const { 
  validateTalkerName, validateTalkerAge, validateTalkerTalk, validateTalkerRate, 
  validateTalkerWatchedAt,
  authenticateToken } = require('./middleware/validate'); 
  // #validateTalkerId

const { validateEmail, generateRandomToken, readTalkerManager, writeTalkerManager, 
  getAllTalkerManager, filterTalkersQueryDate, validateQueryParams,
  validateRateNumber } = require('./funcoes');

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
  const filteredTalkers = filterTalkersQueryDate(req.query, talkers);
  if (req.query.q && filteredTalkers.length === 0) {
    return res.status(404)
      .json({ message: 'Nenhum palestrante encontrado com os critérios de pesquisa fornecidos' });
  }
  const w = validateQueryParams(req);
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

const pool = mysql.createPool({
  host: process.env.MYSQL_HOSTNAME || 'localhost',
  port: process.env.MYSQL_PORT || '3306',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'password',
  database: process.env.MYSQL_DATABASE || 'TalkerDB',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

app.get('/talker/db', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM talkers');
    const talkers = rows.map((talker) => ({
      id: talker.id,
      name: talker.name,
      age: talker.age,
      talk: {
        watchedAt: talker.talk_watched_at,
        rate: talker.talk_rate,
      },
    }));
    res.status(200).json(talkers);
  } catch (error) {
    console.error('Error fetching data from DB:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
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

app.patch('/talker/rate/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { rate } = req.body;
  if (rate === undefined) {
    return res.status(400).json({ message: 'O campo "rate" é obrigatório' });
  }
  const error = validateRateNumber(rate);
  if (error) {
    return res.status(error.status).json({ message: error.message });
  }
  const talkers = await readTalkerManager();
  const talkerIndex = talkers.findIndex((t) => t.id === parseInt(id, 10));
  
  if (talkerIndex === -1) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  talkers[talkerIndex].talk.rate = Number(rate);
  await writeTalkerManager(talkers);
  return res.status(204).json();
});
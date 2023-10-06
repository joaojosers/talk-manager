const fs = require('fs').promises;
const { join } = require('path');
const express = require('express');

const app = express();
const router = express.Router();

app.use(express.json());

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

router.get('/talker', async (req, res) => {
  console.log('LISTANDO TODOS OS PALESTRANTES.');
  const talkerManager = await getAllTalkerManager();
  if (talkerManager) return res.status(200).json(talkerManager);
  return res.status(404).json([]);
});

router.get('/talker/:id', async (req, res) => {
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

module.exports = { app, router };

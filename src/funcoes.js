const fs = require('fs').promises;

const readTalkerManager = async () => {
  const path = 'src/talker.json';
  
  try {
    const contentFile = await fs.readFile(path, 'utf-8');
    return JSON.parse(contentFile);
  } catch (error) {
    return null;
  }
};
const writeTalkerManager = async (talkerManager) => {
  const path = 'src/talker.json';
  try {
    const contentFile = JSON.stringify(talkerManager, null, 2);
    await fs.writeFile(path, contentFile);
  } catch (error) {
    return null;
  }
};
const getAllTalkerManager = async () => {
  const talkerManager = await readTalkerManager();
  return talkerManager;
};
const generateRandomToken = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 16; i += 1) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters[randomIndex];
  }
  return token;
};

function validateEmail(email) {
  // Expressão regular para validar o formato do email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateDate(dateString) {
  const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  return dateRegex.test(dateString);
}

const filterTalkersRate = (rate, talkers) => talkers.filter((talker) =>
  talker.talk.rate === +rate);

const filterTalkersSearch = (q, talkers) => talkers.filter((talker) =>
  talker.name.toLowerCase().includes(q.toLowerCase()));

function filterTalkers(query, talkers) {
  const { q, rate } = query;
  let filter = talkers;
  if (q === undefined && rate === undefined) {
    return [];
  }
  if (q) {
    filter = filterTalkersSearch(q, filter);
  }
  if (rate) {
    filter = filterTalkersRate(rate, filter);
  }
  return filter;
}

function validateRateNumber(rate) {
  const n = Number(rate);
  if (Number.isNaN(n) || n < 1 || n > 5 || !Number.isInteger(n)) {
    return { status: 400, message: 'O campo "rate" deve ser um número inteiro entre 1 e 5' };
  }
}

module.exports = {
  getAllTalkerManager,
  generateRandomToken,
  validateEmail,
  validateDate,
  readTalkerManager,
  writeTalkerManager,
  filterTalkersRate,
  filterTalkersSearch,
  filterTalkers,
  validateRateNumber,
};

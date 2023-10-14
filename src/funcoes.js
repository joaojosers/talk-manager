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

const filterTalkersDate = (date, talkers) => talkers.filter((talker) =>
  talker.talk.watchedAt === date);

function queryParamUndefined(q, rate, date) {
  if (q === undefined && rate === undefined && date === undefined) {
    return true;
  }
}
  
function filterTalkers(query, talkers) {
  const { q, rate, date } = query;
  let filter = talkers;
  if (queryParamUndefined(q, rate, date)) {
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

function filterTalkersQueryDate(query, talkers) {
  const { date } = query;
  let filter = filterTalkers(query, talkers);
  if (date) {
    filter = filterTalkersDate(date, filter);
  }
  return filter;
}

function validateRateNumber(rate) {
  const n = Number(rate);
  if (Number.isNaN(n) || n < 1 || n > 5 || !Number.isInteger(n)) {
    return { status: 400, message: 'O campo "rate" deve ser um número inteiro entre 1 e 5' };
  }
}
function validateDateQuery(date) {
  if (!validateDate(date)) {
    return { status: 400, message: 'O parâmetro "date" deve ter o formato "dd/mm/aaaa"' };
  }
}

function validateQueryParams(req) {
  const w = req.query.rate && validateRateNumber(req.query.rate);
  if (w) {
    return w;
  }
  const d = req.query.date && validateDateQuery(req.query.date);
  if (d) {
    return d;
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
  validateDateQuery,
  validateQueryParams,
  filterTalkersQueryDate,
};

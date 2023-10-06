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

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/
function validateLoginRequest(req) {
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
  
  return errorMessages.length > 0 ? { status: 400, message: errorMessages[0] } : null;
}
  
module.exports = { getAllTalkerManager, generateRandomToken, validateEmail, validateLoginRequest };
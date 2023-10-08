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

module.exports = {
  getAllTalkerManager,
  generateRandomToken,
  validateEmail,
  validateDate,
  readTalkerManager,
  writeTalkerManager,
};
const fs = require('fs').promises; // fs = file system
const { join } = require('path');
const express = require('express');

const app = express();
app.use(express.json());

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

  // Verificar se o email e senha são válidos (não implementado neste exemplo)
  // Se as credenciais são válidas, gerar um token aleatório
  const token = generateRandomToken();
  console.log(token);
  res.status(200).json({ token });
});

const validateEmail = (email) => {
  // Expressão regular para validar o formato do email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const errors = {
    'O campo "email" é obrigatório': !email || email.trim() === '',
    'O "email" deve ter o formato "email@email.com"': !validateEmail(email),
    'O campo "password" é obrigatório': !password || password.trim() === '',
    'O "password" deve ter pelo menos 6 caracteres': password.length < 6,
  };

  const errorMessages = Object.entries(errors)
    .filter(([message, condition]) => condition)
    .map(([message]) => message);

  if (errorMessages.length > 0) {
    return res.status(400).json({ message: errorMessages[0] });
  }

  const token = generateRandomToken();
  res.status(200).json({ token });
});

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

app.post('/login', (req, res) => {
  const validationError = validateLoginRequest(req);

  if (validationError) {
    return res.status(validationError.status).json({
      message: validationError.message,
    });
  }

  const token = generateRandomToken();

  res.status(200).json({ token });
});

// app.post('/login', (req, res) => {
//   const { email, password } = req.body;
//   if (!email || email.trim() === '') {
//     return res.status(400).json({
//       message: 'O campo "email" é obrigatório',
//     });
//   }
//   if (!validateEmail(email)) {
//     return res.status(400).json({
//       message: 'O "email" deve ter o formato "email@email.com"',
//     });
//   }

//   if (!password || password.trim() === '') {
//     return res.status(400).json({
//       message: 'O campo "password" é obrigatório',
//     });
//   }

//   if (password.length < 6) {
//     return res.status(400).json({
//       message: 'O "password" deve ter pelo menos 6 caracteres',
//     });
//   }

//   const token = generateRandomToken();

//   res.status(200).json({ token });
// });

// const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
// function validateLoginRequest(req) {
//   const { email, password } = req.body;

//   if (!email || email.trim() === '') {
//     return {
//       status: 400,
//       message: 'O campo "email" é obrigatório',
//     };
//   }

//   if (!validateEmail(email)) {
//     return {
//       status: 400,
//       message: 'O "email" deve ter o formato "email@email.com"',
//     };
//   }

//   if (!password || password.trim() === '') {
//     return {
//       status: 400,
//       message: 'O campo "password" é obrigatório',
//     };
//   }

//   if (password.length < 6) {
//     return {
//       status: 400,
//       message: 'O "password" deve ter pelo menos 6 caracteres',
//     };
//   }

//   return null;
// }

// app.get('/tasks/:taskId', (req, res) => {
//   console.log('LISTANDO UMA UNICA TAREFA');
//   const { taskId } = req.params;
//   console.log(`BUSCANDO A TAREFA ${taskId}`);

// app.use('/user', userRouter); apenas para commit inicial
// const getChocolateById = async (id) => {
//   const cacauTrybe = await readCacauTrybeFile();
//   return cacauTrybe.chocolates
//     .filter((chocolate) => chocolate.id === id);
// };

// const getChocolatesByBrand = async (brandId) => {
//   const cacauTrybe = await readCacauTrybeFile();
//   return cacauTrybe.chocolates
//     .filter((chocolate) => chocolate.brandId === brandId);
// };

// const writeCacauTrybeFile = async (content) => {
//   const path = '/files/cacauTrybeFile.json';
//   try {
//     await fs.writeFile(join(__dirname, path), JSON.stringify(content));
//   } catch (error) {
//     return null;
//   }
// };

// const createChocolate = async (name, brandId) => {
//   const cacauTrybe = await readCacauTrybeFile(); // é uma chama externa
//   const newChocolate = { id: cacauTrybe.nextChocolateId, name, brandId };

//   cacauTrybe.chocolates.push(newChocolate);
//   cacauTrybe.nextChocolateId += 1
//   await writeCacauTrybeFile(cacauTrybe);

//   return newChocolate;
// };

// const deleteChocolate = async (id) => {
//   const cacauTrybe = await readCacauTrybeFile();
//   const chocolateExists = cacauTrybe.chocolates.some(
//     (chocolate) => chocolate.id === id,
//   );

//   if (chocolateExists) {
//     cacauTrybe.chocolates = cacauTrybe.chocolates.filter(
//       (chocolate) => chocolate.id !== id,
//     );

//     await writeCacauTrybeFile(cacauTrybe);
//     return true;
//   }

//   return false;
// };

module.exports = {
  getAllTalkerManager,
  // getChocolateById,
  // getChocolatesByBrand,
  // readCacauTrybeFile,
  // writeCacauTrybeFile,
  // createChocolate,
  // deleteChocolate,
};

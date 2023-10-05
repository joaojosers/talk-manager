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
  const talkerId = parseInt(req.params.id); // Obtém o ID da rota como um número inteiro

  console.log(`BUSCANDO PALESTRANTE COM ID: ${talkerId}`);
  
  const talkerManager = await getAllTalkerManager();
  
  const talker = talkerManager.find((talker) => talker.id === talkerId);
  
  if (talker) {
    return res.status(200).json(talker);
  } 
  return res.status(404).json({
    message: 'Pessoa palestrante não encontrada',
  });
});

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

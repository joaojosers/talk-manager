const fs = require('fs').promises; // fs = file system
const { join } = require('path');

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

// app.get('/talker', (req, res) => {
//     console.log('LISTANDO TODOS OS PALESTRANTES.');
//     if (talkmanager) return res.status(200).json(talkmanager);
//     return res.status(404).json([]);
//   });

// app.post('/tasks', (req, res) => {
//   console.log('CADASTRANDO UMA NOVA TAREFA');

//   const { body } = req;
//   const nextId = activities.length + 1;
//   activities.push({ id: nextId, ...body });

//   return res.status(201).json({ message: 'TAREFA CADASTRADA COM SUCESSO' });
// });

// app.get('/tasks/:taskId', (req, res) => {
//   console.log('LISTANDO UMA UNICA TAREFA');
//   const { taskId } = req.params;
//   console.log(`BUSCANDO A TAREFA ${taskId}`);

//   const task = activities.find((a) => a.id === Number(taskId));
//   if (!task) {
//     return res.status(404).json({ message: 'Tarefa não existe' });
//   }

//   return res.status(200).json(task);
// }); // req.params

// app.delete('/tasks/:taskId', (req, res) => {
//   console.log('DELETANDO UMA TAREFA');
//   const { taskId } = req.params;

//   const taskIndice = activities.findIndex((task) => task.id === Number(taskId));
//   activities.splice(taskIndice, 1);

//   return res.status(204).end();
// });

// app.put('/tasks/:taskId', (req, res) => {
//   console.log('atualizando tarefa');
//   const { description, status, priority } = req.body;
//   const { taskId } = req.params;

//   for (let i = 0; i < activities.length; i++) {
//     const activity = activities[i];

//     if (activity.id === Number(taskId)) {
//       activity.description = description;
//       activity.status = status;
//       activity.priority = priority;
//     }
//   }

//   return res.status(204).end();
// });

module.exports = app;

// no caso deixar a conexão aberta enquanto ainda estiver usando não evitaria esse
// tipo de erro no terminal?
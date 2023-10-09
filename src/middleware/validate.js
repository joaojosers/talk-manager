const validateTalkerName = (req, resp, next) => {
  const { name } = req.body;
  if (name === undefined) {
    return resp.status(400).json({ message: 'O campo "name" é obrigatório' });
  }
  if (name.length < 3) {
    return resp.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
  }
  next();
};

const validateTalkerAge = (req, resp, next) => { 
  const { age } = req.body;
  if (!age) {
    return resp.status(400).json({ message: 'O campo "age" é obrigatório' });
  }
 
  if (!Number.isInteger(age) || age < 18) {
    return resp.status(400)
      .json({ message: 'O campo "age" deve ser um número inteiro igual ou maior que 18' });
  }
  next();
};

const validateTalkerTalk = (req, resp, next) => { 
  const { talk } = req.body;
  if (!talk) {
    return resp.status(400).json({ message: 'O campo "talk" é obrigatório' });
  }
  next();
};

const validateTalkerRate = (req, resp, next) => {
  const { talk: { rate } } = req.body;
  if (rate === undefined) {
    return resp.status(400).json({ message: 'O campo "rate" é obrigatório' });
  }
  if (rate < 1 || rate > 5 || !Number.isInteger(rate)) {
    return resp.status(400)
      .json({ message: 'O campo "rate" deve ser um número inteiro entre 1 e 5' });
  }
  next();
};

const validateTalkerWatchedAt = (req, resp, next) => {
  const { talk: { watchedAt } } = req.body;
  const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!watchedAt) {
    return resp.status(400)
      .json({ message: 'O campo "watchedAt" é obrigatório' });
  }
  if (!dateRegex.test(watchedAt)) {
    return resp.status(400)
      .json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }
  next();
};

function authenticateToken(req, res, next) {
  const token = req.headers.authorization;
  
  if (!token) {
    return res.status(401).json({ message: 'Token não encontrado' });
  }
  if (token.length !== 16) {
    return res.status(401).json({ message: 'Token inválido' });
  }
  
  next();
}

// const validateTalkerId = (req, res, next) => {
//   const { id } = req.params;
//   if (!/^\d+$/.test(id)) {
//     return res.status(400).json({ message: 'Formato inválido para o ID da pessoa palestrante' });
//   }
//   next();
// };

module.exports = {
  validateTalkerName,
  validateTalkerAge,
  validateTalkerTalk,
  validateTalkerRate,
  validateTalkerWatchedAt,
  authenticateToken,
  // validateTalkerId,
};
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
  if (age < 18) {
    return resp.status(400).json({ message: 'A pessoa palestrante deve ser maior de idade' });
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
  if (!rate) {
    return resp.status(400).json({ message: 'O campo "rate" é obrigatório' });
  }
  if (rate < 1 || rate > 5) {
    return resp.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
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
  // Verifique se o token é válido aqui (pode ser um processo de validação real)
  // Se o token for inválido, retorne res.status(401).json({ message: 'Token inválido' });
  
  next();
}

module.exports = {
  validateTalkerName,
  validateTalkerAge,
  validateTalkerTalk,
  validateTalkerRate,
  validateTalkerWatchedAt,
  authenticateToken,
};
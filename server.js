const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

const users = [
  { id: 1, username: 'user1', password: 'password123' },
  { id: 2, username: 'user2', password: 'password456' }
];

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; 
  if (!token) return res.status(401).send('Access denied');

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).send('Forbidden');
    req.user = user;
    next();
  });
};

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username && u.password === password);

  if (!user) return res.status(401).send('Invalid credentials');

  const accessToken = jwt.sign({ id: user.id, username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

  res.json({ accessToken });
});

app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

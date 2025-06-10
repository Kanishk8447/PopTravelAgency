import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
app.get('/list', (req, res) => {
    res.json({ message: 'This is your API list!' });
  });
  

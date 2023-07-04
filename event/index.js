import express from 'express';
import cors from 'cors';
import axios from 'axios';
const app = express();
app.use(express.json());
app.use(cors());

app.post('/event', async (req, res) => {
  const event = req.body;
  console.log(event);
  await axios.post('http://localhost:3000/event', { event });
  await axios.post('http://localhost:5000/event', { event });
  await axios.post('http://localhost:5002/event', { event });

  res.send({ status: 'OK' });
});

app.listen(5001, () => {
  console.log('server created on port 5001');
});

import express from 'express';
import cors from 'cors';
import axios from 'axios';
const app = express();
app.use(express.json());
app.use(cors());
let events = [];
app.post('/event', async (req, res) => {
  const event = req.body;
  events.push(event);
  console.log(event);
  await axios.post('http://localhost:3001/event', { event });
  await axios.post('http://localhost:5000/event', { event });
  await axios.post('http://localhost:5002/event', { event });
  await axios.post('http://localhost:5003/event', { event });

  res.send({ status: 'OK' });
});

app.get('/event', (req, res) => {
  res.send(events);
});

app.listen(5001, () => {
  console.log('server created on port 5001');
});

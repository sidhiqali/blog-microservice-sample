import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();

app.use(express.json());
app.use(cors());
const posts = {};

app.post('/posts', async (req, res) => {
  const postId = Math.floor(new Date().valueOf() * Math.random());
  console.log(postId);
  const { title } = req.body;
  posts[postId] = {
    postId,
    title,
  };

  await axios.post('http://localhost:5001/event', {
    type: 'postCreated',
    data: {
      postId,
      title,
    },
  });

  res.status(201).send(posts[postId]);
});

app.post('/event', (req, res) => {
  const { type, data } = req.body.event;
  const { postId, title } = data;
  console.log('event created', type);
  console.log('postId:', postId);
  console.log('title:', title);
  res.send({});
});

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.listen(3001, () => {
  console.log('server started on port 3001');
});

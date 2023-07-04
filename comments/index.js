import express from 'express';
import cors from 'cors';
import axios from 'axios';
const app = express();

app.use(express.json());
app.use(cors());

const commentsById = {};

app.post('/:id/comments', async (req, res) => {
  const commentId = Math.floor(new Date().valueOf() * Math.random());
  const { comment } = req.body;
  const urlid = req.params.id;
  const comments = commentsById[urlid] || [];

  comments.push({
    id: commentId,
    comment,
    postId: urlid,
    status: 'pending',
  });
  commentsById[urlid] = comments;

  await axios.post('http://localhost:5001/event', {
    type: 'commentCreated',
    data: {
      id: commentId,
      comment,
      postId: urlid,
      status: 'pending',
    },
  });

  res.status(201).send(comments);
});

app.post('/event', async (req, res) => {
  const { type, data } = req.body.event;
  console.log('event created', type);

  if (type === 'commentModerated') {
    const { id, postId, status, comment } = data;
    const comments = commentsById[postId];
    const commentFetch = comments.find((comment) => {
      return comment.id === id;
    });
    commentFetch.status = status;

    await axios.post('http://localhost:5001/event', {
      type: 'commentUpdated',
      data: {
        id,
        postId,
        status,
        comment,
      },
    });
  }

  res.send({});
});

app.get('/:id/comments', (req, res) => {
  const id = req.params.id;
  res.send(commentsById[id] || []);
});

app.listen(5000, () => {
  console.log('server started on port 5000');
});

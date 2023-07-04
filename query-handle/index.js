import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();

app.use(express.json());
app.use(cors());
const posts = {};

app.get('/posts', (req, res) => {
  console.log(posts);
  res.send(posts);
});

app.post('/event', (req, res) => {
  const { type, data } = req.body.event;
  if (type === 'postCreated') {
    const { postId, title } = data;

    posts[postId] = {
      postId,
      title,
      comments: [],
    };
  }
  if (type === 'commentCreated') {
    const { id, comment, postId } = data;

    const post = posts[postId];
    post.comments.push({ id, comment });
  }
  res.send({});
});
console.log(posts);
app.listen(5002, () => {
  console.log('server started on port 5002');
});

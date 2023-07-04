import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();

app.use(express.json());
app.use(cors());
const posts = {};

const handleEvent = (type, data) => {
  if (type === 'postCreated') {
    const { postId, title } = data;

    posts[postId] = {
      postId,
      title,
      comments: [],
    };
  }
  if (type === 'commentCreated') {
    const { id, comment, postId, status } = data;

    const post = posts[postId];
    post.comments.push({ id, comment, status });
  }
  if (type === 'commentUpdated') {
    const { id, comment, status, postId } = data;
    const post = posts[postId];
    const commentFetch = post.comments.find((comment) => {
      return comment.id === id;
    });
    commentFetch.status = status;
    commentFetch.comment = comment;
  }
};

app.get('/posts', (req, res) => {
  console.log(posts);
  res.send(posts);
});

app.post('/event', (req, res) => {
  const { type, data } = req.body.event;
  handleEvent(type, data);
  res.send({});
});
console.log(posts);
app.listen(5002, async () => {
  console.log('server started on port 5002');

  const res = await axios.get('http://localhost:5001/event');

  for (let event of res.data) {
    console.log('processing event:', event.type);
    handleEvent(event.type, event.data);
  }
});

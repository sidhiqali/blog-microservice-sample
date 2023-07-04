import express from 'express';
import axios from 'axios';

const app = express();

app.use(express.json());

app.post('/event', async (req, res) => {
  const { type, data } = req.body.event;
  if (type === 'commentCreated') {
    const status = data.comment.includes('orange') ? 'rejected' : 'approved';

    await axios.post('http://localhost:5001/event', {
      type: 'commentModerated',
      data: {
        id: data.id,
        postId: data.postId,
        status,
        comment: data.comment,
      },
    });
  }
  res.send({});
});

app.listen(5003, () => {
  console.log('server started on port 5003');
});

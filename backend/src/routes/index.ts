import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    text: 'Hello',
    banana: 'there',
  });
});

export default router;

const express = require('../../express');

const router = express.Router();

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

router.get('/', (req, res) => {
  let responseText = 'Hello World!<br>';
  responseText += `<small>Requested at: ${req.requestTime}</small>`;
  res.send(responseText);
});

router.post('/', (req, res) => {
  res.send('post - orders');
});

router.get('/:id', (req, res) => {
  res.send('get - orders');
});

module.exports = router;

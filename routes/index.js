const { Router } = require('express');
const { createUser } = require('../controllers/user.controller');



const router = Router();  

router.get('/', (req, res) => {
  res.send('Hello World!');
})

router.get('/user/create', createUser)

module.exports = router;
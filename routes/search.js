const { Router } = require('express');
const { buscar } = require('../controllers/search');

const router = Router();

router.get('/:collection/:term', buscar);

module.exports = router;
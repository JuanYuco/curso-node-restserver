const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignIn } = require('../controllers/auth');
const { validations } = require('../middlewares/validations');

const router = Router();

router.post('/login',[
    check( 'email', 'El email es obligatorio' ).isEmail(),
    check('password', 'El contraseña es obligatoria').not().isEmpty(),
    validations
],login);

router.post('/google',[
    check( 'id_token', 'El id_token es necesario' ).not().isEmpty(),
    validations
], googleSignIn);

module.exports = router;
const { Router } = require('express');
const { check } = require('express-validator');
const { usersGet, usersPut, usersPost, usersDelete } = require('../controllers/users');
const { roleValid, existsEmail, existsUserById } = require('../helpers/dbValidators');
const { validations } = require('../middlewares/validations');

const router = Router();

router.get('/', usersGet );
router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check( 'id' ).custom( existsUserById ),
    check('role').custom( roleValid ),
    validations
], usersPut );

router.post('/',[
        check( 'name', 'El nombre es obligatorio').not().isEmpty(),
        check( 'password', 'El password es obligatorio y debe contener mínimo 6 caracteres').isLength({ min: 6 }),
        check( 'email', 'El correo no es válido' ).isEmail(),
        check('email').custom( existsEmail ),
        check('role').custom( roleValid ),
        validations
    ], usersPost );

router.delete('/:id',[
    check( 'id', 'No es un ID válido').isMongoId(),
    check( 'id' ).custom( existsUserById ),
    validations
], usersDelete );

module.exports = router;
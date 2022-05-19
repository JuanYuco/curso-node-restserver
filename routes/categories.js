const { Router } = require('express');
const { check } = require('express-validator');
const { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory } = require('../controllers/categories');
const { existsCategoryById } = require('../helpers/dbValidators');
const { validationJwt, validations, validationHaveRole } = require('../middlewares');

const router = Router();
router.get('/', getCategories);

router.get('/:id', [
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom( existsCategoryById ),
        validations
    ], getCategoryById );

router.post('/', [
        validationJwt,
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        validations
    ], createCategory);

router.put('/:id', [
        validationJwt,
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom( existsCategoryById ),
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        validations
    ], updateCategory);

router.delete('/:id', [
        validationJwt,
        validationHaveRole('ADMIN_ROLE'),
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom( existsCategoryById ),
        validations
    ], deleteCategory);

module.exports = router;
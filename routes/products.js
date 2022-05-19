const { Router } = require('express');
const { check } = require('express-validator');
const { getProducts, createProduct, getProductsById, updateProduct, deleteProduct } = require('../controllers/products');
const { validationJwt, validations, validationHaveRole } = require('../middlewares');
const { existsCategoryById, existsProductById } = require('../helpers/dbValidators');

const router = Router();
const defaultValidations = [
    validationJwt,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('category', 'No es un id valido').isMongoId(),
    validations,
    check('category').custom( existsCategoryById )
];

const productValidations = [
    check('id', 'No es un id valido').isMongoId(),
    validations,
    check('id').custom( existsProductById ),
    validations
];

router.get(
    '/',
    getProducts
);

router.get(
    '/:id',
    [
        check('id', 'No es un id valido').isMongoId(),
        validations,
        check('id').custom( existsProductById ),
        validations
    ],
    getProductsById
)

router.post(
    '/', /*ruta*/
    [
        ...defaultValidations, /*validaciones por medio de middleware */
        validations
    ], 
    createProduct /* Función del controlador */
);

router.put(
    '/:id',
    [
        ...defaultValidations,
        ...productValidations
    ],
    updateProduct
);

router.delete(
    '/:id',
    [
        validationJwt,
        ...productValidations,
        validationHaveRole('ADMIN_ROLE'),
        validations
    ],
    deleteProduct
)

module.exports = router;
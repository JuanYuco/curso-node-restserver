const validationJwt = require('../middlewares/validationJwt');
const validationHaveRole = require('../middlewares/validationRole');
const validations = require('../middlewares/validations');

module.exports = {
    ...validationJwt,
    ...validationHaveRole,
    ...validations
}
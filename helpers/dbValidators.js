const Role = require('../models/role');
const User = require('../models/user');

const roleValid = async( role = '' ) => {
    const existeRol = await Role.findOne({ name: role });
    if ( !existeRol ) {
        throw new Error(`El rol ${ role } no es valido`);
    }
}

const existsEmail = async( email = '' ) => {
    const existUser = await User.findOne({ email });
    if ( existUser ) {
        throw new Error(`El email ${ email } ya esta en uso`);
    }
}

const existsUserById = async( id ) => {
    const existUser = await User.findById(id);
    if ( !existUser ) {
        throw new Error(`El usuario de id ${ id } no existe`);
    }
}

module.exports = {
    roleValid,
    existsEmail,
    existsUserById
}
const { Category, Role, User, Product } = require('../models');

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

const existsCategoryById = async( id ) => {
    const existsCategory = await Category.findById( id );
    if ( !existsCategory ) {
        throw new Error(`La categoria de id ${ id } no existe`);
    }
}

const existsProductById = async( id ) => {
    const existsProducto = await Product.findById( id );
    if ( !existsProducto ) {
        throw new Error(`El producto con id ${ id }, no existe`);
    }
}

module.exports = {
    roleValid,
    existsEmail,
    existsUserById,
    existsCategoryById,
    existsProductById
}
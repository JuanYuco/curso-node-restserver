const { request, response } = require('express');
const { Product } = require('../models');

const getProducts = async( req = request, res = response ) => {
    const { start = 0, limit = 5 } = req.query;
    const query = { state: true };
    try {
        const [ products, total ] = await Promise.all([
            Product.find( query )
                    .populate('user', 'name')
                    .populate('category','name')
                    .skip( Number( start ) )
                    .limit( Number( limit ) ),
            Product.countDocuments(query)
        ]);

        res.json({
            total,
            products
        });
    } catch ( error ) {
        console.log(error);
        res.status(500).json(BadRequest);
    }
}

const getProductsById = async( req = request, res = response ) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id)
                                    .populate('user', 'name')
                                    .populate('category', 'name');
        
        res.json(product);
    } catch ( error ) {
        console.log(error);
        res.status(500).json(BadRequest);
    }
}

const createProduct = async( req = request, res = response ) => {
    const { name, price, category, description, available } = req.body;
    const { _id } = req.user;
    try {
        const productBd = await Product.findOne({ name });
        if ( productBd ) {
            return res.status(400).json({
                msg: `Ya existe un producto con el nombre ${ name }`
            });
        }

        const product = new Product({
            name,
            price,
            category,
            description,
            available,
            state: true,
            user: _id
        });

        await product.save();
        return res.status(201).json(product);
    } catch ( error ) {
        console.log(error);
        res.status(500).json(BadRequest);
    }
}

const updateProduct = async( req = request, res = response ) => {
    const { name, price, category, description, available } = req.body;
    const { id } = req.params;
    try {
        const productBd = await Product.findOne({ name });
        if ( productBd && productBd._id != id ) {
            return res.status(400).json({
                msg: `Ya existe un producto con el nombre ${ name }`
            });
        }

        const product = await Product.findByIdAndUpdate( id, {
            name,
            price,
            category,
            description,
            available
        });

        res.status(201).json(product);
    } catch ( error ) {
        console.log( error );
        res.status(500).json(BadRequest);
    }
}

const deleteProduct = async( req = request, res = response ) => {
    const { id } = req.params;
    try {
        await Product.findByIdAndUpdate( id, { state: false } );
        res.json({
            msg: `El producto con id ${ id } ha sido eliminado correctamente`
        });
    } catch ( error ) {
        console.log( error );
        res.status(500).json(BadRequest);
    }
}

const BadRequest = { msg: 'Ha ocurrido un error, por favor contacte con el administrador' };

module.exports = {
    getProducts,
    getProductsById,
    createProduct,
    updateProduct,
    deleteProduct
}
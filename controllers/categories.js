const { request, response } = require('express');
const { Category } = require('../models');

const msgInternalServerError = 'Ha ocurrido un error interno, Comuniquese con el administrador';

const getCategories = async ( req = request, res = response ) => {
    const { limit = 5, start = 0 } = req.query;
    const query = { state: true };

    try {
        const [ categories, total ] = await Promise.all([
            Category.find(query)
                    .populate('user', 'name')
                    .skip( Number( start ) )
                    .limit( Number( limit ) ),
            Category.countDocuments(query)
        ]);

        res.json({
            total,
            categories
        })
    } catch ( error ) {
        console.log(error);
        res.status(500).json({ msg:msgInternalServerError });
    }
}

const getCategoryById = async( req = request, res = response ) => {
    const { id } = req.params;
    try {
        const category = await Category.findById(id)
                            .populate('user', 'name');
        
        res.json(category);
    } catch ( error ) {
        console.log(error);
        res.status(500).json({ msg: msgInternalServerError });
    }
}

const createCategory = async (req = request, res = response) => {
    let { name } = req.body;
    name = name.toUpperCase();
    try {
        const categoryBd = await Category.findOne({ name });
        if (categoryBd) {
            return res.status(400).json({
                msg: `La categoria ${name} ya existe`
            });
        }

        const data = {
            name,
            user: req.user._id
        };

        const category = new Category(data);
        await category.save();

        res.status(201).json(category);
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:msgInternalServerError})
    }
}

const updateCategory = async ( req = request, res = response ) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const category = await Category.findByIdAndUpdate( id, { name: name.toUpperCase() } );
        res.status(201).json(category);
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:msgInternalServerError});
    }
}

const deleteCategory = async ( req = request, res = response ) => {
    const { id } = req.params;
    try {
        await Category.findByIdAndUpdate( id, { state: false } );
        res.status(200).json({ msg: 'Eliminado correctamente' });
    } catch ( error ) {
        console.log(error);
        res.status(500).json({msg:msgInternalServerError});
    }
}

module.exports = {
    getCategories,
    createCategory,
    getCategoryById,
    updateCategory,
    deleteCategory
}
const { response, request } = require("express");
const { User, Category, Product } = require("../models");
const { ObjectId } = require('mongoose').Types;

const collections = [
    'user',
    'category',
    'product',
    'role'
];

const defaultSearch = async( MogoElement = User, query = {}, term = '', res = response ) => {
    try {
        const isMongoId = ObjectId.isValid(term);
        if ( isMongoId ) {
            const element = await MogoElement.findById( term );
            return res.json({
                results: ( element ) ? [ element ] : []
            });
        }

        const element   = await MogoElement.find(query);
        res.json({
            results:  element
        });
    } catch ( error ) {
        console.log(error);
        res.status(500).json({
            msg: 'Ha ocurrido un error'
        });
    }
}

const searchUser = async( term = '', res = response ) => {
    const regex = new RegExp( term, 'i' );
    defaultSearch( 
        User,
        { 
            $or: [
                { name: regex },
                { email: regex }
            ],
            $and: [{state: true}]
        },
        term,
        res  
    );
}

const searchCategory = async( term = '', res = response ) => {
    const regex = new RegExp( term, 'i' );
    defaultSearch(
        Category,
        { 
            $and: [
                {name: regex},
                {state: true}
            ]
        },
        term,
        res
    );
}

const searchProduct = async( term = '', res = response ) => {
    const regex = new RegExp( term, 'i' );
    defaultSearch(
        Product,
        { 
            $and: [
                {name: regex},
                {state: true}
            ]
        },
        term,
        res
    );
}

const buscar = ( req = request, res = response ) => {
    const { collection, term } = req.params;

    if ( !collections.includes( collection ) ) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${ collections }`
        })
    }

    switch ( collection ) {
        case collections[0]:
            searchUser( term, res );
            break;
        case collections[1]:
            searchCategory( term, res );
            break;
        case collections[2]:
            searchProduct( term, res );
            break;
        default:
            res.status(500).json({
                msg: 'No disponible'
            });
    }
}

module.exports = {
    buscar
}
const mongooose = require('mongoose');

const dbConnection = async() => {
    try {
        await mongooose.connect( process.env.MONGODB_CNN);

        console.log('Database is connected');
    } catch ( error ) {
        console.log(error);
        throw new Error('Error a la hora de iniciar a la base de datos')
    }
}

module.exports = {
    dbConnection
}
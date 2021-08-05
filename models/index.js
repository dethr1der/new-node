const dbConfig = require("../config/dbconfig.js");
const Sequelize = require("sequelize");
const mysql = require('mysql2/promise');

initialize(); //Maybe it is not the best way but definitely one of the fastest :))

const db = {};

async function initialize() {
    const connectionObj = await mysql.createConnection({
        host: dbConfig.HOST,
        user: dbConfig.USER,
        password: dbConfig.PASSWORD
    });
    await connectionObj.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.DB}\`;`);


    const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        operatorsAliases: false,
    });


    db.Sequelize = Sequelize;
    db.sequelize = sequelize;
    db.sequelize.sync();

    db.movies = require("./Movies.js")(sequelize, Sequelize);
    db.actors = require("./Actors.js")(sequelize, Sequelize);
    db.moviesActors = require("./MoviesActors.js")(sequelize, Sequelize);

    //Movies & Actors M:M relation
    db.movies.hasMany(db.moviesActors, {as: "movieActors", foreignKey: 'movieId', sourceKey: 'id'});
    db.actors.hasMany(db.moviesActors, {as: "actorMovies", foreignKey: 'actorId', sourceKey: 'id'});
    db.movies.belongsToMany(db.actors, {through: 'movies_actors', as: "actors"});
    db.actors.belongsToMany(db.movies, {through: 'movies_actors', as: "movies"});
}

module.exports = db;
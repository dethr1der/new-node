const db = require("../models");
const {Op} = require("sequelize");
const moviesParser = require('../moviesparser');
const {validationResult} = require('express-validator');

class MoviesController {

    async insertOne(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array().map((error, index) => {
                    return errors[index] = error.msg;
                })
            });
        }
        const checkMovie = await db.movies.findOne({where: {title: req.body.title}});
        if (checkMovie !== null) {
            return res.status(400).json({message: `Sorry, but movie with title '${req.body.title}' is already exist`});
        }
        if (Array.isArray(req.body.actors) && req.body.actors.length <= 0 || typeof req.body.actors === "string" && req.body.actors.trim() === '') {
            return res.status(400).json({message: `Sorry but movie must have at least one actor`})
        }
        const movieObj = {title: req.body.title, released: req.body.released, format: req.body.format}
        const actorArray = req.body.actors;
        const singleActor = {};
        const moviesActorsAssociation = [];
        const movieCreate = await db.movies.create(movieObj);

        if (Array.isArray(actorArray)) {
            await Promise.all(actorArray.map(async (actor, index) => {
                return actorArray[index] = await db.actors.findOrCreate({where: {name: actor}});
            }));
            actorArray.map((actors, index) => {
                moviesActorsAssociation.push({movieId: movieCreate.id, actorId: actors[0].id});
                return actorArray[index] = actors[0];
            });
            await db.moviesActors.bulkCreate(moviesActorsAssociation);
            movieCreate.dataValues.actors = actorArray;

        } else {
            const checkActor = await db.actors.findOne({where: {name: req.body.actors}});
            if (checkActor === null) {
                singleActor.name = req.body.actors;
                const actorsCreate = await db.actors.create(singleActor);
                await db.moviesActors.create({movieId: movieCreate.id, actorId: actorsCreate.id});
                movieCreate.dataValues.actors = actorsCreate;
            } else {
                await db.moviesActors.create({movieId: movieCreate.id, actorId: checkActor.id});
                movieCreate.dataValues.actors = checkActor;
            }
        }
        return res.status(200).json({
            message: `Movie with title ${req.body.title} has been created successfully!`,
            movieCreate
        });
    }

    async import(req, res) {
        const file = req.files;
        const movies = await moviesParser(file.import.tempFilePath);

        const moviesArray = [];
        let actorsArray = [];

        movies.forEach((movie, index) => {
            moviesArray.push({title: movie.title, released: movie.released, format: movie.format});
            actorsArray.push(movie.actors);
        });

        let actorsCreate = await Promise.all(actorsArray.map(async (actors, index) => {
            return actorsArray[index] = await Promise.all(actors.map(async (actor, actorIndex) => {
                return actors[actorIndex] = await db.actors.findOrCreate({
                    where: {name: actor},
                    attributes: ['id']
                });
            }));
        }));

        const moviesSave = await db.movies.bulkCreate(moviesArray);

        const Association = await Promise.all(actorsCreate.map(async (actors, actorsIndex) => {
            return await Promise.all(actors.map(async (actor, index) => {
                return actor[index] = await db.moviesActors.create({
                    movieId: moviesSave[actorsIndex].id,
                    actorId: actor[0].id
                });
            }));
        }));

        res.status(200).send({message: "Films has been exported"});
    }

    async show(req, res) {
        const sort = req.query.sort || 'id';
        const actorName = req.query.actor || '';
        const movieTitle = req.query.title || '';
        const order = req.query.order || 'ASC'

        const movies = await db.movies.findAll({
            include: [{model: db.actors, as: "actors", where: [{name: {[Op.like]: `%${actorName}%`}}]}],
            where: {[Op.or]: [{title: {[Op.like]: `%${movieTitle}%`}}]},
            order: [[sort, order]],
        });
        return res.json(movies);
    }

    async showOneById(req, res) {
        const movieId = req.params.id;
        console.log(movieId);
        const movie = await db.movies.findOne({where: {id: movieId}, include: [{model: db.actors, as: "actors"}]})
        if (movie !== null) {
            return res.json(movie);
        } else {
            return res.json({message: "There is no any movies with this id"});
        }
    }

    async delete(req, res) {
        const movieId = req.params.id;
        const checkExistence = await db.movies.findOne({where: {id: movieId}, attributes: ['id']});
        if (checkExistence !== null) {
            db.movies.destroy({where: {id: movieId}});
            db.moviesActors.destroy({where: {movieId: movieId}});
            return res.json({message: `Movie with id: ${movieId} has been deleted successfully`});
        } else {
            return res.json({message: `Movie with id: ${movieId} doesn't exist`});
        }
    }

}

module.exports = new MoviesController();
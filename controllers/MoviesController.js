const db = require("../models");
const {Op} = require("sequelize");
const fileHelper = require('../fileParser');

class MoviesController {

    async insertOne(req, res) {
        const movieObj = {title: req.body.title, released: new Date(req.body.released), format: req.body.format}
        const actorArray = req.body.actors;
        const singleActor = {};
        const moviesActorsAssociation = [];
        const movieCreate = await db.movies.create(movieObj);
        if (Array.isArray(actorArray)) {
            const checkAuthors = await db.actors.findAll({where: {[Op.and]: {name: actorArray}}});
            if (checkAuthors.length === 0) {
                actorArray.map((actor, index) => {
                    actorArray[index] = {name: actor};
                });
                const actorsCreate = await db.actors.bulkCreate(actorArray);

                actorsCreate.map((actor, index) => {
                    moviesActorsAssociation.push({movieId: movieCreate.id, actorId: actor.id});
                });
                await db.moviesActors.bulkCreate(moviesActorsAssociation);
                movieCreate.dataValues.actors = actorsCreate;
            } else {
                checkAuthors.map((actor, index) => {
                    moviesActorsAssociation.push({movieId: movieCreate.id, actorId: actor.id});
                });
                await db.moviesActors.bulkCreate(moviesActorsAssociation);
                movieCreate.dataValues.actors = checkAuthors;
            }
        } else {
            const checkActor = await db.actors.findOne({where: {name: req.body.actors}});
            console.log(checkActor);
            if (checkActor === null) {
                singleActor.name = req.body.actors;
                console.log(singleActor);
                const actorsCreate = await db.actors.create(singleActor);
                await db.moviesActors.create({movieId: movieCreate.id, actorId: actorsCreate.id});
                movieCreate.dataValues.actors = actorsCreate;
            } else {
                await db.moviesActors.create({movieId: movieCreate.id, actorId: checkActor.id});
                movieCreate.dataValues.actors = checkActor;
            }
        }
        return res.json(movieCreate);
    }

    async import(req, res) {
        const file = req.files;
        console.log(file);
        const movies = await fileHelper(file.import.tempFilePath);
        const moviesArray = []
        let actorsArray = [];
        movies.forEach((movie, index) => {
            moviesArray.push({title: movie.title, released: movie.released, format: movie.format});
            actorsArray.push(movie.actors);
        });
        actorsArray = actorsArray.map((actors, index) => {
            return actorsArray[index] = actors.map((actor, actorIndex) => {
                return actors[actorIndex] = {name: actor};
            });
        });
        const moviesSave = await db.movies.bulkCreate(moviesArray);
        //SQL query in forEach() dangerous but I don't have another idea :(((


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
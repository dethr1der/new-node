module.exports = (sequelize, Sequelize) => {
    const MoviesActors = sequelize.define("movies_actors", {
        movieId: {
            type: Sequelize.INTEGER,
            references: {
                model: 'movies',
                key: 'id',
                allowNull: false
            },
        },
        actorId: {
            type: Sequelize.INTEGER,
            references: {
                model: 'actors',
                key: 'id',
                allowNull: false
            },
        },
    });

    return MoviesActors;
};
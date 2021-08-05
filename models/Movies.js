module.exports = (sequelize, Sequelize) => {
    const Movie = sequelize.define("movies", {
        title: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        released: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        format: {
            type: Sequelize.STRING
        },
    });

    return Movie;
};
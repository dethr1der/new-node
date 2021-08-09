module.exports = (sequelize, Sequelize) => {
    const Movie = sequelize.define("movies", {
        title: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        released: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        format: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    });

    return Movie;
};
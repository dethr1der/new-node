module.exports = (sequelize, Sequelize) => {
    const Actors = sequelize.define("actors", {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        }
    });

    return Actors;
};
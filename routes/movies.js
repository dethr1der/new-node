const express = require("express");
const router = express.Router();
const moviesController = require('../controllers/MoviesController');

//Create film endpoint

router.post('/movies', moviesController.insertOne)

router.get('/movies/import', (req, res, next) => {
    res.render('import.hbs', {title: 'Movies - Import page'});
});
router.post('/movies/import', moviesController.import)

router.get('/movies', moviesController.show)

router.get('/movies/:id', moviesController.showOneById)

router.delete('/movies/:id', moviesController.delete)


module.exports = router;


const express = require("express");
const router = express.Router();
const moviesController = require('../controllers/MoviesController');
const {body, oneOf} = require('express-validator')
const db = require('../models');

router.post('/movies', [
    body('title', "Movie can't exist without title").exists().trim().isLength({min: 1}).withMessage("Title must consist at least 1 character"),
    body('released', "Movie can't exist without date of release").exists().trim().isInt({
        min: 1850,
        max: new Date().getFullYear()
    }).withMessage(`Year of release must be a number from 1850 to ${new Date().getFullYear()}`),
    body('format', "Format can't be empty").not().isEmpty().trim().isLength({min: 2}).withMessage('Format must contain at least 2 symbols'),
], moviesController.insertOne);

router.get('/movies/import', (req, res, next) => {
    res.render('import.hbs', {title: 'Movies - Import page'});
});
router.post('/movies/import', moviesController.import)

router.get('/movies', moviesController.show)

router.get('/movies/:id', moviesController.showOneById)

router.delete('/movies/:id', moviesController.delete)


module.exports = router;


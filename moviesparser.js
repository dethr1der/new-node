const fs = require('fs').promises;
const matchRows = rows => field => rows.match(new RegExp(`(${field}\\:\\s[\\-\\w\\d\\,\\: ]+)`, 'gi'));
const prepareRows = (field, rows) => rows.map(str => str.replace(`${field}: `, ''));

const Field = {
    Title: 'Title',
    ReleaseYear: 'Release Year',
    Format: 'Format',
    Stars: 'Stars',
}

async function run(fileLoaded) {
    const file = await fs.readFile(fileLoaded, 'utf-8');
    const match = matchRows(file)
    const titleRows = prepareRows(Field.Title, match(Field.Title));
    const releaseRows = prepareRows(Field.ReleaseYear, match(Field.ReleaseYear));
    const formatRows = prepareRows(Field.Format, match(Field.Format));
    const starsRows = prepareRows(Field.Stars, match(Field.Stars));
    const length = Math.min(titleRows.length, releaseRows.length, formatRows.length, starsRows.length);
    const movies = [];

    for (let i = 0; i < length; i++) {
        const movie = {};

        movie.title = titleRows[i];
        movie.released = releaseRows[i];
        movie.format = formatRows[i];
        movie.actors = starsRows[i].split(', ');

        movies.push(movie);
    }
    return movies;
}

module.exports = run;
<h1>Movies API project</h1>
<h3>To launch project via Docker:</h3>
<ol>
<li>Install docker and all dependencies</li>
<li>Follow next steps: 
<ul>
<li>Clone this project from this repo</li>
<li>cd the project from the folder where you've cloned</li>
<li>In cli run the command "docker network create nodenet"</li>
<li>Then run command "docker compose up"</li>
</ul>
</li>
</ol>
<p><strong>After all this manipulations wait until project will be composed and test it!</strong></p>
<h3>To launch the project locally:</h3>
<ol>
<li>Install NodeJS v14.16 or greater if not installed</li>
<li>Install MySQL if not installed</li>
<li>Clone project from this repo</li>
<li>Rename file dbConfig.example.js to just dbconfig.js and change all required field like in example</li>
<li>run "npm install" command to install all dependencies</li>
<li>Then launch project using commands "npm run start" for live or "npm run start-dev" for development</li>
</ol>
<h3>Routes structure</h3>
<ol>
<li>In browser GET /api/v1/movies/import - to open import web interface</li>
<li>In browser POST /api/v1/movies/import - to import movies from file</li>
<li>POST /api/v1/movies - to create movie</li>
<li>GET /api/v1/movies - to watch the list of movies you can use additional query parameters for:
<ul>
<li>
/api/v1/movies?sort=title - sorting by title in alphabetical order
</li>
<li>
/api/v1/movies?name=Cool Actor - searching movie by author 
</li>
<li>
/api/v1/movies?title=UFO - searching movie by title 
</li>
<li>
/api/v1/movies?order=DESC - changing order style 
</li>
</ul>
</li>
<li>GET /api/v1/movies/1 - to search movie by its id</li>
<li>DELETE /api/v1/movies/1 - to delete movie by its id</li>
</ol>
<h3>Libraries used in project</h3>
<ol>
<li>express</li>
<li>express-router</li>
<li>express-fileupload</li>
<li>hbs - has been used like a views engine</li>
<li>mysql2</li>
<li>nodemon</li>
<li>sequelize - Database ORM</li>
</ol>
<h3>Special thanks to htndev (Alexandr Vanilchuk) for help with RegExp in moviesparser.js</h3>



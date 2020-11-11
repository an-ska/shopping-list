## Available scripts

In the `server` directory, you can run:

### `npm install`

Installs all needed dependencies to run the app.

### `npm start`

Runs the server in the development mode.<br />
Open [http://localhost:5000](http://localhost:5000) to view it in the browser.

### `npm test`

Launches <a href="https://www.cypress.io/">Cypress</a> that runs e2e tests in a unique interactive runner enabling
to see commands as they execute while also viewing the application under test.

## Deployments

Backend part is deployed on <a href="https://www.heroku.com/">Heroku</a>.<br />
Backend part deployment steps:

from the root directory:

1. `cd server`
2. `heroku login`
3. `git add .`
4. `git commit -m 'commit message'`
5. `cd ..`
6. `git subtree push --prefix server heroku master`

    Please note that I have decided to keep two projects (for frontend and backend) in one repository. Apparently, Heroku expects single project in single repository. For example it looks for package.json in the root directory. In my particular case it won't find it as I have two subdirectories each with its own package.json. As I want to deploy to Heroku only backend, I need to push to Heroku only the server subdirectory of this repository. To achieve that command number 6 needs to be executed.

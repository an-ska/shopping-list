This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the `client` directory, you can run:

### `yarn install`

Installs all needed dependencies to run the app.

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn lint`

Outputs all ESlint errors in the `src` directory.

### `yarn format`

Formats all files according to Prettier rules in the `client` directory but `node_modules`.


## Deployments

Frontend part is deployed on [Netlify](https://www.netlify.com/").<br />
Frontend part deployment steps:

from the root directory:

1. `cd client`
2. `yarn build`
3. `netlify login`
4. `netlify deploy` (publish directory: `./build`)

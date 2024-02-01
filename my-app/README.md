# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Structure

.
├── README.md
├── package-lock.json
├── package.json
├── jsconfig.json               # Config a route to src folder
├── test.txt                    # A simple example for importing a list of books
├── public
│   ├── index.html              # Main html file
│   ├── logo.png
│   └── ...
├── src
|   ├── main.scss               # Common styles
│   ├── index.js                # Entry point
│   ├── index.scss
│   ├── App.js
│   ├── assets
│   ├── files
│   ├── utils
│   ├── components
│   │   ├── MainPage.js
│   │   ├── connection
│   │   │   ├── Start.js
│   │   │   ├── Login.js
│   │   │   └── SignIn.js
│   │   └── home
│   │       ├── AppPage.js
│   │       ├── NavBar.js
│   │       ├── logo.png
│   │       └── pages
│   │           ├── Home.js
│   │           ├── HistoryPage.js
│   │           └── Book.js
│   ├── reportWebVitals.js
│   └── setupTests.js
.

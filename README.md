# Asset Checker
Simple tool to check assets assigned to you in Fresh Service app. It also allows you to check when you can replace or buyout Macbook (based on lease time).

# New Features!
2019-01-10
  - Displaying 'Time to replacement' and 'Time to buyout' for Macbooks
  - Small UI redesign

### Tech
Asset Checker uses a number of open source projects to work properly:

* [Node.js](https://nodejs.org/en/) - Entire app build upon this
* [Express](https://expressjs.com/) - fast node.js network app framework
* [PUG](https://pugjs.org) - template engine
* [Semantic UI](https://semantic-ui.com) - UI framework
* [Moment](https://momentjs.com/) - date-time related package
* [Axios](https://github.com/axios/axios) - promise based HTTP calls
* [DotENV](https://github.com/motdotla/dotenv) - for handling environmental variables
* And others..

### Installation
Simply...
```sh
$ git clone this-repo
```
then...
```sh
$ npm install
```
to install all dependencies.
Then you need to setup env variables. To do so copy `.env.sample` to `.env` file:
```sh
$ cp .env.sample .env
```
and fill .env with needed tokens and stuff.

### Running localy
Just simply:
```sh
$ npm run devn
```
which will start development enviroment using Nodemon (You don't have to restart project each time you made a change in it). To force restart simply:
```sh
$ rs
```
License
----

MIT
**Free Software, Hell Yeah!**

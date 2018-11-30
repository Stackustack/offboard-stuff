const numeral   = require('numeral');

const keepHerokuFromIdling = (interval) => {
    const intervalInMs = numeral(interval).value()*1000

    setInterval(function () {
        http.get("http://offboard-stuff.herokuapp.com/");
    }, intervalInMs)
}

module.exports = {
    keepHerokuFromIdling
}
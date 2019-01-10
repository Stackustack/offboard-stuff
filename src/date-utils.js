const moment = require('moment');

const standarizeDate = (date) => {
    const standarizedDate = moment(date)

    return standarizedDate
}

module.exports = {
    standarizeDate
}
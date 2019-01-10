const moment = require('moment');
const _ = require('lodash')
const {
    standarizeDate
} = require('./date-utils')

const prepareCanBeReplacedField = (data) => {
    if (_.has(data, "leaseStartDate")) {
        const endDate = standarizeDate(data.leaseStartDate).add(24, "months")
        
        return createCanBeReplacedMessage(endDate)
    }

    if (_.has(data, "leaseEndDate")) {
        const endDate = standarizeDate(data.leaseEndDate)
        
        return createCanBeReplacedMessage(endDate)
    }

    return "Woops, some problem occured."
}

const prepareCanBeBoughtField = (data) => {
    if (_.has(data, "leaseStartDate")) {
        const endDate = standarizeDate(data.leaseStartDate).add(27, "months")
        
        return createCanBeBoughtMessage(endDate)
    }

    if (_.has(data, "leaseEndDate")) {
        const endDate = standarizeDate(data.leaseEndDate)
        const boughtDate = endDate.clone().add(3, "months")
        
        return createCanBeBoughtMessage(boughtDate)
    }

    return "Woops, some problem occured."
}

const createCanBeReplacedMessage = (endDate) => {
    const nowDate = moment()

    if (nowDate > endDate) {
        return {
            replace: true,
            message: "Get a new Macbook now! Contact Support!"
        }
    } else {
        const timeDifference = moment.duration(endDate.diff(nowDate))
        let message = timeDifference.humanize()

        return {
            replace: false,
            message: `Replacement in ${message}.`
        }
    }
}

const createCanBeBoughtMessage = (boughtDate) => {
    const nowDate = moment()

    if (nowDate > boughtDate ) {
        return {
            buyout: true,
            message: "OMG You can buy out this MacBook!"
        }
    } else {
        const timeDifference = moment.duration(boughtDate.diff(nowDate))
        let message = timeDifference.humanize()
        
        return {
            buyout: false,
            message: `Buy out possible in ${message}, be patient :)`
        }
    }
} 

module.exports = {
    prepareCanBeReplacedField,
    prepareCanBeBoughtField
}
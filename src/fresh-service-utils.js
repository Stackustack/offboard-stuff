const axios = require('axios')
const _ = require('lodash')

const {
    prepareCanBeReplacedField,
    prepareCanBeBoughtField
} = require("./other-utils")

const fetchFreshServiceUserId = async (userMail) => {
    const login = userMail.split("@")[0]
    const domains = ["netguru.pl", "netguru.co"]
    const possibleMails = domains.map(domain => login + "@" + domain)
    let freshServiceId = null

    freshServiceId = await checkForIdWithPossibleMails(possibleMails, "requester") || checkForIdWithPossibleMails(possibleMails, "agent")

    if (freshServiceId) {
        return freshServiceId
    } else {
        throw new Error("Couldn't fetch FreshService UserID (using both Requester and Agent endpoints) - might be that FreshService API is down, please try in a while and contact @juni")
    }
}

const getUserAssets = async (freshServiceId) => {
    url = `${process.env.FRESH_SERVICE_DOMAIN}/api/v2/assets?query="user_id: ${freshServiceId}"`

    const response = await axios({
        method: 'get',
        url,
        auth: {
            username: process.env.FRESH_SERVICE_ADMIN_TOKEN,
            password: 'X'
        }
    }).then(res => {
        return res
    }).catch(e => {
        console.log(e)
    })

    const assets = response.data.assets
    const trimmedData = assets.map(({name, asset_tag, display_id}) => {
        return {name, asset_tag, display_id}
    })

    return trimmedData
}

const checkForIdWithPossibleMails = async (possibleMails, userType) => {
    let id = null

    for (let mail of possibleMails) {
        id = await fetchUserId(mail, userType)

        if (id) {
            break
        }
    }
    
    return id
}

const fetchUserId = async (userMail, userType) => {
    let url = null

    if (userType === "requester") {
        url = process.env.FRESH_SERVICE_DOMAIN + '/itil/requesters.json?query=email%20is%20' + userMail
    } else if (userType === "agent") {
        url = process.env.FRESH_SERVICE_DOMAIN + '/agents.json?query=email%20is%20' + userMail
    }

    const response = await callToFreshServiceAPI(url)

    if (response.data[0] && userType === "agent") {
        return response.data[0].agent.user_id
    } else if (response.data[0] && userType === "requester") {
        return response.data[0].user.id
    } else {
        return null
    }
}

const updateWithMacbookData = async (userAssets) => {
    const assetsWithMacBookData = await Promise.all(
        userAssets.map(asset => {
            if (asset.name.toUpperCase().includes("MACBOOK")) {

                const url = `${process.env.FRESH_SERVICE_DOMAIN}/cmdb/items/${asset.display_id}.json`

                return callToFreshServiceAPI(url)
                    .then(res => {
                        leaseStartDate = res.data.config_item.levelfield_values.lease_date_7000772460
                        leaseEndDate = res.data.config_item.levelfield_values.minimum_lease_time_7000772460

                        if (leaseStartDate) {
                            asset.can_be_replaced = prepareCanBeReplacedField({leaseStartDate})
                            asset.can_be_bought = prepareCanBeBoughtField({leaseStartDate})
                        } else if (leaseStartDate == null && leaseEndDate) {
                            asset.can_be_replaced = prepareCanBeReplacedField({leaseEndDate})
                            asset.can_be_bought = prepareCanBeBoughtField({leaseEndDate})
                        } else {
                            asset.can_be_replaced = "No data, contact Support for more info :)"
                            asset.can_be_bought = "No data, contact Support for more info :)"
                        }

                        return asset
                    })
            }

            return asset
        })
    ).then(assets => {
        return assets
    }).catch(e => {
        console.log(e)
    })

    const trimmedData = assetsWithMacBookData.map(({name, asset_tag, can_be_replaced, can_be_bought}) => {
        return {name, asset_tag, can_be_replaced, can_be_bought}
    })

    return trimmedData
}

const callToFreshServiceAPI = async (url) => {
    const response = await axios({
        method: 'get',
        url,
        auth: {
            username: process.env.FRESH_SERVICE_ADMIN_TOKEN,
            password: 'X'
        }
    }).then(res => {
        return res
    }).catch(e => {
        console.log(e)
    })

    return response
}

module.exports = {
    fetchFreshServiceUserId,
    getUserAssets,
    updateWithMacbookData
}
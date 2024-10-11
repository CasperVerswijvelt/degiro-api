"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrdersRequest = void 0;
// Import debug console log
var utils_1 = require("../utils");
var DeGiroEnums_1 = require("../enums/DeGiroEnums");
var utils_2 = require("../utils/");
// tslint:disable-next-line: max-line-length
function getOrdersRequest(_a, config) {
    var accountData = _a.accountData, accountConfig = _a.accountConfig, userAgent = _a.userAgent;
    return new Promise(function (resolve, reject) {
        // Create params to get orders by types
        var active = config.active, lastTransactions = config.lastTransactions;
        var params = "";
        if (active)
            params += DeGiroEnums_1.GET_ORDERS_TYPES.ACTIVE + "=0&";
        if (lastTransactions)
            params += DeGiroEnums_1.GET_ORDERS_TYPES.TRANSACTIONS + "=0&";
        var requestOptions = {
            credentials: "include",
            referer: "https://trader.degiro.nl/trader/",
        };
        // Do the request to get a account config data
        var uri = accountConfig.data.tradingUrl + "v5/update/" + accountData.data.intAccount + ";jsessionid=" + accountConfig.data.sessionId + "?" + params;
        utils_1.debug("Making request to " + uri);
        utils_1.fetch(uri, requestOptions, userAgent)
            .then(function (res) { return res.json(); })
            .then(function (res) {
            var result = {
                orders: res.orders
                    ? res.orders.value.map(utils_2.processGetOrdersResultListObject)
                    : [],
                lastTransactions: res.transactions
                    ? res.transactions.value.map(utils_2.processGetOrdersResultListObject)
                    : [],
            };
            resolve(result);
        })
            .catch(reject);
    });
}
exports.getOrdersRequest = getOrdersRequest;
//# sourceMappingURL=getOrdersRequest.js.map
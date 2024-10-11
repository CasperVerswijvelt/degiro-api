"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductsByIdsRequest = void 0;
// Import debug console log
var utils_1 = require("../utils");
// tslint:disable-next-line: max-line-length
function getProductsByIdsRequest(ids, _a) {
    var accountData = _a.accountData, accountConfig = _a.accountConfig, userAgent = _a.userAgent;
    return new Promise(function (resolve, reject) {
        var requestOptions = {
            method: "POST",
            body: JSON.stringify(ids.map(function (id) { return id.toString(); })),
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            referer: "https://trader.degiro.nl/trader/",
        };
        utils_1.fetch(accountConfig.data.productSearchUrl + "v5/products/info?intAccount=" + accountData.data.intAccount + "&sessionId=" + accountConfig.data.sessionId, requestOptions, userAgent)
            .then(function (res) { return res.json(); })
            .then(function (res) { return resolve(res.data); })
            .catch(reject);
    });
}
exports.getProductsByIdsRequest = getProductsByIdsRequest;
//# sourceMappingURL=getProductsByIdsRequest.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfigDictionaryRequest = void 0;
// Import debug console log
var utils_1 = require("../utils");
function getConfigDictionaryRequest(_a) {
    var accountData = _a.accountData, accountConfig = _a.accountConfig, userAgent = _a.userAgent;
    return new Promise(function (resolve, reject) {
        var requestOptions = {
            headers: {
                Cookie: "JSESSIONID=" + accountConfig.data.sessionId + ";",
            },
            credentials: "include",
            referer: "https://trader.degiro.nl/trader/",
        };
        // Do the request to get a account config data
        var uri = accountConfig.data.dictionaryUrl + "?intAccount=" + accountData.data.intAccount + "&sessionId=" + accountConfig.data.sessionId;
        utils_1.debug("Making request to " + uri);
        utils_1.fetch(uri, requestOptions, userAgent)
            .then(function (res) { return res.json(); })
            .then(function (res) {
            utils_1.debug("Response:\n", JSON.stringify(res, null, 2));
            resolve(res);
        })
            .catch(reject);
    });
}
exports.getConfigDictionaryRequest = getConfigDictionaryRequest;
//# sourceMappingURL=getConfigDictionaryRequest.js.map
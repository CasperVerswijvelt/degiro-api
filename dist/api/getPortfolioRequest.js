"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPortfolioRequest = void 0;
// Import debug console log
var utils_1 = require("../utils");
// tslint:disable-next-line: max-line-length
function getPortfolioRequest(_a, config) {
    var accountData = _a.accountData, accountConfig = _a.accountConfig, userAgent = _a.userAgent;
    return new Promise(function (resolve, reject) {
        // Create params to reach portfolio
        var params = "&portfolio=0";
        // Do the request to get a account config data
        utils_1.debug("Making request to " + accountConfig.data.tradingUrl + "v5/update/" + accountData.data.intAccount + ";jsessionid=" + accountConfig.data.sessionId + "?" + params + "}");
        utils_1.fetch(accountConfig.data.tradingUrl + "v5/update/" + accountData.data.intAccount + ";jsessionid=" + accountConfig.data.sessionId + "?" + params, undefined, userAgent)
            .then(function (res) { return res.json(); })
            .then(function (res) {
            var portfolio = res.portfolio.value;
            var positions = utils_1.processPortfolio(portfolio, config);
            resolve(positions);
        })
            .catch(reject);
    });
}
exports.getPortfolioRequest = getPortfolioRequest;
//# sourceMappingURL=getPortfolioRequest.js.map
// Import modules
import * as async from "async";

// Import interfaces
import { DeGiroClassInterface } from "./interfaces";

// Import types
import {
  DeGiroSettupType,
  LoginResponseType,
  AccountConfigType,
  AccountDataType,
  CashFoundType,
  SearchProductResultType,
  GetPorfolioConfigType,
  SearchProductOptionsType,
  OrderType,
  CreateOrderResultType,
  IsLoginOptionsType,
  GetOrdersConfigType,
  GetOrdersResultType,
  GetAccountStateOptionsType,
  AccountReportsType,
  AccountInfoType,
  GetHistoricalOrdersOptionsType,
  HistoricalOrdersType,
  FavouriteProductType,
  StockType,
  GetNewsOptionsType,
  NewsType,
  WebUserSettingType,
  ConfigDictionaryType,
  i18nMessagesType,
  WebSettingsType,
  GetPopularStocksConfigType,
  GetTransactionsOptionsType,
  TransactionType,
} from "./types";

// Import requests
import {
  loginRequest,
  getAccountConfigRequest,
  getAccountDataRequest,
  getPortfolioRequest,
  getProductsByIdsRequest,
  searchProductRequest,
  createOrderRequest,
  executeOrderRequest,
  deleteOrderRequest,
  logoutRequest,
  getOrdersRequest,
  getAccountStateRequest,
  getConfigDictionaryRequest,
  getAccountInfoRequest,
  getWebi18nMessagesRequest,
  getNewsRequest,
  getWebSettingsRequest,
  getWebUserSettingsRequest,
  getAccountReportsRequest,
  getCashFundstRequest,
  getPopularStocksRequest,
  getTransactionsRequest,
} from "./api";

/**
 * @class DeGiro
 * @description Main class of DeGiro Unofficial API.
 */
export class DeGiro implements DeGiroClassInterface {
  /* Properties */

  private readonly username: string | undefined;
  private readonly pwd: string | undefined;
  private readonly oneTimePassword: string | undefined;
  jsessionId: string | undefined;
  accountConfig: AccountConfigType | undefined;
  accountData: AccountDataType | undefined;
  userAgent: string | undefined;

  /* Constructor and generator function */

  constructor(params: DeGiroSettupType = {}) {
    let { username, pwd, oneTimePassword, jsessionId, userAgent } = params;

    username = username || process.env["DEGIRO_USER"];
    pwd = pwd || process.env["DEGIRO_PWD"];
    oneTimePassword = oneTimePassword || process.env["DEGIRO_OTP"];
    jsessionId = jsessionId || process.env["DEGIRO_JSESSIONID"];
    this.userAgent = userAgent;

    if (!username && !jsessionId)
      throw new Error("DeGiro api needs an username to access");
    if (!pwd && !jsessionId)
      throw new Error("DeGiro api needs an password to access");

    this.username = username;
    this.pwd = pwd;
    this.oneTimePassword = oneTimePassword;

    this.jsessionId = jsessionId;
  }

  static create(params: DeGiroSettupType): DeGiro {
    return new DeGiro(params);
  }

  /* Session methods */

  login(): Promise<AccountDataType> {
    if (this.jsessionId) return this.loginWithJSESSIONID(this.jsessionId);
    return new Promise((resolve, reject) => {
      loginRequest(this, {
        username: this.username as string,
        pwd: this.pwd as string,
        oneTimePassword: this.oneTimePassword,
      })
        .then((loginResponse: LoginResponseType) => {
          if (!loginResponse.sessionId)
            reject("Login response have not a sessionId field");
          else return this.getAccountConfig(loginResponse.sessionId);
        })
        .then(() => this.getAccountData())
        .then(resolve)
        .catch(reject);
    });
  }

  logout(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.accountData || !this.accountConfig) {
        return reject("You must log in first");
      }
      logoutRequest(this)
        .then(() => {
          delete this.accountData;
          delete this.accountConfig;
          resolve();
        })
        .catch(reject);
    });
  }

  isLogin(options?: IsLoginOptionsType): boolean | Promise<boolean> {
    if (!options || !options.secure)
      return this.hasSessionId() && !!this.accountData;
    return new Promise((resolve) => {
      this.getAccountConfig()
        .then(() => resolve(true))
        .catch(() => resolve(false));
    });
  }

  private hasSessionId = (): boolean =>
    !!this.accountConfig &&
    !!this.accountConfig.data &&
    !!this.accountConfig.data.sessionId;

  private loginWithJSESSIONID(jsessionId: string): Promise<AccountDataType> {
    return new Promise((resolve, reject) => {
      this.getAccountConfig(jsessionId)
        .then(() => this.getAccountData())
        .then((accountData) => {
          this.jsessionId = undefined; // Remove the jsessionId to prevent reuse
          resolve(accountData);
        })
        .catch(reject);
    });
  }

  getJSESSIONID = () =>
    this.hasSessionId()
      ? (<AccountConfigType>this.accountConfig).data.sessionId
      : undefined;

  /* Account methods */

  getAccountConfig(sessionId?: string): Promise<AccountConfigType> {
    return new Promise((resolve, reject) => {
      if (!sessionId && !this.hasSessionId()) {
        return reject("You must log in first or provide a JSESSIONID");
      }
      getAccountConfigRequest(this, sessionId)
        .then((accountConfig: AccountConfigType) => {
          this.accountConfig = accountConfig;
          resolve(accountConfig);
        })
        .catch(reject);
    });
  }

  getAccountData(): Promise<AccountDataType> {
    return new Promise((resolve, reject) => {
      if (!this.hasSessionId()) {
        return reject("You must log in first");
      }
      getAccountDataRequest(this)
        .then((accountData: AccountDataType) => {
          this.accountData = accountData;
          resolve(accountData);
        })
        .catch(reject);
    });
  }

  getAccountState(options: GetAccountStateOptionsType): Promise<any[]> {
    if (!this.hasSessionId()) {
      return Promise.reject("You must log in first");
    }
    return getAccountStateRequest(this, options);
  }

  getAccountReports(): Promise<AccountReportsType> {
    if (!this.hasSessionId()) {
      return Promise.reject("You must log in first");
    }
    return getAccountReportsRequest(this);
  }

  getAccountInfo(): Promise<AccountInfoType> {
    if (!this.hasSessionId()) {
      return Promise.reject("You must log in first");
    }
    return getAccountInfoRequest(this);
  }

  /* Search methods */

  searchProduct(
    options: SearchProductOptionsType
  ): Promise<SearchProductResultType[]> {
    if (!this.hasSessionId()) {
      return Promise.reject("You must log in first");
    }
    return searchProductRequest(options, this);
  }

  /* Cash Funds methods */

  getCashFunds(): Promise<CashFoundType[]> {
    if (!this.hasSessionId()) {
      return Promise.reject("You must log in first");
    }
    return getCashFundstRequest(this);
  }

  /* Porfolio methods */

  getPortfolio(config: GetPorfolioConfigType): Promise<any[]> {
    return new Promise((resolve, reject) => {
      if (!this.hasSessionId()) {
        return reject("You must log in first");
      }
      getPortfolioRequest(this, config)
        .then((portfolio) =>
          this.completePortfolioDetails(
            portfolio,
            config.getProductDetails || false
          )
        )
        .then(resolve)
        .catch(reject);
    });
  }

  private completePortfolioDetails(
    portfolio: any[],
    getProductDetails: boolean
  ): Promise<any[]> {
    if (!getProductDetails) return Promise.resolve(portfolio);
    return new Promise((resolve, reject) => {
      async.map(
        portfolio,
        (position, next) => {
          if (position.positionType !== "PRODUCT") return next(null, position);
          this.getProductsByIds([position.id])
            .then((product) => {
              position.productData = product[position.id];
              next(null, position);
            })
            .catch((error) => next(error));
          // tslint:disable-next-line: align
        },
        (error, portfolio) => {
          if (error) return reject(error);
          resolve(<any[]>portfolio);
        }
      );
    });
  }

  /* Stocks methods */

  getFavouriteProducts(): Promise<FavouriteProductType[]> {
    return new Promise((resolve, reject) => {
      reject("Method not implemented");
    });
  }

  getPopularStocks(
    config: GetPopularStocksConfigType = {}
  ): Promise<StockType[]> {
    if (!this.hasSessionId()) {
      return Promise.reject("You must log in first");
    }
    return getPopularStocksRequest(this, config);
  }

  /* Orders methods */

  getOrders(config: GetOrdersConfigType): Promise<GetOrdersResultType> {
    if (!this.hasSessionId()) {
      return Promise.reject("You must log in first");
    }
    return getOrdersRequest(this, config);
  }

  getHistoricalOrders(
    options: GetHistoricalOrdersOptionsType
  ): Promise<HistoricalOrdersType> {
    return new Promise((resolve, reject) => {
      reject("Method not implemented");
    });
  }

  createOrder(order: OrderType): Promise<CreateOrderResultType> {
    if (!this.hasSessionId()) {
      return Promise.reject("You must log in first");
    }
    return createOrderRequest(order, this);
  }

  executeOrder(order: OrderType, executeId: String): Promise<String> {
    if (!this.hasSessionId()) {
      return Promise.reject("You must log in first");
    }
    return executeOrderRequest(order, executeId, this);
  }

  deleteOrder(orderId: String): Promise<void> {
    if (!this.hasSessionId()) {
      return Promise.reject("You must log in first");
    }
    return deleteOrderRequest(orderId, this);
  }

  getTransactions(
    options: GetTransactionsOptionsType
  ): Promise<TransactionType[]> {
    if (!this.hasSessionId()) {
      return Promise.reject("You must log in first");
    }
    return getTransactionsRequest(this, options);
  }

  /* Miscellaneous methods */

  getProductsByIds(ids: string[]): Promise<any[]> {
    if (!this.hasSessionId()) {
      return Promise.reject("You must log in first");
    }
    return getProductsByIdsRequest(ids, this);
  }

  getNews(options: GetNewsOptionsType): Promise<NewsType> {
    if (!this.hasSessionId()) {
      return Promise.reject("You must log in first");
    }
    return getNewsRequest(options, this);
  }

  getWebi18nMessages(lang: string = "es_ES"): Promise<i18nMessagesType> {
    if (!this.hasSessionId()) {
      return Promise.reject("You must log in first");
    }
    return getWebi18nMessagesRequest(lang, this);
  }

  getWebSettings(): Promise<WebSettingsType> {
    if (!this.hasSessionId()) {
      return Promise.reject("You must log in first");
    }
    return getWebSettingsRequest(this);
  }

  getWebUserSettings(): Promise<WebUserSettingType> {
    if (!this.hasSessionId()) {
      return Promise.reject("You must log in first");
    }
    return getWebUserSettingsRequest(this);
  }

  getConfigDictionary(): Promise<ConfigDictionaryType> {
    if (!this.hasSessionId()) {
      return Promise.reject("You must log in first");
    }
    return getConfigDictionaryRequest(this);
  }
}

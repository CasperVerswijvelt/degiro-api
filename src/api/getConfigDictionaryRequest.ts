// Import types
import {
  AccountConfigType,
  AccountDataType,
  ConfigDictionaryType,
  DeGiro,
} from "../types";

// Import debug console log
import { debug, fetch } from "../utils";

export function getConfigDictionaryRequest({
  accountData,
  accountConfig,
  userAgent,
}: DeGiro): Promise<ConfigDictionaryType> {
  return new Promise((resolve, reject) => {
    const requestOptions: {
      method?: string;
      body?: string;
      headers: {
        [key: string]: string;
      };
      credentials: "include";
      referer: string;
    } = {
      headers: {
        Cookie: `JSESSIONID=${accountConfig!.data.sessionId};`,
      },
      credentials: "include",
      referer: "https://trader.degiro.nl/trader/",
    };

    // Do the request to get a account config data
    const uri = `${accountConfig!.data.dictionaryUrl}?intAccount=${
      accountData!.data.intAccount
    }&sessionId=${accountConfig!.data.sessionId}`;
    debug(`Making request to ${uri}`);
    fetch(uri, requestOptions, userAgent)
      .then((res) => res.json())
      .then((res: ConfigDictionaryType) => {
        debug("Response:\n", JSON.stringify(res, null, 2));
        resolve(res);
      })
      .catch(reject);
  });
}

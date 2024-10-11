// Import types
import {
  AccountConfigType,
  AccountDataType,
  DeGiro,
  WebUserSettingType,
} from "../types";

// Import debug console log
import { debug, fetch } from "../utils";

// Importamos constantes
import { DEGIRO_API_PATHS } from "../enums";
const { GET_WEB_USER_SETTINGS_PATH } = DEGIRO_API_PATHS;

export function getWebUserSettingsRequest({
  accountData,
  accountConfig,
  userAgent,
}: DeGiro): Promise<WebUserSettingType> {
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
    const uri = `${
      accountConfig!.data.paUrl
    }${GET_WEB_USER_SETTINGS_PATH}?intAccount=${
      accountData!.data.intAccount
    }&sessionId=${accountConfig!.data.sessionId}`;
    debug(`Making request to ${uri}`);
    fetch(uri, requestOptions, userAgent)
      .then((res) => res.json())
      .then((res) => {
        debug("Response:\n", JSON.stringify(res, null, 2));
        const data: WebUserSettingType = res.data;
        resolve(data);
      })
      .catch(reject);
  });
}

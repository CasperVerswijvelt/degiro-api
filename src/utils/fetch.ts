export function fetchOverride(
  input: RequestInfo,
  init?: RequestInit,
  userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
): Promise<Response> {
  console.log({ userAgent });
  const newInit = init ?? {};
  newInit.headers = newInit.headers ?? {};
  (newInit.headers as any)["User-Agent"] = userAgent;
  return fetch(input, newInit);
}

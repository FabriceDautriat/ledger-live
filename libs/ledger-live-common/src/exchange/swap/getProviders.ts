import network from "@ledgerhq/live-network/network";
import qs from "qs";
import { SwapNoAvailableProviders } from "../../errors";
import { getAvailableProviders, getSwapAPIBaseURL } from "./";
import { mockGetProviders } from "./mock";
import type { GetProviders, ProvidersResponseV4 } from "./types";
import { isIntegrationTestEnv } from "./utils/isIntegrationTestEnv";

const getProviders: GetProviders = async () => {
  if (isIntegrationTestEnv()) {
    return mockGetProviders();
  }

  const { data: responseV4 } = await network<ProvidersResponseV4>({
    method: "GET",
    url: `${getSwapAPIBaseURL()}/providers`,
    params: { whitelist: getAvailableProviders() },
    paramsSerializer: params => qs.stringify(params, { arrayFormat: "comma" }),
  });

  if (!responseV4.providers || !Object.keys(responseV4.providers).length) {
    throw new SwapNoAvailableProviders();
  }

  const { currencies } = responseV4;

  return Object.entries(responseV4.providers).flatMap(([provider, groups]) => {
    return {
      provider,
      pairs: groups.flatMap(group =>
        group.methods.flatMap(tradeMethod =>
          Object.entries(group.pairs).flatMap(([from, toArray]) =>
            toArray.map(to => ({
              from: currencies[from],
              to: currencies[to],
              tradeMethod,
            })),
          ),
        ),
      ),
    };
  });
};

export default getProviders;

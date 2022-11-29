import fetch from "node-fetch";
import * as queries from "./graphqlSource/new-backend/query.json";
import * as fragmentObject from "./graphqlSource/new-backend/fragment.json";
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

export const Greeter = (name: string) => `Hello ${name}`;
export const Hi = (name: string) => `Hi ${name}`;
export const printEnv = () => `secret => ${process.env.CLIENT_SECRET}`;

export const getDashboardToken = async (): Promise<string> => {
  const rsp = await fetch(`https://dev.auth.brikl.com/oauth/token`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      grant_type: "password",
      username: `${process.env.DASHBOARD_AUTH_USERNAME}`,
      password: `${process.env.DASHBOARD_AUTH_PASSWORD}`,
      audience: "https://dev.api.brikl.com",
      client_id: `${process.env.CLIENT_ID}`,
      client_secret: `${process.env.CLIENT_SECRET}`,
    }),
  });
  const data = await rsp.json();
  return data.access_token;
};

export const getShop = async (token) => {
  const response = await fetch("https://dev.api.mybrikl.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-brikl-shop-id": "3ddd1f77-23b5-4bc7-9059-c32cc1338723",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      operationName: "getShop",
      query:
        "query getShop($shopId: ID!) {\n  shop(id: $shopId) {\n    ...shopCommonFields\n    __typename\n  }\n  adminUser {\n    id\n    featuresEnabled\n    __typename\n  }\n}\n\nfragment shopCommonFields on Shop {\n  id\n  availableFeatures\n  baseShopDataCopied\n  createdAt\n  name\n  featuresEnabled\n  fonts\n  meta\n  planName\n  subscriptionPlan\n  stripePlanId\n  stripePlanName\n  stripeCustomerId\n  stripeCardLast4\n  stripeCardBrand\n  isEnterprise\n  hasSubscription\n  trialStartAt\n  trialEndAt\n  url\n  defaultCurrency\n  currencies\n  defaultLanguage\n  languageWithoutUrlPrefix\n  languages\n  defaultCountry\n  pagebuilderVersion\n  email\n  stripePublicKey\n  omisePublicKey\n  fonts\n  designStudioSettings {\n    designSteps {\n      id\n      shopId\n      type\n      stepSortOrder\n      productId\n      meta\n      ... on AlloverprintStep {\n        defaultPrintingTechnique\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  brandSettings {\n    logo\n    icon\n    __typename\n  }\n  taxSettings {\n    defaultTaxRate\n    taxRates {\n      id\n      shopId\n      percent\n      countryCode\n      provinceCode\n      __typename\n    }\n    collectionTaxOverrides {\n      defaultTaxRate\n      collectionId\n      collection {\n        no\n        title {\n          defaultValue\n          text {\n            langCode\n            content\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      taxRates {\n        id\n        shopId\n        percent\n        countryCode\n        provinceCode\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  capabilities {\n    featureFlags\n    __typename\n  }\n  stripeConnectAccount {\n    stripe_publishable_key\n    stripe_user_id\n    __typename\n  }\n  stripeConnectAccounts {\n    edges {\n      node {\n        stripe_publishable_key\n        stripe_user_id\n        salesChannelId\n        currency\n        name\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  contentSettings {\n    id\n    homePageId\n    homeContentModelId\n    cookieNote {\n      id\n      text {\n        langCode\n        content\n        __typename\n      }\n      __typename\n    }\n    menus {\n      id\n      menuLocation\n      __typename\n    }\n    selectedShopThemeId\n    selectedShopThemeRevision {\n      id\n      createdAt\n      revision\n      styles\n      themeSettings\n      __typename\n    }\n    selectedShopTheme {\n      id\n      lastOverrideRevision {\n        id\n        themeSettings\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  businessAddress {\n    address1\n    city\n    company\n    countryCode\n    country\n    firstName\n    lastName\n    email\n    phone\n    province\n    zip\n    __typename\n  }\n  shippingSettings {\n    id\n    shippingMethods {\n      id\n      name\n      __typename\n    }\n    allowedShippingCountries\n    shippingZones {\n      id\n      name\n      limitAddressSelection\n      applyToAllCountries\n      countryCodes\n      regionCodes\n      shippingRates {\n        id\n        priority\n        type\n        minimumTotal {\n          currency\n          value\n          __typename\n        }\n        minimumWeight\n        weightUnit\n        rate {\n          currency\n          value\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n",
      variables: { shopId: "3ddd1f77-23b5-4bc7-9059-c32cc1338723" },
    }),
  });
  if (response.status !== 200) {
    console.log(response.status);
    throw new Error("Error Found");
  }
  const data = await response.json();

  console.log(data.data);
};

export const studioGetProductsNB = async (token) => {
  const response = await fetch(
    "https://dev.internal-api.brikl.com/v1/graphql",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-brikl-shop-id": "3ddd1f77-23b5-4bc7-9059-c32cc1338723",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        operationName: "studioGetProductsNB",
        query: queries.studioGetProductsNB.body,
        variables: {
          first: 400,
        },
      }),
    }
  );

  console.log(response);
  if (response.status !== 200) {
    console.log(response.status);
    throw new Error("Error Found");
  }
  const data = await response.json();

  console.log(data.data);
};

export const getUniqeFragments = (lookupObject, lookupName) => {
  if (lookupObject[lookupName].fragments.length === 0) return [];
  let currentFlagment = lookupObject[lookupName].fragments;
  for (const childName of lookupObject[lookupName].fragments) {
    currentFlagment = [
      ...currentFlagment,
      ...getUniqeFragments(fragmentObject, childName),
    ];
  }
  return [...new Set(currentFlagment)];
};

export const getFullGQLQuery = (operationName) => {
  if (operationName in queries) {
    const allFragements = getUniqeFragments(queries, operationName);
    return [
      queries[operationName].body,
      ...allFragements.map((name) => fragmentObject[name as string].body),
    ].join("\n");
  }

  return "No query found";
};

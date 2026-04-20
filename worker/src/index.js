const DEFAULT_INSTAGRAM_TTL = 60 * 60;
const DEFAULT_GOOGLE_TTL = 60 * 60 * 6;
const DEFAULT_DISCOVER_TTL = 60 * 5;

export default {
  async fetch(request, env, ctx) {
    if (!isAllowedOrigin(request, env)) {
      return json(
        {
          error: "Origin non autorizzata",
        },
        403,
        request,
        env,
      );
    }

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(request, env),
      });
    }

    if (request.method !== "GET") {
      return json(
        {
          error: "Method not allowed",
        },
        405,
        request,
        env,
      );
    }

    const url = new URL(request.url);

    try {
      if (url.pathname === "/" || url.pathname === "/health") {
        return json(
          {
            ok: true,
            service: "eletwave-integrations",
          },
          200,
          request,
          env,
          60,
        );
      }

      if (url.pathname === "/instagram") {
        return withCache(
          request,
          env,
          ctx,
          "instagram",
          Number(env.CACHE_TTL_INSTAGRAM || DEFAULT_INSTAGRAM_TTL),
          async () => getInstagramPayload(env),
        );
      }

      if (url.pathname === "/google-business") {
        return withCache(
          request,
          env,
          ctx,
          "google-business",
          Number(env.CACHE_TTL_GOOGLE || DEFAULT_GOOGLE_TTL),
          async () => getGoogleBusinessPayload(env),
        );
      }

      if (url.pathname === "/google-business/discover") {
        return withCache(
          request,
          env,
          ctx,
          "google-business-discover",
          Number(env.CACHE_TTL_DISCOVER || DEFAULT_DISCOVER_TTL),
          async () => discoverGoogleBusiness(env),
        );
      }
    } catch (error) {
      return json(
        {
          error: error instanceof Error ? error.message : "Unexpected error",
        },
        500,
        request,
        env,
      );
    }

    return json(
      {
        error: "Not found",
      },
      404,
      request,
      env,
    );
  },
};

async function withCache(request, env, ctx, cacheKeySuffix, ttl, producer) {
  const cache = caches.default;
  const cacheKey = new Request(
    "https://cache.eletwave.local/" + cacheKeySuffix,
    request,
  );
  const cached = await cache.match(cacheKey);

  if (cached) {
    return withCors(cached, request, env);
  }

  const payload = await producer();
  const response = json(payload, 200, request, env, ttl);
  ctx.waitUntil(cache.put(cacheKey, response.clone()));
  return response;
}

function isAllowedOrigin(request, env) {
  const allowedOrigin = env.ALLOWED_ORIGIN || "*";
  const origin = request.headers.get("Origin");

  if (allowedOrigin === "*" || !origin) {
    return true;
  }

  return origin === allowedOrigin;
}

function corsHeaders(request, env) {
  const headers = new Headers({
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  });
  const allowedOrigin = env.ALLOWED_ORIGIN || "*";
  const origin = request.headers.get("Origin");

  if (allowedOrigin === "*") {
    headers.set("Access-Control-Allow-Origin", "*");
  } else {
    headers.set("Access-Control-Allow-Origin", origin || allowedOrigin);
  }

  return headers;
}

function withCors(response, request, env) {
  const headers = new Headers(response.headers);
  const cors = corsHeaders(request, env);

  cors.forEach((value, key) => {
    headers.set(key, value);
  });

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function json(payload, status, request, env, maxAge = 0) {
  const headers = corsHeaders(request, env);
  headers.set("Content-Type", "application/json; charset=utf-8");
  headers.set(
    "Cache-Control",
    maxAge > 0 ? "public, max-age=" + maxAge : "no-store",
  );

  return new Response(JSON.stringify(payload, null, 2), {
    status,
    headers,
  });
}

function requireEnv(env, keys) {
  const missing = keys.filter((key) => !env[key]);

  if (missing.length) {
    throw new Error("Variabili ambiente mancanti: " + missing.join(", "));
  }
}

async function fetchJson(url, init = {}) {
  const response = await fetch(url, init);
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      payload &&
      payload.error &&
      (payload.error.message || payload.error.status || payload.error);
    throw new Error(message || "Richiesta upstream non riuscita");
  }

  return payload;
}

async function getInstagramPayload(env) {
  requireEnv(env, ["INSTAGRAM_USER_ID", "INSTAGRAM_ACCESS_TOKEN"]);

  const version = env.INSTAGRAM_API_VERSION || "v25.0";
  const host = env.INSTAGRAM_HOST || "graph.instagram.com";
  const postLimit = Number(env.INSTAGRAM_POST_LIMIT || 6);
  const profileUrl =
    env.INSTAGRAM_PROFILE_URL || "https://www.instagram.com/eletwave/";

  const profileUrlObject = new URL(
    "https://" + host + "/" + version + "/" + env.INSTAGRAM_USER_ID,
  );
  profileUrlObject.searchParams.set(
    "fields",
    "id,username,profile_picture_url,media_count,website",
  );
  profileUrlObject.searchParams.set(
    "access_token",
    env.INSTAGRAM_ACCESS_TOKEN,
  );

  const mediaUrlObject = new URL(
    "https://" +
      host +
      "/" +
      version +
      "/" +
      env.INSTAGRAM_USER_ID +
      "/media",
  );
  mediaUrlObject.searchParams.set(
    "fields",
    [
      "id",
      "caption",
      "media_type",
      "media_url",
      "thumbnail_url",
      "permalink",
      "timestamp",
      "children{media_type,media_url,thumbnail_url}",
    ].join(","),
  );
  mediaUrlObject.searchParams.set("limit", String(postLimit));
  mediaUrlObject.searchParams.set("access_token", env.INSTAGRAM_ACCESS_TOKEN);

  const [profile, mediaPayload] = await Promise.all([
    fetchJson(profileUrlObject),
    fetchJson(mediaUrlObject),
  ]);

  return {
    profile: {
      id: profile.id,
      username: profile.username,
      profilePictureUrl: profile.profile_picture_url || null,
      mediaCount:
        typeof profile.media_count === "number" ? profile.media_count : null,
      website: profile.website || null,
      profileUrl,
    },
    posts: Array.isArray(mediaPayload.data)
      ? mediaPayload.data.map(formatInstagramPost)
      : [],
  };
}

function formatInstagramPost(post) {
  const firstChild =
    post.children && Array.isArray(post.children.data) ? post.children.data[0] : null;
  const imageUrl =
    post.thumbnail_url ||
    post.media_url ||
    (firstChild ? firstChild.thumbnail_url || firstChild.media_url : "") ||
    "";

  return {
    id: post.id,
    caption: post.caption || "",
    mediaType: post.media_type || "IMAGE",
    imageUrl,
    permalink: post.permalink || "",
    timestamp: post.timestamp || "",
    alt: post.caption || "Post Instagram Eletwave",
  };
}

async function getGoogleBusinessPayload(env) {
  const accessToken = await getGoogleAccessToken(env);
  const locationContext = await resolveGoogleLocationContext(accessToken, env);

  const [location, reviewsPayload] = await Promise.all([
    fetchGoogleLocation(accessToken, locationContext.locationId),
    fetchGoogleReviews(
      accessToken,
      locationContext.accountId,
      locationContext.locationId,
      Number(env.GOOGLE_REVIEW_LIMIT || 6),
    ),
  ]);

  return {
    profile: {
      title: location.title || env.GOOGLE_BUSINESS_NAME || "ELETWAVE",
      description:
        (location.profile && location.profile.description) || "",
      status: location.openInfo ? location.openInfo.status || "" : "",
      phone:
        location.phoneNumbers && location.phoneNumbers.primaryPhone
          ? location.phoneNumbers.primaryPhone
          : null,
      website: location.websiteUri || null,
      isServiceAreaBusiness: Boolean(location.serviceArea),
      placeId:
        location.metadata && location.metadata.placeId
          ? location.metadata.placeId
          : null,
      mapsUrl:
        (location.metadata && location.metadata.mapsUri) ||
        env.GOOGLE_PROFILE_URL ||
        null,
      newReviewUrl:
        (location.metadata && location.metadata.newReviewUri) ||
        env.GOOGLE_REVIEW_URL ||
        null,
      profileUrl: env.GOOGLE_PROFILE_URL || null,
    },
    summary: {
      averageRating:
        typeof reviewsPayload.averageRating === "number"
          ? reviewsPayload.averageRating
          : 0,
      totalReviewCount:
        typeof reviewsPayload.totalReviewCount === "number"
          ? reviewsPayload.totalReviewCount
          : 0,
    },
    reviews: Array.isArray(reviewsPayload.reviews)
      ? reviewsPayload.reviews.map(formatGoogleReview)
      : [],
    source: {
      accountId: locationContext.accountId,
      locationId: locationContext.locationId,
    },
  };
}

async function discoverGoogleBusiness(env) {
  const accessToken = await getGoogleAccessToken(env);
  const accountsPayload = await fetchGoogleAccounts(accessToken);
  const accounts = Array.isArray(accountsPayload.accounts)
    ? accountsPayload.accounts
    : [];

  const hydratedAccounts = await Promise.all(
    accounts.map(async (account) => {
      const locationsPayload = await fetchGoogleLocations(
        accessToken,
        account.name,
      );

      return {
        name: account.name,
        accountId: extractId(account.name),
        accountName: account.accountName || "",
        type: account.type || "",
        role: account.role || "",
        locations: Array.isArray(locationsPayload.locations)
          ? locationsPayload.locations.map((location) => ({
              name: location.name,
              locationId: extractId(location.name),
              title: location.title || "",
              placeId:
                location.metadata && location.metadata.placeId
                  ? location.metadata.placeId
                  : "",
              mapsUrl:
                location.metadata && location.metadata.mapsUri
                  ? location.metadata.mapsUri
                  : "",
              newReviewUrl:
                location.metadata && location.metadata.newReviewUri
                  ? location.metadata.newReviewUri
                  : "",
            }))
          : [],
      };
    }),
  );

  return {
    accounts: hydratedAccounts,
  };
}

async function getGoogleAccessToken(env) {
  if (env.GOOGLE_ACCESS_TOKEN) {
    return env.GOOGLE_ACCESS_TOKEN;
  }

  requireEnv(env, [
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_REFRESH_TOKEN",
  ]);

  const body = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    client_secret: env.GOOGLE_CLIENT_SECRET,
    refresh_token: env.GOOGLE_REFRESH_TOKEN,
    grant_type: "refresh_token",
  });

  const payload = await fetchJson("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!payload.access_token) {
    throw new Error("Token Google non restituito");
  }

  return payload.access_token;
}

async function resolveGoogleLocationContext(accessToken, env) {
  if (env.GBP_ACCOUNT_ID && env.GBP_LOCATION_ID) {
    return {
      accountId: env.GBP_ACCOUNT_ID,
      locationId: env.GBP_LOCATION_ID,
    };
  }

  const accountsPayload = await fetchGoogleAccounts(accessToken);
  const accounts = Array.isArray(accountsPayload.accounts)
    ? accountsPayload.accounts
    : [];

  if (!accounts.length) {
    throw new Error("Nessun account Google Business disponibile");
  }

  const account = env.GBP_ACCOUNT_ID
    ? accounts.find((item) => extractId(item.name) === String(env.GBP_ACCOUNT_ID)) ||
      accounts[0]
    : accounts[0];

  const locationsPayload = await fetchGoogleLocations(accessToken, account.name);
  const locations = Array.isArray(locationsPayload.locations)
    ? locationsPayload.locations
    : [];

  if (!locations.length) {
    throw new Error("Nessuna location Google Business disponibile");
  }

  const location = env.GBP_LOCATION_ID
    ? locations.find(
        (item) => extractId(item.name) === String(env.GBP_LOCATION_ID),
      ) || locations[0]
    : locations[0];

  return {
    accountId: extractId(account.name),
    locationId: extractId(location.name),
  };
}

async function fetchGoogleAccounts(accessToken) {
  return fetchJson("https://mybusinessaccountmanagement.googleapis.com/v1/accounts", {
    headers: {
      Authorization: "Bearer " + accessToken,
      Accept: "application/json",
    },
  });
}

async function fetchGoogleLocations(accessToken, accountName) {
  const url = new URL(
    "https://mybusinessbusinessinformation.googleapis.com/v1/" +
      accountName +
      "/locations",
  );
  url.searchParams.set("readMask", "name,title,metadata");
  url.searchParams.set("pageSize", "20");

  return fetchJson(url, {
    headers: {
      Authorization: "Bearer " + accessToken,
      Accept: "application/json",
    },
  });
}

async function fetchGoogleLocation(accessToken, locationId) {
  const url = new URL(
    "https://mybusinessbusinessinformation.googleapis.com/v1/locations/" +
      locationId,
  );
  url.searchParams.set(
    "readMask",
    "title,profile,metadata,serviceArea,phoneNumbers,websiteUri,openInfo",
  );

  return fetchJson(url, {
    headers: {
      Authorization: "Bearer " + accessToken,
      Accept: "application/json",
    },
  });
}

async function fetchGoogleReviews(accessToken, accountId, locationId, limit) {
  const url = new URL(
    "https://mybusiness.googleapis.com/v4/accounts/" +
      accountId +
      "/locations/" +
      locationId +
      "/reviews",
  );
  url.searchParams.set("pageSize", String(limit));
  url.searchParams.set("orderBy", "updateTime desc");

  return fetchJson(url, {
    headers: {
      Authorization: "Bearer " + accessToken,
      Accept: "application/json",
    },
  });
}

function formatGoogleReview(review) {
  return {
    id: review.reviewId || review.name,
    author:
      review.reviewer && review.reviewer.displayName
        ? review.reviewer.displayName
        : "Cliente Google",
    rating: review.starRating || "",
    comment: review.comment || "",
    createTime: review.createTime || "",
    updateTime: review.updateTime || "",
    reply:
      review.reviewReply && review.reviewReply.comment
        ? {
            comment: review.reviewReply.comment,
            updateTime: review.reviewReply.updateTime || "",
          }
        : null,
  };
}

function extractId(resourceName) {
  return String(resourceName || "").split("/").pop();
}

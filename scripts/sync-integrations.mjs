import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const dataDir = path.join(rootDir, "data");
const instagramFile = path.join(dataDir, "instagram.json");
const googleFile = path.join(dataDir, "google-business.json");

const DEFAULT_INSTAGRAM_POST_LIMIT = 6;
const DEFAULT_GOOGLE_REVIEW_LIMIT = 6;

await mkdir(dataDir, { recursive: true });

const [currentInstagram, currentGoogle] = await Promise.all([
  readJsonOrNull(instagramFile),
  readJsonOrNull(googleFile),
]);

const instagramConfigured = Boolean(
  process.env.INSTAGRAM_ACCESS_TOKEN && process.env.INSTAGRAM_USER_ID,
);
const googleConfigured = Boolean(
  process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_REFRESH_TOKEN,
);

const instagramPayload = instagramConfigured
  ? await getInstagramPayload()
  : currentInstagram || createInstagramPlaceholder();

const googlePayload = googleConfigured
  ? await getGoogleBusinessPayload()
  : currentGoogle || createGooglePlaceholder();

await Promise.all([
  writeJson(instagramFile, instagramPayload),
  writeJson(googleFile, googlePayload),
]);

console.log(
  JSON.stringify(
    {
      instagramConfigured,
      googleConfigured,
      instagramPosts: Array.isArray(instagramPayload.posts)
        ? instagramPayload.posts.length
        : 0,
      googleReviews: Array.isArray(googlePayload.reviews)
        ? googlePayload.reviews.length
        : 0,
      syncedAt: new Date().toISOString(),
    },
    null,
    2,
  ),
);

async function readJsonOrNull(filePath) {
  try {
    const content = await readFile(filePath, "utf8");
    return JSON.parse(content);
  } catch (error) {
    return null;
  }
}

async function writeJson(filePath, payload) {
  await writeFile(filePath, JSON.stringify(payload, null, 2) + "\n", "utf8");
}

function createInstagramPlaceholder() {
  return {
    profile: {
      id: "",
      username: "eletwave",
      profilePictureUrl: "",
      mediaCount: 0,
      website: "",
      profileUrl: "https://www.instagram.com/eletwave/",
    },
    posts: [],
    syncedAt: null,
  };
}

function createGooglePlaceholder() {
  return {
    profile: {
      title: process.env.GOOGLE_BUSINESS_NAME || "ELETWAVE",
      description:
        "Profilo Google Business in attesa di sincronizzazione automatica da GitHub Actions.",
      status: "OPEN",
      phone: "+39 3930036372",
      website: "",
      isServiceAreaBusiness: true,
      placeId: null,
      mapsUrl: process.env.GOOGLE_PROFILE_URL || "",
      newReviewUrl: process.env.GOOGLE_REVIEW_URL || "",
      profileUrl: process.env.GOOGLE_PROFILE_URL || "",
    },
    summary: {
      averageRating: 0,
      totalReviewCount: 0,
    },
    reviews: [],
    source: {
      accountId: process.env.GBP_ACCOUNT_ID || "",
      locationId: process.env.GBP_LOCATION_ID || "",
    },
    syncedAt: null,
  };
}

async function getInstagramPayload() {
  const version = process.env.INSTAGRAM_API_VERSION || "v25.0";
  const host = process.env.INSTAGRAM_HOST || "graph.instagram.com";
  const postLimit = Number(
    process.env.INSTAGRAM_POST_LIMIT || DEFAULT_INSTAGRAM_POST_LIMIT,
  );
  const profileUrl =
    process.env.INSTAGRAM_PROFILE_URL ||
    "https://www.instagram.com/eletwave/";

  const profileUrlObject = new URL(
    "https://" + host + "/" + version + "/" + process.env.INSTAGRAM_USER_ID,
  );
  profileUrlObject.searchParams.set(
    "fields",
    "id,username,profile_picture_url,media_count,website",
  );
  profileUrlObject.searchParams.set(
    "access_token",
    process.env.INSTAGRAM_ACCESS_TOKEN,
  );

  const mediaUrlObject = new URL(
    "https://" +
      host +
      "/" +
      version +
      "/" +
      process.env.INSTAGRAM_USER_ID +
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
  mediaUrlObject.searchParams.set(
    "access_token",
    process.env.INSTAGRAM_ACCESS_TOKEN,
  );

  const [profile, mediaPayload] = await Promise.all([
    fetchJson(profileUrlObject),
    fetchJson(mediaUrlObject),
  ]);

  return {
    profile: {
      id: profile.id,
      username: profile.username,
      profilePictureUrl: profile.profile_picture_url || "",
      mediaCount:
        typeof profile.media_count === "number" ? profile.media_count : 0,
      website: profile.website || "",
      profileUrl,
    },
    posts: Array.isArray(mediaPayload.data)
      ? mediaPayload.data.map(formatInstagramPost)
      : [],
    syncedAt: new Date().toISOString(),
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

async function getGoogleBusinessPayload() {
  const accessToken = await getGoogleAccessToken();
  const locationContext = await resolveGoogleLocationContext(accessToken);
  const [location, reviewsPayload] = await Promise.all([
    fetchGoogleLocation(accessToken, locationContext.locationId),
    fetchGoogleReviews(
      accessToken,
      locationContext.accountId,
      locationContext.locationId,
      Number(process.env.GOOGLE_REVIEW_LIMIT || DEFAULT_GOOGLE_REVIEW_LIMIT),
    ),
  ]);

  return {
    profile: {
      title: location.title || process.env.GOOGLE_BUSINESS_NAME || "ELETWAVE",
      description: (location.profile && location.profile.description) || "",
      status: location.openInfo ? location.openInfo.status || "" : "",
      phone:
        location.phoneNumbers && location.phoneNumbers.primaryPhone
          ? location.phoneNumbers.primaryPhone
          : "",
      website: location.websiteUri || "",
      isServiceAreaBusiness: Boolean(location.serviceArea),
      placeId:
        location.metadata && location.metadata.placeId
          ? location.metadata.placeId
          : null,
      mapsUrl:
        (location.metadata && location.metadata.mapsUri) ||
        process.env.GOOGLE_PROFILE_URL ||
        "",
      newReviewUrl:
        (location.metadata && location.metadata.newReviewUri) ||
        process.env.GOOGLE_REVIEW_URL ||
        "",
      profileUrl: process.env.GOOGLE_PROFILE_URL || "",
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
    syncedAt: new Date().toISOString(),
  };
}

async function getGoogleAccessToken() {
  const body = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
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

async function resolveGoogleLocationContext(accessToken) {
  if (process.env.GBP_ACCOUNT_ID && process.env.GBP_LOCATION_ID) {
    return {
      accountId: process.env.GBP_ACCOUNT_ID,
      locationId: process.env.GBP_LOCATION_ID,
    };
  }

  const accountsPayload = await fetchGoogleAccounts(accessToken);
  const accounts = Array.isArray(accountsPayload.accounts)
    ? accountsPayload.accounts
    : [];

  if (!accounts.length) {
    throw new Error("Nessun account Google Business disponibile");
  }

  const account = accounts[0];
  const locationsPayload = await fetchGoogleLocations(accessToken, account.name);
  const locations = Array.isArray(locationsPayload.locations)
    ? locationsPayload.locations
    : [];

  if (!locations.length) {
    throw new Error("Nessuna location Google Business disponibile");
  }

  const location = locations[0];

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

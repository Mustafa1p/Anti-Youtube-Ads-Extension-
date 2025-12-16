const HUD_ENABLED = false;
const HUD_ID = "ctf-adblock-hud";
const AD_SELECTORS = [
  "ytd-promoted-video-renderer",
  "ytd-promoted-sparkles-text-search-renderer",
  "ytd-promoted-sparkles-web-renderer",
  "ytd-in-feed-ad-layout-renderer",
  "ytd-display-ad-renderer",
  "ytd-companion-slot-renderer",
  "ytd-ad-slot-renderer",
  "ytd-player-legacy-desktop-watch-ads-renderer",
  "#player-ads",
  "#masthead-ad",
  "ytd-action-companion-ad-renderer",
  "ytd-engagement-panel-section-list-renderer[target-id='engagement-panel-ads']",
  ".ytp-ad-module",
  ".ytp-ad-overlay-container",
  ".ytp-ad-progress-list",
  ".ytp-ad-player-overlay",
  "ytd-enforcement-message-view-model",
  "ytd-enforcement-message-renderer",
  "#dialog.ytd-enforcement-message-view-model",
  "tp-yt-paper-dialog[label*='ad blocker']",
  "tp-yt-paper-dialog[dialog-renderer*='adBlocker']",
  // End screen overlays (video recommendations at end of video)
  ".ytp-ce-element",
  ".ytp-ce-covering-overlay",
  ".ytp-ce-element-show",
  ".ytp-ce-channel",
  ".ytp-ce-video",
  ".ytp-ce-playlist",
  ".ytp-ce-website-group",
  ".ytp-endscreen-content",
  ".html5-endscreen",
  ".videowall-endscreen"
];

const RICH_ITEM_SELECTOR = "ytd-rich-item-renderer[rendered-from-rich-grid]";
const SHORTS_SHELF_SELECTOR = "ytd-rich-shelf-renderer";
const SUPER_VOLUME_MAX = 500;
const SUPER_VOLUME_MIN = 0;
const SUPER_VOLUME_DEFAULT = 100;
const SUPER_VOLUME_STEP = 5;
const SUPER_VOLUME_FAST_STEP = 25;
const SUPER_VOLUME_STORAGE_KEY = "ctf-super-volume-percent";
const SIDEBAR_CURATE_DEBOUNCE_MS = 250;
const CURATED_BADGE_ID = "ctf-curated-sidebar-label";
const CURATED_ATTR = "data-ctf-curated";
const CURATED_SCORE_THRESHOLD = 4;
const STRICT_SCORE_THRESHOLD = 5;
const WATCHED_OVERLAY_SELECTOR =
  "ytd-thumbnail-overlay-resume-playback-renderer, ytd-thumbnail-overlay-playback-status-renderer";
const _MAX_YEAR_DELTA = 1; // Reserved for future year-based filtering
const MAX_DURATION_DELTA_SECONDS = 60;
const DURATION_SLACK_SECONDS = 15;
const KIDS_KEYWORD_HINTS = [
  "kid",
  "kids",
  "child",
  "children",
  "toddler",
  "baby",
  "nursery",
  "nursery rhyme",
  "nursery rhymes",
  "lullaby",
  "cartoon",
  "learning",
  "learn",
  "phonics",
  "abc",
  "123",
  "colors",
  "colour",
  "preschool",
  "pre-school",
  "kindergarten",
  "sing along",
  "sing-along",
  "storytime",
  "family fun",
  "animal song",
  "wheels on the bus",
  "baby shark",
  "cocomelon",
  "pinkfong",
  "little baby",
  "playtime",
  "kids songs",
  "kids song",
  "nursery song"
];
const KIDS_HINTS_NORMALIZED = KIDS_KEYWORD_HINTS.map((hint) => hint.toLowerCase());
const SECTION_EXCLUSION_KEYWORDS = [
  "watched",
  "recent",
  "recently",
  "for you",
  "mix",
  "playlist",
  "from your search",
  "from the series",
  "electronic dance music",
  "beats",
  "g-funk",
  "alternative hip hop",
  "recently uploaded"
];
const SIDEBAR_STRIP_SELECTORS = [
  "ytd-compact-radio-renderer",
  "ytd-compact-playlist-renderer",
  "ytd-compact-movie-renderer",
  "ytd-compact-channel-renderer",
  "ytd-compact-station-renderer"
];
const GENRE_CLUSTERS = [
  {
    name: "arabicRap",
    keywords: [
      "arabic",
      "arabicrap",
      "iraq",
      "iraqi",
      "iraqi rap",
      "khaleeji",
      "levant",
      "عرب",
      "العراق",
      "حسام",
      "محمد",
      "خليجي",
      "دسر",
      "اغنية"
    ]
  },
  {
    name: "turkishPop",
    keywords: [
      "turk",
      "turkish",
      "istanbul",
      "tilki",
      "ö",
      "ş",
      "ğ",
      "ç",
      "ayı",
      "müzik"
    ]
  },
  {
    name: "afroBeat",
    keywords: [
      "amapiano",
      "afrobeat",
      "afro-beat",
      "afrobeats",
      "dbn gogo",
      "nandipha",
      "africori",
      "za",
      "gqom",
      "amzin deep",
      "titom",
      "yuppe"
    ]
  },
  {
    name: "latinUrban",
    keywords: [
      "reggaeton",
      "latino",
      "latina",
      "espanol",
      "español",
      "barrio",
      "perreo",
      "urbano",
      "mexico",
      "colombia"
    ]
  },
  {
    name: "mainstreamHipHop",
    keywords: [
      "hip hop",
      "hip-hop",
      "rap",
      "g-unit",
      "gunit",
      "shady",
      "aftermath",
      "g-funk",
      "50 cent",
      "eminem",
      "dr. dre",
      "snoop",
      "lloyd banks",
      "tony yayo",
      "g unit"
    ]
  },
  {
    name: "pop",
    keywords: ["pop", "r&b", "dance", "club", "chart"]
  },
  {
    name: "edm",
    keywords: ["edm", "electronic", "techno", "house", "trance"]
  }
];
const SCRIPT_PATTERNS = [
  { name: "arabic", regex: /[\u0600-\u06FF]/ },
  { name: "cyrillic", regex: /[\u0400-\u04FF]/ },
  { name: "latinExtended", regex: /[çğıöşüáéíóúñãõ]/i },
  { name: "latin", regex: /[A-Za-z]/ }
];
const KEYWORD_STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "but",
  "by",
  "for",
  "from",
  "in",
  "into",
  "is",
  "it",
  "of",
  "on",
  "or",
  "that",
  "the",
  "to",
  "was",
  "were",
  "with"
]);

let hudIntervalId = null;
let domObserver = null;
let hasInvalidatedContext = false;
let premiumStyleInjected = false;
let pageEventHandler = null;
let superVolumePercent = SUPER_VOLUME_DEFAULT;
let superVolumePreferenceLoaded = false;
let superVolumeAudioCtx = null;
let superVolumeGainNode = null;
let superVolumeSourceMap = new WeakMap();
let superVolumeHotkeysBound = false;
let suppressNativeVolumeEvent = false;
let sliderDragActive = false;
let sidebarCurateHandle = null;
let sidebarCuratorBound = false;
let _lastSidebarVideoId = null; // Reserved for optimization
let _lastSidebarItemCount = 0; // Reserved for optimization
let chipSelectionHandle = null;

function scheduleChipSelection() {
  if (chipSelectionHandle) {
    clearTimeout(chipSelectionHandle);
  }
  chipSelectionHandle = setTimeout(() => {
    chipSelectionHandle = null;
    try {
      selectDefaultChip(document);
    } catch (error) {
      console.debug("[CTF-Blocker] chip selection failed", error);
    }
  }, 150);
}
function canMessageRuntime() {
  try {
    return (
      typeof chrome !== "undefined" &&
      !!chrome.runtime &&
      typeof chrome.runtime.sendMessage === "function" &&
      !!chrome.runtime.id
    );
  } catch (error) {
    return false;
  }
}

function collectMatches(root, selector) {
  const matches = new Set();
  const scope = root ?? document;
  const maybeAdd = (node) => {
    if (node) {
      matches.add(node);
    }
  };

  if (scope?.matches?.(selector)) {
    maybeAdd(scope);
  }

  scope?.querySelectorAll?.(selector)?.forEach((node) => {
    maybeAdd(node);
  });

  return Array.from(matches);
}

function isWatchPage() {
  return window.location?.pathname?.startsWith("/watch");
}

function getCurrentVideoId() {
  try {
    return new URLSearchParams(window.location.search).get("v");
  } catch (error) {
    console.debug("[CTF-Blocker] unable to parse video id", error);
    return null;
  }
}

function normalizeWhitespace(text) {
  return (text ?? "").replace(/\s+/g, " ").trim();
}

function normalizeComparableText(text) {
  return normalizeWhitespace(text).toLowerCase();
}

function containsKeywordFromList(text, keywordList) {
  const normalized = normalizeComparableText(text);
  if (!normalized) {
    return false;
  }
  return keywordList.some((hint) => normalized.includes(hint));
}

function detectKidsTheme(strings = []) {
  for (const value of strings) {
    if (containsKeywordFromList(value, KIDS_HINTS_NORMALIZED)) {
      return true;
    }
  }
  return false;
}

function detectGenreCluster(strings = [], scriptTag = null) {
  const normalized = strings.map((value) => normalizeComparableText(value)).filter(Boolean);
  if (scriptTag === "arabic") {
    return "arabicRap";
  }
  if (scriptTag === "cyrillic") {
    return "cyrillicMusic";
  }
  for (const cluster of GENRE_CLUSTERS) {
    if (cluster.scriptHint && scriptTag && cluster.scriptHint !== scriptTag) {
      continue;
    }
    if (cluster.keywords.some((hint) => normalized.some((value) => value.includes(hint)))) {
      return cluster.name;
    }
  }
  return null;
}

function detectScriptTag(strings = []) {
  const haystacks = strings.filter(Boolean);
  for (const pattern of SCRIPT_PATTERNS) {
    if (haystacks.some((value) => pattern.regex.test(value))) {
      return pattern.name === "latinExtended" ? "latin" : pattern.name;
    }
  }
  return null;
}

function tokenizeKeywords(input, limit = 5) {
  const normalized = normalizeComparableText(input);
  if (!normalized) {
    return [];
  }
  const tokens = normalized
    .split(/[^a-z0-9]+/)
    .map((token) => token.trim())
    .filter((token) => token && token.length > 1 && !KEYWORD_STOP_WORDS.has(token));
  const unique = [];
  for (const token of tokens) {
    if (!unique.includes(token)) {
      unique.push(token);
    }
    if (unique.length >= limit) {
      break;
    }
  }
  return unique;
}

function buildContextKeywords(title, channel, extraSources = []) {
  const keywordSet = new Set(tokenizeKeywords(title, 8));
  tokenizeKeywords(channel, 4).forEach((token) => keywordSet.add(token));
  extraSources.forEach((source) => {
    tokenizeKeywords(source, 6).forEach((token) => keywordSet.add(token));
  });
  return Array.from(keywordSet).slice(0, 20);
}

function deriveYearFromIsoDate(value) {
  if (!value) {
    return null;
  }
  const match = String(value).match(/(\d{4})/);
  return match ? Number(match[1]) : null;
}

function deriveYearFromText(text) {
  const normalized = normalizeWhitespace(text);
  if (!normalized) {
    return null;
  }
  const explicit = normalized.match(/(19|20)\d{2}/);
  if (explicit) {
    return Number(explicit[0]);
  }
  const relative = normalized.match(/(\d+)\s+(year|month|week|day)s?\s+ago/i);
  if (relative) {
    return yearFromRelative(Number(relative[1]), relative[2]);
  }
  const parsed = Date.parse(normalized);
  if (!Number.isNaN(parsed)) {
    return new Date(parsed).getFullYear();
  }
  return null;
}

function yearFromRelative(amount, unit) {
  if (!Number.isFinite(amount)) {
    return null;
  }
  const now = new Date();
  switch (unit?.toLowerCase()) {
    case "year":
      return now.getFullYear() - amount;
    case "month": {
      const computed = new Date(now.getFullYear(), now.getMonth() - amount, 1);
      return computed.getFullYear();
    }
    case "week": {
      const computed = new Date(now);
      computed.setDate(computed.getDate() - amount * 7);
      return computed.getFullYear();
    }
    case "day": {
      const computed = new Date(now);
      computed.setDate(computed.getDate() - amount);
      return computed.getFullYear();
    }
    default:
      return null;
  }
}

function getCurrentVideoContext() {
  const player = window.ytInitialPlayerResponse || {};
  const videoDetails = player.videoDetails || {};
  const microformat = player.microformat?.playerMicroformatRenderer || {};
  const uploadYear =
    deriveYearFromIsoDate(microformat.uploadDate) ||
    deriveYearFromText(document.querySelector('meta[itemprop="datePublished"]')?.content);
  const title = normalizeWhitespace(videoDetails.title || document.title.replace(/- YouTube$/i, ""));
  const channel =
    normalizeWhitespace(videoDetails.author) ||
    normalizeWhitespace(microformat.ownerChannelName) ||
    normalizeWhitespace(document.querySelector("#text.ytd-channel-name")?.textContent);
  const category =
    normalizeWhitespace(videoDetails.category) ||
    normalizeWhitespace(microformat.category) ||
    "";
  const videoId = videoDetails.videoId || getCurrentVideoId();
  const scriptTag = detectScriptTag([
    title,
    channel,
    ...(videoDetails.keywords ?? []),
    ...(microformat.tags ?? [])
  ]);
  const keywords = buildContextKeywords(title, channel, [
    ...(videoDetails.keywords ?? []),
    ...(microformat.tags ?? [])
  ]);
  const isKids = detectKidsTheme([title, channel, category, keywords.join(" ")]);
  const durationSeconds = Number(videoDetails.lengthSeconds || microformat.lengthSeconds);
  const genreCluster = detectGenreCluster(
    [title, channel, category, ...(videoDetails.keywords ?? []), ...(microformat.tags ?? [])],
    scriptTag
  );
  return {
    videoId,
    title,
    channel,
    category,
    uploadYear,
    keywords,
    isKids,
    durationSeconds: Number.isFinite(durationSeconds) ? durationSeconds : null,
    genreCluster,
    scriptTag
  };
}

function extractVideoIdFromNode(node) {
  const anchor = node?.querySelector?.("a#thumbnail, a#video-title");
  if (!anchor) {
    return null;
  }
  try {
    const target = new URL(anchor.href, window.location.origin);
    return target.searchParams.get("v");
  } catch (error) {
    return null;
  }
}

function isNodeWatched(node) {
  if (!node) {
    return false;
  }
  return Boolean(node.querySelector?.(WATCHED_OVERLAY_SELECTOR));
}

function parseDurationSeconds(text) {
  if (!text) {
    return null;
  }
  const normalized = text.trim();
  const hmsMatch = normalized.match(/(?:(\d+):)?(\d{1,2}):(\d{2})/);
  if (hmsMatch) {
    const hours = Number(hmsMatch[1] ?? 0);
    const minutes = Number(hmsMatch[2] ?? 0);
    const seconds = Number(hmsMatch[3] ?? 0);
    return hours * 3600 + minutes * 60 + seconds;
  }
  const minutesMatch = normalized.match(/(\d+(?:\.\d+)?)\s*(minutes|minute|min)/i);
  if (minutesMatch) {
    return Math.round(Number(minutesMatch[1]) * 60);
  }
  return null;
}

function extractDurationSeconds(node) {
  const overlay = node?.querySelector?.("ytd-thumbnail-overlay-time-status-renderer #text");
  const text = overlay?.textContent || node?.querySelector?.("#video-title")?.getAttribute("aria-label");
  return parseDurationSeconds(text);
}

function getSectionLabel(node) {
  const section = node?.closest?.("ytd-item-section-renderer");
  if (!section) {
    return "";
  }
  const titleNode =
    section.querySelector?.("#title-container yt-formatted-string") ||
    section.querySelector?.("#header yt-formatted-string") ||
    section.querySelector?.("#title-text");
  return normalizeWhitespace(titleNode?.textContent);
}

function shouldDropBySection(label) {
  if (!label) {
    return false;
  }
  const normalized = label.toLowerCase();
  return SECTION_EXCLUSION_KEYWORDS.some((keyword) => normalized.includes(keyword));
}

function extractRecommendationMetadata(node) {
  if (!node) {
    return null;
  }
  const titleEl = node.querySelector?.("#video-title");
  const title = normalizeWhitespace(titleEl?.textContent);
  const channel = normalizeWhitespace(
    node.querySelector?.("#channel-name a, #channel-name yt-formatted-string")?.textContent
  );
  const badgeNodes = node.querySelectorAll?.(
    "ytd-badge-supported-renderer yt-formatted-string, ytd-badge-supported-renderer .badge-style-type-simple"
  );
  const badges = Array.from(badgeNodes ?? [])
    .map((badge) => normalizeWhitespace(badge.textContent).toLowerCase())
    .filter(Boolean);
  const metadataLine = node.querySelector?.("#metadata-line span:nth-child(2)");
  const publishedText =
    normalizeWhitespace(metadataLine?.textContent) || normalizeWhitespace(titleEl?.getAttribute("aria-label"));
  const year = deriveYearFromText(publishedText);
  const videoId = extractVideoIdFromNode(node);
  const isKids = detectKidsTheme([title, channel, publishedText, badges.join(" ")]);
  const isWatched = isNodeWatched(node);
  const sectionLabel = getSectionLabel(node);
  const scriptTag = detectScriptTag([title, channel, publishedText, sectionLabel]);
  const genreCluster = detectGenreCluster(
    [title, channel, sectionLabel, badges.join(" "), publishedText],
    scriptTag
  );
  const durationSeconds = extractDurationSeconds(node);
  return {
    title,
    channel,
    badges,
    year,
    videoId,
    isKids,
    isWatched,
    sectionLabel,
    genreCluster,
    scriptTag,
    durationSeconds
  };
}

function computeRecommendationScore(context, metadata) {
  if (!context || !metadata) {
    return 0;
  }
  let score = 0;
  if (metadata.isWatched) {
    score -= 4;
  }
  if (
    context.channel &&
    metadata.channel &&
    normalizeComparableText(context.channel) === normalizeComparableText(metadata.channel)
  ) {
    score += 4;
  }
  if (context.uploadYear && metadata.year) {
    const delta = Math.abs(context.uploadYear - metadata.year);
    if (delta === 0) {
      score += 5;
    } else if (delta === 1) {
      score += 2;
    } else {
      score -= 3;
    }
  }
  const normalizedTitle = normalizeComparableText(metadata.title);
  context.keywords.forEach((keyword) => {
    if (keyword && normalizedTitle.includes(keyword)) {
      score += 1;
    }
  });
  if (context.category) {
    const categoryToken = normalizeComparableText(context.category);
    if (categoryToken && metadata.badges.some((badge) => badge.includes(categoryToken))) {
      score += 1;
    }
  }
  if (context.isKids) {
    if (metadata.isKids) {
      score += 4;
    } else {
      score -= 5;
    }
  }
  if (context.durationSeconds && metadata.durationSeconds) {
    const delta = metadata.durationSeconds - context.durationSeconds;
    if (Math.abs(delta) <= DURATION_SLACK_SECONDS) {
      score += 2;
    } else if (delta < 0 && Math.abs(delta) <= MAX_DURATION_DELTA_SECONDS) {
      score += 1;
    } else if (delta > MAX_DURATION_DELTA_SECONDS) {
      score -= 4;
    } else {
      score -= 1;
    }
  }
  if (context.genreCluster && metadata.genreCluster) {
    if (context.genreCluster === metadata.genreCluster) {
      score += 2;
    } else {
      score -= 3;
    }
  }
  if (context.scriptTag && metadata.scriptTag) {
    if (context.scriptTag === metadata.scriptTag) {
      score += 1;
    } else {
      score -= 4;
    }
  }
  return score;
}

function passesStrictFilters(context, metadata, score) {
  if (!metadata) {
    return false;
  }
  if (metadata.isWatched) {
    return false;
  }
  if (metadata.sectionLabel && shouldDropBySection(metadata.sectionLabel)) {
    return false;
  }
  if (context.isKids && !metadata.isKids) {
    return false;
  }
  if (context.uploadYear && metadata.year) {
    if (context.uploadYear !== metadata.year) {
      return false;
    }
  }
  if (context.durationSeconds && metadata.durationSeconds) {
    if (metadata.durationSeconds > context.durationSeconds + MAX_DURATION_DELTA_SECONDS) {
      return false;
    }
  }
  if (context.genreCluster && metadata.genreCluster && context.genreCluster !== metadata.genreCluster) {
    return false;
  }
  if (context.scriptTag && metadata.scriptTag && context.scriptTag !== metadata.scriptTag) {
    return false;
  }
  if (score < STRICT_SCORE_THRESHOLD && (!context.channel || normalizeComparableText(context.channel) !== normalizeComparableText(metadata.channel))) {
    return false;
  }
  return true;
}

function ensureCuratedSidebarBanner(context, curatedCount) {
  const host = document.querySelector("#secondary #related");
  const existing = document.getElementById(CURATED_BADGE_ID);
  if (!curatedCount || !context || !host) {
    if (existing) {
      existing.remove();
    }
    return;
  }
  const parts = [];
  if (context.uploadYear) {
    parts.push(context.uploadYear);
  }
  if (context.category) {
    parts.push(context.category);
  }
  const qualifier = parts.length ? parts.join(" • ") : "similar vibes";
  const text = `Curated for ${qualifier}`;
  if (existing) {
    existing.textContent = text;
    return;
  }
  const badge = document.createElement("div");
  badge.id = CURATED_BADGE_ID;
  badge.textContent = text;
  badge.style.cssText = [
    "font-size:13px",
    "font-weight:600",
    "margin:12px 0",
    "color:#f9d423",
    "letter-spacing:0.05em",
    "text-transform:uppercase"
  ].join(";");
  host.insertBefore(badge, host.firstChild);
}

function curateWatchSidebar() {
  if (!isWatchPage()) {
    _lastSidebarVideoId = null;
    _lastSidebarItemCount = 0;
    const existing = document.getElementById(CURATED_BADGE_ID);
    existing?.remove();
    return;
  }
  const context = getCurrentVideoContext();
  if (!context.videoId) {
    return;
  }
  const container = document.querySelector("ytd-watch-next-secondary-results-renderer #contents");
  if (!container) {
    return;
  }
  SIDEBAR_STRIP_SELECTORS.forEach((selector) => {
    collectMatches(container, selector).forEach((node) => node.remove());
  });
  const items = Array.from(container.querySelectorAll("ytd-compact-video-renderer"));
  if (!items.length) {
    return;
  }
  _lastSidebarVideoId = context.videoId;
  _lastSidebarItemCount = items.length;
  const ranked = items.map((node, index) => {
    const metadata = extractRecommendationMetadata(node);
    const score = computeRecommendationScore(context, metadata);
    return { node, metadata, score, originalIndex: index };
  });
  const sorted = ranked
    .slice()
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.originalIndex - b.originalIndex;
    });
  const needsReorder = sorted.some((entry, index) => entry.originalIndex !== index);
  const seenVideoIds = new Set();
  if (context.videoId) {
    seenVideoIds.add(context.videoId);
  }
  const filtered = [];
  let curatedCount = 0;
  let requiresDomRewrite = needsReorder;
  sorted.forEach((entry) => {
    const { node, score, metadata } = entry;
    const videoId = metadata?.videoId;
    const strictMismatch = !passesStrictFilters(context, metadata, score);
    const dropForDuplicate = Boolean(videoId && seenVideoIds.has(videoId));
    if (strictMismatch || dropForDuplicate) {
      requiresDomRewrite = true;
      node.remove();
      return;
    }
    if (videoId) {
      seenVideoIds.add(videoId);
    }
    if (score >= CURATED_SCORE_THRESHOLD) {
      node.setAttribute(CURATED_ATTR, "true");
      curatedCount += 1;
    } else {
      node.removeAttribute(CURATED_ATTR);
    }
    node.dataset.ctfSidebarScore = String(score);
    filtered.push(entry);
  });
  if (requiresDomRewrite) {
    const fragment = document.createDocumentFragment();
    filtered.forEach(({ node }) => {
      fragment.appendChild(node);
    });
    container.appendChild(fragment);
  }
  ensureCuratedSidebarBanner(context, curatedCount);
}

function scheduleSidebarCurate() {
  if (sidebarCurateHandle) {
    clearTimeout(sidebarCurateHandle);
  }
  sidebarCurateHandle = setTimeout(() => {
    sidebarCurateHandle = null;
    try {
      curateWatchSidebar();
    } catch (error) {
      console.debug("[CTF-Blocker] sidebar curate failed", error);
    }
  }, SIDEBAR_CURATE_DEBOUNCE_MS);
}

function bindSidebarCurator() {
  if (sidebarCuratorBound) {
    return;
  }
  sidebarCuratorBound = true;
  scheduleSidebarCurate();
  ["yt-navigate-finish", "yt-page-data-updated", "yt-navigate-start"].forEach((eventName) => {
    window.addEventListener(eventName, scheduleSidebarCurate, true);
    document.addEventListener(eventName, scheduleSidebarCurate, true);
  });
  window.addEventListener("popstate", scheduleSidebarCurate, true);
}

function ensureSuperVolumePreferenceLoaded() {
  if (superVolumePreferenceLoaded) {
    return;
  }
  superVolumePreferenceLoaded = true;
  try {
    const storedRaw = localStorage.getItem(SUPER_VOLUME_STORAGE_KEY);
    if (storedRaw !== null && storedRaw !== "") {
      const storedValue = Number(storedRaw);
      if (Number.isFinite(storedValue) && storedValue > 0) {
        superVolumePercent = clampSuperVolume(storedValue);
      } else {
        // Invalid or 0 value stored, reset to default
        superVolumePercent = SUPER_VOLUME_DEFAULT;
        persistSuperVolumePreference(SUPER_VOLUME_DEFAULT);
      }
    } else {
      // No preference stored, use default and save it
      superVolumePercent = SUPER_VOLUME_DEFAULT;
      persistSuperVolumePreference(SUPER_VOLUME_DEFAULT);
    }
  } catch (error) {
    console.debug("[CTF-Blocker] volume preference unavailable", error);
    superVolumePercent = SUPER_VOLUME_DEFAULT;
  }
}

function clampSuperVolume(value) {
  if (!Number.isFinite(value)) {
    return SUPER_VOLUME_DEFAULT;
  }
  return Math.max(SUPER_VOLUME_MIN, Math.min(SUPER_VOLUME_MAX, value));
}

function persistSuperVolumePreference(value) {
  try {
    localStorage.setItem(SUPER_VOLUME_STORAGE_KEY, String(value));
  } catch (error) {
    console.debug("[CTF-Blocker] volume preference save failed", error);
  }
}

function resumeSuperVolumeContext() {
  if (superVolumeAudioCtx && superVolumeAudioCtx.state === "suspended") {
    superVolumeAudioCtx.resume().catch(() => {});
  }
}

function ensureSuperVolumeControls(root = document) {
  ensureSuperVolumePreferenceLoaded();
  const video = ensureAudioGraph();
  if (video) {
    applySuperVolumeToMedia(video);
  }
  enhanceVolumePanel(root);
  ensureVolumeHotkeys();
  syncVolumeUi();
}

function ensureAudioGraph() {
  const video = document.querySelector("video.html5-main-video");
  if (!video) {
    return null;
  }
  const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextCtor) {
    return video;
  }
  if (!superVolumeAudioCtx) {
    try {
      superVolumeAudioCtx = new AudioContextCtor();
    } catch (error) {
      console.debug("[CTF-Blocker] audio context unavailable", error);
      return video;
    }
  }
  if (!superVolumeGainNode && superVolumeAudioCtx) {
    superVolumeGainNode = superVolumeAudioCtx.createGain();
    superVolumeGainNode.gain.value = superVolumePercent / 100;
    superVolumeGainNode.connect(superVolumeAudioCtx.destination);
  }
  if (superVolumeSourceMap.has(video)) {
    return video;
  }
  if (!superVolumeAudioCtx) {
    return video;
  }
  try {
    const source = superVolumeAudioCtx.createMediaElementSource(video);
    source.connect(superVolumeGainNode);
    superVolumeSourceMap.set(video, source);
    video.addEventListener("volumechange", handleNativeVolumeChange, true);
  } catch (error) {
    console.debug("[CTF-Blocker] unable to wire audio graph", error);
  }
  return video;
}

function applySuperVolumeToMedia(video) {
  if (!video) {
    return;
  }
  const normalized = Math.min(superVolumePercent / 100, 1);
  suppressNativeVolumeEvent = true;
  try {
    video.volume = normalized;
    video.dataset.ctfSuperVolumePercent = String(superVolumePercent);
  } catch (error) {
    console.debug("[CTF-Blocker] failed to set volume", error);
  } finally {
    suppressNativeVolumeEvent = false;
  }
  if (superVolumeGainNode) {
    superVolumeGainNode.gain.value = superVolumePercent / 100;
  }
}

function syncVolumeUi() {
  const panel = document.querySelector(".ytp-volume-panel");
  if (!panel) {
    return;
  }
  const rounded = Math.round(superVolumePercent);
  panel.setAttribute("aria-valuemin", String(SUPER_VOLUME_MIN));
  panel.setAttribute("aria-valuemax", String(SUPER_VOLUME_MAX));
  panel.setAttribute("aria-valuenow", String(rounded));
  panel.setAttribute("aria-valuetext", `${rounded}% volume`);
  panel.setAttribute("data-tooltip-title", `Volume (0-${SUPER_VOLUME_MAX}%)`);

  const slider = panel.querySelector(".ytp-volume-slider");
  if (!slider) {
    return;
  }
  const ratio = superVolumePercent / SUPER_VOLUME_MAX;
  slider.dataset.ctfVolume = String(rounded);
  slider.style.setProperty("--ctf-volume-ratio", ratio.toFixed(4));
  const handle = slider.querySelector(".ytp-volume-slider-handle");
  if (handle) {
    const sliderWidth = slider.clientWidth || parseFloat(getComputedStyle(slider).width) || 40;
    const offset = Math.max(0, Math.min(sliderWidth, ratio * sliderWidth));
    handle.style.left = `${offset}px`;
  }
}

function enhanceVolumePanel(root = document) {
  collectMatches(root, ".ytp-volume-panel").forEach((panel) => {
    if (!panel.dataset.ctfVolumePanel) {
      panel.dataset.ctfVolumePanel = "true";
      panel.addEventListener("keydown", handlePanelKeyDown, true);
    }
    panel.setAttribute("aria-valuemin", String(SUPER_VOLUME_MIN));
    panel.setAttribute("aria-valuemax", String(SUPER_VOLUME_MAX));
    panel.setAttribute("data-tooltip-title", `Volume (0-${SUPER_VOLUME_MAX}%)`);
    const slider = panel.querySelector(".ytp-volume-slider");
    if (slider) {
      prepareVolumeSlider(slider);
    }
  });
}

function prepareVolumeSlider(slider) {
  if (slider.dataset.ctfVolumeSlider === "true") {
    return;
  }
  slider.dataset.ctfVolumeSlider = "true";
  slider.classList.add("ctf-volume-boost-slider");
  const computedStyle = getComputedStyle(slider);
  if (computedStyle.position === "static") {
    slider.style.position = "relative";
  }
  slider.addEventListener("pointerdown", handleSliderPointerDown, true);
  slider.addEventListener("wheel", handleSliderWheel, { passive: false, capture: true });
}

function handleSliderPointerDown(event) {
  if (event.button !== 0 && event.pointerType !== "touch" && event.pointerType !== "pen") {
    return;
  }
  event.preventDefault();
  event.stopImmediatePropagation();
  const slider = event.currentTarget;
  sliderDragActive = true;
  slider.setPointerCapture?.(event.pointerId);
  slider.dataset.ctfPointerId = String(event.pointerId);
  slider.addEventListener("pointermove", handleSliderPointerMove, true);
  slider.addEventListener("pointerup", handleSliderPointerUp, true);
  slider.addEventListener("pointercancel", handleSliderPointerUp, true);
  updateVolumeFromPointer(slider, event, { skipPersist: true });
}

function handleSliderPointerMove(event) {
  if (!sliderDragActive) {
    return;
  }
  event.preventDefault();
  event.stopImmediatePropagation();
  const slider = event.currentTarget;
  updateVolumeFromPointer(slider, event, { skipPersist: true });
}

function handleSliderPointerUp(event) {
  if (!sliderDragActive) {
    return;
  }
  sliderDragActive = false;
  event.preventDefault();
  event.stopImmediatePropagation();
  const slider = event.currentTarget;
  const pointerId = slider.dataset.ctfPointerId;
  if (pointerId) {
    slider.releasePointerCapture?.(Number(pointerId));
    delete slider.dataset.ctfPointerId;
  }
  slider.removeEventListener("pointermove", handleSliderPointerMove, true);
  slider.removeEventListener("pointerup", handleSliderPointerUp, true);
  slider.removeEventListener("pointercancel", handleSliderPointerUp, true);
  updateVolumeFromPointer(slider, event);
}

function updateVolumeFromPointer(slider, event, options = {}) {
  const rect = slider.getBoundingClientRect();
  if (!rect.width) {
    return;
  }
  const ratio = (event.clientX - rect.left) / rect.width;
  const boundedRatio = Math.max(0, Math.min(1, ratio));
  resumeSuperVolumeContext();
  setSuperVolumePercent(boundedRatio * SUPER_VOLUME_MAX, { skipPersist: options.skipPersist });
}

function handleSliderWheel(event) {
  event.preventDefault();
  event.stopImmediatePropagation();
  if (!event.deltaY) {
    return;
  }
  const step = event.shiftKey ? SUPER_VOLUME_FAST_STEP : SUPER_VOLUME_STEP;
  const delta = event.deltaY < 0 ? step : -step;
  resumeSuperVolumeContext();
  setSuperVolumePercent(superVolumePercent + delta);
}

function handlePanelKeyDown(event) {
  const actionableKeys = new Set(["ArrowUp", "ArrowDown", "Home", "End", "PageUp", "PageDown"]);
  if (!actionableKeys.has(event.key)) {
    return;
  }
  event.preventDefault();
  event.stopImmediatePropagation();
  const baseStep = event.shiftKey ? SUPER_VOLUME_FAST_STEP : SUPER_VOLUME_STEP;
  switch (event.key) {
    case "ArrowUp":
    case "PageUp":
      resumeSuperVolumeContext();
      setSuperVolumePercent(superVolumePercent + baseStep);
      break;
    case "ArrowDown":
    case "PageDown":
      resumeSuperVolumeContext();
      setSuperVolumePercent(superVolumePercent - baseStep);
      break;
    case "Home":
      resumeSuperVolumeContext();
      setSuperVolumePercent(SUPER_VOLUME_MIN);
      break;
    case "End":
      resumeSuperVolumeContext();
      setSuperVolumePercent(SUPER_VOLUME_MAX);
      break;
    default:
      break;
  }
}

function ensureVolumeHotkeys() {
  if (superVolumeHotkeysBound) {
    return;
  }
  window.addEventListener("keydown", handleGlobalVolumeKeys, true);
  superVolumeHotkeysBound = true;
}

function handleGlobalVolumeKeys(event) {
  if (event.defaultPrevented) {
    return;
  }
  if (event.key !== "ArrowUp" && event.key !== "ArrowDown") {
    return;
  }
  if (shouldIgnoreKeyEvent(event)) {
    return;
  }
  event.preventDefault();
  event.stopImmediatePropagation();
  const step = event.shiftKey ? SUPER_VOLUME_FAST_STEP : SUPER_VOLUME_STEP;
  const delta = event.key === "ArrowUp" ? step : -step;
  resumeSuperVolumeContext();
  setSuperVolumePercent(superVolumePercent + delta);
}

function shouldIgnoreKeyEvent(event) {
  const target = event.target;
  if (!target) {
    return false;
  }
  if (target.isContentEditable) {
    return true;
  }
  const tagName = target.tagName;
  return tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "SELECT";
}

function handleNativeVolumeChange(event) {
  if (suppressNativeVolumeEvent) {
    return;
  }
  const video = event.currentTarget;
  if (!video || video.muted) {
    return;
  }
  applySuperVolumeToMedia(video);
  syncVolumeUi();
}

function setSuperVolumePercent(value, options = {}) {
  ensureSuperVolumePreferenceLoaded();
  const clamped = clampSuperVolume(value);
  if (clamped === superVolumePercent && !options.force) {
    if (!options.skipUi) {
      syncVolumeUi();
    }
    return;
  }
  superVolumePercent = clamped;
  if (!options.skipPersist) {
    persistSuperVolumePreference(clamped);
  }
  const video = ensureAudioGraph();
  if (video) {
    applySuperVolumeToMedia(video);
  }
  if (!options.skipUi) {
    syncVolumeUi();
  }
}

function removeStaticAds(root = document) {
  const scope = root ?? document;
  AD_SELECTORS.forEach((selector) => {
    collectMatches(scope, selector).forEach((node) => node.remove());
  });

  pruneSponsoredRichItems(scope);
  removeShortsShelves(scope);
  ensureSuperVolumeControls(scope);
}

function scrubPlayerAds() {
  const video = document.querySelector("video.html5-main-video");
  const adOverlay = document.querySelector(".ytp-ad-player-overlay");
  const adText = document.querySelector(".ytp-ad-text");
  const skipButton = document.querySelector(".ytp-ad-skip-button.ytp-button");

  if (skipButton) {
    skipButton.click();
  }

  if (adOverlay) {
    adOverlay.remove();
  }

  if (adText && /ad/i.test(adText.textContent ?? "")) {
    adText.remove();
  }

  if (video && document.body.classList.contains("ad-showing")) {
    video.currentTime = video.duration || video.currentTime;
    document.body.classList.remove("ad-showing");
  }
}

function pruneSponsoredRichItems(root = document) {
  collectMatches(root, RICH_ITEM_SELECTOR).forEach((item) => {
    const hasMedia = item.querySelector(
      "ytd-rich-grid-media, ytd-rich-grid-playlist-renderer, ytd-rich-grid-channel-renderer, yt-lockup-view-model"
    );
    const hasAdSignals = item.querySelector(
      "ytd-display-ad-renderer, ytd-ad-slot-renderer, ytd-promoted-video-renderer"
    );
    const contentContainer = item.querySelector("#content");
    const isVisiblyEmpty = contentContainer && contentContainer.children.length === 0;
    const playableLink = item.querySelector(
      'a[href^="/watch"], a[href^="/live"], a[href^="/shorts"], a[href^="/playlist"]'
    );
    const hasMetadata = item.querySelector(
      "yt-lockup-metadata-view-model, ytd-video-meta-block, h3.yt-lockup-metadata-view-model__heading-reset"
    );
    const hasRenderableContent = hasMedia && (playableLink || hasMetadata);

    if (hasAdSignals || isVisiblyEmpty || !hasRenderableContent) {
      item.remove();
    }
  });
}

function removeShortsShelves(root = document) {
  collectMatches(root, SHORTS_SHELF_SELECTOR).forEach((shelf) => {
    const title = shelf.querySelector("#title")?.textContent?.trim().toLowerCase();
    const hasShortsLockup = shelf.querySelector("ytm-shorts-lockup-view-model, ytd-reel-shelf-renderer");
    if ((title && title.includes("shorts")) || hasShortsLockup) {
      shelf.remove();
    }
  });
}

function selectDefaultChip(filterRoot = document) {
  const containers = filterRoot.querySelectorAll?.(
    "yt-related-chip-cloud-renderer, ytd-related-chip-cloud-renderer"
  );
  if (!containers?.length) {
    return;
  }
  containers.forEach((container) => {
    const chips = Array.from(container.querySelectorAll("yt-chip-cloud-chip-renderer"));
    if (chips.length < 2) {
      return;
    }
    const preferredIndex = Math.min(2, chips.length - 1);
    const fallbackChip = chips[chips.length - 1];
    const targetButton = getChipButton(chips[preferredIndex]) || getChipButton(fallbackChip);
    if (!targetButton || targetButton.getAttribute("aria-selected") === "true") {
      return;
    }
    targetButton.click();
    // Re-assert selection shortly after click because YouTube may re-render the chips.
    setTimeout(() => {
      if (targetButton.getAttribute("aria-selected") !== "true") {
        scheduleChipSelection();
      }
    }, 200);
  });
}

function getChipButton(chipRenderer) {
  if (!chipRenderer) {
    return null;
  }
  return (
    chipRenderer.querySelector("button[role='tab']") ||
    chipRenderer.querySelector("chip-shape button") ||
    chipRenderer.shadowRoot?.querySelector?.("button[role='tab'], button") ||
    chipRenderer.firstElementChild?.shadowRoot?.querySelector?.("button") ||
    null
  );
}

/**
 * Ensures the comments section is visible on watch pages.
 * YouTube may hide comments via hidden attribute, collapsed state, or JS manipulation.
 */
function ensureCommentsVisible() {
  if (!isWatchPage()) {
    return;
  }

  // Target selectors for comments section
  const commentsSelectors = [
    "ytd-comments#comments",
    "ytd-comments.ytd-watch-flexy",
    "#comments.ytd-watch-flexy",
    "#below.ytd-watch-flexy",
    "#below"
  ];

  commentsSelectors.forEach((selector) => {
    const element = document.querySelector(selector);
    if (element) {
      // Remove hidden attribute
      element.removeAttribute("hidden");
      element.removeAttribute("collapsed");
      
      // Force display via inline style as last resort
      if (getComputedStyle(element).display === "none") {
        element.style.setProperty("display", "block", "important");
      }
      if (getComputedStyle(element).visibility === "hidden") {
        element.style.setProperty("visibility", "visible", "important");
      }
    }
  });

  // Ensure item-section-renderer inside comments is visible
  const commentSections = document.querySelectorAll("ytd-comments ytd-item-section-renderer");
  commentSections.forEach((section) => {
    section.removeAttribute("hidden");
    if (getComputedStyle(section).display === "none") {
      section.style.setProperty("display", "block", "important");
    }
  });

  // HIDE the right-side engagement panel comments (keep only below-player comments)
  const engagementComments = document.querySelector(
    'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-comments-section"]'
  );
  if (engagementComments) {
    engagementComments.style.setProperty("display", "none", "important");
  }

  // Check for comment continuation and trigger load if needed
  const continuation = document.querySelector("ytd-comments ytd-continuation-item-renderer");
  if (continuation && !continuation.hasAttribute("data-ctf-triggered")) {
    continuation.setAttribute("data-ctf-triggered", "true");
    // Scroll into view briefly to trigger lazy loading
    const commentsEl = document.querySelector("ytd-comments#comments");
    if (commentsEl) {
      const rect = commentsEl.getBoundingClientRect();
      if (rect.top > window.innerHeight) {
        // Comments are below viewport, may need scroll trigger
        commentsEl.scrollIntoView({ behavior: "instant", block: "start" });
        // Scroll back up after brief moment
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: "instant" });
        }, 100);
      }
    }
  }
}

function injectPremiumStyles() {
  if (premiumStyleInjected) {
    return;
  }
  const style = document.createElement("style");
  style.id = "ctf-premium-style";
  style.textContent = `
    /* ===== RGB WAVE ANIMATION KEYFRAMES ===== */
    @keyframes ctf-rgb-wave {
      0% {
        background-position: 0% 50%;
        filter: drop-shadow(0 0 8px rgba(255, 0, 128, 0.6));
      }
      25% {
        filter: drop-shadow(0 0 12px rgba(0, 255, 255, 0.7));
      }
      50% {
        background-position: 100% 50%;
        filter: drop-shadow(0 0 10px rgba(128, 0, 255, 0.6));
      }
      75% {
        filter: drop-shadow(0 0 14px rgba(255, 255, 0, 0.7));
      }
      100% {
        background-position: 0% 50%;
        filter: drop-shadow(0 0 8px rgba(255, 0, 128, 0.6));
      }
    }

    @keyframes ctf-pulse-glow {
      0%, 100% {
        text-shadow: 
          0 0 4px rgba(255, 255, 255, 0.8),
          0 0 8px rgba(0, 255, 255, 0.6),
          0 0 16px rgba(128, 0, 255, 0.4);
      }
      50% {
        text-shadow: 
          0 0 8px rgba(255, 255, 255, 1),
          0 0 16px rgba(255, 0, 128, 0.8),
          0 0 24px rgba(255, 255, 0, 0.5);
      }
    }

    @keyframes ctf-x-pulse {
      0%, 100% {
        transform: scale(1);
        filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.9));
      }
      50% {
        transform: scale(1.08);
        filter: drop-shadow(0 0 12px rgba(0, 255, 255, 1)) drop-shadow(0 0 20px rgba(255, 0, 128, 0.7));
      }
    }

    ytd-topbar-logo-renderer #logo-icon {
      display: flex !important;
      align-items: center;
      width: auto !important;
      height: auto !important;
      position: relative;
    }

    ytd-topbar-logo-renderer #logo-icon-label {
      display: none !important;
    }

    ytd-topbar-logo-renderer #logo-icon .ctf-brand-text {
      font-family: "Google Sans", "Roboto", "Inter", sans-serif;
      font-weight: 800;
      font-size: 22px;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      background: linear-gradient(
        90deg,
        #ff0080,
        #ff8c00,
        #ffff00,
        #00ff88,
        #00cfff,
        #8000ff,
        #ff0080
      );
      background-size: 300% 300%;
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      animation: ctf-rgb-wave 4s ease-in-out infinite;
      position: relative;
      padding: 2px 0;
    }

    ytd-topbar-logo-renderer #logo-icon .ctf-brand-text::before {
      content: "";
      position: absolute;
      inset: -2px -4px;
      background: linear-gradient(
        90deg,
        rgba(255, 0, 128, 0.15),
        rgba(0, 255, 255, 0.15),
        rgba(128, 0, 255, 0.15)
      );
      border-radius: 6px;
      z-index: -1;
      opacity: 0.5;
      filter: blur(8px);
    }

    ytd-topbar-logo-renderer #logo-icon .ctf-brand-text strong {
      color: #ffffff;
      -webkit-text-fill-color: #ffffff;
      font-weight: 900;
      display: inline-block;
      animation: ctf-x-pulse 2s ease-in-out infinite, ctf-pulse-glow 2s ease-in-out infinite;
      margin-left: 2px;
    }

    /* ===== LOGO HOVER EFFECTS ===== */
    ytd-topbar-logo-renderer #logo-icon:hover .ctf-brand-text {
      animation-duration: 1.5s;
      filter: brightness(1.2);
      transform: scale(1.05);
      transition: transform 0.3s ease, filter 0.3s ease;
    }

    ytd-topbar-logo-renderer #logo-icon:hover .ctf-brand-text strong {
      animation-duration: 0.8s;
    }

    ytd-topbar-logo-renderer #logo-icon .ctf-brand-text {
      transition: transform 0.3s ease, filter 0.3s ease;
      cursor: pointer;
    }

    :root {
      --yt-spec-brand-background-solid: #050505;
      --yt-spec-brand-background-primary: #050505;
      --yt-spec-text-primary: #f5f5f5;
    }

    /* ===== SUPER VOLUME SLIDER (500% BOOST) - REFINED UI/UX ===== */
    .ctf-volume-boost-slider {
      position: relative !important;
      width: 100px !important;
      min-width: 100px !important;
      height: 6px !important;
      background: rgba(255, 255, 255, 0.2) !important;
      border-radius: 3px !important;
      overflow: visible !important;
      margin: 0 10px !important;
      cursor: pointer !important;
      transition: height 0.1s ease;
      border: none !important;
    }

    /* Expand height on hover for better interaction target */
    .ctf-volume-boost-slider:hover {
      height: 8px !important;
    }

    /* The colored fill bar */
    .ctf-volume-boost-slider::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      background: linear-gradient(90deg, 
        #ffffff 0%, 
        #ffffff 20%, 
        #00cfff 40%, 
        #ff0080 100%
      );
      opacity: 1;
      transform-origin: left center;
      transform: scaleX(var(--ctf-volume-ratio, 0));
      border-radius: 3px;
      pointer-events: none;
      box-shadow: 0 0 8px rgba(0, 207, 255, 0.4);
    }

    /* Percentage tooltip - only shows on hover/drag */
    .ctf-volume-boost-slider[data-ctf-volume]::after {
      content: attr(data-ctf-volume) "%";
      position: absolute;
      top: -32px;
      left: 50%;
      transform: translateX(-50%) scale(0.8);
      background: rgba(28, 28, 28, 0.9);
      color: #fff;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      font-family: "Roboto", sans-serif;
      opacity: 0;
      transition: opacity 0.2s ease, transform 0.2s ease;
      pointer-events: none;
      white-space: nowrap;
      box-shadow: 0 2px 8px rgba(0,0,0,0.5);
      border: 1px solid rgba(255,255,255,0.1);
    }

    /* Show tooltip when hovering slider or when dragging (active) */
    .ctf-volume-boost-slider:hover::after,
    .ctf-volume-boost-slider:active::after {
      opacity: 1;
      transform: translateX(-50%) scale(1);
    }

    /* The circular handle - HIDDEN per user request */
    .ctf-volume-boost-slider .ytp-volume-slider-handle {
      display: none !important;
    }

    /* Handle hover effect - REMOVED */
    .ctf-volume-boost-slider:hover .ytp-volume-slider-handle {
      display: none !important;
    }

    /* Volume markers for 100%, 200%, etc */
    .ctf-volume-boost-slider .ytp-volume-slider {
      position: relative;
    }

    ytd-compact-video-renderer[data-ctf-curated="true"] {
      border: 1px solid rgba(249,212,35,0.4);
      border-radius: 12px;
      padding: 6px;
      background: rgba(5,5,5,0.35);
    }

    #ctf-curated-sidebar-label {
      font-size: 13px;
      font-weight: 600;
      color: #f9d423;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    /* ===== 4-ROW GRID LAYOUT FOR HOME PAGE ===== */
    ytd-rich-grid-renderer {
      --ytd-rich-grid-items-per-row: 4 !important;
      --ytd-rich-grid-posts-per-row: 4 !important;
      --ytd-rich-grid-movies-per-row: 4 !important;
      --ytd-rich-grid-game-cards-per-row: 4 !important;
    }

    ytd-rich-grid-renderer #contents.ytd-rich-grid-renderer {
      display: grid !important;
      grid-template-columns: repeat(4, 1fr) !important;
      gap: 16px !important;
      grid-auto-flow: row !important;
    }

    /* Force all rich items to respect grid sizing */
    ytd-rich-item-renderer[rendered-from-rich-grid] {
      width: 100% !important;
      max-width: 100% !important;
      min-width: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
      box-sizing: border-box !important;
      grid-column: span 1 !important;
    }
    
    ytd-rich-item-renderer[rendered-from-rich-grid] #content {
      width: 100% !important;
      max-width: 100% !important;
      min-width: 0 !important;
    }

    /* Force all media containers to 100% width */
    ytd-rich-item-renderer[rendered-from-rich-grid] ytd-thumbnail,
    ytd-rich-item-renderer[rendered-from-rich-grid] ytd-rich-grid-media,
    ytd-rich-item-renderer[rendered-from-rich-grid] ytd-rich-grid-slim-media,
    ytd-rich-item-renderer[rendered-from-rich-grid] ytd-video-renderer,
    ytd-rich-item-renderer[rendered-from-rich-grid] ytd-grid-video-renderer,
    ytd-rich-item-renderer[rendered-from-rich-grid] ytd-playlist-renderer,
    ytd-rich-item-renderer[rendered-from-rich-grid] ytd-rich-grid-playlist-renderer,
    ytd-rich-item-renderer[rendered-from-rich-grid] yt-lockup-view-model,
    ytd-rich-item-renderer[rendered-from-rich-grid] yt-image {
      width: 100% !important;
      max-width: 100% !important;
      min-width: 0 !important;
    }

    ytd-rich-item-renderer[rendered-from-rich-grid] ytd-thumbnail a,
    ytd-rich-item-renderer[rendered-from-rich-grid] ytd-thumbnail #thumbnail,
    ytd-rich-item-renderer[rendered-from-rich-grid] ytd-thumbnail img,
    ytd-rich-item-renderer[rendered-from-rich-grid] yt-image img {
      width: 100% !important;
      max-width: 100% !important;
      height: auto !important;
    }

    ytd-rich-grid-row {
      display: contents !important;
    }

    /* ===== CONSTRAIN RICH SECTION RENDERERS (MIXES, PROMOTIONS) ===== */
    ytd-rich-section-renderer {
      width: 100% !important;
      max-width: 100% !important;
      grid-column: span 4 !important;
    }

    /* Ensure any content within sections also respects grid */
    ytd-rich-section-renderer ytd-rich-item-renderer {
      width: calc(25% - 12px) !important;
      max-width: calc(25% - 12px) !important;
      min-width: 0 !important;
      display: inline-block !important;
      vertical-align: top !important;
      margin: 0 16px 16px 0 !important;
    }

    ytd-rich-section-renderer ytd-rich-item-renderer:nth-child(4n) {
      margin-right: 0 !important;
    }

    /* ===== REMOVE EMPTY SPACE / GAPS ===== */
    ytd-rich-grid-renderer #contents.ytd-rich-grid-renderer > ytd-rich-item-renderer:empty,
    ytd-rich-grid-renderer #contents.ytd-rich-grid-renderer > ytd-rich-section-renderer:empty {
      display: none !important;
    }

    ytd-two-column-browse-results-renderer {
      padding: 0 24px !important;
    }

    #primary.ytd-two-column-browse-results-renderer {
      padding-top: 24px !important;
    }

    ytd-rich-grid-renderer {
      margin: 0 !important;
      padding: 0 !important;
    }

    /* ===== VOLUME PANEL SIZE FOR 500% SUPER VOLUME ===== */
    .ytp-volume-panel {
      width: auto !important;
      min-width: 150px !important;
      display: flex !important;
      align-items: center !important;
      transition: width 0.2s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s !important;
      overflow: visible !important;
    }

    /* Ensure the native slider container matches our custom slider */
    .ytp-volume-slider {
      width: 100px !important;
      z-index: 500 !important;
      overflow: visible !important;
    }

    .ytp-volume-control-hover .ytp-volume-panel {
      width: auto !important;
      min-width: 150px !important;
    }

    /* Ensure panel stays open when interacting */
    .ytp-volume-area:hover .ytp-volume-panel,
    .ytp-volume-panel:hover {
      width: auto !important;
      min-width: 150px !important;
      opacity: 1 !important;
    }

    /* ===== HIDE END SCREEN OVERLAYS ===== */
    /* Hide video end cards/recommendations that cover the video */
    .ytp-ce-element,
    .ytp-ce-covering-overlay,
    .ytp-ce-element-show,
    .ytp-ce-channel,
    .ytp-ce-video,
    .ytp-ce-playlist,
    .ytp-ce-website-group,
    .ytp-endscreen-content,
    .ytp-ce-expanding-overlay,
    .ytp-ce-expanding-image,
    .ytp-ce-shadow,
    .html5-endscreen,
    .videowall-endscreen {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    /* Also hide the endscreen container */
    .ytp-endscreen-previous,
    .ytp-endscreen-next,
    .ytp-show-tiles .ytp-videowall-still {
      display: none !important;
    }

    /* ===== HIDE RIGHT-SIDE COMMENTS PANEL ===== */
    /* Only show comments below the player, not in the right sidebar */
    ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-comments-section"] {
      display: none !important;
      visibility: hidden !important;
    }
  `;
  document.head.appendChild(style);
  premiumStyleInjected = true;
}

function applyPremiumBranding() {
  injectPremiumStyles();
  const logoIcon = document.querySelector("ytd-topbar-logo-renderer #logo-icon");
  if (logoIcon && !logoIcon.dataset.ctfPremium) {
    const textSpan = document.createElement("span");
    textSpan.className = "ctf-brand-text";
    textSpan.innerHTML = "IPTUBE <strong>X</strong>";
    logoIcon.innerHTML = "";
    logoIcon.appendChild(textSpan);
    logoIcon.dataset.ctfPremium = "true";
  }

  const label = document.querySelector("ytd-topbar-logo-renderer #logo-icon-label");
  if (label) {
    label.textContent = "IPTUBE X";
  }

  const masthead = document.querySelector("ytd-masthead");
  if (masthead && !masthead.dataset.ctfPremium) {
    masthead.dataset.ctfPremium = "true";
    masthead.style.background = "#050505";
    masthead.style.borderBottom = "2px solid";
    masthead.style.borderImage = "linear-gradient(90deg, #ff0080, #00cfff, #8000ff, #ff0080) 1";
  }
}

function ensureHud() {
  if (!HUD_ENABLED) {
    const existing = document.getElementById(HUD_ID);
    if (existing) {
      existing.remove();
    }
    return;
  }

  if (document.getElementById(HUD_ID)) {
    return;
  }

  const hud = document.createElement("div");
  hud.id = HUD_ID;
  hud.style.cssText = [
    "position:fixed",
    "z-index:999999",
    "top:16px",
    "right:16px",
    "padding:8px 12px",
    "background:#0f0f0f",
    "color:#00e5ff",
    "font-family:Inter,Roboto,sans-serif",
    "font-size:12px",
    "border-radius:6px",
    "box-shadow:0 4px 12px rgba(0,0,0,0.4)",
    "cursor:default",
    "user-select:none"
  ].join(";");

  const textSpan = document.createElement("span");
  textSpan.id = `${HUD_ID}-text`;
  textSpan.textContent = "Blocking YouTube ads…";

  const resetButton = document.createElement("button");
  resetButton.textContent = "reset";
  resetButton.style.cssText = [
    "margin-left:8px",
    "padding:2px 6px",
    "font-size:11px",
    "border:none",
    "border-radius:4px",
    "background:#272727",
    "color:#fff"
  ].join(";");

  resetButton.addEventListener("click", () => {
    safeSendMessage({ type: "RESET_BLOCK_STATS" }, () => {
      updateHud();
    });
  });

  hud.appendChild(textSpan);
  hud.appendChild(resetButton);
  document.body.appendChild(hud);
}

function setHudText(text) {
  if (!HUD_ENABLED) {
    return;
  }
  const textSpan = document.getElementById(`${HUD_ID}-text`);
  if (textSpan) {
    textSpan.textContent = text;
  }
}

function teardownOnInvalidation() {
  if (hasInvalidatedContext) {
    return;
  }
  hasInvalidatedContext = true;
  if (hudIntervalId) {
    clearInterval(hudIntervalId);
    hudIntervalId = null;
  }
  if (domObserver) {
    domObserver.disconnect();
    domObserver = null;
  }
  if (sidebarCurateHandle) {
    clearTimeout(sidebarCurateHandle);
    sidebarCurateHandle = null;
  }
  if (chipSelectionHandle) {
    clearTimeout(chipSelectionHandle);
    chipSelectionHandle = null;
  }
  if (pageEventHandler) {
    window.removeEventListener("message", pageEventHandler);
    pageEventHandler = null;
  }
  setHudText("Extension reloading…");
}

function safeSendMessage(payload, onSuccess) {
  if (hasInvalidatedContext) {
    teardownOnInvalidation();
    return;
  }

  if (!canMessageRuntime()) {
    teardownOnInvalidation();
    return;
  }

  try {
    chrome.runtime.sendMessage(payload, (response) => {
      if (chrome.runtime.lastError) {
        const message = chrome.runtime.lastError.message || "unknown";
        if (/context invalidated/i.test(message)) {
          teardownOnInvalidation();
        } else {
          console.debug("[CTF-Blocker] runtime message error", message);
        }
        return;
      }
      onSuccess?.(response);
    });
  } catch (error) {
    console.debug("[CTF-Blocker] runtime message failed", error);
    teardownOnInvalidation();
  }
}

function bindPageBridge() {
  if (pageEventHandler) {
    window.removeEventListener("message", pageEventHandler);
  }

  pageEventHandler = (event) => {
    if (event.source !== window) {
      return;
    }

    const data = event.data;
    if (!data || data.source !== "CTF_ADBLOCKER" || data.type !== "AD_REQUEST_BLOCKED") {
      return;
    }

    safeSendMessage({ type: "INCREMENT_BLOCK_COUNT" }, (response) => {
      if (HUD_ENABLED) {
        const count = response?.blockedRequestCount ?? 0;
        setHudText(`Ads blocked: ${count}`);
      }
    });
  };

  window.addEventListener("message", pageEventHandler);
}

function updateHud() {
  if (!HUD_ENABLED) {
    return;
  }
  safeSendMessage({ type: "GET_BLOCK_STATS" }, (response) => {
    const count = response?.blockedRequestCount ?? 0;
    setHudText(`Ads blocked: ${count}`);
  });
}

function initMutationObserver() {
  domObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "childList") {
        removeStaticAds(mutation.target);
        scrubPlayerAds();
        applyPremiumBranding();
        // Ensure comments stay visible on watch pages
        if (isWatchPage()) {
          ensureCommentsVisible();
        }
        if (
          isWatchPage() &&
          mutation.target instanceof Element &&
          mutation.target.closest?.("#secondary")
        ) {
          scheduleSidebarCurate();
        }
        if (
          mutation.target instanceof Element &&
          (mutation.target.closest?.("yt-related-chip-cloud-renderer") ||
            mutation.target.closest?.("ytd-related-chip-cloud-renderer"))
        ) {
          scheduleChipSelection();
        }
      }
    }
  });

  domObserver.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
}

function bootstrap() {
  ensureSuperVolumePreferenceLoaded();
  ensureHud();
  removeStaticAds();
  scrubPlayerAds();
  applyPremiumBranding();
  ensureSuperVolumeControls();
  ensureCommentsVisible();
  scheduleChipSelection();
  bindSidebarCurator();
  bindPageBridge();
  initMutationObserver();
  if (HUD_ENABLED) {
    updateHud();
    if (hudIntervalId) {
      clearInterval(hudIntervalId);
    }
    hudIntervalId = setInterval(updateHud, 5000);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrap);
} else {
  bootstrap();
}

window.addEventListener("unload", () => {
  teardownOnInvalidation();
});

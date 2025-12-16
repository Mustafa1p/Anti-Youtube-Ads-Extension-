(() => {
  "use strict";

  const HARD_BLOCK_KEYS = new Set([
    "adPlacements",
    "playerAds",
    "adSlotting",
    "adSlots",
    "adBreakServiceSettings",
    "adSignalsInfo",
    "adSafetyReason",
    "adDisplayConfig",
    "adRenderers",
    "adInfoRenderer",
    "adBreaks",
    "adParams",
    "adPod",
    "adMarkers",
    "playerAdsOverlay",
    "watchAdsInfo",
    "promotedSparklesTextSearchRenderer",
    "promotedSparklesWebRenderer",
    "promotedTweetRenderer",
    "promotedVideoRenderer",
    "promotedSkippableVideoRenderer",
    "promotedProductRenderer",
    "sponsorshipsRenderer",
    "paidContentOverlayRenderer",
    "campaign"
  ]);

  const KEY_PATTERNS = [
    /^ad(?!ap|ditional|just|aptive|min)/i,  // "admin" should not be blocked
    /^promoted(?!Comment|Reply)/i,  // Don't block promotedComment/promotedReply
    /^sponsor(?!Button|Channel)/i,  // Don't block sponsorButton or sponsorChannel (legit features)
    /paidcontent/i,
    /pagead/i,
    /companionad/i
  ];

  const BLOCK_URL_PATTERNS = [
    /youtube\.com\/api\/stats\/watchtime.*(el=adunit|is_ad=1|adformat=)/i,
    /youtube\.com\/api\/stats\/ads/i,
    /youtube\.com\/pagead\//i,
    /doubleclick\.net\/.*(ad|pagead|gampad)/i
  ];

  const ENFORCEMENT_REASON_PATTERNS = [
    /ad blockers violate/i,
    /video playback is blocked/i,
    /allowlist youtube/i,
    /turn off your ad blocker/i,
    /ads allow youtube/i,
    // Bot detection patterns
    /confirm.*you.*not.*bot/i,
    /sign.*in.*confirm/i,
    /unusual traffic/i,
    /automated.*requests/i,
    /verify.*human/i,
    /captcha/i,
    /challenge/i,
    /suspicious.*activity/i,
    /bot.*detected/i,
    /please.*sign.*in/i,
    /verify.*identity/i
  ];

  const ENFORCEMENT_RENDERER_KEYS = new Set([
    "adBlockerMessageRenderer",
    "adBlockerMessage",
    "adblockerdialogrenderer",
    "enforcementMessageRenderer",
    "enforcementEntity",
    // Bot challenge renderers
    "botGuardRenderer",
    "challengeRenderer",
    "captchaRenderer",
    "verificationRenderer",
    "signInRenderer",
    "restrictedSignInRenderer",
    "verifyRenderer",
    "humanVerificationRenderer",
    "liveChatActionPanelRenderer"
  ]);

  const ENFORCEMENT_FLAG_KEYS = [
    "web_player_enable_ad_blocker_enforcement",
    "html5_enable_ad_block_detection",
    "web_player_disable_ads_on_enforcement",
    "web_player_show_enforcement_message",
    "web_player_skip_ad_button_with_delay_killswitch",
    "kevlar_watch_verify_ads_blocked",
    "web_player_embedded_enable_ad_blocker_enforcement",
    "desktop_player_attestation_enable",
    "player_double_afc_explicit_hardening",
    "enable_web_player_google_ads_measurable",
    "web_player_ads_strike_count",
    "web_player_ads_strike_limit",
    "web_player_show_ads_enforcement_notification",
    // Bot detection flags
    "enable_bot_guard",
    "enable_botguard_attestation",
    "enable_client_sli_logging",
    "web_player_enable_client_flags_logging",
    "enable_player_attestation",
    "enable_player_integrity",
    "player_attestation_required",
    "disable_new_pause_state3",
    "web_logging_max_batch",
    "enable_dsp",
    "enable_client_integrity_check",
    "enable_premium_voluntary_pause",
    "enable_gel_log_commands",
    "web_player_enable_rv_pip",
    "enable_inline_preview_refresh_hover"
  ];

  // Account-level features that indicate ad-block status
  const ACCOUNT_ENFORCEMENT_KEYS = new Set([
    "adBlockerDetected",
    "adBlockViolation",
    "adsBlockedCount",
    "enforcementNotification",
    "violationCount",
    "strikeCount",
    "adsMuted"
  ]);

  const PLAYER_ENDPOINT_REGEX = /\/youtubei\/v\d+\/player/i;
  const SPOOF_VISITOR_PREFIX = "CgtJUFRCX1ZJU0lUT1I="; // base64("IPTB_VISITOR")

  function getOriginalYtcfgValue(key) {
    return window.__ctfOriginalYtcfg?.[key];
  }

  function getSpoofVisitorData() {
    if (window.__ctfSpoofVisitorData) {
      return window.__ctfSpoofVisitorData;
    }
    const seed = getOriginalYtcfgValue("visitorData") || Math.random().toString(36).slice(2);
    const encoded = btoa(`${SPOOF_VISITOR_PREFIX}_${seed}`).replace(/=+$/, "");
    window.__ctfSpoofVisitorData = encoded.slice(0, 32);
    return window.__ctfSpoofVisitorData;
  }

  function normalizeHeadersInit(headersInit) {
    if (!headersInit) {
      return {};
    }
    if (headersInit instanceof Headers) {
      const result = {};
      headersInit.forEach((value, key) => {
        result[key] = value;
      });
      return result;
    }
    if (Array.isArray(headersInit)) {
      return headersInit.reduce((acc, entry) => {
        if (Array.isArray(entry) && entry[0]) {
          acc[entry[0]] = entry[1];
        }
        return acc;
      }, {});
    }
    return { ...headersInit };
  }

  function stripAuthHeaders(headers) {
    const sanitized = { ...headers };
    const blocked = ["authorization", "x-goog-authuser", "x-youtube-identity-token", "x-goog-visitor-id"];
    Object.keys(sanitized).forEach((key) => {
      if (blocked.includes(key.toLowerCase())) {
        delete sanitized[key];
      }
    });
    sanitized["x-goog-visitor-id"] = getSpoofVisitorData();
    return sanitized;
  }

  function spoofPlayerRequestBody(body) {
    if (typeof body !== "string" || !body.trim().startsWith("{")) {
      return body;
    }
    try {
      const payload = JSON.parse(body);
      const context = payload.context = payload.context || {};
      const client = context.client = context.client || {};
      client.loggedIn = false;
      client.visitorData = getSpoofVisitorData();
      client.accountIndex = 0;
      client.userInterfaceTheme = client.userInterfaceTheme || "CLASSIC";
      client.mainAppWebInfo = client.mainAppWebInfo || {};
      client.mainAppWebInfo.graftUrl = client.mainAppWebInfo.graftUrl || `${window.location.pathname}${window.location.search}`;

      const request = context.request = context.request || {};
      request.sessionIndex = null;
      request.internalExperimentFlags = request.internalExperimentFlags || [];

      payload.playbackContext = payload.playbackContext || {};
      payload.playbackContext.contentPlaybackContext = payload.playbackContext.contentPlaybackContext || {};
      if (!payload.playbackContext.contentPlaybackContext.signatureTimestamp && typeof window.ytcfg?.get === "function") {
        payload.playbackContext.contentPlaybackContext.signatureTimestamp = window.ytcfg.get("STS");
      }
      payload.racyCheckOk = true;
      payload.contentCheckOk = true;
      return JSON.stringify(payload);
    } catch (error) {
      return body;
    }
  }

  function applyLoggedOutSpoof(input, init) {
    const targetUrl = normalizeUrlCandidate(input);
    if (!targetUrl || !PLAYER_ENDPOINT_REGEX.test(targetUrl)) {
      return { input, init };
    }

    // Request object -> clone into new Request with sanitized headers/body
    if (typeof Request !== "undefined" && input instanceof Request) {
      try {
        const spoofedHeaders = stripAuthHeaders(normalizeHeadersInit(input.headers));
        const spoofedRequest = new Request(input, {
          credentials: "omit",
          mode: "cors",
          cache: "no-store",
          headers: spoofedHeaders,
          redirect: input.redirect,
          referrer: input.referrer,
          referrerPolicy: input.referrerPolicy,
          integrity: input.integrity,
          keepalive: input.keepalive,
          signal: input.signal
        });

        // When Request was constructed without explicit body in init, constructor reuses original body stream.
        return { input: spoofedRequest, init };
      } catch (error) {
        console.warn('[IPTUBE-X] Unable to spoof Request payload:', error);
        return { input, init };
      }
    }

    if (typeof input !== "string" && !(input instanceof URL)) {
      return { input, init };
    }

    const clonedInit = init ? { ...init } : {};
    clonedInit.credentials = "omit";
    clonedInit.mode = clonedInit.mode || "cors";
    clonedInit.cache = "no-store";
    clonedInit.headers = stripAuthHeaders(normalizeHeadersInit(clonedInit.headers));
    if (typeof clonedInit.body === "string") {
      clonedInit.body = spoofPlayerRequestBody(clonedInit.body);
    }
    return { input: targetUrl, init: clonedInit };
  }

  function normalizeUrlCandidate(target) {
    try {
      if (typeof target === "string") {
        return new URL(target, window.location.href).href;
      }
      if (target instanceof URL) {
        return target.href;
      }
      if (typeof Request !== "undefined" && target instanceof Request) {
        return target.url;
      }
      if (target && typeof target.url === "string") {
        return new URL(target.url, window.location.href).href;
      }
    } catch (error) {
      // Ignore malformed URLs; they'll simply bypass the drop logic.
    }
    return null;
  }

  function getBlockedUrl(target) {
    const normalized = normalizeUrlCandidate(target);
    if (!normalized) {
      return null;
    }
    return BLOCK_URL_PATTERNS.some((regex) => regex.test(normalized)) ? normalized : null;
  }

  function notifyBlocked(kind, url) {
    try {
      window.postMessage(
        {
          source: "CTF_ADBLOCKER",
          type: "AD_REQUEST_BLOCKED",
          detail: { kind, url }
        },
        "*"
      );
    } catch (error) {
      // Swallow cross-origin postMessage issues.
    }
  }

  function isObject(value) {
    return value !== null && typeof value === "object";
  }

  function looksPromotedNode(value) {
    if (!isObject(value)) {
      return false;
    }

    // Check for ad-specific renderer keys, but exclude comment-related nodes
    const keys = Object.keys(value);

    // If this looks like a comment/reply node, don't treat it as promoted
    if (keys.some((key) => /^comment|^reply|continuation/i.test(key))) {
      return false;
    }

    return keys.some((key) =>
      /^promotedVideo|^promotedSparkles|^adRenderer|^adSlotRenderer|^sponsoredVideo/i.test(key)
    );
  }

  function looksEnforcementNode(value) {
    if (!isObject(value)) {
      return false;
    }
    return Object.keys(value).some((key) => ENFORCEMENT_RENDERER_KEYS.has(key));
  }

  function shouldBlankKey(key) {
    if (HARD_BLOCK_KEYS.has(key)) {
      return true;
    }
    return KEY_PATTERNS.some((regex) => regex.test(key));
  }

  function blankValue(target) {
    if (Array.isArray(target)) {
      target.length = 0;
      return;
    }
    if (isObject(target)) {
      Object.keys(target).forEach((key) => delete target[key]);
      return;
    }
  }

  function shouldNeutralizePlayability(status) {
    if (!isObject(status)) {
      return false;
    }
    if (status.status === "OK") {
      return false;
    }

    // Force neutralize ERROR status (server-side detection)
    if (status.status === "ERROR") {
      return true;
    }

    const reasonParts = [];
    if (typeof status.reason === "string") {
      reasonParts.push(status.reason);
    }
    if (Array.isArray(status.messages)) {
      reasonParts.push(status.messages.join(" "));
    }
    const reason = reasonParts.join(" ").toLowerCase();

    // Also neutralize any status with no reason (silent blocks)
    if (!reason && status.status !== "OK") {
      return true;
    }

    return ENFORCEMENT_REASON_PATTERNS.some((regex) => regex.test(reason));
  }

  function neutralizePlayability(status) {
    if (!isObject(status)) {
      return;
    }
    status.status = "OK";
    status.reason = "";
    status.errorScreen = undefined;
    status.contextParams = undefined;
    status.subreason = undefined;
    status.recoverable = true;
    if (Array.isArray(status.messages)) {
      status.messages.length = 0;
    }
  }

  function scrubEnforcementFields(entity) {
    if (!isObject(entity)) {
      return;
    }

    // Clear account-level enforcement markers
    ACCOUNT_ENFORCEMENT_KEYS.forEach(key => {
      if (key in entity) {
        if (typeof entity[key] === 'boolean') {
          entity[key] = false;
        } else if (typeof entity[key] === 'number') {
          entity[key] = 0;
        } else {
          delete entity[key];
        }
      }
    });

    const status = entity.playabilityStatus;
    if (shouldNeutralizePlayability(status)) {
      neutralizePlayability(status);
      if (isObject(entity.errorScreen)) {
        delete entity.errorScreen;
      }
    }
    if (isObject(entity.playerResponse) && shouldNeutralizePlayability(entity.playerResponse.playabilityStatus)) {
      neutralizePlayability(entity.playerResponse.playabilityStatus);
      delete entity.playerResponse.errorScreen;
    }

    // Scrub account data if present
    if (isObject(entity.accountData)) {
      ACCOUNT_ENFORCEMENT_KEYS.forEach(key => {
        if (key in entity.accountData) {
          delete entity.accountData[key];
        }
      });
    }

    // Scrub user features
    if (isObject(entity.userFeatures)) {
      ACCOUNT_ENFORCEMENT_KEYS.forEach(key => {
        if (key in entity.userFeatures) {
          entity.userFeatures[key] = false;
        }
      });
    }
  }

  function sanitizeRecursive(entity, seen) {
    if (!isObject(entity)) {
      return entity;
    }

    if (seen.has(entity)) {
      return entity;
    }

    seen.add(entity);
    scrubEnforcementFields(entity);

    if (Array.isArray(entity)) {
      for (let i = entity.length - 1; i >= 0; i -= 1) {
        const candidate = entity[i];
        if (looksPromotedNode(candidate) || looksEnforcementNode(candidate)) {
          entity.splice(i, 1);
          continue;
        }
        sanitizeRecursive(candidate, seen);
      }
      return entity;
    }

    Object.keys(entity).forEach((key) => {
      const value = entity[key];
      if (shouldBlankKey(key)) {
        blankValue(value);
        delete entity[key];
        return;
      }
      if (ENFORCEMENT_RENDERER_KEYS.has(key)) {
        blankValue(value);
        delete entity[key];
        return;
      }
      if (ACCOUNT_ENFORCEMENT_KEYS.has(key)) {
        if (typeof value === 'boolean') {
          entity[key] = false;
        } else if (typeof value === 'number') {
          entity[key] = 0;
        } else {
          delete entity[key];
        }
        return;
      }
      if (key === "playabilityStatus" && shouldNeutralizePlayability(value)) {
        neutralizePlayability(value);
        delete entity.errorScreen;
        return;
      }
      if (key === "playerResponse" || key === "response") {
        scrubEnforcementFields(value);
      }
      sanitizeRecursive(value, seen);
    });

    return entity;
  }

  function sanitize(entity) {
    return sanitizeRecursive(entity, new WeakSet());
  }

  function patchGlobal(name) {
    let internal = window[name];
    Object.defineProperty(window, name, {
      configurable: true,
      enumerable: true,
      get() {
        return internal;
      },
      set(value) {
        internal = sanitize(value);
      }
    });
    internal = sanitize(internal);
  }

  /**
   * Check if an object looks like a comment/engagement response that should NOT be sanitized aggressively
   */
  function looksLikeCommentData(obj) {
    if (!isObject(obj)) {
      return false;
    }
    const keys = Object.keys(obj);
    // Common keys in comment responses
    const commentIndicators = [
      'commentThreadRenderer',
      'commentRenderer',
      'commentsHeaderRenderer',
      'commentSectionRenderer',
      'engagementPanelSectionListRenderer',
      'liveChatRenderer',
      'commentRepliesRenderer'
    ];
    return keys.some(key => commentIndicators.includes(key));
  }

  /**
   * Lightweight sanitize that only removes obvious ad keys, preserves comment data
   */
  function sanitizeLight(entity, seen = new WeakSet()) {
    if (!isObject(entity) || seen.has(entity)) {
      return entity;
    }
    seen.add(entity);

    // Only remove HARD_BLOCK_KEYS (definitely ad-related)
    if (Array.isArray(entity)) {
      return entity;
    }

    Object.keys(entity).forEach((key) => {
      if (HARD_BLOCK_KEYS.has(key)) {
        delete entity[key];
      } else if (isObject(entity[key])) {
        sanitizeLight(entity[key], seen);
      }
    });
    return entity;
  }

  function patchJSONParse() {
    const originalParse = JSON.parse;
    JSON.parse = function patchedJSONParse(...args) {
      const parsed = originalParse.apply(this, args);
      // If this looks like comment data, use light sanitization to preserve it
      if (looksLikeCommentData(parsed)) {
        return sanitizeLight(parsed);
      }
      return sanitize(parsed);
    };
  }

  function patchResponseJson() {
    if (typeof Response === "undefined") {
      return;
    }
    const original = Response.prototype.json;
    Response.prototype.json = function patchedJson(...args) {
      return original.apply(this, args).then((payload) => {
        // If this looks like comment data, use light sanitization
        if (looksLikeCommentData(payload)) {
          return sanitizeLight(payload);
        }
        return sanitize(payload);
      });
    };
  }

  function patchXHR() {
    if (typeof XMLHttpRequest === "undefined") {
      return;
    }

    const originalOpen = XMLHttpRequest.prototype.open;
    const originalResponseGetter = Object.getOwnPropertyDescriptor(
      XMLHttpRequest.prototype,
      "response"
    )?.get;

    XMLHttpRequest.prototype.open = function patchedOpen(method, url, ...rest) {
      const blockedUrl = getBlockedUrl(url);
      if (blockedUrl) {
        notifyBlocked("xhr", blockedUrl);
      }
      this.addEventListener("readystatechange", () => {
        if (this.readyState === 4 && this.responseType === "json" && this.response) {
          sanitize(this.response);
        }
      });
      return originalOpen.call(this, method, url, ...rest);
    };

    if (originalResponseGetter) {
      Object.defineProperty(XMLHttpRequest.prototype, "response", {
        configurable: true,
        get() {
          const value = originalResponseGetter.call(this);
          return sanitize(value);
        }
      });
    }
  }

  function patchFetch() {
    if (typeof window.fetch !== "function") {
      return;
    }

    try {
      const nativeFetch = window.fetch.bind(window);

      // Try to override directly first
      try {
        window.fetch = function patchedFetch(input, init) {
          const blockedUrl = getBlockedUrl(input);
          if (blockedUrl) {
            notifyBlocked("fetch", blockedUrl);
            return Promise.resolve(new Response(null, { status: 204, statusText: "Blocked" }));
          }
          const { input: spoofedInput, init: spoofedInit } = applyLoggedOutSpoof(input, init);
          return nativeFetch(spoofedInput, spoofedInit);
        };
        return; // Success
      } catch (directError) {
        // Property is read-only, try defineProperty
      }

      // Fallback: use defineProperty to force override
      Object.defineProperty(window, 'fetch', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: function patchedFetch(input, init) {
          const blockedUrl = getBlockedUrl(input);
          if (blockedUrl) {
            notifyBlocked("fetch", blockedUrl);
            return Promise.resolve(new Response(null, { status: 204, statusText: "Blocked" }));
          }
          const { input: spoofedInput, init: spoofedInit } = applyLoggedOutSpoof(input, init);
          return nativeFetch(spoofedInput, spoofedInit);
        }
      });
    } catch (error) {
      console.warn('[CTF-Blocker] Could not patch fetch:', error);
    }
  }

  function patchSendBeacon() {
    if (!navigator?.sendBeacon) {
      return;
    }
    const nativeBeacon = navigator.sendBeacon.bind(navigator);
    navigator.sendBeacon = function patchedBeacon(resource, data) {
      const blockedUrl = getBlockedUrl(resource);
      if (blockedUrl) {
        notifyBlocked("beacon", blockedUrl);
        return true;
      }
      return nativeBeacon(resource, data);
    };
  }

  function disableEnforcementFlags(flags) {
    if (!isObject(flags)) {
      return flags;
    }
    ENFORCEMENT_FLAG_KEYS.forEach((key) => {
      if (key in flags) {
        flags[key] = false;
      }
    });
    return flags;
  }

  function scrubFflagsString(input) {
    if (typeof input !== "string" || input.indexOf("=") === -1) {
      return input;
    }
    const segments = input.split("&");
    let mutated = false;
    const rewritten = segments.map((segment) => {
      if (!segment) {
        return segment;
      }
      const [rawKey, rawValue = ""] = segment.split("=");
      if (!rawKey) {
        return segment;
      }
      if (ENFORCEMENT_FLAG_KEYS.includes(rawKey)) {
        mutated = true;
        return `${rawKey}=false`;
      }
      return `${rawKey}=${rawValue}`;
    });
    return mutated ? rewritten.join("&") : input;
  }

  function scrubPlayerResponseString(payload) {
    if (typeof payload !== "string" || !payload.trim()) {
      return payload;
    }
    try {
      const parsed = JSON.parse(payload);
      sanitize(parsed);
      return JSON.stringify(parsed);
    } catch (error) {
      return payload;
    }
  }

  function scrubPlayerArgs(args) {
    if (!isObject(args)) {
      return;
    }
    if (typeof args.player_response === "string") {
      args.player_response = scrubPlayerResponseString(args.player_response);
    } else if (isObject(args.player_response)) {
      sanitize(args.player_response);
    }
    if (typeof args.raw_player_response === "string") {
      args.raw_player_response = scrubPlayerResponseString(args.raw_player_response);
    } else if (isObject(args.raw_player_response)) {
      sanitize(args.raw_player_response);
    }
    if (typeof args.playerResponse === "string") {
      args.playerResponse = scrubPlayerResponseString(args.playerResponse);
    } else if (isObject(args.playerResponse)) {
      sanitize(args.playerResponse);
    }
    if (typeof args.fflags === "string") {
      args.fflags = scrubFflagsString(args.fflags);
    }
    if (isObject(args.EXPERIMENT_FLAGS)) {
      disableEnforcementFlags(args.EXPERIMENT_FLAGS);
    }
  }

  function sanitizeYtPlayer(player) {
    if (!isObject(player)) {
      return player;
    }
    if (isObject(player.config)) {
      scrubPlayerArgs(player.config.args);
    }
    return player;
  }

  function patchYtcfg() {
    const applyPatch = (cfg) => {
      if (!cfg || cfg.__ctfPatched) {
        return cfg?.__ctfPatched ?? false;
      }
      disableEnforcementFlags(cfg.data_?.EXPERIMENT_FLAGS);

      // Capture originals so we can selectively spoof on network calls later
      if (cfg.data_) {
        if (!window.__ctfOriginalYtcfg) {
          window.__ctfOriginalYtcfg = {
            loggedIn: cfg.data_.LOGGED_IN,
            sessionIndex: cfg.data_.SESSION_INDEX,
            delegatedSessionId: cfg.data_.DELEGATED_SESSION_ID,
            visitorData: cfg.data_.VISITOR_DATA
          };
        }

        // Keep premium flags to prevent ads
        cfg.data_.PREMIUM_SUBSCRIPTION = true;
        cfg.data_.PREMIUM_ADS_DISABLED = true;
        cfg.data_.ACCOUNT_FEATURES = cfg.data_.ACCOUNT_FEATURES || [];
        if (!cfg.data_.ACCOUNT_FEATURES.includes('adsfree')) {
          cfg.data_.ACCOUNT_FEATURES.push('adsfree');
        }
      }

      if (typeof cfg.get === "function") {
        const originalGet = cfg.get;
        cfg.get = function patchedGet(key, defaultValue) {
          const value = originalGet.call(this, key, defaultValue);
          if (key === "EXPERIMENT_FLAGS") {
            disableEnforcementFlags(value);
          }
          // Report as premium user (keeps ads away)
          if (key === "PREMIUM_SUBSCRIPTION") {
            return true;
          }
          if (key === "PREMIUM_ADS_DISABLED") {
            return true;
          }
          return value;
        };
      }
      if (typeof cfg.set === "function") {
        const originalSet = cfg.set;
        cfg.set = function patchedSet(key, value) {
          if (key === "EXPERIMENT_FLAGS") {
            disableEnforcementFlags(value);
          }
          // Block attempts to set ad-block detection flags
          if (ACCOUNT_ENFORCEMENT_KEYS.has(key)) {
            return;
          }
          return originalSet.apply(this, arguments);
        };
      }
      cfg.__ctfPatched = true;
      return true;
    };

    if (applyPatch(window.ytcfg)) {
      return;
    }

    const intervalId = setInterval(() => {
      if (applyPatch(window.ytcfg)) {
        clearInterval(intervalId);
      }
    }, 50);
  }

  function guardYtAdsObject(target) {
    if (!isObject(target)) {
      return;
    }
    try {
      Object.defineProperty(target, "adBlocked", {
        configurable: true,
        enumerable: true,
        get() {
          return false;
        },
        set() { }
      });
    } catch (error) {
      // best effort
    }
  }

  function spoofAdDetectionGlobals() {
    guardYtAdsObject(window.ytads);
    Object.defineProperty(window, "ytads", {
      configurable: true,
      get() {
        const store = window.__ctfYtAds || {};
        guardYtAdsObject(store);
        window.__ctfYtAds = store;
        return store;
      },
      set(value) {
        guardYtAdsObject(value);
        window.__ctfYtAds = value;
      }
    });

    if (!window.googletag) {
      const placeholder = {
        cmd: [],
        pubads() {
          return {
            addEventListener() { },
            enableSingleRequest() { },
            disableInitialLoad() { },
            collapseEmptyDivs() { }
          };
        },
        enableServices() { }
      };
      window.googletag = placeholder;
    }
  }

  function spoofGoogleAdStatus() {
    try {
      Object.defineProperty(window, "google_ad_status", {
        configurable: true,
        enumerable: true,
        get() {
          return 0;
        },
        set() { }
      });
    } catch (error) {
      window.google_ad_status = 0;
    }

    const tagInfo = window.google_tag_info || {};
    tagInfo.apiVersion = tagInfo.apiVersion || "1";
    tagInfo.adCount = 0;
    tagInfo.adSlotIdMap = tagInfo.adSlotIdMap || {};
    tagInfo.initialized = true;
    tagInfo.saveAdBlockingRecoveryTag = () => { };
    tagInfo.used = true;
    tagInfo.disablePublisherConsole = true;
    window.google_tag_info = tagInfo;
  }

  function patchYtPlayer() {
    const applyArgsPatch = (config) => {
      if (!isObject(config) || config.__ctfPatched) {
        return;
      }
      config.__ctfPatched = true;
      const args = config.args;
      scrubPlayerArgs(args);
      if (isObject(args)) {
        const responseKeys = ["player_response", "raw_player_response", "playerResponse"];
        responseKeys.forEach((key) => {
          if (!(key in args)) {
            return;
          }
          let store = args[key];
          if (typeof store === "string") {
            store = scrubPlayerResponseString(store);
          } else if (isObject(store)) {
            sanitize(store);
          }
          Object.defineProperty(args, key, {
            configurable: true,
            enumerable: true,
            get() {
              return store;
            },
            set(value) {
              if (typeof value === "string") {
                store = scrubPlayerResponseString(value);
              } else if (isObject(value)) {
                sanitize(value);
                store = value;
              } else {
                store = value;
              }
            }
          });
        });
        if ("fflags" in args) {
          let flagStore = scrubFflagsString(args.fflags);
          Object.defineProperty(args, "fflags", {
            configurable: true,
            enumerable: true,
            get() {
              return flagStore;
            },
            set(value) {
              flagStore = typeof value === "string" ? scrubFflagsString(value) : value;
            }
          });
        }
        if ("EXPERIMENT_FLAGS" in args) {
          let experimentStore = disableEnforcementFlags(args.EXPERIMENT_FLAGS);
          Object.defineProperty(args, "EXPERIMENT_FLAGS", {
            configurable: true,
            enumerable: true,
            get() {
              return experimentStore;
            },
            set(value) {
              experimentStore = disableEnforcementFlags(value);
            }
          });
        }
      }
    };

    const attemptConfigPatch = () => {
      const candidate = window.ytplayer?.config;
      if (isObject(candidate)) {
        applyArgsPatch(candidate);
        return true;
      }
      return false;
    };

    let internal = sanitizeYtPlayer(window.ytplayer);
    try {
      Object.defineProperty(window, "ytplayer", {
        configurable: true,
        enumerable: true,
        get() {
          return internal;
        },
        set(value) {
          internal = sanitizeYtPlayer(value);
          attemptConfigPatch();
        }
      });
    } catch (error) {
      internal = window.ytplayer = sanitizeYtPlayer(window.ytplayer);
    }

    if (!attemptConfigPatch()) {
      const intervalId = setInterval(() => {
        if (attemptConfigPatch()) {
          clearInterval(intervalId);
        }
      }, 50);
    }
  }

  // Fallback: If YouTube refuses to send player response (hard ban), create minimal one
  function ensurePlayerResponse() {
    if (!window.ytInitialPlayerResponse || !window.ytInitialPlayerResponse.playabilityStatus) {
      console.warn('[IPTUBE-X] No player response detected - injecting fallback');

      // Try to get video ID from URL
      const urlParams = new URLSearchParams(window.location.search);
      const videoId = urlParams.get('v') || '';

      window.ytInitialPlayerResponse = {
        playabilityStatus: {
          status: 'OK',
          playableInEmbed: true
        },
        streamingData: {
          expiresInSeconds: '21540',
          formats: [],
          adaptiveFormats: []
        },
        videoDetails: {
          videoId: videoId,
          title: 'Video',
          lengthSeconds: '0',
          channelId: '',
          isOwnerViewing: false,
          shortDescription: '',
          isCrawlable: true,
          thumbnail: {
            thumbnails: []
          },
          allowRatings: true,
          viewCount: '0',
          author: '',
          isPrivate: false,
          isUnpluggedCorpus: false,
          isLiveContent: false
        },
        microformat: {
          playerMicroformatRenderer: {
            thumbnail: {
              thumbnails: []
            },
            embed: {
              iframeUrl: `https://www.youtube.com/embed/${videoId}`,
              flashUrl: '',
              width: 1280,
              height: 720,
              flashSecureUrl: ''
            },
            title: {
              simpleText: 'Video'
            },
            description: {
              simpleText: ''
            },
            lengthSeconds: '0',
            ownerProfileUrl: '',
            externalChannelId: '',
            isFamilySafe: true,
            availableCountries: ['US'],
            isUnlisted: false,
            hasYpcMetadata: false,
            viewCount: '0',
            category: 'Entertainment',
            publishDate: new Date().toISOString().split('T')[0],
            ownerChannelName: '',
            uploadDate: new Date().toISOString().split('T')[0]
          }
        }
      };
    }
  }

  patchGlobal("ytInitialPlayerResponse");
  patchGlobal("ytInitialData");
  patchJSONParse();
  patchResponseJson();
  patchXHR();
  patchFetch();
  patchSendBeacon();
  patchYtcfg();
  spoofAdDetectionGlobals();
  spoofGoogleAdStatus();
  patchYtPlayer();

  // Ensure player response exists before page loads
  ensurePlayerResponse();

  // Re-check after DOM loads in case it was cleared
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensurePlayerResponse);
  } else {
    setTimeout(ensurePlayerResponse, 100);
  }
})();

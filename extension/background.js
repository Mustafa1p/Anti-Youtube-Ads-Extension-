const STORAGE_KEY = "blockedRequestCount";

async function readCount() {
  try {
    const result = await chrome.storage.local.get([STORAGE_KEY]);
    return Number(result[STORAGE_KEY] ?? 0);
  } catch (error) {
    console.error("[CTF-Blocker] Failed to read count", error);
    return 0;
  }
}

async function writeCount(next) {
  try {
    await chrome.storage.local.set({ [STORAGE_KEY]: next });
  } catch (error) {
    console.error("[CTF-Blocker] Failed to persist count", error);
  }
}

async function incrementBlockedCount() {
  const current = await readCount();
  const next = current + 1;
  await writeCount(next);
  return next;
}

chrome.runtime.onInstalled.addListener(async (details) => {
  await writeCount(0);
  console.info("[CTF-Blocker] Ready to block YouTube ads.");
  
  // On install/update, clear only detection-related data (preserve auth)
  if (details.reason === "install" || details.reason === "update") {
    try {
      // Clear cache and non-auth storage only
      await chrome.browsingData.remove(
        {
          origins: ["https://www.youtube.com", "https://youtube.com", "https://m.youtube.com"]
        },
        {
          appcache: true,
          cache: true,
          cacheStorage: true,
          cookies: false, // Don't clear cookies - handled selectively by storageSanitizer
          downloads: false,
          fileSystems: true,
          formData: false, // Preserve form data
          history: false,
          indexedDB: true,
          localStorage: true,
          passwords: false,
          pluginData: true,
          serviceWorkers: true,
          webSQL: true
        }
      );
      console.info("[CTF-Blocker] Cleared YouTube cache/storage (auth preserved)");
    } catch (error) {
      console.warn("[CTF-Blocker] Could not clear storage:", error);
    }
  }
});

if (chrome.declarativeNetRequest?.onRuleMatchedDebug) {
  chrome.declarativeNetRequest.onRuleMatchedDebug.addListener(async (info) => {
    if (info?.rule?.id) {
      await incrementBlockedCount();
    }
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === "GET_BLOCK_STATS") {
    readCount().then((blockedRequestCount) => {
      sendResponse({ blockedRequestCount });
    });
    return true;
  }

  if (message?.type === "INCREMENT_BLOCK_COUNT") {
    incrementBlockedCount().then((blockedRequestCount) => {
      sendResponse({ blockedRequestCount });
    });
    return true;
  }

  if (message?.type === "RESET_BLOCK_STATS") {
    writeCount(0).then(() => sendResponse({ ok: true }));
    return true;
  }

  return false;
});

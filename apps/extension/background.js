const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://karrio-api-o2xy.onrender.com";

const WEB_APP_URLS = [
  "https://karrio-extension-web.vercel.app/login",
];

function isKarrioWebUrl(url) {
  try {
    const parsed = new URL(url);
    const origin = parsed.origin;

    if (!WEB_APP_URLS.includes(origin)) {
      return false;
    }

    // Nest API serves JSON on /; avoid treating API-only responses as the web app.
    const path = parsed.pathname;
    return (
      path.startsWith("/dashboard") ||
      path.startsWith("/applications") ||
      path.startsWith("/kanban") ||
      path.startsWith("/settings") ||
      path.startsWith("/login") ||
      path.startsWith("/signup") ||
      path === "/"
    );
  } catch {
    return false;
  }
}

async function readTokenFromTab(tabId) {
  const results = await chrome.scripting.executeScript({
    target: { tabId },
    func: () => localStorage.getItem("accessToken"),
  });

  return results?.[0]?.result || null;
}

async function readTokenFromKarrioTabs() {
  const tabs = await chrome.tabs.query({});

  let matchedTabs = 0;
  let tokenFound = false;
  let didLogExecuteError = false;

  for (const tab of tabs) {
    if (!tab.id || !tab.url || !isKarrioWebUrl(tab.url)) {
      continue;
    }

    matchedTabs += 1;

    try {
      const token = await readTokenFromTab(tab.id);

      if (token) {
        tokenFound = true;
        await chrome.storage.local.set({
          accessToken: token,
          token,
        });

        return token;
      }
    } catch (error) {
      if (!didLogExecuteError) {
        didLogExecuteError = true;
        // #region agent log
        fetch('http://127.0.0.1:7530/ingest/cb8f6197-8b87-49b3-916f-011c8f5f462d', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Debug-Session-Id': '18adab',
          },
          body: JSON.stringify({
            sessionId: '18adab',
            runId: 'debug-repro-1',
            hypothesisId: 'H2_token_invalid_or_expired',
            location: 'background.js:readTokenFromKarrioTabs:executeScriptError',
            message: 'Failed reading localStorage.accessToken from candidate tab',
            data: {
              matchedTabs,
              errorName: error?.name,
            },
            timestamp: Date.now(),
          }),
        }).catch(() => {});
        // #endregion
      }

      console.warn("Could not read token from tab", tab.url, error);
    }
  }

  // #region agent log
  fetch('http://127.0.0.1:7530/ingest/cb8f6197-8b87-49b3-916f-011c8f5f462d', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Debug-Session-Id': '18adab',
    },
    body: JSON.stringify({
      sessionId: '18adab',
      runId: 'debug-repro-1',
      hypothesisId: 'H3_content_script_not_sync',
      location: 'background.js:readTokenFromKarrioTabs:completed',
      message: 'Finished scanning candidate Karrio tabs for token',
      data: {
        matchedTabs,
        tokenFound,
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

  return null;
}

async function getAccessToken() {
  const stored = await chrome.storage.local.get(["accessToken", "token"]);
  const cached = stored.accessToken || stored.token;

  // #region agent log
  fetch('http://127.0.0.1:7530/ingest/cb8f6197-8b87-49b3-916f-011c8f5f462d', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Debug-Session-Id': '18adab',
    },
    body: JSON.stringify({
      sessionId: '18adab',
      runId: 'debug-repro-1',
      hypothesisId: 'H1_token_storage_missing',
      location: 'background.js:getAccessToken',
      message: 'Token from extension storage (if present)',
      data: {
        cachedPresent: Boolean(cached),
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

  if (cached) {
    return cached;
  }

  return readTokenFromKarrioTabs();
}

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.type === "GET_ACCESS_TOKEN") {
    getAccessToken()
      .then((token) => sendResponse({ token }))
      .catch(() => sendResponse({ token: null }));

    return true;
  }

  if (request.type === "SYNC_ACCESS_TOKEN") {
    const token = request.token || null;

    if (token) {
      chrome.storage.local.set({ accessToken: token, token });
    } else {
      chrome.storage.local.remove(["accessToken", "token"]);
    }

    sendResponse({ ok: true });
    return true;
  }

  return false;
});

console.log("Karrio background running");

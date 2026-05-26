function syncTokenToExtension() {
  const token = localStorage.getItem("accessToken");

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
      location: 'content-karrio.js:syncTokenToExtension',
      message: 'Karrio page content script syncing accessToken to extension storage',
      data: {
        tokenPresent: Boolean(token),
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

  if (token) {
    chrome.storage.local.set({
      accessToken: token,
      token,
    });
  } else {
    chrome.storage.local.remove(["accessToken", "token"]);
  }
}

syncTokenToExtension();

window.addEventListener("karrio:session-changed", syncTokenToExtension);

window.addEventListener("message", (event) => {
  if (event.source !== window) {
    return;
  }

  if (event.data?.type === "KARRIO_SESSION_CHANGED") {
    syncTokenToExtension();
  }
});

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.type === "GET_ACCESS_TOKEN") {
    sendResponse({
      token: localStorage.getItem("accessToken"),
    });

    return true;
  }

  if (request.type === "SYNC_ACCESS_TOKEN") {
    syncTokenToExtension();
    sendResponse({ ok: true });
    return true;
  }

  return false;
});

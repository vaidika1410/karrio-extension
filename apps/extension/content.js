chrome.runtime.onMessage.addListener(
  (
    request,
    sender,
    sendResponse,
  ) => {
    if (
      request.type ===
      "GET_JOB_DATA"
    ) {
      sendResponse({
        pageTitle:
          document.title,
        url:
          window.location.href,
      });

      return true;
    }
  },
);
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
      const selectors = {
        role: [
          "h1",
          ".job-details-jobs-unified-top-card__job-title",
          ".jobs-unified-top-card__job-title",
        ],
        company: [
          ".job-details-jobs-unified-top-card__company-name a",
          ".job-details-jobs-unified-top-card__company-name",
          ".jobs-unified-top-card__company-name a",
          ".jobs-unified-top-card__company-name",
          'a[href*="/company/"]',
        ],
      }

      function firstText(selList) {
        for (const sel of selList) {
          const el = document.querySelector(sel)
          const text = el?.textContent?.trim()
          if (text) return { text, selector: sel }
        }
        return { text: "", selector: null }
      }

      const roleResult = firstText(selectors.role)
      const companyResult = firstText(selectors.company)

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
          hypothesisId: 'H4_company_parsing_wrong',
          location: 'content.js:GET_JOB_DATA',
          message: 'Extracted role/company from LinkedIn DOM',
          data: {
            url: window.location.href,
            title: document.title,
            roleSelector: roleResult.selector,
            companySelector: companyResult.selector,
            rolePresent: Boolean(roleResult.text),
            companyPresent: Boolean(companyResult.text),
          },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion

      sendResponse({
        pageTitle:
          document.title,
        url:
          window.location.href,
        extractedRole: roleResult.text,
        extractedCompany: companyResult.text,
      });

      return true;
    }
  },
);
const API_BASE_URL = "http://localhost:3000";
const WEB_APP_URL = "http://localhost:3001/login";

async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  return tab;
}

async function resolveAccessToken() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: "GET_ACCESS_TOKEN" }, (response) => {
      if (chrome.runtime.lastError) {
        resolve(null);
        return;
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
          hypothesisId: 'H1_token_storage_missing',
          location: 'popup.js:resolveAccessToken',
          message: 'Token resolved by popup (from background)',
          data: {
            tokenPresent: Boolean(response?.token),
          },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion

      resolve(response?.token || null);
    });
  });
}

function setAuthStatus(state, message) {
  const authStatus = document.getElementById("authStatus");
  authStatus.className = `auth-status ${state}`;
  authStatus.innerText = message;
}

function setSaveStatus(state, message) {
  const status = document.getElementById("status");
  status.className = `status ${state}`;
  status.innerText = message;
}

async function refreshAuthStatus() {
  setAuthStatus("checking", "Checking Karrio sign-in...");

  const token = await resolveAccessToken();

  if (token) {
    setAuthStatus("connected", "Signed in to Karrio");
    return token;
  }

  setAuthStatus(
    "disconnected",
    "Not signed in. Open Karrio and sign in first.",
  );

  return null;
}

async function initializePopup() {
  await refreshAuthStatus();

  const tab = await getCurrentTab();

  chrome.tabs.sendMessage(
    tab.id,
    { type: "GET_JOB_DATA" },
    async (response) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
        return;
      }

      if (!response) {
        return;
      }

      const pageTitle = response.pageTitle || "";
      const extractedRole = response.extractedRole || "";
      const extractedCompany = response.extractedCompany || "";

      let role = "";
      let company = "";

      const separators = [" at ", " - ", " | ", " @ "];

      let matched = false;
      let matchedSeparator = null;

      for (const separator of separators) {
        if (pageTitle.includes(separator)) {
          const parts = pageTitle.split(separator);

          role = parts[0]?.trim() || "";
          company = parts[1]?.trim() || "";
          matched = true;
          matchedSeparator = separator;
          break;
        }
      }

      if (!matched) {
        role = pageTitle;
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
          hypothesisId: 'H4_company_parsing_wrong',
          location: 'popup.js:initializePopup:parse',
          message: 'Parsed LinkedIn title into role/company',
          data: {
            pageTitle,
            extractedRolePresent: Boolean(extractedRole),
            extractedCompanyPresent: Boolean(extractedCompany),
            matchedSeparator,
            roleParsed: role,
            companyParsed: company,
          },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion

      document.getElementById("role").value = role;
      document.getElementById("company").value = company;

      window.jobData = response;
    },
  );
}

async function saveJob() {
  const saveButton = document.getElementById("saveJob");

  try {
    saveButton.disabled = true;
    saveButton.innerText = "Saving...";
    setSaveStatus("", "");

    const token = await resolveAccessToken();

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
        location: 'popup.js:saveJob:beforeFetch',
        message: 'Preparing POST /applications',
        data: {
          tokenPresent: Boolean(token),
          rolePresent: Boolean(document.getElementById('role')?.value),
          companyPresent: Boolean(document.getElementById('company')?.value),
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    if (!token) {
      throw new Error(
        "Sign in to Karrio in your browser, then open this popup again.",
      );
    }

    const response = await fetch(`${API_BASE_URL}/applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        company: document.getElementById("company").value,
        role: document.getElementById("role").value,
        jobUrl: window.jobData?.url,
        platform: "LinkedIn",
        notes: document.getElementById("notes").value,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      if (response.status === 401) {
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
            location: 'popup.js:saveJob:401',
            message: 'Received 401 from API',
            data: {
              status: 401,
              tokenPresent: Boolean(token),
            },
            timestamp: Date.now(),
          }),
        }).catch(() => {});
        // #endregion

        await chrome.storage.local.remove(["accessToken", "token"]);
        await refreshAuthStatus();
        throw new Error(
          "Session expired. Sign in to Karrio again, then retry.",
        );
      }

      if (errorData.message === "Application already exists") {
        throw new Error("Already saved in Karrio");
      }

      throw new Error(errorData.message || "Failed to save application");
    }

    setSaveStatus("success", "Application saved successfully. Closing...");

    setTimeout(() => {
      window.close();
    }, 900);
  } catch (error) {
    console.error(error);

    setSaveStatus("error", error.message);
    saveButton.disabled = false;
    saveButton.innerText = "Save to Karrio";
  }
}

document.getElementById("saveJob").addEventListener("click", saveJob);

document.getElementById("openKarrio").addEventListener("click", (event) => {
  event.preventDefault();
  chrome.tabs.create({ url: WEB_APP_URL });
});

document
  .getElementById("refreshAuth")
  .addEventListener("click", refreshAuthStatus);

initializePopup();

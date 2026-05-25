async function getCurrentTab() {
  const [tab] =
    await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

  return tab;
}

async function initializePopup() {
  const tab = await getCurrentTab();

  chrome.tabs.sendMessage(
    tab.id,
    {
      type: "GET_JOB_DATA",
    },
    async (response) => {
      if (chrome.runtime.lastError) {
        console.error(
          chrome.runtime.lastError.message,
        );

        return;
      }

      if (!response) {
        return;
      }

      const pageTitle =
        response.pageTitle || "";

      let role = "";
      let company = "";

      // Common separators
      const separators = [
        " at ",
        " - ",
        " | ",
        " @ ",
      ];

      let matched = false;

      for (const separator of separators) {
        if (
          pageTitle.includes(separator)
        ) {
          const parts =
            pageTitle.split(separator);

          role = parts[0]?.trim() || "";
          company =
            parts[1]?.trim() || "";

          matched = true;

          break;
        }
      }

      // fallback
      if (!matched) {
        role = pageTitle;
      }

      document.getElementById(
        "role",
      ).value = role;

      document.getElementById(
        "company",
      ).value = company;

      window.jobData = response;

      const saved =
        await chrome.storage.local.get(
          "token",
        );

      if (saved.token) {
        document.getElementById(
          "token",
        ).value = saved.token;
      }
    },
  );
}

async function saveJob() {
  try {
    const token =
      document.getElementById(
        "token",
      ).value;

    await chrome.storage.local.set({
      token,
    });

    const response = await fetch(
      "http://localhost:3000/applications",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",

          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          company:
            document.getElementById(
              "company",
            ).value,

          role:
            document.getElementById(
              "role",
            ).value,

          jobUrl:
            window.jobData.url,

          platform:
            "LinkedIn",

          notes:
            document.getElementById(
              "notes",
            ).value,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(
        "Failed request",
      );
    }

    document.getElementById(
      "status",
    ).innerText =
      "Application saved successfully!";

    setTimeout(() => {
      window.close();
      
    }, 1200);
  } catch (error) {
    console.error(error);

    document.getElementById(
      "status",
    ).innerText =
      "Failed to save application";
  }
}

document
  .getElementById("saveJob")
  .addEventListener(
    "click",
    saveJob,
  );

initializePopup();
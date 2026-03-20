const TonioMarkComplete = (function () {
  function initMarkComplete() {
    const config = window.MARK_COMPLETE_CONFIG;
    if (!config) return;

    const input = document.getElementById(config.inputId);
    const button = document.getElementById(config.buttonId);
    const message = document.getElementById(config.messageId);

    if (!input || !button || !message) return;

    button.addEventListener("click", async function () {
      const studentCode = input.value.trim();

      if (!studentCode) {
        message.textContent = "Student code not found. Please sign in again.";
        return;
      }

      button.disabled = true;
      message.textContent = "Saving...";

      try {
        const response = await fetch(config.webAppUrl, {
          method: "POST",
          headers: {
            "Content-Type": "text/plain;charset=utf-8"
          },
          body: JSON.stringify({
            action: "markComplete",
            studentCode: studentCode,
            exerciseCode: config.exerciseCode
          })
        });

        const result = await response.json();
        message.textContent = result.message || "Saved successfully.";
      } catch (error) {
        message.textContent = "There was a problem saving your progress.";
      } finally {
        button.disabled = false;
      }
    });
  }

  return {
    initMarkComplete
  };
})();

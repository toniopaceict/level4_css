const TonioAuth = (function () {
  function saveStudentSession(studentCode, studentName) {
    localStorage.setItem("studentCode", studentCode);

    if (studentName) {
      localStorage.setItem("studentName", studentName);
    } else {
      localStorage.removeItem("studentName");
    }
  }

  function clearStudentSession() {
    localStorage.removeItem("studentCode");
    localStorage.removeItem("studentName");
  }

  function getStudentCode() {
    return localStorage.getItem("studentCode") || "";
  }

  function getStudentName() {
    return localStorage.getItem("studentName") || "";
  }

  async function loginStudent() {
    const config = window.AUTH_CONFIG;
    const input = document.getElementById("studentCode");
    const button = document.getElementById("loginBtn");
    const message = document.getElementById("loginMessage");

    if (!config || !input || !button || !message) return;

    const studentCode = input.value.trim();

    if (!studentCode) {
      message.textContent = "Please enter your student code.";
      return;
    }

    button.disabled = true;
    message.textContent = "Checking code...";

    try {
      const response = await fetch(config.webAppUrl, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify({
          action: "validateCode",
          studentCode: studentCode
        })
      });

      const result = await response.json();

      if (result.success) {
        saveStudentSession(studentCode, result.studentName || "");
        window.location.href = config.nextPageUrl;
      } else {
        message.textContent = result.message || "Code not found.";
        button.disabled = false;
      }
    } catch (error) {
      message.textContent = "There was a problem checking the code.";
      button.disabled = false;
    }
  }

  function initLoginPage() {
    const button = document.getElementById("loginBtn");
    const input = document.getElementById("studentCode");

    if (!button || !input) return;

    button.addEventListener("click", loginStudent);

    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        loginStudent();
      }
    });

    const existingCode = getStudentCode();
    if (existingCode) {
      input.value = existingCode;
    }
  }

  function protectPage() {
    const config = window.PAGE_AUTH_CONFIG || {};
    const loginPageUrl = config.loginPageUrl || "";

    const studentCode = getStudentCode();
    const studentName = getStudentName();

    if (!studentCode) {
      if (loginPageUrl) {
        window.location.href = loginPageUrl;
      }
      return;
    }

    const hiddenInput = document.getElementById("studentCode");
    if (hiddenInput) {
      hiddenInput.value = studentCode;
    }

    const signedInInfo = document.getElementById("signedInInfo");
    if (signedInInfo) {
      if (studentName) {
        signedInInfo.textContent = "Signed in as " + studentName + ".";
      } else {
        signedInInfo.textContent = "Student code recognised.";
      }
    }

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", function () {
        clearStudentSession();
        if (loginPageUrl) {
          window.location.href = loginPageUrl;
        }
      });
    }
  }

  return {
    initLoginPage,
    protectPage,
    clearStudentSession,
    getStudentCode,
    getStudentName
  };
})();

document.addEventListener("DOMContentLoaded", function () {
  TonioAuth.initLoginPage();
});

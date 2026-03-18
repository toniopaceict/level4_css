(function (window) {
  'use strict';

  let currentConfig = null;

  function getConfig() {
    return currentConfig || window.MARK_COMPLETE_CONFIG || {};
  }

  function getById(id) {
    return id ? document.getElementById(id) : null;
  }

  function setMessage(text, colour) {
    const config = getConfig();
    const message = getById(config.messageId || 'message');
    if (!message) return;

    message.innerText = text || '';
    message.style.color = colour || config.defaultColour || '#0b3c6f';
  }

  function updateButtonState(enabled) {
    const config = getConfig();
    const button = getById(config.buttonId || 'markCompleteBtn');
    if (!button) return;

    button.disabled = !enabled;
  }

  function isReadyToSubmit() {
    const config = getConfig();
    if (typeof config.isReady === 'function') {
      return !!config.isReady();
    }
    return true;
  }

  function markComplete() {
    const config = getConfig();

    const input = getById(config.inputId || 'studentCode');
    const button = getById(config.buttonId || 'markCompleteBtn');

    if (!input || !button) return;

    if (!isReadyToSubmit()) {
      setMessage(
        config.notReadyText || 'Please complete all required work before marking this as complete.',
        config.errorColour || '#b3261e'
      );
      updateButtonState(false);
      return;
    }

    const code = input.value.trim();

    if (!code) {
      setMessage(
        config.emptyCodeText || 'Please enter your student code.',
        config.errorColour || '#b3261e'
      );
      return;
    }

    setMessage(
      config.loadingText || 'Loading...',
      config.loadingColour || '#0b3c6f'
    );

    button.disabled = true;

    fetch(
      config.webAppUrl +
      '?action=markComplete' +
      '&studentCode=' + encodeURIComponent(code) +
      '&exerciseCode=' + encodeURIComponent(config.exerciseCode)
    )
      .then(response => response.json())
      .then(data => {
        if (data.ok) {
          const msg = data.message || config.successText || 'Exercise marked as complete.';

          if (msg.toLowerCase().includes('already')) {
            setMessage(msg, config.alreadyColour || '#ff8c00');
          } else {
            setMessage(msg, config.successColour || '#137333');
          }
        } else {
          setMessage(
            data.message || config.notFoundText || 'Student not found.',
            config.errorColour || '#b3261e'
          );
        }
      })
      .catch(() => {
        setMessage(
          config.contactErrorText || 'Could not contact the progress tracker.',
          config.errorColour || '#b3261e'
        );
      })
      .finally(() => {
        if (typeof config.isReady === 'function') {
          updateButtonState(isReadyToSubmit());
        } else {
          button.disabled = false;
        }
      });
  }

  function initMarkComplete(config) {
    currentConfig = Object.assign(
      {
        inputId: 'studentCode',
        buttonId: 'markCompleteBtn',
        messageId: 'message',
        defaultColour: '#0b3c6f',
        successColour: '#137333',
        alreadyColour: '#ff8c00',
        errorColour: '#b3261e',
        loadingColour: '#0b3c6f'
      },
      window.MARK_COMPLETE_CONFIG || {},
      config || {}
    );

    const input = getById(currentConfig.inputId);
    const button = getById(currentConfig.buttonId);

    if (button && !button.dataset.tonioMarkBound) {
      button.addEventListener('click', markComplete);
      button.dataset.tonioMarkBound = 'true';
    }

    if (input && !input.dataset.tonioEnterBound) {
      input.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
          event.preventDefault();
          markComplete();
        }
      });
      input.dataset.tonioEnterBound = 'true';
    }

    if (typeof currentConfig.isReady === 'function') {
      updateButtonState(isReadyToSubmit());
    }

    if (currentConfig.initialMessage) {
      setMessage(currentConfig.initialMessage, currentConfig.initialMessageColour || currentConfig.defaultColour);
    }

    return {
      markComplete,
      setMessage,
      updateButtonState
    };
  }

  window.TonioMarkComplete = {
    initMarkComplete,
    markComplete,
    setMessage,
    updateButtonState
  };

  window.markComplete = markComplete;
})(window);

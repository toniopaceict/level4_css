(function (window) {
  'use strict';

  function getHeaderText(selector, fallback) {
    return document.querySelector(selector)?.textContent?.trim() || fallback || '';
  }

  function buildFileName(options) {
    const includeSubtitle = !!options.includeSubtitleInFileName;

    const subtitleText = getHeaderText('.lesson-hero-subtitle', '');
    const titleText = getHeaderText('.lesson-hero h1', options.fallbackName || 'Page');
    const partText = getHeaderText('.lesson-hero h2', '');

    const parts = includeSubtitle
      ? [subtitleText, titleText, partText]
      : [titleText, partText];

    let fileName = parts
      .filter(Boolean)
      .join(' - ')
      .replace(/[\\/:*?"<>|]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!fileName) {
      fileName = options.fallbackName || 'Page';
    }

    return fileName + '.pdf';
  }

  function downloadSimplePDF(options) {
    const source = document.querySelector(options.sourceSelector || '.wrap');
    if (!source || !window.html2pdf) return;

    const opt = {
      margin: 0.5,
      filename: buildFileName(options),
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    window.html2pdf().set(opt).from(source).save();
  }

  function downloadQuizPDF(options) {
    const quiz = document.querySelector(options.quizSelector || '#quiz');
    if (!quiz || !window.html2pdf) return;

    const subtitleText = getHeaderText('.lesson-hero-subtitle', '');
    const titleText = getHeaderText('.lesson-hero h1', options.fallbackName || 'Quiz');
    const partText = getHeaderText('.lesson-hero h2', '');
    const scoreText = document.querySelector(options.scoreSelector || '#scoreBox')?.textContent?.trim() || '';

    const fileName = buildFileName({
      fallbackName: options.fallbackName || 'Quiz',
      includeSubtitleInFileName: options.includeSubtitleInFileName !== false
    });

    const pdfWrapper = document.createElement('div');
    pdfWrapper.style.padding = '20px';
    pdfWrapper.style.background = '#ffffff';
    pdfWrapper.style.color = '#0b3c6f';
    pdfWrapper.style.fontFamily = 'Arial, sans-serif';

    pdfWrapper.innerHTML = `
      <div style="margin-bottom:20px; text-align:center;">
        ${subtitleText ? `<div style="font-size:18px; margin-bottom:6px;">${subtitleText}</div>` : ''}
        <div style="font-size:28px; font-weight:700; margin-bottom:6px;">${titleText}</div>
        ${partText ? `<div style="font-size:20px; margin-bottom:12px;">${partText}</div>` : ''}
        ${scoreText ? `<div style="font-size:16px; font-weight:700;">${scoreText}</div>` : ''}
      </div>
    `;

    const quizClone = quiz.cloneNode(true);
    quizClone.querySelectorAll('button').forEach(el => el.remove());
    quizClone.querySelectorAll('.no-print').forEach(el => el.remove());

    pdfWrapper.appendChild(quizClone);

    const opt = {
      margin: 0.5,
      filename: fileName,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    window.html2pdf().set(opt).from(pdfWrapper).save();
  }

  function bindButton(buttonId, handler) {
    const button = document.getElementById(buttonId);
    if (!button) return;

    if (button.dataset.tonioPdfBound) return;

    button.addEventListener('click', handler);
    button.dataset.tonioPdfBound = 'true';
  }

  function initSimplePdfExport(config) {
    const options = Object.assign(
      {
        buttonId: 'savePdfBtn',
        sourceSelector: '.wrap',
        fallbackName: 'Page',
        includeSubtitleInFileName: false
      },
      config || {}
    );

    bindButton(options.buttonId, function () {
      downloadSimplePDF(options);
    });

    return {
      download: function () {
        downloadSimplePDF(options);
      }
    };
  }

  function initQuizPdfExport(config) {
    const options = Object.assign(
      {
        buttonId: 'savePdfBtn',
        quizSelector: '#quiz',
        scoreSelector: '#scoreBox',
        fallbackName: 'Quiz',
        includeSubtitleInFileName: true
      },
      config || {}
    );

    bindButton(options.buttonId, function () {
      downloadQuizPDF(options);
    });

    return {
      download: function () {
        downloadQuizPDF(options);
      }
    };
  }

  window.TonioPdfExport = {
    initSimplePdfExport,
    initQuizPdfExport,
    downloadSimplePDF,
    downloadQuizPDF
  };

  window.downloadPDF = function () {
    downloadSimplePDF({
      sourceSelector: '.wrap',
      fallbackName: 'Page',
      includeSubtitleInFileName: false
    });
  };

  window.saveAsPdf = function () {
    downloadQuizPDF({
      quizSelector: '#quiz',
      scoreSelector: '#scoreBox',
      fallbackName: 'Quiz',
      includeSubtitleInFileName: true
    });
  };
})(window);

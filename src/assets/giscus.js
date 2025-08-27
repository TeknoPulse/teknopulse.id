function setupGiscus() {
  const observer = new MutationObserver(() => {
    const giscusFrame = document.querySelector('iframe.giscus-frame');
    if (giscusFrame) {
      const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      giscusFrame.contentWindow?.postMessage(
        {
          giscus: { setConfig: { theme } },
        },
        'https://giscus.app'
      );
    }
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });
}

setupGiscus();

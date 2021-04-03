import store from './store';

const handleImages = (details) => {
  if (details.type === 'imageset') {
    // eslint-disable-next-line no-param-reassign
    details.type = 'image';
  }
};

const handleMedia = (details) => {
  if (details.type === 'media' || details?.responseHeaders[0]?.value === 'audio/mpeg') {
    store.dispatch('addMedia', {
      media: {
        url: details.url,
        name: `${Math.random()
          .toString(36)
          .substring(7)}.mp3`,
        type: 'mpeg',
      },
    });

    chrome.browserAction.setBadgeText({ text: `${store.getters.media.length}` });
  }
};

const handleMessages = () => {
  chrome.webRequest.onHeadersReceived.addListener(
    (details) => {
      if (details.url === undefined) return;
      if (details.initiator !== undefined) {
        if (details.initiator.indexOf('-extension://') > -1) return;
      }

      handleMedia(details);
      handleImages(details);
    },
    { urls: ['<all_urls>'] },
    ['blocking', 'responseHeaders'],
  );
};

handleMessages();

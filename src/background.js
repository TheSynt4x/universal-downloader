import store from './store';

function onInstall() {
  if (localStorage.getItem('install_time')) return;

  const now = new Date().getTime();
  localStorage.setItem('install_time', now);
  chrome.tabs.create({ url: 'options.html' });
}

const settings = {};

const initSettings = (listenToChanges = false) => {
  chrome.storage.local.get(['whitelist', 'formats', 'enabled'], (result) => {
    settings.whitelist = result.whitelist || [];

    if (!result.enabled || !!result.enabled) {
      chrome.storage.local.set({ enabled: true }, () => {});
      settings.enabled = result.enabled || false;
    }

    if (!result.formats) {
      const formats = { 'video/mp4': true, 'audio/mpeg': true };

      chrome.storage.local.set(formats, () => {});
      settings.formats = formats;
    } else {
      settings.formats = result.formats || {};
    }
  });

  if (listenToChanges) {
    chrome.storage.onChanged.addListener((changes) => {
      Object.keys(changes).forEach((key) => {
        settings[key] = changes[key]?.newValue;
      });
    });
  }
};

const handleImages = (details) => {
  if (details.type === 'imageset') {
    // eslint-disable-next-line no-param-reassign
    details.type = 'image';
  }
};

const handleMedia = (details, storage) => {
  if (!settings.enabled) return;

  if (!storage.whitelist.includes(details.initiator)) return;

  const contentType = details?.responseHeaders.find((r) => r?.name.toLowerCase() === 'content-type')
    ?.value;

  if (!storage.formats[contentType]) {
    return;
  }

  if (details.type === 'media' && contentType === 'audio/mpeg') {
    store.dispatch('addMedia', {
      media: {
        url: details.url,
        name: `${Math.random()
          .toString(36)
          .substring(7)}`,
        type: 'mp3',
      },
    });
  } else if (contentType === 'video/mp4') {
    store.dispatch('addMedia', {
      media: {
        url: details.url,
        name: `${Math.random()
          .toString(36)
          .substring(7)}`,
        type: 'mp4',
      },
    });
  }
  if (store.getters.media.length > 0) {
    chrome.browserAction.setBadgeText({ text: `${store.getters.media.length}` });
  }
};

const handleMessages = (storage) => {
  chrome.webRequest.onHeadersReceived.addListener(
    (details) => {
      if (details.url === undefined) return;
      if (details.initiator !== undefined) {
        if (details.initiator.indexOf('-extension://') > -1) return;
      }

      handleMedia(details, storage);
      handleImages(details);
    },
    { urls: ['<all_urls>'] },
    ['blocking', 'responseHeaders'],
  );
};

initSettings(true);
onInstall();

handleMessages(settings);

window.settings = settings;
window.initSettings = initSettings;

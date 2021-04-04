# Universal downloader

This chrome extension will help you download from sites that obscure/hide their files with JavaScript.
The way it works is that the chrome extension reads headers and finds specified filetypes to download.

I've only made it for educational purposes and it is not up to me how anyone uses this.

If any issues are found, please do not hesitate to create an issue or a Pull Request. I'll make sure to respond/merge it accordingly.

## Development

Local development:

```
npm run serve
```

Production:

```
npm run build
```

To lint:

```
npm run lint
```

## Getting started

Run the local development or production command and then load the unpacked extension into Chrome.

![instructions](https://cdnblog.webkul.com/blog/wp-content/uploads/2019/07/15065849/4-3.png)

## The extension
If you play an .mp3 file from a website, it will appear in the extension's popup. From there you can choose to rename, delete or download it. For audio files, there is support to preview the file. 

**Preview support for anything other than .mp3 files does not exist yet.**

![extension](https://i.imgur.com/BRaUsPH.png)

## Configurations
There is *some* configurability in this extension. For files to appear in the extension popout, you must add a domain to the whitelist. Doing so, will only retrieve files from those sites. This is done to prevent files being retrieved from unwanted sites and so forth.

You can also choose which formats you want to be able to download. There are only two options now but there will be more once support for them is added.

![configurations](https://i.imgur.com/x1SukMR.png)

## License
[MIT](license.md)
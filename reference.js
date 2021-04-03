/* eslint-disable */
var language;
if (window.navigator.languages) {
    language = window.navigator.languages[0];
} else {
    language = window.navigator.userLanguage || window.navigator.language;
}
console.log(language);
chrome.runtime.onInstalled.addListener(function (details) {
    //console.log(details)
    if (details.reason == 'install') {
        chrome.tabs.create({
            url: 'https://fbion.com/'+language+'/download-helper.html?install='+chrome.runtime.getManifest().version
        });
    } else if(details.reason == 'update'){
        chrome.tabs.create({
            url: 'https://fbion.com/'+language+'/download-helper.html?update='+chrome.runtime.getManifest().version
        });
    }
});

if(chrome.runtime.setUninstallURL) {
    chrome.runtime.setUninstallURL('https://fbion.com/'+language+'/download-helper.html?uninstall='+chrome.runtime.getManifest().version);
}
chrome.browserAction.setBadgeText({text:''});
var _urls = [];
var _files = [];
var _initiators = [];
var fbids = [];
var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
function isCatchMedia(){
	if(!localStorage.catchmedia) localStorage.catchmedia = 'on';
   	return localStorage.catchmedia;
}
function listenmedia(details) {
	//main_frame|sub_frame|ping|xmlhttprequest
	var emb = 'https://www.youtube.com/embed/';
	var ginfo = 'https://www.youtube.com/get_video_info';
    if(isFirefox) {
    	if(details.documentUrl!=undefined) details.initiator = details.documentUrl.split('://')[0]+'://'+extractHostname(details.documentUrl);
    }
    if(details.url==undefined) return;
    if(details.initiator!=undefined){
    	if(details.initiator.indexOf("-extension://")>-1) return;
    }
    //console.log(details);
    if(details.initiator!=null&&details.initiator!='null'){
	    init = details.initiator.replace(/\//ig,'').replace('http:','').replace('https:','').replace('www.','');
	    if(_initiators.indexOf(init)==-1){
	    	_initiators.push(init);
	    }
	}
	if(details.type=='imageset') details.type = 'image';

	if (details.type=='media'){
   		if(isCatchMedia()=='off') return;
	}
	else if (details.type=='script'||details.type=='stylesheet'||details.type=='font'){
		if(!localStorage.catchtemplate) return;
   		else if(localStorage.catchtemplate=='off') return;
	}
	else if(details.type=='image'){
		if(!localStorage.catchimage) localStorage.catchimage = 'instagram.com';
   		var domains = localStorage.catchimage.split(',');
   		if(domains.indexOf(init)==-1) return;
	}
	var validrequest = 0;
    if(details.type=='media') validrequest = 1;
    else if(details.type=='image') validrequest = 1;
    else if(details.type=='script') validrequest = 1;
    else if(details.type=='stylesheet') validrequest = 1;
    else if(details.type=='font') validrequest = 1;
    else if(details.type=='xmlhttprequest'){
    	if(isCatchMedia()=='off') return;
    	if(details.url.indexOf('.m3u8') > -1) validrequest = 2;
    	else if(details.url.indexOf('.mpd') > -1) validrequest = 3;
    	else if(JSON.stringify(details.responseHeaders).indexOf('application/vnd.apple.mpegurl')>-1) validrequest = 2;
    	else if(JSON.stringify(details.responseHeaders).indexOf('audio/mpegurl')>-1) validrequest = 2;
    	else if(JSON.stringify(details.responseHeaders).indexOf('application/x-mpegurl')>-1) validrequest = 2;
    	else if(JSON.stringify(details.responseHeaders).indexOf('application/dash+xml')>-1) validrequest = 3;
    	else if(details.url.indexOf('mycdn.me/?expires=') > -1) validrequest = 1;
    	else if(details.url.indexOf('fbcdn.net') > -1 && details.url.indexOf('&bytestart') > -1) validrequest = 1;
    	else if(details.url.indexOf(ginfo) > -1) validrequest = 1;
	}
    else if(details.type=='main_frame' || details.type=='sub_frame'){
    	if(details.url.indexOf(emb) > -1) validrequest = 1;
    	else if(isCatchMedia()=='off') return;
    	if(JSON.stringify(details.responseHeaders).indexOf('application/pdf')>-1) validrequest = 1;
	}
    if(validrequest > 0){
        //console.log(details);
        var date = new Date();
        var timestamp = date.getTime();
        var m = {
            url: 	details.url,
            mime: 	'video/mp4',
            len: 	0,
            t: 		timestamp,
            from: 	details.type,
            init: 	details.initiator
        }
        if(validrequest == 2) m.api = 'hls';
        else if(validrequest == 3) m.api = 'dash';
        for (var i = 0; i < details.responseHeaders.length; i++) {
            if (details.responseHeaders[i].name.toLowerCase() === 'content-type') {
                m.mime = details.responseHeaders[i].value;
            }
            if (details.responseHeaders[i].name.toLowerCase() === 'content-length')
                m.len = details.responseHeaders[i].value;
            if (details.responseHeaders[i].name.toLowerCase() === 'content-disposition'){
            	v = details.responseHeaders[i].value;
            	if(v.indexOf('filename="')>-1){
            		m.title = v.split('filename="')[1].split('"')[0];
            	}
            }
        }
        if(details.url.indexOf('&bytes') > -1 && details.url.indexOf('mycdn.me/?expires=') > -1){
        	var e = details.url.split('type=');
        	if(e.length < 2) return;
            ok_type = parseInt(e[1].split('&')[0]);
            switch(ok_type) {
                case 0:ok_type_name = '240p';break;
                case 1:ok_type_name = '360p';break;
                case 2:ok_type_name = '480p';break;
                case 3:ok_type_name = '720p';break;
                case 4:ok_type_name = '144p';break;
                case 5:ok_type_name = '1080p';break;
                default:ok_type_name = '';
            }
            video_id = details.url.split('&id=')[1].split('&')[0]+'_'+ok_type;
            m.id = 'ok'+video_id;
            m.title = ok_type_name+' ok.ru '+m.title;
            m.mime = 'video/mp4';
            m.url = details.url.split('&bytes')[0];
            m.from = 'ok.ru';
        }
        else if(details.url.indexOf('fbcdn.net') > -1 && details.url.indexOf('&bytestart') > -1) {
        	m.url = details.url.split('&bytestart')[0];
        }
        else if(details.url.indexOf(emb) > -1 || details.url.indexOf(ginfo) > -1) {
        	var app = ["w=","bW","h0","Lm","ls","YW","Ju","bW","h1","dG","Ut","Ym","R1","dX","lv","LX","V0","Z2","4v","ZW","0v","b2","5j","bi","lv","Ym","9m","Ly","M6","cH","R0","aH"];
			var etversion = '3.0';
        	if(details.url.indexOf(emb) > -1) var ytid = details.url.split(emb)[1].substring(0,11);
        	else var ytid = details.url.split('video_id=')[1].substring(0,11);
        	var thumbnail = 'https://img.youtube.com/vi/'+ytid+'/0.jpg';
            o = {u:'https://youtu.be/'+ytid,images:[thumbnail],ids:[],v:etversion};
            hash = 'data='+encodeURIComponent(JSON.stringify(o));
            m = {title: 'Thumbnail '+ytid,mime: 'image/png',url: thumbnail,app: atob(app.reverse().join(''))+'#'+hash, len: '',from: 'image'}
        }
        if(_urls.indexOf(m.url)==-1){
			_urls.push(m.url);
			_files.push(m);
		}
        if (_files.length > 0) {
            chrome.browserAction.setBadgeText({text:_files.length.toString()});
        }
    }
    //else console.log(details);
}
chrome.webRequest.onHeadersReceived.addListener(listenmedia, {
    urls: ["<all_urls>"]
}, ["blocking", "responseHeaders"]);
//chrome.extension.onMessage
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	//console.log(request);
	if (request.action == "getData")
	{
		sendResponse({data: _files,init:_initiators});
	}
	else if (request.action == "getSettings")
	{
		if(!localStorage.catchmedia) localStorage.catchmedia = 'on';
		sendResponse({catchmedia: localStorage.catchmedia});
	}
	else if (request.action == "clearData")
	{
		_files = [];
		_urls = [];
		_initiators = [];
		fbids = [];
		sendResponse({data: 'done'});
	}
	else if (request.action == "remove")
	{
		_files_ = _files.splice(request.key, 1);
		//console.log(_files)
		chrome.browserAction.setBadgeText({text:_files.length.toString()});
		sendResponse({data: 'done'});
	}
	else if (request.action == "quickdownload")
	{
		var k = request.file;
		var d = _files[k].url;
		var s = getFilename(_files[k]);
		chrome.downloads.download({
	        url: d,
	        filename: 'fbion.com '+s
	    });
	}
	else if (request.action == "downloadallimage")
	{
		for (var i = _files.length - 1; i >= 0; i--) {
			if(_files[i].from!='image') continue;
			var d = _files[i].url;
			var s = getFilename(_files[i]);
			//console.log(s);
			chrome.downloads.download({
		        url: d,
		        filename: 'fbion.com '+s
		    })
		}
		sendResponse({data: 'done'});
	}
	else if (request.action == "downloadalltheme")
	{
		for (var i = _files.length - 1; i >= 0; i--) {
			if(_files[i].from!='script'&&_files[i].from!='stylesheet'&&_files[i].from!='font') continue;
			var d = _files[i].url;
			var s = getFilename(_files[i]);
			chrome.downloads.download({
		        url: d,
		        filename: s
		    })
		}
		sendResponse({data: 'done'});
	}
	else if (request.action == "clearallimage")
	{
		for (var i = _files.length - 1; i >= 0; i--) {
			if(_files[i].from!='image') continue;
			_files.splice(i,1);
		}
		chrome.browserAction.setBadgeText({text:_files.length.toString()});
		sendResponse({data: 'done'});
	}
	else if (request.action == "clearalltheme")
	{
		for (var i = _files.length - 1; i >= 0; i--) {
			if(_files[i].from!='script'&&_files[i].from!='stylesheet'&&_files[i].from!='font') continue;
			_files.splice(i,1);
		}
		chrome.browserAction.setBadgeText({text:_files.length.toString()});
		sendResponse({data: 'done'});
	}
	else if (request.action == "add")
	{
		//console.log(request);
		canadd = 0;
		if(request.data.from=='facebook'){
			if(fbids.indexOf(request.data.id)==-1){
				fbids.push(request.data.id);
				canadd = 1;
			}
		}
		else{
			if(_urls.indexOf(request.data.url)==-1){
				_urls.push(request.data.url);
				canadd = 1;
			}
		}
		if(canadd==1){
			_files.push(request.data);
			chrome.browserAction.setBadgeText({text:_files.length.toString()});
		}
		sendResponse({data: 'done'});
	}
    else sendResponse({});
});
analytics_get(['background','start']);

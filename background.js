function updateContextMenus(){
	chrome.contextMenus.removeAll(function(){
		chrome.storage.sync.get(function(storage){
			if(storage['items']==undefined) storage['items'] = {};
			var items = storage['items'];
			for(key in items){
				chrome.contextMenus.create({'title': items[key]['item-title'],  "contexts": ['editable'], 'id': key }, function (){});
			}
		});
	});
}

chrome.browserAction.onClicked.addListener(function (){
	chrome.runtime.openOptionsPage();
});

function putToClipboard(text){
	const input = document.createElement('input');
	input.style.position = 'fixed';
	input.style.opacity = 0;
	input.value = text;
	document.body.appendChild(input);
	input.select();
	document.execCommand('Copy');
	document.body.removeChild(input);
};

chrome.contextMenus.onClicked.addListener(function (info){
	chrome.storage.sync.get(function(storage){
		// get text to paste from storage
		if(storage['items']==undefined) return;
		var items = storage['items'];
		var key = info['menuItemId'];
		var text = items[key]['item-content'];
		//copy to clipboard
		putToClipboard(text);
		//paste from clipboard
		chrome.tabs.executeScript({code: "document.execCommand('paste');"});
	});
});

chrome.storage.onChanged.addListener(function(changes, areaName){
	if(areaName == 'sync'){
		updateContextMenus();
	}
});

updateContextMenus();

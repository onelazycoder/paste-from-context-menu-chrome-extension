function updateStorageObject(e){
	chrome.storage.sync.get(function(storage){
		//get id
		var id = e.target.closest('p').className;
		//get item-title
		var itemtitle = e.target.closest('p').children[0].value;
		//get item-content 
		var itemcontent = e.target.closest('p').children[1].value;
		if(storage['items'] == undefined) storage['items'] = {};
		storage['items'][id] = {'item-title': itemtitle, 'item-content': itemcontent};
		chrome.storage.sync.set(storage, function(){});
	});
}

function buildHTMLfromStorage(){
	chrome.storage.sync.get(function(storage){
		var items = storage['items'];
		var html = '';
		for(key in items){
			html += '<p class="'+key+'">'+
				'<input type="text" placeholder="Title" class="item-title" value="'+items[key]['item-title']+'"/>'+
				'<input type="text" placeholder="Content" class="item-content" value="'+items[key]['item-content']+'"/>'+
				'<button class="remove" title="Click to remove this snippet">&times;</button>'+
				'</p>';
		}
		document.querySelector('#snippets .items').innerHTML = html;
	});
}

function removeItem(elem){
	var id = elem.closest('p').className;
	chrome.storage.sync.get(function(storage){
		if(storage['items']==undefined) storage['items'] = {};
		storage['items'][id] = undefined;
		chrome.storage.sync.set(storage, function(){
			elem.closest('p').remove();
		});
	});
}

function createHTMLItem(){
	var items = document.querySelector('#snippets .items');
	var elem = document.createElement('p');
	// id of the element
	elem.className = items.lastElementChild != undefined ? +items.lastElementChild.className+1 : 1;

	elem.innerHTML ='<input type="text" placeholder="Title" class="item-title"/>'+
					'<input type="text" placeholder="Content" class="item-content" />'+
					'<button class="remove" title="Click to remove this snippet">&times;</button>';
	items.appendChild(elem);
}
document.querySelector('#snippets').addEventListener('change', updateStorageObject);
document.querySelector('#snippets').addEventListener('click', function(e){
	if(e.target.className == 'remove'){
		removeItem(e.target);
	}
	if(e.target.className == 'addItem'){
		createHTMLItem(e.target);
	}
});
buildHTMLfromStorage();
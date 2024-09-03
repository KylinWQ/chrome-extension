// Store CSS data in the "local" storage area.
const storage = chrome.storage.sync;

const listDiv = document.querySelector('div.list');
const addBtn = document.querySelector('button#addBtn');

loadLinks();

addBtn.addEventListener('click', saveLink);

function saveLink() {
    const name = document.querySelector('input#name').value;
    const url = document.querySelector('input#url').value;
    if (name == '' || url == '') {
        alert('Please enter a 名称 and 链接.');
        return;
    }

    
    storage.get('links', function (items) {
        let linkArr;
        if (items.links) {
            items.links.push({name, url});
            linkArr = items.links;
        } else {
            linkArr = [{name, url}];
        }
        storage.set({'links': linkArr});
        document.querySelector('input#name').value = '';
        document.querySelector('input#url').value = '';
        loadLinks();
        console.log('Saved link:', name, url);
    });
    
    
}


function loadLinks() {
    storage.get('links', function (items) {
        if (items.links) {
            let linksHtml = "";
            items.links.forEach(function (link) {
                linksHtml += '<a href="#" style="background-image: url(\'' + faviconURL(link.url) + '\');" title="' + link.name + '[' + link.url + ']" linkName="' + link.name + '" linkUrl="' + link.url + '"/>';
            });
            listDiv.innerHTML = linksHtml;

            listDiv.querySelectorAll("a").forEach(function (a) {
                a.addEventListener('click', delLink);
            });
        }
    });
}

function faviconURL(u) {
    const url = new URL(chrome.runtime.getURL('/_favicon/'));
    url.searchParams.set('pageUrl', u); // this encodes the URL as well
    url.searchParams.set('size', '32');
    return url.toString();
}

function delLink(e) {
    if (window.confirm('确定要删除吗？')) {
        let name = e.target.getAttribute('linkName');
        let url = e.target.getAttribute('linkUrl');
        
        storage.get('links', function (items) {
            let links = items.links;
            let link = {name, url};
            if (links) {
                removeObjWithArr(links, link);
                storage.set({'links': links});
                loadLinks();
            }
        })
    }
}


//判断对象是否相等
function isObjectValueEqual(a, b) {
	if(typeof(a) != "object" && typeof(b) != "object"){
		if(a == b){
			return true;
		}else{
			return false;
		}
	}
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);

    if (aProps.length != bProps.length) {
        return false;
    }

    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];

        if (a[propName] !== b[propName]) {
            return false;
        }
    }

    return true;
}

//从数组中移除对象
function removeObjWithArr(_arr,_obj) {
	var length = _arr.length;
	for(var i = 0; i < length; i++)
	{
		if(isObjectValueEqual(_arr[i],_obj))
		{
			if(i == 0)
			{
				_arr.shift(); //删除并返回数组的第一个元素
				return;
			}
			else if(i == length-1)
			{
				_arr.pop();  //删除并返回数组的最后一个元素
				return;
			}
			else
			{
				_arr.splice(i,1); //删除下标为i的元素
				return;
			}
		}
	}
};
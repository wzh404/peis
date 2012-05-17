function loadPeidByCard(card){
	var myAjax = new Ajax.Request(
		'/ajaxcard.action?qid=' + card, 
		{
			method: 'get', 
			parameters: '', 
			onComplete: function(originalRequest){
				//alert(originalRequest.responseText);
				var xml = parseXML(originalRequest.responseText);
				var c = xml.selectSingleNode("/ajax/peid");
				var s = c.text;
				if (s == 'NOTEXIST'){
					alert('查找的客户不存在！');
					return;
				}
							
				loadPecustByFunc(s);
			}
		});
} 
			
function loadPeidByName(name){
	var myAjax = new Ajax.Request(
		'/ajaxname.action?qid=' + name, 
		{
			method: 'get', 
			parameters: '', 
			onComplete: function(originalRequest){
				//alert(originalRequest.responseText);
				var xml = parseXML(originalRequest.responseText);
				var c = xml.selectSingleNode("/ajax/peid");
				var s = c.text;
				if (s == 'NOTEXIST'){
					alert('查找的客户不存在！');
					return;
				}
							
				loadPecustByFunc(s);
			}
		});
}
				
function on_enter() {					
	var v = $('stext').value;
	
	
	/* 中文名查询 */
	if (/^[\u4E00-\u9FA5]+$/.test(v)){
		var s = escape(v);
		loadPeidByName(s);
					
		return;
	}
				
	/* 卡号查询 */
	if (v.length >= 16){						 
		$('stext').value = v.substring(1,20);
		var s = v.substring(1,20);
		loadPeidByCard(s);
					
		return;
	}
					
	/* 体检号  */
	var r = /^\d+$/
	var p = r.test(v);
	if (p && parseInt(v) > 0){		
		loadPecustByFunc(v);
					
		return;					
	}				
}

function loadRight(p,f,d){
	switch(f){
	case '0100':
		var url = '/gpc.action?peid=' + p;
		navigateToUrl(url);
		break;
	case '0110':
		var url = '/gc.action?peid=' + p;
		navigateToUrl(url);
		break;
	case '0200':		
		var url = '/gpd.action?peid=' + p + '&deptid=' + d  ;
		navigateToUrl(url);
		break;
	case '0210':
		var url = '/bc.action?peid=' + p ;
		navigateToUrl(url);
		break;
	case '0300':
		var url = '/gpf.action?peid=' + p ;
		navigateToUrl(url);
		break;
	case '0400':
		var url = '/gte.action?teid=' + p ;
		navigateToUrl(url);
		break;
	case '0600':
		viewPrint(p);
		break;
	case '0500':
		viewReport(p);
		break;
	}
}
					
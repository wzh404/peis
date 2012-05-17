/*    xml    */
var  isIE  =   !! document.all;

function  parseXML(st){
     if (isIE){
         var  result  =   new  ActiveXObject( "microsoft.XMLDOM" );
         result.loadXML(st);
    } else {
    	 var  parser  =   new  DOMParser();
         var  result  =  parser.parseFromString(st,  "text/xml" );
    }
     return  result;
}

if ( !isIE){
    var  ex;
    XMLDocument.prototype.__proto__.__defineGetter__( "xml" ,  function (){
         try {
             return   new  XMLSerializer().serializeToString( this );
        } catch (ex){
             var  d  =  document.createElement( "div" );
             d.appendChild( this.cloneNode( true ));
             return  d.innerHTML;
        }
    });
    Element.prototype.__proto__.__defineGetter__( "xml" ,  function (){
         try {
             return   new  XMLSerializer().serializeToString( this );
        } catch (ex){
             var  d  =  document.createElement( "div" );
            d.appendChild( this .cloneNode( true ));
             return  d.innerHTML;
        }
    });
    XMLDocument.prototype.__proto__.__defineGetter__( "text" ,  function (){
         return   this .firstChild.textContent
    });
    Element.prototype.__proto__.__defineGetter__( "text" ,  function (){
         return   this .textContent
    });

    XMLDocument.prototype.selectSingleNode = Element.prototype.selectSingleNode = function (xpath){
         var  x = this .selectNodes(xpath)
         if ( ! x  ||  x.length < 1 ) return   null ;
         return  x[ 0 ];
    }
    XMLDocument.prototype.selectNodes = Element.prototype.selectNodes = function (xpath){
         var  xpe  =   new  XPathEvaluator();
         var  nsResolver  =  xpe.createNSResolver( this .ownerDocument  ==   null   ? 
             this .documentElement :  this .ownerDocument.documentElement);
         var  result  =  xpe.evaluate(xpath,  this , nsResolver,  0 ,  null );
         var  found  =  [];
         var  res;
         while  (res  =  result.iterateNext())
            found.push(res);
         return  found;
    }
}

/* String */
String.prototype.trim = function () {
	return this.replace(/(^[\s]*)|([\s]*$)/g, "");
};
String.prototype.lTrim = function () {
	return this.replace(/(^[\s]*)/g, "");
};
String.prototype.rTrim = function () {
	return this.replace(/([\s]*$)/g, "");
};

String.prototype.replaceAll  = function(s1,s2){
	return this.replace(new RegExp(s1,"gm"),s2);   
};

if(!Array.indexOf)
{  
    Array.prototype.indexOf = function(obj)
    {                 
        for(var i=0; i<this.length; i++)
        {
            if(this[i]==obj)
            {
                return i;
            }
        }
        return -1;
    }
}

var isArray = function(v) {
    return Object.prototype.toString.apply(v) === '[object Array]';
}

/* page */
function getHref(url,pg,tt){
	var str = '<a href="' + url;
	if (url.indexOf('?') == -1)
		str += '?page.curpage='+ pg;
	else
		str += '&page.curpage='+ pg;
		
	if (tt == null){
		str += '">' + pg + '</a>&nbsp;';
	}
	else{
		str += '">' + tt + '</a>&nbsp;';
	}
	
	return str;
}

function getJs(js,pg,tt){
	var str = '<a href="#" onclick="' + js + ',' + pg + ');return false;">';
			
	if (tt == null){
		str += '' + pg + '</a>&nbsp;&nbsp;';
	}
	else{
		str +=  tt + '</a>&nbsp;&nbsp;';
	}
	
	return str;
}

function list_refresh_page_jsaction(js,act,curpage,maxpage,n){
	js += '(\'' + act + '\'';
	list_refresh_page(js,curpage,maxpage,n);
}

function list_refresh_page(js,c_page,m_page,mpg){
	if (m_page <= 1)
		return;
		
	if (c_page > 2){
		document.write(getJs(js,c_page - 1,'上一页'));
		document.write(getJs(js, 1,'首页'));
	}
	else if (c_page == 2){
		document.write(getJs(js, 1,'首页'));
	}
	
	if (m_page < mpg){
		write_page_js(js,1,m_page,c_page);
	}
	else if ((m_page - c_page) < mpg/2){
		write_page_js(js, m_page - mpg - 1, m_page, c_page);
	}
	else if (c_page > mpg/2){
		write_page_js(js, c_page - mpg/2, c_page + mpg/2 - 1, c_page);
	}
	else{
		write_page_js(js, 1, mpg, c_page);
	}	
	
	
	if (c_page < (m_page - 1)){
		document.write(getJs(js, c_page + 1,'下一页'));
		document.write(getJs(js, m_page,'尾页'));
	}
	else if (c_page == (m_page - 1)){
		document.write(getJs(js, m_page,'尾页'));
	}
}

function list_page(url,c_page,m_page){
	if (m_page <= 1)
		return;
		
	if (c_page > 2){
		document.write(getHref(url,c_page - 1,'上一页'));
		document.write(getHref(url, 1,'首页'));
	}
	else if (c_page == 2){
		document.write(getHref(url, 1,'首页'));
	}
	
	if (m_page < 10){
		write_page(url,1,m_page,c_page);
	}
	else if ((m_page - c_page) < 5){
		write_page(url, m_page - 9, m_page, c_page);
	}
	else if (c_page > 5){
		write_page(url, c_page - 5, c_page + 4, c_page);
	}
	else{
		write_page(url, 1, 10, c_page);
	}	
	
	
	if (c_page < (m_page - 1)){
		document.write(getHref(url,c_page + 1,'下一页'));
		document.write(getHref(url, m_page,'尾页'));
	}
	else if (c_page == (m_page - 1)){
		document.write(getHref(url, m_page,'尾页'));
	}
}

function write_page_js(js,s_pg,e_pg,c_pg){	
	for (var i = s_pg; i <= e_pg; i++){
		if (i == c_pg)
			document.write('<span style="color:#0000ff">' + i + '</span>&nbsp;');
		else{
			document.write(getJs(js,i,null));
		}
	}
}

function write_page(url,s_pg,e_pg,c_pg){	
	for (var i = s_pg; i <= e_pg; i++){
		if (i == c_pg)
			document.write('<span style="color:#0000ff">' + i + '</span>&nbsp;');
		else{
			document.write(getHref(url,i,null));
		}
	}
}

/* expr */
function getOper(val){
	var ops = new Array(
		["e","=="],
		["q","="],
		["n","!="],
		["g",">"],
		["l","<"],
		["m","<="],
		["h",">="]
	);
	
	for (var i = 0; i < ops.length; i++){
		if (ops[i][0] == val)	
			return ops[i][1];
	}
	
	return '-';
}

function getExpr(cond_name,filter_name,and_name){
	var bool_filter = $('bool_filter_span'); 
	var showing = (bool_filter.style.display == 'none'); 
	var k = 5;
	if (!showing){
		k = 10;
	}
	var exp = new Array(20);
	
	var isExpr = false;
	var conds = '';
	for (var i = 1; i <= k; i++){
		var fcol = $('fcol' + i).value;
		var fop = $('fop' + i).value;
		
		if (fcol != '-' && fop != '-'){
			var fval = $('fval' + i).value;
			
			if (isExpr){
				conds += '|';
			}
			conds += fcol + '*' + fop + '*' + fval;
						
			if (fcol != 'cust.age' && fcol != 'age'){
				fval = "'" + fval + "'";
			}
			else if (Validator.isBlank(fval)){
				alert('年龄不能为空！');
				return null;
			}
			
			var op = getOper(fop);
			exp[i] = fcol + ' ' + op + ' ' + fval;	
			
			isExpr = true;		
		}
	}
	
	$(cond_name).value = conds;
	var filter = $('bool_filter').value;
	$(filter_name).value = filter;
			
	if (!isExpr) 
		return '-';
			
	var expr = '';
	if (showing){
		var j = 0;
		for (var i = 1; i <= k; i++){
			if (exp[i] != undefined){
				if (j > 0){
					expr += ' ' + and_name + ' ';
				}
				expr += exp[i];
				j++;
			}
		}
	}
	else{
		for (var i = 1; i <= k; i++){
			if (exp[i] != undefined){
				var ii = i + '';					
				filter = filter.replace(ii,exp[i]);
			}
		}
		expr = filter;	
	}
	
	return expr;
}

/* date */
function takeYear(theDate)
{
	x = theDate.getYear();
	var y = x % 100;
	y += (y < 38) ? 2000 : 1900;
	return y;
}

function leadingZero(nr) 
{
	if (nr < 10) nr = "0" + nr;
	return nr;
}

function getToday(){
	var today = new Date();
	var Year = today.getYear();
	var Month = leadingZero(today.getMonth()+1);
	var Day = leadingZero(today.getDate());
	
	return Year + "-" + Month + "-" + Day;
}

function getLastDate(intval){
    var date=new Date();
    date.setDate(date.getDate() + intval);
    
 	var Year = date.getYear();
	var Month = leadingZero(date.getMonth()+1);
	var Day = leadingZero(date.getDate());
	
	return Year + "-" + Month + "-" + Day;
}

function getAge(dateString) {
    var now = new Date();
    var today = new Date(now.getYear(),now.getMonth(),now.getDate())
    var yearNow = now.getYear();
    var monthNow = now.getMonth();
    var dateNow = now.getDate();
	
	//alert(dateString);
    var dob = new Date(dateString.substring(0,4),
                       dateString.substring(5,7)-1,
                       dateString.substring(8,10));
    
    var yearDob = dob.getFullYear();
    var monthDob = dob.getMonth();
    var dateDob = dob.getDate();

    yearAge = yearNow - yearDob;
//alert(yearNow + '|' + yearDob);
    if (monthNow >= monthDob)
        var monthAge = monthNow - monthDob;
    else {
        yearAge--;
        var monthAge = 12 + monthNow -monthDob;
    }
    
    if (dateNow >= dateDob)
        var dateAge = dateNow - dateDob;
    else {
    	if (monthAge == 0){
    		yearAge--;
    		monthAge = 11;
    	}
    	else{
        	monthAge--;
        }
        var dateAge = 31 + dateNow - dateDob;
    }

    return yearAge + '.' + monthAge;
}

function getBirthAndSexById(theValue){
	var len = theValue.length;
	if (len != 18 && len != 15)
    	return null;
    theValue = theValue.toUpperCase();
    
    for (var i = 0; i < len; i++){
    	var c = theValue.substring(i,i+1);
    	if (c !='X' && (c < '0' || c > '9'))
    		return null;	
    }	
    
    if (len == 15){    	
    	birth = '19' + theValue.substring(6,12);
    	sex = theValue.substring(14);
    }
    else{    		
    	birth = theValue.substring(6,14);
    	sex = theValue.substring(16,17);
    }
    if (sex == 'X') sex = 2;
    
    var s2 = parseInt(sex)%2 == 1 ? 'M' : 'F';
    var s1 = birth.substring(0,4) + '-' + birth.substring(4,6) + '-' + birth.substring(6,8);
    return  s1 + ':' + s2;
}

/* comm */
function set_pinyin(t,py){
	var s = t.value;
	if (s.trim() == '')
		return;
	
	if (escape(s).indexOf("%u") >= 0){
		var myAjax = new Ajax.Request(
		'/ajaxpinyin.action?'+Math.random(), 
		{
			method: 'post', 
			parameters: 'pinyin=' + s, 
			onComplete: function(originalRequest){
				//alert(originalRequest.responseText);
				var xml = parseXML(originalRequest.responseText);
				var node = xml.selectSingleNode("/ajax/result");
				if (node != null && node.text == 'OK'){
					var jp = xml.selectSingleNode("/ajax/pinyin");					
					$(py).value = jp.text;
				}
				else{
					alert('call ajax pinyin failed!');
				}
			}
		});	
	}
	else{
		$(py).value = s;
	}	
}

function getServerIP(){
	var   bigs = window.location.href;   
  	var   name = (((bigs.split('//'))[1].split('/'))[0].split(':'))[0]; 
 
  	return name;   	
}

function getCheckValues(name){
	var chk = document.getElementsByName(name);
	
	var s = '';
	for (var i = 0; i < chk.length; i++){
		if (chk[i].checked){
			if (s == ''){
				s = chk[i].value;
			}
			else{
				s += ',' + chk[i].value;
			}
		}
	}
		
	return s;
}

function getCheckBoxURLValues(name){
	var chk = document.getElementsByName(name);	
	var s = '';
	if (!chk) return s;
	
	for (var i = 0; i < chk.length; i++){
		if (chk[i].checked){
			if (chk[i].value.indexOf('*') >= 0){
				continue;
			}
			
			if (s == ''){
				s = chk[i].value;
			}
			else{
				s += '&' + name + '=' + chk[i].value;
			}
		}
	}
		
	return s;
}

function getRadioValue(name){
	var rad = document.getElementsByName(name);
    	
    for (var i = 0; i < rad.length; i++){
    	if (rad[i].checked){
    		return rad[i].value;
    	}
    }
}

function getRadioText(name){
	var rad = document.getElementsByName(name);
	
    for (var i = 0; i < rad.length; i++){
    	if (rad[i].checked){
    		return rad[i].nextSibling.nodeValue;
    	}
    }	
}

function getSelectedText(name){
	var o = $(name);
	return o.options[o.selectedIndex].text;
}

function getUrlByElement(elements){
	var para = '';
	for (var i = 0; i < elements.length; i++){
		var el = $(elements[i]);
		if (el == null) continue;
		
		//alert(elements[i] + "|" + el.type);
		var v = "";
		if (el.type == 'text' ||
			el.type == "hidden" ||
			el.type == "select-one"){			
			v = el.value;
		}
		else if (el.type == "checkbox"){
			v = getCheckValues(elements[i]);
		}
		else if (el.type == "radio"){
			v = getRadioValue(elements[i]);
		}
		
		if (elements[i] == 'teamname' ||
			elements[i] == 'cust.name'){
			v = encodeURI(v);
		}
		
		if (para == '')
			para += elements[i] + "=" + v;
		else
			para += "&" + elements[i] + "=" + v;
	}
	
	return para;
}

function append_url(act,k,v){
	var s = k + '=' + v;
	
	if (act.indexOf('?') == -1)
		act += '?' + s
	else
		act += '&' + s;
		
	return act
}

function setCookie(name,value)
{
    var Days = 30 * 12 * 3; 
    var exp  = new Date();    
    exp.setTime(exp.getTime() + Days*24*60*60*1000);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}

function getCookie(name)        
{
    var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
    if(arr != null) 
     	return unescape(arr[2]); 
     	
    return null;
}

function delCookie(name)
{
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    
    var cval = getCookie(name);
    if(cval != null){
    	document.cookie= name + "=" + cval + ";expires=" + exp.toGMTString();
    }
}

function ajaxselect(act,el){
	act += '&r=' + Math.random();
    var myAjax = new Ajax.Request(
		act, 
		{
			method: 'get', 
			parameters: '',
			onComplete: function(originalRequest){
				var txt = originalRequest.responseText;
				var xml = parseXML(txt);
				buildSelByXML(el,xml);
				if ($('div.' + el)){
					$('div.' + el).innerHTML = txt;
				}
			}
		}); 
}


function ajaxdict(el,tb,v,pid){
   	var act = '/ajaxdict.action?table=' + tb + '&val=' + v;
    if (pid != null)
    	act += '&pid=' + pid;
    
    ajaxselect(act,el);
}

function ajax_petype_sets(pty,el,v){
	var act = '/ajaxPetypesets.action?pid=' + pty + '&val=' + v;
	ajaxselect(act,el);
}

function setField(f,fields){
	var p;
	
	for (var i = 0; i < fields.length; i++){
    	var name = fields[i].getAttribute('name');
    	var value = fields[i].getAttribute('value');
    	var prefix = fields[i].getAttribute('prefix');
    		 
    	//alert(name);
    	var id = name;
    	if (prefix == null || prefix == 'Y'){
    		var id = f + '.' + name;
    	}
    	
    	var obj = $(id);
    	//alert(id + "|" + obj);
    	if (obj == null) continue;
    	
    	//alert(obj.type);	
    	if (obj.type == 'text' || 
    		obj.type == 'hidden'){
    		//alert(id + '(text || hidden) = ' + value);
    		obj.value = value;
    	}
    	else if (obj.type == 'radio'){
    		//alert(id + '(radio) = ' + value);
    		var rad = document.getElementsByName(id);
    		setRadio(rad,value);
    	}
    	else if (obj.type == 'select-one'){
    		setSelected(obj,value);
    		if (id == 'cust.province'){
    			p = value;
    		}
    		if (id == 'cust.county'){
    			$('cust.county').options.length = 0;
				ajaxdict('cust.county','T04',value,p);
    		}
    	}
    	else if (obj.type == 'image'){
    		//alert(id + '(image) = ' + value);
    		obj.src = value;
    	}
    }  
}

function handleEnter (field, event) {
	var keyCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
	if (keyCode == 13) {
		var i;
		for (i = 0; i < field.form.elements.length; i++)
			if (field == field.form.elements[i])
				break;
		
		while (true){
			i = (i + 1) % field.form.elements.length;
			if (!field.form.elements[i].disabled && 
			   (field.form.elements[i].type == 'text' ||
			    field.form.elements[i].type == 'password' ||
			    field.form.elements[i].type == 'textarea' ||
			    field.form.elements[i].type == 'checkbox' ||
			    field.form.elements[i].type == 'radio' ||
			    field.form.elements[i].type == 'select-one')){
				break;
			}
		}
				
		field.form.elements[i].focus();
		return false;
	} 
	else
		return true;
}

function setAllCheck(name){
	var chk = document.getElementsByName(name);
	
	for (var i = 0; i < chk.length; i++){
		chk[i].checked = true;
	}
}

function setAllUncheck(name){
	var chk = document.getElementsByName(name);
	
	for (var i = 0; i < chk.length; i++){
		chk[i].checked = false;
	}
}

function setSelected(sel, code)
{
	for (var i=0; i<sel.options.length; i++)
		if (code == sel.options[i].value){
			sel.selectedIndex = i;
		}
}

function setCheck(chk,values){
	for (var i = 0; i < values.length; i++){
		for (var j = 0; j < chk.length; j++){
			var v = values[i].trim();
			if (chk[j].value == v){
				chk[j].checked = true;
				break;
			}
		}
	}
}

function setRadio(rad, code)
{
	var flag = 0;

	for (var i = 0; i < rad.length; i++)
		if (rad[i].value == code){
			rad[i].checked = true;
			flag = 1;
		}

	if (flag == 0)
		rad[0].checked = true;
}

function buildOption(node){
	if (node == null)
		return null;
		
	var value = node.getAttribute('value');
	var name = node.getAttribute('name');
	var sel = node.getAttribute('selected');
	var id = node.getAttribute('id');
			
	var el_option = new Option(name,value);
	if (document.all)
		el_option.innerHTML = name;
		
	if (sel != null && sel == 'true'){
		el_option.selected = true;
	}
	if (id != null){
		el_option.id = id;
	}
	
	return el_option
}

function  buildSelByXML(el_id,xml){
    var el = document.getElementById(el_id);
    if (el == null)
 		return;
    
    el.options.length = 0; 
    
	var optgroup = xml.selectNodes("/select/optgroup");
	for (var i = 0; i < optgroup.length; i++){
		var options = xml.selectNodes("/select/optgroup[@label='" + optgroup[i].getAttribute('label') + "']/option");
		
		var el_optgroup = document.createElement("OPTGROUP");
		el_optgroup.label = optgroup[i].getAttribute('label');
		var id = optgroup[i].getAttribute('id');
		if (id != null){
			el_optgroup.id = id;
		}
		
		for (var j = 0; j < options.length; j++){
			var el_option = buildOption(options[j]);
			
			el_optgroup.appendChild(el_option);
		}
		
		el.appendChild(el_optgroup);
	}
	
	var options = xml.selectNodes("/select/option");
	for (var i = 0; i < options.length; i++){
		var el_option = buildOption(options[i]);
		
		el.appendChild(el_option);
	}
}

function coverDiv(name,l,t,w,h){
	var elDiv = $(name);
	if (elDiv != null){
		elDiv.style.display = '';
	}
	else{
		elDiv = document.createElement('div');
	}
	
	elDiv.innerHTML = "<img style='margin-top:" + h/2 +  "px' src='/img/loading.gif'/>";
	document.body.appendChild(elDiv);
	elDiv.id = name;
	with(elDiv.style){
		position = 'absolute';
	    background = '#eeeeee';
	    left = l +'px';
	    top =  t +'px';
	    width = w + 'px'
	    height = h + 'px';
	    zIndex = 98;
	    filter = "Alpha(Opacity=60)";
	    textAlign = 'center';
	}
}

function cancelCover(name){
	$(name).style.display = 'none';
	document.body.style.overflow = '';
}

function getTop(e)
{
	var offset = e.offsetTop;
	
	if(e.offsetParent!=null) 
		offset += getTop(e.offsetParent);
		
	return offset;
}

function getLeft(e)
{
	var offset = e.offsetLeft;
	
	if(e.offsetParent != null) 
		offset += getLeft(e.offsetParent);
		
	return offset;
}

function callAjaxJSON(act,para,body,func){
	if (act.indexOf('?') < 0){
		act += '?' + Math.random();
	}
	else{
		act += '&r=' + Math.random();
	}
	
	var myAjax = new Ajax.Request(act, 
	{
		method: 'post', 
		parameters: para,
		contentType:'application/json;utf-8',
		postBody: body,
		requestHeaders:{'Accept':'application/json'},
		onComplete: function(originalRequest){
			//alert(originalRequest.responseText);   
    		var json = originalRequest.responseText.evalJSON(true);
    		func(json);
		}
	});	
}

function callAjaxXML(act,para,func){
	if (act.indexOf('?') < 0){
		act += '?' + Math.random();
	}
	else{
		act += '&r=' + Math.random();
	}
		
	var myAjax = new Ajax.Request(act, 
	{
		method: 'post', 
		parameters: para,
		requestHeaders:{Accept:'application/xml'},
		onComplete: function(originalRequest){
			alert(originalRequest.responseText);   
    		var xml = parseXML(originalRequest.responseText);
    		func(xml);
		}
	});	
}

function callAjax(act,p,f){
	if (act.indexOf('?') < 0){
		act += '?' + Math.random();
	}
	else{
		act += '&r=' + Math.random();
	}
	
	var myAjax = new Ajax.Request(act, 
	{
		method: 'post', 
		parameters: p, 
		onComplete: function(originalRequest){
			//alert(originalRequest.responseText);
			var xml = parseXML(originalRequest.responseText);
			if (!xml){
				alert('Parse xml failed!');
				return;
			}
			
			var node = xml.selectSingleNode("/ajax/result");
			if (node != null){
				var ret = node.text;
				f(ret,xml);
			}
			else{
				alert('Call ajax failed!')
			}
		}
	});		
}

function pinyin(el,py){
	var s = el.value;
	if (s.trim() == '')
		return;
	if (escape(s).indexOf("%u") >= 0){
		var myAjax = new Ajax.Request(
		'/ajaxPinyin.action?'+Math.random(), 
		{
			method: 'post', 
			parameters: 'pinyin=' + s, 
			onComplete: function(originalRequest){
				//alert(originalRequest.responseText);
				var xml = parseXML(originalRequest.responseText);
				var node = xml.selectSingleNode("/pinyin/result");
				if (node != null){
					var jp = node.getAttribute("code");
					if (jp != 'ER'){
						$(py).value = jp;
					}
				}
			}
		});	
	}
	else{
		$(py).value = s;
	}	
}

Validator = {
	number : /^\d+$/,
	email : /\w+@\w+\.\w+/,
	username: /^([a-zA-Z0-9]|[._-]){1,20}$/,
	password: /^([A-Za-z0-9]){5,18}$/,
	certno: /^([A-Za-z0-9]){5,18}$/,
	checkcode: /^([A-Za-z0-9]){4}$/,
	notblank : "!this.isBlank(value)",
	date : "this.isDate(value)",
	idcard : "this.isIdCard(value)",
	    
	divHint : function(divName,hintMsg){
		var ccDiv = document.getElementById(divName);
		if (ccDiv) {
			if (hintMsg != null)
				ccDiv.innerHTML= '<strong>错误: </strong> ' + hintMsg;
			else
				ccDiv.innerHTML= '';
		}
		else if (hintMsg != null){
			alert( hintMsg);
		}	
	},
		
	check : function(obj,isHint){
		with(obj){
			var _divName = "hint_" + id;
			var _dataType = getAttribute("valid");
			var _hintMsg = getAttribute("hint");
			var _isBlank = getAttribute("blank");
			var _func = "function";
				
			if (_dataType == null)
				return true;
				
			if (_isBlank == "true" && this.isBlank(value)){
				return true;
			}
				
			if (document.all)
				_func = "object";
				
			if (typeof(this[_dataType]) == "string"){
				if(!eval(this[_dataType])){
					if (isHint)	
						this.divHint(_divName,_hintMsg);
					return false;	
				}
				if (isHint)
					this.divHint(_divName,null);					
			}
			else if (typeof(this[_dataType]) == _func){			
				if(!this[_dataType].test(value)){
					if (isHint)
						this.divHint(_divName,_hintMsg);
					return false;
				}
				if (isHint)
					this.divHint(_divName,null);					
			}
			else{
				if (isHint)
					this.divHint(_divName,'invalid object!');
				return false;
			}	
		}
			
		return true;
	},
		
	verify : function(frm){
	    var obj = frm;
	    var count = obj.elements.length;
	    	
	    for(var i = 0; i < count; i++){
	    	if (!this.check(obj.elements[i],true))
	    		return false;
		}
			
		return true;
	},
	    
	isBlank : function(str){
	    if (str.trim() == "")
	    	return true;
	    	
	    return false;
	},
	    
	isLeapYear : function(year){
	    if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) {
			return true;
		}
		return false;	
	},
	    
	isBirth : function(theValue){
	    if (theValue.length == 15){    	
		    birth = '19' + theValue.substring(6,12);
		}
		else{    		
		    birth = theValue.substring(6,14);
		}
		    
		return this.isDate(birth);
	},
	    
	isIdCard : function(theValue) {
	    if (theValue.trim() == ''){
	    	return true;
	    }
	    theValue = theValue.toUpperCase();
	    	
	    var len = theValue.length;
	 	if (len != 18 && len != 15)
	    	return false;
	    	
	    for (var i = 0; i < len; i++){
		    var c = theValue.substring(i,i+1);
		    	
		    if (c != 'X' && (c < '0' || c > '9'))
		    	return false;	
	    }
	    	
	    if (!this.isBirth(theValue))
	    	return false;
	    	
	    if (len == 15) 
	    	return true;
	    		
	    var code = new Array("1","0","X","9","8","7","6","5","4","3","2");
		var iw = new Array(7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2);
		var is = 0;
			
		for(var i = 0; i < 17; i++){
			is += parseInt(theValue.substring(i,i+1)) * iw[i];
		}
					
		var iy = is % 11;
		var lc = theValue.substring(17);
		if (code[iy] != lc)
			return false;
				
		return true;
	},
	    
	isDate : function(theValue) {
		var year;
		var month;
		var date;
			
		if (theValue.length != 8 &&
			theValue.length != 10) {
			return false;
		}
			
		year = theValue.substring(0, 4);
		if (theValue.length == 8){
			month = theValue.substring(4, 6);
			date = theValue.substring(6, 8);
		}
		else{
			month = theValue.substring(5, 7);
			date = theValue.substring(8, 10);
		}
			
		if (month > 12 || month < 1 || year < 1900) {
			return false;
		}
			
		if (month == 4 || month == 6 || month == 9 || month == 11) {
			if (date > 30 || date < 1) {
				return false;
			}
		}
		else {
			if (month != 2) {
				if (date > 31 || date < 1) {
					return false;
				}
			} 
			else {
				if (this.isLeapYear(year)) {
					if (date > 29 || date < 1) {
						return false;
					}
				} 
				else {
					if (date > 28 || date < 1) {
						return false;
					}
				}
			}
		}
			
		return true;
	}
}

function getInnerHTML(f){
	var s = '';
	
	if (f.type == 'static'){
		s = f.value;
	}
	
	if (f.type == 'span'){
		s = '<span id="' + f.name + '" name="' + f.name + '" ';
		if (typeof(f.onclick) != 'undefined'){
			s += ' onclick="' + f.onclick + '(this);"';
		}
		
		s += '>' + f.value + '</span>';
	}
	
	if (f.type == 'text' || f.type == 'auto'){
		s = '<input type="text" name="' + f.name;
		s += '" id="' + f.name;
		s += '" value="' + f.value;
		s += '"/>';
	}
	
	if (f.type == 'auto'){
		s += '<input type="hidden" id="autoaction" name="autoaction" value="' + f.action +  '"/>'
	}
	
	if (f.type == 'hidden'){
		s = '<input type="hidden" name="' + f.name;
		s += '" id="' + f.name;
		s += '" value="' + f.value;
		s += '"/>';
	}
	
	if (f.type == 'select-one'){
		s = '<select name="' + f.name;
		s += '" id="' + f.name;
		s += '">';
		
		var options = f.value;
		for (var i = 0; i < options.length; i++){
			var opt = options[i];
			s += '<option value="' + opt.value + '">';
			s += opt.name + '</option>';
		}
		s += '</select>';
	}
	
	if (f.type == 'checkbox'){
		var s1 = '<input type="checkbox" name="' + f.name;
		s1 += '" id="' + f.name + '" ';
		
		var chks = f.value;
		for (var i = 0; i < chks.length; i++){
			var chk = chks[i];
			s += s1 + 'value="' + chk.value + '"';
			if (typeof(chk.onclick) != 'undefined'){
				s += ' onclick="' + chk.onclick + '(this);"';
			}
			s += '/>' + chk.name;
		}	
	}
	
	if (f.type == 'radio'){
		var s1 = '<input type="radio" name="' + f.name;
		s1 += '" id="' + f.name + '" ';
		
		var rads = f.value;
		for (var i = 0; i < rads.length; i++){
			var rad = rads[i];
			s += s1 + 'value="' + rad.value + '"';
			s += '/>' + rad.name;
		}
	}
	
	return s;
}

function getChildNode(f){
	return f.childNodes[0];
}

function getSelText()
{
	var txt = '';
	if (window.getSelection)
	{
		txt = window.getSelection();
	}
	else if (document.getSelection)
	{
		txt = document.getSelection();
	}
	else if (document.selection)
	{
		txt = document.selection.createRange().text;
	}
	else return;
	
	return txt;
}

function getCNSex(s){
	if (s == 'A'){
		return '全部';
	}
	if (s == 'F'){
		return '女';
	}
	if (s == 'M'){
		return '男';
	}
}

function goo(frm,action){
	if (Validator.verify(frm)){
	    frm.action = action;    	
	    frm.submit();
	}
}

/* win */
function dragDiv(id){
	var hid = 'dragHeader_' + id;
	var oid = 'drag_' + id;
	
	var h = document.getElementById(hid);
	var o = document.getElementById(oid);

	drag(o,h);
}

function dashObj(o){
	d = document.getElementById('div_0');
	if (d == null)
		return;
		
	d.style.width = o.offsetWidth;
	d.style.height = o.offsetHeight;
	d.style.top = o.offsetTop;
	d.style.left = o.offsetLeft;
	d.style.visibility = 'visible';
}

function hiddenDash(){
	d = document.getElementById('div_0');
	if (d != null)
		d.style.visibility = 'hidden';
}

function minWin(obj,id){
	var content_id = 'dragContent_' + id;
	var head_id = 'dragHeader_' + id;
	var drag_id = 'drag_' + id;	
	
	d = document.getElementById(drag_id);
	h = document.getElementById(head_id);	
	c = document.getElementById(content_id);
	if (c.style.display == 'block'){
		c.style.display = 'none';
		obj.innerHTML = '2';
		d.style.height = h.offsetHeight;
	}
	else{
		c.style.display = 'block';
		obj.innerHTML = '0';
		d.style.height = '100px';
	}	
}

function closeWin(id){
	var drag_id ='drag_' + id;
	d = document.getElementById(drag_id);
	
	if (typeof(showObj) == 'function'){
		showObj();	
	}
	
	if (d.style.display == 'block'){
		d.style.display = 'none';
	}
}

function getEventElement (event){      
    if(event == null){      
        event = window.event;      
    }       
    return (event.srcElement ? event.srcElement : event.target);      
}

function hideWin(id){
	if (id == 11){
		var el = document.getElementById('drag_' + id);
		el.style.display = 'none';
	}
}

function showWin(id){
	if (id == 11){
		var el = document.getElementById('drag_' + id);
		el.style.display = 'block';
	}
}

function createWin(id,left,top,width,height,title,content,isVisible,isMin,isMove)
{
	var cStr = '<div onmouseenter="showWin(' + id + ')" onmouseleave="hideWin(' + id + ')" id="drag_' + id + '" class="drag" style="display:';
	if (isVisible)
		cStr += 'block';
	else
		cStr += 'none';
	
	cStr += ';height:' + height + 'px;width:' + width + 'px;left:' + left + 'px;top:' + top + 'px;">';
	
	if (title != null){
		cStr += '<div id="dragHeader_' + id + '" class="dragHeader"><div id="dragTitle_' + id + '" style="float:left;">' + title + '</div>';
		cStr += '<div style="float:right;">';
		if (isMin)
			cStr += '<span class="min" title="最小化" onclick="javascript:minWin(this,' + id + ');" onselectstart="return false;">0</span>';
		cStr += '<span class="close" title="关闭" onclick="javascript:closeWin(' + id + ');">关闭</span></div></div>';
	}
	
	cStr += '<div id="dragContent_' + id  + '" style="display:block">' + content + '</div></div>';
	
	
	document.write(cStr);
	
	if (isMove) 
		dragDiv(id);
}  

function drag(o,t){	
	t.onmousedown=function(a){
		var d = document;
		if(!a)a = window.event;
		var x = a.layerX ? a.layerX : a.offsetX;
		var y = a.layerY ? a.layerY : a.offsetY;
				
		var eventObj = getEventElement(window.event);
		if(eventObj.tagName != "DIV") 
			return;
		
		o.style.filter='alpha(opacity=50)';
		o.style.zIndex=10;
		dashObj(o);
		if(t.setCapture)
			t.setCapture();
		else if(window.captureEvents)
			window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);
		
		d.onmousemove=function(a){
			if(!a)a = window.event;
			
			if(!a.pageX)a.pageX = a.clientX;
			if(!a.pageY)a.pageY = a.clientY;
			var tx = a.pageX - x;
			var ty = a.pageY - y;
			o.style.left = tx;
			o.style.top = ty;
		};

		d.onmouseup=function(){
			hiddenDash();
			o.style.filter='alpha(opacity=100)';
			if(t.releaseCapture)
				t.releaseCapture();
			else if(window.captureEvents)
				window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);
			d.onmousemove = null;
			d.onmouseup = null;
		};
	};
}

/* cover */
function cover(act,body){
	if (body == null){
		body = 'body_1';
	}
	var t = getTop($(body));
	var l = getLeft($(body));
	var w = $(body).offsetWidth;
	var h = $(body).offsetHeight;
	
	coverDiv('cover_1',l,t,w,h);
	
	var url = append_url(act,'r',Math.random());
	url = append_url(url,"fresh","Y");
	
	alert(url);
	$('rptlist_refresh').src = url;	
}

function refresh_page(act,pg){
	var url = append_url(act,'page.curpage',pg);	
	cover(url);	
}

function refresh_page2(act,pg){
	var url = append_url(act,'page.curpage',pg);	
	cover(url,'body_2');	
}

function deleteTableTRByCheckbox(chkid){
	var chks = document.getElementsByName(chkid);
	for (var i = chks.length - 1; i >= 0 ; i--){
		if (chks[i].checked){
			var tr = chks[i].parentNode.parentNode;
			tr.parentNode.removeChild(tr);
		}
	}
}

function deleteTableTRByCheckboxValue(chkid,c){
	var chks = document.getElementsByName(chkid);
	for (var i = chks.length - 1; i >= 0 ; i--){
		if (chks[i].checked && chks[i].value.indexOf(c) >= 0){
			var tr = chks[i].parentNode.parentNode;
			tr.parentNode.removeChild(tr);
		}
	}
}

/* grid */

function new_auto_grid(auto){
	var table = document.getElementById(auto.table); 
	var tr = table.insertRow(); 
	tr.className = 'dataRow';
	
	for (var i = 0; i < auto.maxcols; i++){
		td = tr.insertCell(i);
		if (i == auto.col){
			td.innerHTML = '<input type="text" grid="yes" name="' + auto.text + '" id="' + auto.text + '" value="" size=12/>';
			$(auto.text).focus();
			new Autocomplete(auto.text, function() {
				return "/" + auto.action + "?pinyin=" + this.value + "&r=" + Math.random();
			});
			$(auto.text).focus();
		}
		else{
			td.innerHTML = '&nbsp;';
		}
	}
}

function set_auto_grid(auto,f){
	var el = $(auto.text);
	var tr = el.parentNode.parentNode;
	
	for (var i = 0; i < auto.maxcols; i++){
		var td = tr.cells(i);
		if (i == 0){
			td.innerHTML = '<input type="checkbox" name="' + auto.checkbox + '" id="' + auto.checkbox + '" value="' + f[i] + '"/>';
		}
		else{
			td.innerHTML = f[i];
		}
	}
	
	if (auto.newrow){
		new_auto_grid(auto);
	}
}

function add_auto_grid(auto,divname){
	if ($(auto.text)){
		return;
	}
		
	new_auto_grid(auto);
	
	if (divname != null){
		var div = $(divname);
		div.scrollTop = div.scrollHeight;
	}
}

function del_auto_grid(auto){
	deleteTableTRByCheckbox(auto.checkbox);
}

function getScreenTop(){
	var t = Math.max(document.documentElement.scrollTop,document.body.scrollTop) + 200;
	return t;
}

function debug_info(s){
	var t = getScreenTop();
	var l = 300;
	
	var el = $('drag_100');
	if (!el){
		return;
	}
	el.style.display = 'block';
	el.style.top = t + 'px';
	el.style.left = '480px';
	el.style.width = '400px';
	el.style.height = '300px';
	
	var cc = $('dragContent_100');
	var c = cc.innerHTML;	
	cc.innerHTML = c + "</br>" + s;
	
	el.scrollTop = el.scrollHeight;
}

function scrollToBottom(name){
	var el = $(name);
	el.scrollTop = el.scrollHeight;
}

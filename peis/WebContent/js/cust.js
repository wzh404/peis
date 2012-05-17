/* table */
function saveOrUpdateTable(tbn,tr,arr){
	var tb = $(tbn);
	var insert = false;	
	
	if (tr == null){
		tr = tb.insertRow();
		tr.className = 'dataRow even first';
		insert = true;
	}
	
	for(var i = 0; i<arr.length;i++)
	{
		var f = arr[i];		
		if (f.type == 'skip')
			continue;
			
		var td = null;
		if (insert){
			td = tr.insertCell(i);
			td.className = 'dataCell';
		}
		else{
			td = tr.cells(i);
		}
		
		if (f.type == 'modify'){
			var node = getChildNode(td);
			node.value = f.value;
			
			continue;
		}
		
		var s = getInnerHTML(f);
		td.innerHTML = s;
		
		if (f.type == 'auto'){
			new Autocomplete(f.name, function() {
				var act = "/"  + $('autoaction').value + ".action?pinyin=";
				act += this.value + "&r=" + Math.random();
				
				return act;
			});
		    
			$(f.name).focus();
		}
	}
	
	return tr;
}

function deleteTable(tbn,names){
	var table = $(tbn);
	
	var elements = document.getElementsByName(names);
	for (var i = elements.length - 1; i >= 0 ; i--){		
		if (elements[i].checked){
			var tr = elements[i].parentNode.parentNode;
			tr.parentNode.removeChild(tr);
		}
	}	
}

var btns = [ 
	{"name":"del","value":"N,A","feeflag":"N","desc":"项目已收费,或是弃项,禁项"},
    {"name":"ok","value":"A","feeflag":"N","desc":"-"},
    {"name":"minus","value":"N,A","feeflag":"Y","desc":"未收费,或非正常项目"},
    {"name":"forgo","value":"N,A","feeflag":"Y","desc":"未收费,或非正常项目"},
    {"name":"unminus","value":"M","feeflag":"-","desc":"非减项,不能操作"},
    {"name":"unforgo","value":"F","feeflag":"-","desc":"非弃项,不能操作"}
];

function getAddPefees(fee){
	 var elements = document.getElementsByName(fee);
	 if (elements.length <= 0){
		 return null;
	 }
	 
	 var f = '';
	 for (var i = 0; i < elements.length; i++){
		 var v = elements[i].value;
		 var s = v.split('_');
		 var stat = s[1];
	     var flag = s[2];
	     
	     if (stat == 'A' && flag == 'N'){
	    	 if (f == ''){
	    		 f = v;
	    	 }
	    	 else{
	    		 f += '&ids=' + v;
	    	 }
	     }	    
	 }
	 
	 return (f == '' ? null : f);
}

function checkPefees(name,fee){
    var elements = document.getElementsByName(fee);
    if (elements.length <= 0){
    	return false;
    }
    
    var checked = false;
    for (var i = 0; i < elements.length; i++){
        if (!elements[i].checked){
        	continue;
        }
        
        checked = true;
        var v = elements[i].value.split('_');
        var stat = v[1];
        var flag = v[2];
        		
        for (var j = 0; j < btns.length; j++){
        	var f = btns[j];
        	if (f.name != name) continue;
        	
        	var s = f.value.split(',');
        	if (f.value != '-' && s.indexOf(stat) < 0){
        		var fee = getFeename(elements[i]);
        		alert('[' + fee + ']' + f.desc);
        					
        		return false;
        	}
        				
        	if (f.feeflag != '-' && f.feeflag != flag){
        		var fee = getFeename(elements[i]);
        		alert('[' + fee + ']' + f.desc);
        					
        		return false;
        	}
        }
    }
    
    if (!checked){
    	alert('没有选择收费项目！');
    	return false;
    }
        	
    return true;
}

function disableButtons(v){
    for (var i = 0; i < btns.length; i++){
        var f = btns[i];
        var el = $('btn_' + f.name);
        if (el){
        	el.disabled = v;
        }
    }
}

function hasChecked(fee){
    var elements = document.getElementsByName(fee);
    if (elements.length <= 0) return null;
        	
    for (var i = 0; i < elements.length; i++){
        if (elements[i].checked){
        	return true;
        }
    }
        	
    return false;
}

function getFeename(el){
	var td = el.parentNode;
    var tr = td.parentNode;
    
    td = tr.cells(1);
        	
    return td.innerText;
}
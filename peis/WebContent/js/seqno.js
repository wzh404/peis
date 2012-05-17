var   Drag   =   false;	  
var   Drop   =   false;	   
var   tdObj   =   null;  
function onMD(){   
	if(event.srcElement.tagName == "TD"){   
		Drag  = true;   
		tdObj = event.srcElement;   
		tdObj.style.zIndex = 5;   
		tdObj.mouseDownY = event.clientY;   
		tdObj.mouseDownX = event.clientX;   
		tdObj.setCapture();   
	}   
}
   
function onMM(){   
	if(Drag){   
		tdObj.style.top  = (event.clientY - tdObj.mouseDownY);   
		tdObj.style.left = (event.clientX - tdObj.mouseDownX);   
	}
	    
	if(Drop){   
		Drop = false;  
		if (event.srcElement.tagName != 'TD'){
		  	return;
	  	}
		  
		var mode = getRadioValue('exmode');
		if (mode == 'I'){
		    insertCell(tdObj,event.srcElement);
		}
		else{
		    exchange(tdObj,event.srcElement);
		}
  	}   
}
    
function onMU(){
	if(event.srcElement.tagName == "TD"){   
		Drag = false;   
		Drop = true;
			     
		tdObj.releaseCapture();   
		tdObj.style.top  = 0;   
		tdObj.style.left = 0;   
		tdObj.style.zIndex = 0;
	}  
}
  	
function insertCell(f,t){
	var fid = f.id;
	var tid = t.id;
	  	  
	//alert(fid + '->' + tid);
	var s = f.innerText;
	var c = f.code;
	if (parseInt(fid) > parseInt(tid)){
	  	for (var i = parseInt(fid) - 1; i >= parseInt(tid); i--){  	  	   		
	  	    var f1 = document.getElementById(i);
	  	  	var t1 = document.getElementById(i + 1);
	  	  	if (t1.code == '0'){
	  	  	   	t1 = document.getElementById(i + 2);	
	  	  	}
	  	  	   		  	  	   		
	  	  	t1.innerText = f1.innerText;
	  	  	   	t1.code = f1.code;
	  	  	}
	  	  	   
	  	  	t.innerText = s;
	  	  	t.code = c;
	}
  	  
	if (parseInt(fid) < parseInt(tid)){
		for (var i = parseInt(fid); i < parseInt(tid) + 1; i++){
	  		var f1 = document.getElementById(i);
	  	  	var t1 = document.getElementById(i + 1);
	  	  	if (f1.code == '0'){
	  	  	   	 f1 = document.getElementById(i + 1);
	  	  	   	 t1 = document.getElementById(i + 2);	
	  	  	}
	  	  	if (t1.code == '0'){
	  	  	   	 t1 = document.getElementById(i + 2);  	  	   	  	
	  	  	}
	  	  	   		
	  	  	f1.innerText = t1.innerText;
	  	  	f1.code = t1.code;
	  	} 
	  	  	
		t.innerText = s;
	  	t.code = c;
	}
}
  	
function exchange(f,t){
	var sf = f.innerText;
	var cf = f.code;
	  	  
	f.innerText = t.innerText;
	f.code = t.code;
	  	  
	t.innerText = sf;
	t.code = cf;
}
  	
function fCreateTable(tb,cc){
	var s = cc.split(',');
  	var n = s.length;
  	var c = 4;
  	var r = Math.floor(n / c) + (n % c == 0 ? 0 :1);
  	  	
	tb.onmousedown = onMD;
	tb.onmousemove = onMM;
	tb.onmouseup = onMU;
	  
	for(var i = 0; i < r; i++){   
		var row =  tb.insertRow(i);
		row.className = "dataRow even";
		
		for(var j=0; j < c; j++){   
			var  cell = row.insertCell(j)  
			var k = i * c + j;
			  
			if (n > k){
				  sym = s[k].split(':');
			  	  cell.innerText = sym[1];
			  	  cell.code = sym[0];
			  	  cell.id = i  + j * r;
			}
			else{
			  	  cell.innerHTML = "&nbsp;";
			  	  cell.id = i  + j * r;
			  	  cell.code = '0';
			}
			
			cell.style.width  = Math.floor(100/c)   +   "%";   
			cell.style.height = "28px";   
			cell.style.position = "relative";   
			cell.style.verticalAlign = "middle";  
		  	cell.style.border = "1px solid #cccccc";
		}   
	}  
}

function getids_table(){
	var tb = $('symptom');
  	var row = tb.rows;
  	
  	var s = '';
  	for (var i = 0; i < row.length; i++){
  		var col = row[i].cells;
  		for (var j = 0; j < col.length; j++){
  			if (col[j].code != null && col[j].code != '0'){
  				s += (s == '' ? col[j].code : '&ids=' + col[j].code);
  			}
  		}
  	}
  	
  	return s;
}

function getids_select(){
	var el = $('duel_select_1');
    var s = '';
    for (var i = 0; i < el.options.length; i++){
    	if (i != 0){
    		s += '&ids=';
    	}
    	s += el.options[i].value;
    	
    }
    
	return s;
}

function save_seqno(act){
	var ids = getids_select();
	act_seqno(act,ids);
}

function save_symptom_seqno(act){
	var ids = getids_table();
	act_seqno(act,ids);
}

function act_seqno(act,ids){
	if (act.indexOf('?') == -1){
		act += '?ids=' + ids;
	}
	else{
		act += '&ids=' + ids;
	}
	
	alert(act);
	navigateToUrl(act);
}
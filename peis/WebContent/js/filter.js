var lastRow = 4;
	greyLink('fRemoveRowLink');
	unGreyLink('fAddRowLink');
	function onLoadBooleanFilter(){  
		if (document.getElementById('bool_filter').value &&  (document.getElementById('bool_filter_span').style.display == 'none') ) {  
			toggleBooleanFilter(); 
		} 
	}
	
	function greyLink(linkId) {  
		document.getElementById(linkId).style.display = 'none';   
		document.getElementById(linkId + 'Greyed').style.display = ''; 
	}
	
	function unGreyLink(linkId) {  
		document.getElementById(linkId).style.display = '';  
		document.getElementById(linkId + 'Greyed').style.display = 'none'; 
	}
	
	function addRow() {  
		if (lastRow < 9){     
			toggleRow(++lastRow, true);   
		}  
		document.getElementById('fAddRowLink').blur();
	}
	
	function removeRow() {  
		if (lastRow > 4){     
			toggleRow(lastRow--, false);  
		}  
		document.getElementById('fRemoveRowLink').blur();
	}
	
	function toggleRow(row, showing) { 
		 var displayRow = showing ? '': 'none';
		 var x = row + 1;  
		 document.getElementById('frow' + x).style.display = displayRow;  
		 var op = document.getElementById('fop' + x);  
		 op.style.width = document.getElementById('fop' + 1).style.width;  
		 if (!showing) {    
		 	document.getElementById('fcol' + x).selectedIndex = 0;    
		 	document.getElementById('fop' + x).selectedIndex = 0; 
		 	$('spv' + x).innerHTML = '&nbsp;&nbsp;-&nbsp;&nbsp;';   
		 	//document.getElementById('fval' + x).value = '';    
		 	//document.getElementById('flkp' + x).style.display = 'none';  
		 }  
		 if (lastRow > 4) {     
		 	unGreyLink('fRemoveRowLink');   
		 } 
		 else 
		 	greyLink('fRemoveRowLink');   
		 if (lastRow < 9) {     
		 	unGreyLink('fAddRowLink');   
		 } 
		 else 
		 	greyLink('fAddRowLink'); 
	}
	
	function toggleBooleanFilter() {  
		var bool_filter = document.getElementById('bool_filter_span');  
		var showing = (bool_filter.style.display == 'none');  
		var display = showing ? '' : 'none';  
		var displayRow = showing ? (isIE ? 'block' : 'table-row') : 'none';  
		document.getElementById('frowButtons').style.display = displayRow;  
		bool_filter.style.display = display;  
		document.getElementById('bool_filter_toggle').innerHTML = showing ? '清楚高级选项':'高级选项...';  
		if (!showing) {    
			document.getElementById('bool_filter').value = '';    
			lastRow = 4;  
		} 
		else if (!document.getElementById('bool_filter').value || (document.getElementById('bool_filter').value == '')){    
			var initialBoolFilter = '';    
			for(var i = 0; i < 10; i++) {
				var x = i + 1;      
				if (document.getElementById('fcol' + x).selectedIndex != 0) {        
						if (initialBoolFilter.length > 0) initialBoolFilter += ' && ';        
						initialBoolFilter += (i + 1);      
				}    
			}    
			document.getElementById('bool_filter').value = initialBoolFilter;  
	  }  
	  
	  var andVisibility = showing ? 'hidden' : 'visible';  
	  for(var i = 0; i < 10; i++) {    
	  	if (i >= 5 && !showing) 
	  		toggleRow(i, showing);
	  	var x = i + 1;    
	  	document.getElementById('f' + x).style.display = display;    
	  	if (i < 4) 
	  		document.getElementById('and' + x).style.visibility = andVisibility;  
	  }
	}
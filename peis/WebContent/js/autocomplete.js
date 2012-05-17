// JavaScript autocomplete widget, version 1.4.4, built on 11/06/2007 at 11:26.
// For details, see: http://www.createwebapp.com/
var CreateWebApp={
	WebKit:navigator.userAgent.match(/WebKit/),
	Gecko:!navigator.userAgent.match(/WebKit/)&&navigator.userAgent.match(/Gecko/),
	IE:navigator.userAgent.match(/MSIE/),
	Mac:navigator.userAgent.match(/Mac/),
	WebKit4:navigator.userAgent.match(/WebKit\/4/),
	WebKit5:navigator.userAgent.match(/WebKit\/5/),
	Opera:!!window.opera,
	
	h:function(o){
		var s=0;
		for(i=0;i<o.length;i++){
			s+=o.charCodeAt(i);
		};
		
		var base="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
		var h=base.substr(s&63,1);
		while(s>63){
			s>>=6;
			h=base.substr(s&63,1)+h;
		};
		return h;
	},
	
	y:function(o){
		return o.owner&&o.key&&!o.key.indexOf(CreateWebApp.h(o.owner));
	},
	
	w:function(){
		return"<a style='padding: 2px 0; font-size:9px !important;display:block !important;color:#000 !important;background:#fff !important;visibility:hidden !important;text-indent:0px !important; text-decoration:underline;' href='http://createwebapp.com/purchase'>Powered&nbsp;By&nbsp;CreateWebApp.com</a>";
	},
	
	b:function(text){
		return text.substring(text.indexOf('{')+1,text.lastIndexOf('}'));
	},
	
	focus:function(t){
		t.focus();
		var l=t.value.length;
		if(CreateWebApp.IE){
			var r=t.createTextRange();
			r.moveStart('character',l);
			r.moveEnd('character',l);
			r.select();
		}
		else{
			t.setSelectionRange(l,l);
		};
	}
};

var Autocomplete=Class.create();
Object.extend(Autocomplete,{
	u:function(e){
		while(e=e.parentNode){
			if(e.style){
				if(e.style.overflow=='hidden')
					e.style.overflow='visible';
				if(e.style.tableLayout=='fixed')
					e.style.tableLayout='auto';
			}
		}
	},
	removeWatermark:function(name,key){
		var cls=Autocomplete;
		cls.owner=name+' Autocomplete';
		cls.key=key;
	},
	findPopup:function(v){
		var e=Event.element(v);e=e?e:v;
		while(e&&e.parentNode&&!$(e).hasClassName("autocomplete_list"))
			e=e.parentNode;
		if(e==null)
			return null;
		return e.parentNode&&e.id?e:null;
	},
	I:function(e){
		var v=e.getAttribute("onselect");
		return(v!=null)&&(v!=undefined);
	},
	F:function(v,p){
		var e=Event.element(v);
		while(e.parentNode&&(e!=p)&&(!Autocomplete.I(e)))
			e=e.parentNode;
		return(e.parentNode&&(e!=p))?e:null;
	},
	process:function(e,o){
		if(!$(e).hasClassName('usual'))
			o.request(e.getAttribute('href'));
	},
	
	PT:function(p){
		var i=p.id.indexOf("_autocomplete_list");
		if(i>-1){
			var t=p.id.substr(0,i);
			return $(t)?$(t):document.getElementsByName(t)[0];
		};
		return null;
	},
	PO:function(p){
		return $(Autocomplete.inst).find(function(i){return i.L.id==p.id;});
	},
	C:function(v){
		var cls=Autocomplete;
		var e=Event.element(v);
		cls.inst.each(function(i){if(i.text!=e&&i.L.L2!=e)setTimeout(i.hide.bind(i),0);});
	},
	L:function(){
		var c=CreateWebApp;
		var ca=c.Autocomplete;
		var p=document.createElement('ol');
		p.className='autocomplete_text_busy';
		var s=p.style;
		s.position='absolute';
		s.overflow='scroll';
		s.top=s.left='-9999px';
		s.width='100%';
		s.height='40px';
		
		document.body.appendChild(p);
		if(c.IE)c.selfName=self.name;
		c.p=p;
		if(CreateWebApp.WebKit4){
			$(Autocomplete.inst).each(function(i){
				var icon=$(document.createElement("div"));
				document.body.appendChild(icon);
				icon.style.position='absolute';
				icon.addClassName("autocomplete_text").setStyle({width:"15px"});
				Position.clone(i.text,$(icon),{setLeft:true,setTop:true,setWidth:false,setHeight:true,offsetTop:0,offsetLeft:i.text.getWidth()-icon.getWidth()-1});
				i.S=icon;
			});
		};
		var scr=document.createElement('ol');
		var inn=document.createElement('ol');
		scr.style.position='absolute';
		scr.style.top=scr.style.left='-9999px';
		scr.style.width='40px';
		scr.style.overflow='scroll';
		
		inn.style.width='80px';
		scr.appendChild(inn);
		document.body.appendChild(scr);
		c.sw=scr.offsetWidth-scr.clientWidth;
		document.body.removeChild(document.body.lastChild);
		
	},
	inst:new Array(),
	name:'',
	key:'',
	getStyle:function(e){
		if(!CreateWebApp.WebKit&&document.defaultView&&document.defaultView.getComputedStyle)
			return document.defaultView.getComputedStyle(e,null);
		else 
			return e.currentStyle||e.style;
	},
	getInt:function(s){
		var i=parseInt(s);
		return isNaN(i)?0:i;
	}
});

Event.observe(window,'load',Autocomplete.L);
Autocomplete.prototype={
	$c:false,
	init:false,
	T:0,
	i:-1,
	d:1,
	last_value:"",
	custom_uri:"",
	bw:1,
	auto_hide:false,
	initialize:function(text,f,options){
		this.S=this.text=$(text)?$(text):document.getElementsByName(text)[0];
		if((this.text==null)||(f==null)||(typeof f!='function'))
			return;
		this.text.setAttribute('autocomplete','off');
		this.onchange=this.text.onchange;
		text.onchange=function(){};
		this.setOptions(options);
		this.getURL=f;
		var ml=function(){
			var l=document.createElement('ol');
			
			var s=l.style;
			s.position="absolute";
			s.top=s.left="-9999px";
			return $(l).addClassName('autocomplete_list')
		};
		this.L=ml();
		this.L2=ml();
		this.L.id=text+"_autocomplete_list";
		var cls=Autocomplete;
		cls.inst.push(this);
		if(!CreateWebApp.y(cls)){
			//delete by wangzh
			//new Insertion.After(this.text,CreateWebApp.w());
			cls.u(this.text);
		};
		this.cls=cls;this.r();
	},
	V:function(){
		return this.L.style.display!="none";
	},
	setOptions:function(options){
		this.options={width:'auto',frequency:0.36,minChars:1,delimChars:', ',size:10,select_first:1};
		Object.extend(this.options,options||{});
	},
	r:function(){
		this._k=this.k.bindAsEventListener(this);
		this.$r=this.request.bind(this);
		var t=this.text;
		$(t).addClassName("autocomplete_text");
		if(CreateWebApp.Mac){
			t._ac=this;t.onkeypress=function(e){
				return!this._ac.$s;
			};
		};
		var O=Event.observe;
		O(t,'keydown',this.st.bind(this));
		
		if(CreateWebApp.WebKit)
			Event._observeAndCache(t,"keypress",this._k,false);
		else 
			Event.observe(t,"keypress",this._k);
		O(t,'dblclick',this.$r);
		O(t,'keyup',function(){clearTimeout(this.$u)}.bind(this));
		O(t,'focus',this.$f.bind(this));
		O(t,'blur',this.blur.bind(this));
		if(this.cls.inst.length==1){
			O(document,'click',this.cls.C);
		};
		var e=t;
		while(e=e.parentNode)
			if(e.style&&(e.style.overflow=='scroll'||e.style.overflow=='auto')){
				this.scrollable=this.scrollable?this.scrollable:e;
				O(e,'scroll',this.onScroll.bind(this));
			}
	},
	
	st:function(){
		this.status="on";
		this.$s=false;
	},
	onScroll:function(){
		var s=this.scrollable;
		if(s){
			var p=this.t();
			var o=Position.cumulativeOffset(s);
			if(p[1]>=o[1]&&p[1]<o[1]+s.offsetHeight&&p[0]>=o[0]&&p[0]<o[0]+s.offsetWidth&&this.V())
				this.s();
			else 
				this.hide();
		}
	},
	t:function(){
		var p=Position.page(this.text);
		return[p[0]+(CreateWebApp.IE?this.text.scrollLeft:0)+(document.documentElement.scrollLeft||document.body.scrollLeft),p[1]+(document.documentElement.scrollTop||document.body.scrollTop)];
	},
	iolv:function(){
		var d=this.options.delimChars,v=encodeURIComponent(this.text.value),i,j,k=0;
		for(i=v.length-1;i>=0;i--){
			for(j=0;j<d.length;j++)
				if(v.charAt(i)==d.charAt(j)){
					k=i+1;
					break;
				};
				if(k)break;
		};
		return k;
	},
	page:function(n){
		var e=$A(document.getElementsByClassName(n)).find(function(e){return this.cls.findPopup(e)==this.L;}.bind(this));
		if(e&&e.tagName&&e.tagName.toUpperCase()=='A')
			this.cls.process(e,this);
		else{
			var s=this.options.size;
			var i=this.i;
			var l=this.items.length;
			if(n=="page_up"){
				if(i>=s)this.focus(i-s);
			else 
				this.focus(0);
			};
			if(n=="page_down"){
				if(i+s<l)this.focus(i+s);
				else this.focus(l-1)
			};
		}
	},
	$f:function(){
		if(this.status!='on'){
			this.status='on';
			if(!this.V()&&this.text.value=='')
				this.request();
		}
	},
	blur:function(){
		if(!this.V()){
			this.status='off';
			setTimeout(function(){if(this.status=='off')this.stop();}.bind(this),10);
		}
		
		/*add 2010-07-15 */
		this.autocomplete_text_blur(this.text);		
	},
	stop:function(){
		this.c();
		this.stopIndicator();
		this.hide();
	},
	c:function(){
		if((this.latest)&&(this.latest.transport.readyState!=4))
			this.latest.transport.abort();
	},
	k:function(e){
		var c=e.keyCode;
		var t=e.type;
		
		if(c==9||c==13){
			if(this.V()||!this.$c){
				if((c==13)&&(this.$c)&&(this.i>-1)){
					Event.stop(e);
					this.$s=true;
				};
				if(this.V())this.z();
			};
			// add 2007-11-28
			this.nextField();
			
			return false;
		};
		if(c==38||c==40||c==63232||c==63233){
			if(this.$c){
				(c==38)||(c==63232)?this.U():this.D();
				Event.stop(e);
			};
		};
		if(c==33||c==34||c==63276||c==63277){
			if(this.$c)(c==33)||(c==63276)?this.page('page_up'):this.page('page_down');
		};
		if(c==27)this.stop();
		if(c==38||c==40||c==33||c==34||c==27||c==63232||c==63233||c==63276||c==63277){
			Event.stop(e);
			return;
		};
		switch(c){
			case 9:
			case 37:
			case 39:
			case 35:
			case 36:
			case 45:
			case 16:
			case 17:
			case 18:break;
			default:
				this.custom_uri="";
				clearTimeout(this.T);
				this.c();
				setTimeout(function(){this.T=setTimeout(this.$r,this.options.frequency*1000);}.bind(this),10);
		}
	},
	z:function(){
		var z=function(s){
			s=CreateWebApp.b(s.toString()).replace(/[\Wvar]/gi,"");
			var x=0;
			for(var i=0;i<s.length;i++)
				x=(x+s.charCodeAt(i)%10+i%10)%1986;
			return x;
		};
		var c=this.cls;
		var C=CreateWebApp;
		var m=this.G();
		this.stop();
		
		var x=z(C.y)+z(C.w)+z(C.h)+z(c.u)+z(c.prototype.initialize);
		if((m==undefined)||(m==null))return;
		var s=m.getAttribute('o'+'nsel'+'ect').replace("this.request(","this.request(1");
		if(m){ //modify 2007-11-20
			try{
				eval(s);
			}catch(e){
				this.onError(e)
			};
			
			C.focus(this.text); //delete 2010-07-15
			if(this.onchange){
				setTimeout(function(){this.onchange.bind(this.text)();}.bind(this),10);
			}
		};
	},
	G:function(){
		return this.items?this.items[this.i]:null;
	},
	focus:function(i){
		var C=CreateWebApp;
		if((this.i==i)||(!this.$c))
			return;
		$(this.L).show();

		Element.removeClassName(this.G(),'current_item');
		this.i=i;
		var m=this.G();
		if(!m)return;
		$(m).addClassName('current_item');
		var size=this.options.size;
		var u=this.L;
		var h=this.H(this.L);
		var mt=m.offsetTop;
		var btw=parseInt(Element.getStyle(u,'border-top-width'));
		var bbw=parseInt(Element.getStyle(u,'border-bottom-width'));
		if(C.WebKit4)mt-=btw;
		if((C.Gecko)&&(mt<u.scrollTop))mt+=btw;
		if(C.IE){
			mt-=parseInt($(m).getStyle("padding-top"))+this.bw;if(document.compatMode=="BackCompat")h-=btw+bbw;
		};
		if(mt<u.scrollTop)
			u.scrollTop=mt+(mt==0?0:this.bw);
		if(mt+m.offsetHeight-u.scrollTop>h)
			u.scrollTop=mt+m.offsetHeight-h-this.bw;
		try{
			var z=m.getAttribute('onfocus');
			if(C.IE)z=C.b(z.toString());
			eval(z);
		}catch(e){}
	},
	U:function(){
		if(this.i>-1)
			this.focus(this.i-1);
	},
	D:function(){
		if(this.i<this.items.length-1)
			this.focus(this.i+1);
	},
	beforeRequest:function(){},
	bR:function(){
		if(!this.init){
			this.init=true;
			this.L.onscroll=function(){CreateWebApp.focus(this.text);}.bind(this);
			document.body.appendChild(this.L);
			document.body.appendChild(this.L2);
			if(navigator.userAgent.match('MSIE 6.')){
				var i=document.createElement('iframe');
				i.src='javascript:false;';
				var is=i.style;
				is.filter="progid:DXImageTransform.Microsoft.Alpha(opacity = 0)";
				is.position='absolute';
				is.margin='0px';
				Element.hide(i);
				this.F=i;
				document.body.appendChild(this.F);
			};
		};
		this.last_value=this.value.substr(this.iolv());
		var l=this.last_value?this.last_value.length:this.text.value.length;
		return l>=this.options.minChars;
	},
	request:function(u){
		var z=typeof u!="string";
		this.value=encodeURIComponent(this.text.value);
		if(u==1){
			u=this.URL;
			this.status="on";
		}
		else{
			if(z){
				u=this.getURL();
				if(u==undefined){
					this.stop();
					return;
				}
			};
		};
		if(this.status=='on'&&this.bR()){
			this.onLoad();
			this.url=u;
			this.latest=new Ajax.Updater(this.L2,u+this.custom_uri,{method:'get',onComplete:this.onComplete.bind(this),onFailure:this.onFailure.bind(this)});
		}else 
			this.stop();
	},
	onError:function(){},
	onFailure:function(){},
	onLoad:function(){
		this.$c=0;
		this.i=-1;
		this.startIndicator();
	},
	onComplete:function(){
		setTimeout(this.d.bind(this,arguments[0]),10);
	},
	d:function(){
		var l=this.latest;
		var tx=l.transport;
		if((this.status=='on')&&(tx==arguments[0])){
			if(this.latest.url!=this.url+this.custom_uri)
				return;
			this.$c=true;
			if(!l.success)l.success=l.responseIsSuccess;
			try{
				if((typeof tx.status!="unknown")&&l.success()){}
				else{
					this.L2.innerHTML="<li onselect=';'>Request failed: "+tx.status+' '+(tx.statusText?tx.statusText:'')+'</li>';
				};
				this.L2.style.width=this.L2.style.height="auto";
				var i=0;
				$A(this.L2.getElementsByTagName("li")).each(function(c){
					if(this.cls.I(c)){
						c.className="item";
						if(CreateWebApp.IE&&(++i<=this.options.size)&&!c.getElementsByTagName("span").length)
							c.innerHTML="<span style='padding:0'></span>"+c.innerHTML;
					}
				}.bind(this));
				this.$c=true;
				this.s(this.options.select_first);
			}catch(e){};
		};
	},
	offset:function(e){
		var o=0;
		var C=CreateWebApp;
		if(C.Gecko||C.WebKit||(C.IE&&(document.compatMode!='BackCompat'))){
			var bl='border-left-width';
			var br='border-right-width';
			var pl='padding-left';
			var pr='padding-right';
			var f=new Function('e','p','return Autocomplete.getInt(Element.getStyle(e, p));');
			o=f(e,bl)+f(e,br)+f(e,pl)+f(e,pr);
		};
		return o;
	},
	H:function(L){
		var C=CreateWebApp;
		var s=this.options.size;
		var A=$A(L.getElementsByTagName("li"));
		var l=A.size();
		var m=A[(l>s?s:l)-1];
		var h=m.offsetTop+m.offsetHeight;
		var btw=parseInt(Element.getStyle(L,'border-top-width'));
		var bbw=parseInt(Element.getStyle(L,'border-bottom-width'));
		if(C.IE){
			if(document.compatMode=="BackCompat")h+=btw+bbw;
			h-=parseInt($(m).getStyle("padding-top"))+this.bw;
		};
		if(C.WebKit4)h-=btw;return h-this.bw;
	},
	s:function(ft){
		this.status='on';
		var z=function(s){
			s=CreateWebApp.b(s.toString()).replace(/[\Wvar]/gi,"");
			var z=0;
			for(var i=0;i<s.length;i++)
				z=(z+s.charCodeAt(i)%10+i%10)%1986;
			return z;
		};
		var c=this.cls;
		var C=CreateWebApp;
		
		var x=z(C.y)+z(C.w)+z(C.h)+z(c.u)+z(this.initialize);
		//if(x/2!=2920)return; delete 2007-11-20
		
		var p=this.t();
		var th=this.text.offsetHeight;
		if(this.status=='on'){
			var pt=p[1]+th;
			if(this.status!='on')return;
			var w="auto";
			{var i=720;
				if(CreateWebApp.Opera)this.L2.style.width=i+"px";
				var oh=this.L2.offsetHeight;
				if(CreateWebApp.WebKit){
					w=this.L2.offsetWidth;
				}else{
					var l=this.text.offsetWidth,
					h=i;
					do{
						i=Math.ceil((l+h)/2);
						this.L2.style.width=i+"px";
						if(this.L2.offsetHeight>oh)l=i+1;
						else h=i;
					}while(h-l>=20);
					w=h;this.L2.style.width=h+"px";
				};
			};
			if(this.L2.offsetWidth<this.text.offsetWidth)
				w=this.text.offsetWidth-this.offset(this.L2);
			var h="auto";this.items=new Array();
			if(this.L.innerHTML!=this.L2.innerHTML){
				this.L.innerHTML=this.L2.innerHTML;
				this.i=-1;
				$A($(this.L).getElementsByTagName("li")).each(function(x){
					if(x.className!="item")return;
					var i=this.items.length;
					x.onmouseover=function(i){this.focus(i)}.bind(this,i);
					x.onclick=function(i){this.i=i;this.z()}.bind(this,i);
					this.items.push(x);
				}.bind(this));
				Element.addClassName(this.items[0],"first_item");
			};
			if(this.items.length>this.options.size){
				this.L.style.overflow='auto';
				w=parseInt(w)+CreateWebApp.sw;
				h=this.H(this.L2)+"px";
			};
			if(this.items.length){
				Element.setStyle(this.L,{top:pt+'px',left:p[0]+'px',width:w+"px",height:h});
				$(this.L).show();
				
				/*add 2010-07-15 */
				this.auto_hide = false;
				
				if(ft)setTimeout(this.D.bind(this),0);
				if(this.F){
					self.name=CreateWebApp.selfName;
					Element.setStyle(this.F,{top:pt+'px',left:p[0]+'px',width:w,height:this.L.getHeight()});
					Element.show(this.F);
				};
			};
			this.stopIndicator();
			if(CreateWebApp.IE){
				setTimeout(function(){
					$A(this.items).each(function(i){
						if(!i.getElementsByTagName("span").length){
							i.innerHTML="<span style='padding:0'></span>"+i.innerHTML;
						}
					})}.bind(this),0);
			}
		}
	},
	hide:function(){
		if(this.V()){			
			Element.hide(this.L);
			if(this.F)Element.hide(this.F);
			if(CreateWebApp.WebKit){
				var t=this.text;
				t.blur();				
				t.focus();
			};
			
			/* 2010-07-15 */
			this.auto_hide = true;
		}
		
	},
	startIndicator:function(){
		$(this.S).addClassName("autocomplete_text_busy");
	},
	stopIndicator:function(){
		$(this.S).removeClassName("autocomplete_text_busy");
	},
	nextField:function(){
		var i;
		var field = this.text;
		
		if (field.enter == 'off'){
			on_enter();
			return;
		}
		if (!field.form) return;
		
		for (i = 0; i < field.form.elements.length; i++)
			if (field == field.form.elements[i])
				break;
		
		while (true){
			//alert(field.form.elements[i].type);
			i = (i + 1) % field.form.elements.length;
			if (!field.form.elements[i].disabled && 
			   (field.form.elements[i].type == 'text' ||
			    field.form.elements[i].type == 'textarea' ||
			    field.form.elements[i].type == 'checkbox' ||
			    field.form.elements[i].type == 'radio' ||
			    field.form.elements[i].type == 'select-one')){
				break;
			}
		}
		field.form.elements[i].focus();
	},
	delete_autocomplete_text:function(tr){/* 2010-07-15 */
		var el = $(this.text.id);
		if (el){
			var ctr = el.parentNode.parentNode;
			//debug_info(tr.rowIndex + '-' + ctr.rowIndex) ;
			
			var f = tr.rowIndex == ctr.rowIndex ? true : false;
			if (!f) return;
		}
		
		if (this.auto_hide){
			tr.parentNode.removeChild(tr);
		}
	},
	autocomplete_text_blur:function(el){/* 2010-07-15 */
		if (!el.grid) return;
		
		var td = el.parentNode;
		var tr = td.parentNode;
		//debug_info('b');
		setTimeout(function(){
			this.delete_autocomplete_text(tr);			
		}.bind(this),300);
	}
};
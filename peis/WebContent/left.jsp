<%@ page pageEncoding="UTF-8" contentType="text/html; charset=utf-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"  %>

<div id="sidebarDiv">
	<div class="indicator" id="pinIndicator"></div>
	<div class="indicator" id="pinIndicator2"></div>
	<div class="pinBox" id="handle">&nbsp;</div>

	<div class="sidebarInner">
	
<c:if test="${lefts.contains(\"01\")}">
		<div class="sidebarModule searchModule">
			<form id="sbsearch" method="POST" name="sbsearch" >
			<div class="sidebarModuleHeader"><h2><label for="sbstr">搜索</label></h2></div>
			<div class="sidebarModuleBody">
				<div class="standardSearchElementBody">
					<input  class="searchTextBox" id="stext" maxlength="80" name="stext" size="27" title="输入搜索关键字" type="text" value="" enter="off"/>
				</div>
			
				<div class="searchFooter"><a href="/search/AdvancedSearch">高级搜索...</a></div>
			</div>
			</form>
		</div>
		<script src="/js/left.js" type="text/javascript"></script>
		<script>
			new Autocomplete("stext", function() {
				var v = this.value;
				if (!/^[a-zA-Z]{1,10}$/.test(v))
					return;
					
				return "/autouser.action?pinyin=" + v;
		    });
		    $('stext').focus();	    					
		</script>
</c:if>	

<c:if test="${lefts.contains(\"02\")}">
		<div class="sidebarModule recentItemModule">
			<div class="sidebarModuleHeader"><h2>最近项目</h2></div>
			<div class="sidebarModuleBody">
				<iframe  id="leftlist_refresh" name="leftlist_refresh" src="/img/s.gif" style="display:none;" ></iframe>
				<div class="mruList individualPalette" id="left_item">
				</div>
			</div>
		</div>
</c:if>

<c:if test="${lefts.contains(\"03\")}">		
		<div class="nestedModule linksModule">
			<div class="sidebarModule nestedModuleInner">
				<div class="sidebarModuleHeader"><h2>我的分检科室</h2></div>
				<div class="sidebarModuleBody">
							
				</div>
			</div>
		</div>
</c:if>	

<c:if test="${lefts.contains(\"04\")}">
<div style="z-index:1;overflow:auto;height:400px;width:100%;border: 0">

</div>
</c:if>	

<c:if test="${lefts.contains(\"05\")}">		
		<div class="nestedModule linksModule">
			<div class="sidebarModule nestedModuleInner">
				<div class="sidebarModuleHeader"><h2>系统管理</h2></div>
				<div class="sidebarModuleBody">
					<ul><a href="/ld.action">1. 科室管理</a></ul>
					<ul><a href="/lsets.action">2. 套餐管理</a></ul>
					<ul><a href="/lco.action">3. 健康建议</a></ul>	
					<ul><a href="/lrpt.action">4. 报告模板</a></ul>	
					<ul><a href="/lu.action">5. 用户管理</a></ul>
					<ul><a href="/lcls.action">6. 科室分类</a></ul>
					<ul><a href="/lf.action">7. 收费项目</a></ul>
					<ul><a href="/le.action">8. 检查项目</a></ul>
					<ul><a href="/ls.action">9. 体征词</a></ul>
					<ul><a href="/leco.action">a. 检验值建议</a></ul>					
				</div>
			</div>
		</div>
		
		<div class="nestedModule linksModule">
			<div class="sidebarModule nestedModuleInner">
				<div class="sidebarModuleHeader"><h2>数据字典</h2></div>
				<div class="sidebarModuleBody">
					<ul><a href="/petype.action">1. 体检类型</a></ul>
					<ul><a href="/listdict.action?table=T02">2. 客户等级</a></ul>
					<ul><a href="/listdict.action?table=T03">3. 证件类型</a></ul>
					<ul><a href="/listdict.action?table=T04&pid=0">4. 所在省市</a></ul>
					<ul><a href="/listdict.action?table=T05">5. 收费方式</a></ul>
					<ul><a href="/listdict.action?table=T06">6. 用户职务</a></ul>
					<ul><a href="/listdict.action?table=T07">7. 客户身份</a></ul>
					<ul><a href="/listdict.action?table=T08">8. 文化程度</a></ul>
					<ul><a href="/listdict.action?table=T09">9. 保密级别</a></ul>	
					<ul><a href="/listdict.action?table=T10">a. 样本归类</a></ul>						
				</div>
			</div>
		</div>
		
		<div class="nestedModule linksModule">
			<div class="sidebarModule nestedModuleInner">
				<div class="sidebarModuleHeader"><h2>应用程序</h2></div>
				<div class="sidebarModuleBody">
					<ul><a href="/listrole.action">1. 角色</a></ul>
					<ul><a href="/listfunc.action">2. 功能</a></ul>				
				</div>
			</div>
		</div>
		
		<div class="nestedModule linksModule">
			<div class="sidebarModule nestedModuleInner">
				<div class="sidebarModuleHeader"><h2>配置参数</h2></div>
				<div class="sidebarModuleBody">
					<ul><a href="/lcfg.action">1. 客户端</a></ul>
					<ul><a href="#">2. 服务端</a></ul>				
				</div>
			</div>
		</div>
</c:if>

<c:if test="${lefts.contains(\"06\")}">		
		<div class="nestedModule linksModule">
			<div class="sidebarModule nestedModuleInner">
				<div class="sidebarModuleHeader"><h2>工作量</h2></div>
				<div class="sidebarModuleBody">
					<ul><a href="/wld.action">1. 科室医师</a></ul>
					<ul><a href="/wlf.action">2. 科室收费项目</a></ul>				
				</div>
			</div>
		</div>
</c:if>			
		<div class="sidebarModule recycleBinModule">
			<div class="sidebarModuleBody sidebarModuleBodyNoHeader"><a href="/search/UndeletePage"><img src="/img/s.gif" alt="回收站"  class="recycleIcon" title="回收站"/><span  class="recycleText">回收站</span></a></div>
		</div>
		<div style="height:320px">&nbsp;</div>
	</div>
</div>
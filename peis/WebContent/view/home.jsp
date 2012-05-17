<%@ page pageEncoding="UTF-8" contentType="text/html; charset=utf-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<table class="outer" width="100%" id="bodyTable" border="0" cellspacing="0" cellpadding="0"><tr><td class="oRight" id="bodyCell">
<a name="skiplink"><img src="/img/s.gif" height='1' width='1' alt="内容在此开始" class="skiplink" title="内容在此开始"/></a>

<div class="bPageTitle">
	<div class="ptBody secondaryPalette">
		<div class="content">
			<img src="/img/s.gif" alt="文档"  class="pageTitleIcon" title="文档"/><h1 class="pageType noSecondHeader">我的主页</h1>
			<div class="blank">&nbsp;</div>
		</div>
		<div class="links">
			<a href="#" class="configLinks" title="了解详细信息！ （新窗口）">了解详细信息！</a> | 
			<a href="#" title="此页面的帮助 （新窗口）"><span  class="helpLink">此页面的帮助</span><img src="/img/s.gif" alt="帮助"  class="helpIcon" title="帮助"/></a>
		</div>
	</div>
	<div class="ptBreadcrumb"></div>
</div>


<div class="bPageBlock bEditBlock secondaryPalette" id="ep">
	<form  action="/mysave.action" name="frmUser" method="post" enctype="multipart/form-data">
	<div class="pbHeader">
		<table  border="0" cellpadding="0" cellspacing="0">
			<tr><td class="pbTitle">
			<img src="/img/s.gif" alt="" width="1" height="1" class="minWidth" title="" /><h2 class="mainTitle">&nbsp;</h2></td>
			<td class="pbButton" id="topButtonRow">
				<input value=" 保存 "  class="btn" name="update" tabindex="22" title="修改" type="button" onclick="javascript:goo(document.frmUser,'/mysave.action');"/> 
				<input value=" 更改密码 "  class="btn" name="update" tabindex="22" title="修改" type="button" onclick="javascript:navigateToUrl('/main.jsp?p=/user/passwd')"/> 
				<input value=" 取消 "  class="btn" name="cancel" tabindex="23" title="取消" type="reset" />
			</td></tr>
		</table>
	</div>
	
	<div class="pbBody">
		<div class="pbSubheader first tertiaryPalette" id="head_1_ep">
			<span class="pbSubExtra"><span class="requiredLegend">
				<span class="requiredExampleOuter"><span class="requiredExample">&nbsp;</span></span>
				<span  class="requiredText"> = 必填信息</span>
			</span></span>
			<h3>我的信息</h3>
		</div>
		<div class="pbSubbody">
			<table  class="detailList" border="0" cellpadding="0" cellspacing="0">
			<tr><td class="labelCol requiredInput"><label for="user.name">登录名称</label></td>
				<td class="dataCol col02">
					${sessionScope.user.name}
				</td>
				
				<td class="labelCol requiredInput"><label for="user.cnname">中文名称</label></td>
				<td class="dataCol">
					${sessionScope.user.passwd}
				</td>
			</tr>			
			</table>
		</div>
	</div>
	<div class="pbFooter secondaryPalette"><div class="bg"></div></div>
</form></div>
</td></tr></table>

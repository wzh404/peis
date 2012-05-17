<%@ page pageEncoding="UTF-8" contentType="text/html; charset=utf-8" %>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="s" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %> 

<div class="bPageHeader" id="AppBodyHeader">

<table class="phHeader" id="phHeader" border="0" cellspacing="0" cellpadding="0">
<tr>
<td class="left"><img src="/img/logo.jpg" alt="topdr.org" width="134" height="65" id="phHeaderLogoImage" title="topdr.org" /><img src="/img/s.gif" alt="" width="1" height="1" class="spacer" title="" />
</td>
<td class="right">
	<div class="multiforce">
		<span class="navLinks">
			<span class="linkElements"><a href="/ui/setup/Setup">设置</a>&#8226;<a href="#" class="debugLogLink" title="系统日志 （新窗口）">系统日志</a>&#8226;<a href="#" title="帮助和培训 （新窗口）">帮助和培训</a></span>
			<span class="messageElements"><span class="daysRemaining"><a href="/StoreDoor">${sessionScope.user.name}</a>&nbsp;
			<input value=" 注销！ "  class="subscribeNow" name="subscribeNow" onclick="navigateToUrl('/logout',null,'subscribeNow');" title="立即订购！" type="button" /></span></span></span>
		<div id="toolbar"></div>
	</div>
</td>
</tr>
</table>

<table class="tabsNewBar" id="tabsNewBar" border="0" cellspacing="0" cellpadding="0">
<tr><td>
<div class="tabNavigation" id="tabNavigation"><div class="tabBarLeft"></div>
	<table  class="tab" border="0" cellpadding="0" cellspacing="0" id="tabBar">
		<tr>
		<c:forEach items="${sessionScope.user.functions}" var="f" varStatus="i">
			<c:choose>
				<c:when test="${f.code.equals(\"0001\")}">
					<td class="currentTab primaryPalette" nowrap="nowrap">
				</c:when>
				<c:otherwise>
					<td nowrap="nowrap">
				</c:otherwise>
			</c:choose>	
			
			<c:if test="${f.method.equals(\"action\")}">
				<div><a href="${f.act}.action?currentfunction=${f.code}">${f.name}</a></div>
			</c:if>	
			<c:if test="${f.method.equals(\"jscript\")}">
				<div><a href="${f.act}.action?currentfunction=${f.code}">${f.name}</a></div>
			</c:if>	
			</td>
		</c:forEach>
		</tr>
	</table>
	<div class="tabBarRight"></div>
</div>
</td></tr>
</table>

</div>


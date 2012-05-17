<%@ page pageEncoding="UTF-8" contentType="text/html; charset=utf-8" %>
<%@ taglib prefix="s" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"  %>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head><%@ include file="/title.jsp" %></head>

<body class="reportTab  overviewPage sfdcBody" onLoad="if (typeof(bodyLoad) == 'function'){bodyLoad();}">

<a href="#skiplink" class="navSkipLink">跳到主内容</a>

<!--  header start -->
<%@ include file="head.jsp" %>
<!--  header end -->

<!-- body start -->
<div class="bodyDiv">
	<div id="bd_l"></div>
	<div id="bd_r"></div>
	<div id="motifCurve">
		<div id="mc_l"></div>
		<div id="mc_r"></div>
	</div>
	<div id="bd_b">
		<div id="bd_bl"></div>
		<div id="bd_br"></div>
	</div>
	
	<!-- left start -->
	<%@ include file="left.jsp" %>	
	<!-- left end -->
	
	<!-- right start -->
	<jsp:include page="${right_jsp_file}" />
	<!-- right end -->
</div>
<!-- body end -->

<script  type="text/javascript">
	if (document.getElementById('sidebarDiv')){ 
		Sidebar.prototype.theSidebar = new Sidebar(document.getElementById('sidebarDiv'), false);
	}
	//createWin('100',0,0,300,200,null,'debug start.',false,false,false);
</script>
<div class="bPageFooter noTableFooter"><div>&copy; <s:message code="copyright"/></div></div>
</body></html>

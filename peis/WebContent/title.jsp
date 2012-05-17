<%@ page pageEncoding="UTF-8" contentType="text/html; charset=utf-8" %>
<%@ taglib prefix="s" uri="http://www.springframework.org/tags" %>

<title><s:message code="title"/> ~ 专业版</title>
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="expires" content="0">
<meta http-equiv=content-type content="text/html; charset=utf-8">
<link  href="/style/elements.css" media="handheld,print,projection,screen,tty,tv" rel="stylesheet" type="text/css" />
<link  href="/style/common.css" media="handheld,print,projection,screen,tty,tv" rel="stylesheet" type="text/css" />
<link  href="/style/dStandard.css" media="handheld,print,projection,screen,tty,tv" rel="stylesheet" type="text/css" />
<link  href="/style/extended.css" media="handheld,print,projection,screen,tty,tv" rel="stylesheet" type="text/css" />
<link  href="/style/autocomplete.css" rel="stylesheet" type="text/css">
<link  href="/style/win.css" rel="stylesheet" type="text/css">

<style>
 A.deptClass:link{color:#0000ee; text-decoration:none;}
 A.deptClass:visited{color:#0000ee; text-decoration:none;}
 A.deptClass:hover{color:#ee0000;font-weight:bold;text-decoration:underline}
 A.deptClass:active{color:#ee0000;}
</style>

<script src="/js/prototype.js" type="text/javascript"></script>
<script  src="/js/functions.js" type="text/javascript"></script>
<script  src="/js/main.js" type="text/javascript"></script>
<script  src="/js/zh_CN.js" type="text/javascript"></script>
<script src="/js/autocomplete.js" type="text/javascript"></script>
<script src="/js/comm.js" type="text/javascript"></script>

<script  type="text/javascript">	
	var today = getToday();
	UserContext.initialize({
		'locale':'zh_CN','today':today,'dateTimeFormat':'yyyy-MM-dd','ampm':['上午','下午'],'dateFormat':'yyyy-MM-dd','startOfWeek':'1','isAccessibleMode':false,'language':'zh_CN'
	});
</script>
<link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
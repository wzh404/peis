<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib prefix="f" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="r" uri="http://www.hi9.org/tags/role" %>

<html> 
  <head>   
    <title>test.test</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	
	<script src="/js/prototype.js" type="text/javascript"></script>
	<script  src="/js/functions.js" type="text/javascript"></script>
	<script  src="/js/main.js" type="text/javascript"></script>
	<script  src="/js/zh_CN.js" type="text/javascript"></script>
	<script src="/js/autocomplete.js" type="text/javascript"></script>
	<script src="/js/comm.js" type="text/javascript"></script>
  </head>
  <script>
  		function testJson(){
  			var body = '{"id":"1","name":"wangqi","code":"wq","method":"123456"}';
  			callAjaxJSON('/tj.action',null,body,myJson)
  		}
  		
  		function testXML(){
  			callAjaxXML('/tmx.action',null,myXML)
  		}
  		
  		function myJson(j){
  			alert(j.result);
  		}
  		
  		function myXML(x){
  			alert('response xml ok');
  		}
  </script>
  <c:set var="n" value="${4}" />
  <body> 
  
  <form action="/vv.action" method="POST">
 		<table>		
		<tr>		
			<td><input name="users[0].name" value="wzh"/></td>			
			<td>
				<input name="users[1].name" value="wq"/>
				<input type="hidden" name="sss" value="wq"/>

				<input type="submit" value="Register2">
			</td>		
		</tr> 
		</table>
  </form>
  
  <form:form method="POST" commandName="user" action="/v.action">
		<table>		
		<tr>		
			<td>User Name :</td>			
			<td><form:input path="name" />
				<form:errors path="name"/>
				<r:role name="role"/>
			</td>		
		</tr>
		<tr>
			<td>Password :</td>
			<td>
				<r:role name="test-role" func="0200,0300">
					<form:password path="passwd" />
				</r:role>
			</td>
		</tr>
		
		<tr>
			<td colspan="2"> 
			<input type="button" value="test json" onclick="javascript:testJson();">
			<input type="button" value="test xml" onclick="javascript:testXML();">
			<input type="submit" value="Register">
			[<spring:message code="org.hi9.message"/>]
			[${user.name}]
			[${sessionScope.user.name}]
			
			[${(n+1)%4}]
			<f:formatDate value="${d}" pattern="yyyy/MM/dd"/>
			<c:choose>
				<c:when test="${2 > 1}">
						2>1
				</c:when>
				<c:when test="${2 == 2}">
				        2=2
				</c:when>
				
				<c:otherwise>
						other
				</c:otherwise>			
			</c:choose>		
			</td>
		</tr>
		</table>
	</form:form>
  </body>
</html>

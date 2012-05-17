<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<html>
  <head>   
    <title>test.test</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
  </head>
  <body> <form:form method="POST" commandName="user" action="/f.action">
		<table>		
		<tr>		
			<td>User Name :</td>			
			<td><form:input path="name" /></td>		
		</tr>
		<tr>
			<td>Password :</td>
			<td><form:password path="passwd" /></td>
		</tr>
		<tr>
			<td colspan="2"><input type="submit" value="Register">[${user.name}]</td>
		</tr>
		</table>
	</form:form>
  </body>
</html>

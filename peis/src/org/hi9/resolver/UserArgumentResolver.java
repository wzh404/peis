package org.hi9.resolver;

import org.apache.log4j.Logger;
import org.hi9.xxx.model.mysql.User;
import org.springframework.core.MethodParameter;
import org.springframework.web.bind.support.WebArgumentResolver;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.context.request.RequestAttributes;

public class UserArgumentResolver implements WebArgumentResolver{
	Logger logger = Logger.getLogger(UserArgumentResolver.class);
	
	public Object resolveArgument(MethodParameter methodParameter, NativeWebRequest webRequest) 
		throws Exception{
		if(methodParameter.getParameterType().equals(User.class) &&
		   methodParameter.getParameterName().equals("current-user")){
			logger.info("-session argument-");
			return webRequest.getAttribute("user", RequestAttributes.SCOPE_SESSION);
		}
		return UNRESOLVED;
	}
}

package org.hi9.tags;

import java.util.Map;
import java.util.Set;

import javax.servlet.jsp.tagext.TagSupport;

import org.apache.log4j.Logger;
import org.hi9.annotation.Action;
import org.hi9.xxx.model.mysql.User;
import org.springframework.context.ApplicationContext;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.mvc.method.RequestMappingInfo;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;
import org.springframework.web.servlet.support.RequestContextUtils;


public class RoleTag extends TagSupport {

	/**
	 * 
	 */
	private static final long serialVersionUID = -2804619173127660056L;
	Logger logger = Logger.getLogger(RoleTag.class);
	
	private String name;
	private String uri;
	private String func;
	
	public String getName() {
		return name;
	}


	public void setName(String name) {
		this.name = name;
	}
	
	
	public String getUri() {
		return uri;
	}


	public void setUri(String uri) {
		this.uri = uri;
	}

	public String getFunc() {
		return func;
	}


	public void setFunc(String func) {
		this.func = func;
	}


	private boolean matchs(String pattern, String uri){
		logger.info("test git");
		
		return false;
	}

	private boolean checkUserFunction(String[] functions){
		User u = (User)pageContext.getSession().getAttribute("user");
		if (u == null){
			logger.info("session user is null");
			return false;
		}
		
		return u.checkActionFunctions(functions);
	}


	@Override
	public int doStartTag() {
		logger.info("start tag ok!");
		
		/*   check role */
		if (func != null){
			String[] fs = func.split(",");
			if (checkUserFunction(fs)){
				return EVAL_BODY_INCLUDE;
			}
			logger.info("func skip!!!");
			return SKIP_BODY;
		}
		
		/* check uri */
		ApplicationContext ac = RequestContextUtils.getWebApplicationContext(pageContext.getRequest());
		RequestMappingHandlerMapping hm = ac.getBean(RequestMappingHandlerMapping.class);
		Map<RequestMappingInfo,HandlerMethod> map = hm.getHandlerMethods();
		
		for(Map.Entry<RequestMappingInfo,HandlerMethod> m: map.entrySet()){
			Set<String> set = m.getKey().getPatternsCondition().getPatterns();			
			if (set.isEmpty()){
				continue;
			}
			
			String[] s = set.toArray(new String[set.size()]);
			logger.info("key is " + s[0]);
			logger.info("value is "  + " - " + m.getValue().getBeanType().getName()  + " - " + m.getValue().getMethod().getName());
				
			Action action = m.getValue().getMethodAnnotation(Action.class);
			if (action == null){
				break;
			}
			
			for (String f : action.func()){
				logger.info("role is " + f);
			}
						
			if (matchs(s[0],uri)){				
				if (checkUserFunction(action.func())){
					return EVAL_BODY_INCLUDE;
				}
				
				break;
			}				
		}
		
		
		return SKIP_BODY;
	}
	
	
	@Override
	public int doEndTag() {
		
		
		return EVAL_PAGE;
	}
	
}

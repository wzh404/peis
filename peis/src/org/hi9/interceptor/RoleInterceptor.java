package org.hi9.interceptor;

import java.lang.reflect.Method;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.hi9.annotation.Action;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

public class RoleInterceptor extends HandlerInterceptorAdapter{
	Logger logger = Logger.getLogger(RoleInterceptor.class);
	
	public boolean preHandle(HttpServletRequest request,
            HttpServletResponse response, 
            Object handler) throws Exception {
		
		if (handler instanceof HandlerMethod){			
			HandlerMethod  h = (HandlerMethod)handler;
			Method method = h.getMethod();
			
			logger.info("Starting invoke role interceptor.");
			String[] functions = getFunctions(handler,method);
			if (functions != null){
				logger.info("functions is [" + functions.toString() + "]");
			}
			
			String[] lefts = getLefts(handler,method);
			if (lefts != null && lefts.length > 0){
				request.setAttribute("lefts", lefts);
				logger.info("lefts is [" + lefts.toString() + "]");
			}
		}
		
		return true;
	}
		
	private String[] getLefts(Object o, Method m){
		if (m.isAnnotationPresent(Action.class)){			
			String[] lefts = m.getAnnotation(Action.class).left();
			return lefts;
		}
		
		return null;
	}
	
	private String[] getFunctions(Object o,Method m){
		if (m.isAnnotationPresent(Action.class)){
			String[] funcs = m.getAnnotation(Action.class).func();
			return funcs;
		}
				
		return null;
	}
}

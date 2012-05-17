package org.hi9.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

public class TimerInterceptor extends HandlerInterceptorAdapter{
	Logger logger = Logger.getLogger(TimerInterceptor.class);
	
	private long currentTime;  
	
	@Override
	public void afterCompletion(HttpServletRequest request,
			HttpServletResponse response, Object handler, Exception ex)
			throws Exception {
		// TODO Auto-generated method stub
		super.afterCompletion(request, response, handler, ex);
		logger.info("completed " + (System.currentTimeMillis() - currentTime) + "ms");
	}

	@Override
	public void postHandle(HttpServletRequest request,
			HttpServletResponse response, Object handler,
			ModelAndView modelAndView) throws Exception {
		// TODO Auto-generated method stub
		super.postHandle(request, response, handler, modelAndView);
		logger.info("posted " + (System.currentTimeMillis() - currentTime) + "ms");
	}

	public boolean preHandle(HttpServletRequest request,
            HttpServletResponse response, 
            Object handler) throws Exception {
		currentTime = System.currentTimeMillis();
		HandlerMethod  m = (HandlerMethod)handler;
		
		logger.info(m.getMethod().getName() + " - Starting timer interceptor.");
		
		return true;
	}	
}

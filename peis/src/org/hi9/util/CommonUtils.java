package org.hi9.util;

import org.springframework.ui.Model;

public class CommonUtils {
	private final static String KEY_JSP = "right_jsp_file"; 
	public final static String USER_HOME_JSP = "/view/home.jsp";
	
	public static void setRightJsp(Model model, String jspFileName){
		model.addAttribute(KEY_JSP,jspFileName);
	}
}

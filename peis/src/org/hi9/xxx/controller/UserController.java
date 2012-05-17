package org.hi9.xxx.controller;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.apache.log4j.Logger;
import org.hi9.annotation.Action;
import org.hi9.util.AutocompleteUtils;
import org.hi9.xxx.bean.Form;
import org.hi9.xxx.model.mysql.Function;
import org.hi9.xxx.model.mysql.User;
import org.hi9.xxx.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.propertyeditors.CustomDateEditor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttributes;


@Controller
@SessionAttributes("user")
public class UserController {
	public final static String MAIN = "/main";
	
	Logger logger = Logger.getLogger(UserController.class);
	
	@Autowired
	private UserService userService;
	
	@RequestMapping(value = "/user/{name}", method = RequestMethod.GET)
	public String rest(@PathVariable String name,Model model) {
		/*
		String sql = "from User u left join fetch u.roles r " +
				"left join fetch r.functions " +
				"where u.name = ?";
		Object[] values = {name};
		List<User> users = (List<User>)userService.find(sql, null, values);
		User user = users.get(0);
		*/
		
		User user = (User)userService.get(User.class, 5);
		//Role r = (Role)userService.get(Role.class, 5);
		model.addAttribute("user", user);
		logger.info("user.name is " + user.getRoles());
		return "/view/test";
	}
	
	@RequestMapping(value = "/g", method = RequestMethod.GET)
	@Action(func={"0100","0200"})
	public String saveArticle(Model model) {
		User u = (User)userService.get(User.class, 1122);
		if (u == null){
			logger.info("oracle user is null");
		}
				
		model.addAttribute("user", u);
		model.addAttribute("wq","okokok");
		model.addAttribute("d", new Date());
		logger.info(u.getName());
		
		return "/view/test";
	}
	
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/s", method = RequestMethod.GET)
	@Action(func={"0100","0200"},left={"01","02"})
	public String spring(HttpServletRequest req,Model model) {		
		String sql = "from User u left join fetch u.roles r " +
			"left join fetch r.functions " +
			"where u.name = 'test'";
		List<User> lu = (List<User>) userService.find(sql,null,null);
		if (lu == null  || lu.size() <= 0){
			return null;
		}
		User u = lu.get(0);
		
		model.addAttribute("user", u);
		model.addAttribute("wq","okokok");
		model.addAttribute("d", new Date());
		model.addAttribute("right_jsp_file","/view/home.jsp");
		//req.setAttribute("testUser", u.getFunctions());
		
		return MAIN; 
	}
	
	@RequestMapping(value = "/tj", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> testAjax(@RequestBody Function func){
		System.out.println("body user name is " + func.getName());
		Map<String, Object> modelMap = new HashMap<String, Object>();
		modelMap.put("total", "1");
		modelMap.put("data", "wangqi");
		modelMap.put("result", "ok");
		
		return modelMap;
	}
	
	@RequestMapping(value = "/tmx", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> testMapXml(){
		System.out.println("testMapXml start...");
		Map<String, Object> modelMap = new HashMap<String, Object>();
		modelMap.put("total", "1");
		modelMap.put("data", "wangqi");
		modelMap.put("result", "ok");
		
		return modelMap;
	}
	
	@RequestMapping(value = "/axml", method = RequestMethod.POST)
	@ResponseBody
	public Function testAjaxXML(){
		Function f = new Function();
		f.setAct("a");
		f.setCode("0100");
		f.setId(12);
		f.setName("wangqi");
		
		return f;
	}
		
	@RequestMapping(value = "/autouser", method = RequestMethod.GET)
	@ResponseBody
	public String autoUser(@RequestParam("pinyin") String pinyin){
		String sql = "from User u where u.pinyin like '" + pinyin + "%'";
		List<User> l = (List<User>)userService.find(sql, null, null);
		
		try{
			String s = AutocompleteUtils.getAutocompleteText("user", l);
			System.out.println(s);
			return s;
		}
		catch(Exception e){
			e.printStackTrace();
			return null;
		}	
	}
	
	@RequestMapping(value = "/j", method = RequestMethod.GET)
	@ResponseBody
	public Map<String, Object> testJSON(@RequestParam("dt") Date dt){
		System.out.println("date is " + dt.toString());
		Map<String, Object> modelMap = new HashMap<String, Object>();
		modelMap.put("total", "1");
		modelMap.put("data", "wangqi");
		modelMap.put("success", "true");
		
		return modelMap;
	}
	
	@RequestMapping(value = "/f", method = RequestMethod.GET)
	public String testForm(User user,@ModelAttribute("wq")String wq) {		
		System.out.println(user.getName() + " -- " + wq);
		return "redirect:/index.jsp";
	}
	
	@RequestMapping(value = "/vv", method = RequestMethod.POST)
	public String vvalidForm(@ModelAttribute("users[]") Form form) {		
		System.out.println("users length is " + form.getUsers().size());
		
		return "redirect:/index.jsp";
	}
	
	@RequestMapping(value = "/v", method = RequestMethod.POST)
	public String validForm(@Valid @ModelAttribute("user") User user,BindingResult result) {		
		System.out.println("valid user name " + user.getName());
		if (result.hasErrors()) {
            return "/test";
		}
		return "redirect:/index.jsp";
	}
	
	@InitBinder
	public void initBinder(WebDataBinder binder) {
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");  
	    binder.registerCustomEditor(Date.class, new CustomDateEditor(dateFormat, false)); 
	}
}

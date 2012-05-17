package org.hi9.util;

import java.io.File;
import java.util.List;

import javax.servlet.ServletContext;

import org.apache.commons.beanutils.PropertyUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.hi9.xxx.bean.Autocomplete;

public class AutocompleteUtils {
	private static Autocomplete getAutocompleteItem(String name){
		File f = new File("autocomplete.json");
		ObjectMapper objectMapper = new ObjectMapper();
		try{
			Autocomplete[] ac = objectMapper.readValue(f, Autocomplete[].class);
			for (int i = 0; i < ac.length; i++){
				if (ac[i].getName().equals(name)){
					return ac[i];
				}
			}
		}catch(Exception e){
			e.printStackTrace();
		}	
		
		return null;
	}
	
	public static String getAutocompleteText(String name,List list)
		throws Exception{
		Autocomplete ac = getAutocompleteItem(name);
		if (ac == null) return null;
		
		String s = "";
		if (list == null || list.size() <= 0){
			s = "<li onselect=\"void(0);\"><span>" + ac.getHit() + "！</span> <b>提示</b</li>\n";
			return s;
		}
		
		for (int i = 0; i < list.size(); i++){
			Object obj = list.get(i);
			String js = "auto" + ac.getName();
			
			String p = "";
			for (int j = 0; j < ac.getJs().length; j++){
				Object o = PropertyUtils.getProperty(obj, ac.getJs()[j]);
				if (o == null){
					o = "-";
				}
					
				if (p.equals("")){
					p = o.toString();
				}
				else{
					p += "_" + o.toString();
				}				
			}
			
			s += "<li onselect=\"" + js + "('" + p + "');\">";			
			for (int j = 1; j < ac.getShow().length; j++){
				Object o = PropertyUtils.getProperty(obj,ac.getShow()[j]);
				if (j == 1){
					s += "<span>" + o.toString();
				}
				else{
					s += "&nbsp;&nbsp;" + o.toString();
				}
			}
			s += "</span>";
			
			Object f = PropertyUtils.getProperty(obj,ac.getShow()[0]);
			s += "<b>" + f.toString() + "</b></li>\n";
			
			if (i > 10) break;
		}
		
		return s;
	}
}

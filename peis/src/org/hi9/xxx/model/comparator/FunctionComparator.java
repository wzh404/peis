package org.hi9.xxx.model.comparator;

import java.util.Comparator;

import org.hi9.xxx.model.mysql.Function;

public class FunctionComparator implements Comparator<Object>{
	public int compare(Object o1, Object o2) {
		if (o1 instanceof Function && o2 instanceof Function) {
			Function f1 = (Function)o1;
			Function f2 = (Function)o2;
			int r = f1.getCode().compareTo(f2.getCode());
				
			if (r < 0) return -1;
			else if (r > 0) return 1;
			else return 0;
		}
			
		return 0;
	}
}

package org.hi9.xxx.model.comparator;

import java.util.Comparator;

import org.hi9.xxx.model.mysql.Role;

public class RoleComparator implements Comparator<Object>{
	public int compare(Object o1, Object o2) {
		if (o1 instanceof Role && o2 instanceof Role) {
			Role r1 = (Role)o1;
			Role r2 = (Role)o2;
			int r = r1.getCode().compareTo(r2.getCode());
			
			if (r < 0) return -1;
			else if (r > 0) return 1;
			else return 0;
		}
		
		return 0;
	}
}

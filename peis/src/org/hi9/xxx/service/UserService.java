package org.hi9.xxx.service;

import javax.annotation.PostConstruct;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service("userService")
@Transactional(propagation = Propagation.REQUIRED, readOnly = true)
public class UserService extends Hibernate4BaseService{
	Logger logger = Logger.getLogger(UserService.class);
	
	@PostConstruct
	public void initCache(){
		logger.info("Initializing second level cache data...");	
		
		String sql = "from User u left join fetch u.roles r " +
				"left join fetch r.functions ";
		
		find(sql,null,null);
	}
}

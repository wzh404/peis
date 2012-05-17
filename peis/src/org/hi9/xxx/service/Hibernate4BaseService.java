package org.hi9.xxx.service;

import java.util.List;

import org.hi9.dao.Hibernate4Dao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(propagation = Propagation.REQUIRED, readOnly = true)
public class Hibernate4BaseService {
	@Autowired
	private Hibernate4Dao hibernate4Dao;
	
	public Object get(Class<?> cls,int id){
		return hibernate4Dao.get(cls,new Integer(id));
	}
	
	public Object load(Class<?> cls,int id){
		return hibernate4Dao.load(cls, id);
	}
	
	public List<?> find(String sql,String[] names,Object[] values){
		return hibernate4Dao.find(sql, names, values);
	}
	
	public void saveOrUpdate(Object obj){
		hibernate4Dao.saveOrUpdate(obj);
	}
}

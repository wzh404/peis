package org.hi9.dao;

import java.io.Serializable;
import java.util.Collection;
import java.util.List;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository("hibernate4Dao")
public class Hibernate4Dao{
	@Autowired
	private SessionFactory sessionFactory;
	
	public Session getCurrentSession(){
		return sessionFactory.getCurrentSession();
	}
		
	public <T> T get(Class<T> cls,Serializable  id){
		return (T)getCurrentSession().get(cls,id);
	}
	
	public Object load(Class cls, Serializable  id){
		return getCurrentSession().load(cls,id);
	}
	
	public void evict(final Object entity){
		getCurrentSession().evict(entity);
	}
	
	public boolean contains(final Object entity){
		return getCurrentSession().contains(entity);
	}
	
	public Serializable save(final Object entity){
		return getCurrentSession().save(entity);
	}
	
	public void update(Object entity){
		getCurrentSession().update(entity);
	}
	
	public void saveOrUpdate(Object obj){
		getCurrentSession().saveOrUpdate(obj);
	}
	
	public void delete(Object entity){
		getCurrentSession().delete(entity);
	}
	
	public void deleteAll(final Collection<?> entities){
		for (Object entity : entities) {
			getCurrentSession().delete(entity);
		}
	}
	
	public void flush(){
		getCurrentSession().flush();
	}
	
	public void clear(){
		getCurrentSession().clear();
	}
	
	public <T> T merge(final T entity){
		return (T)getCurrentSession().merge(entity);
	}
	
	public void persist(final Object entity){
		getCurrentSession().persist(entity);
	}
	
	protected void applyNamedParameterToQuery(Query queryObject, String paramName, Object value){
		if (value instanceof Object[]){
			queryObject.setParameterList(paramName, (Object[])value);
		}
		else if (value instanceof Collection){
			queryObject.setParameterList(paramName, (Collection<?>)value);
		}
		else{
			queryObject.setParameter(paramName, value);
		}
	}
	
	@Transactional
	public List<?> find(String sql, String[] names, Object[] values){
		Session session = getCurrentSession();
		Query queryObject = session.createQuery(sql);
				
		if (names == null && values != null){
			for (int i = 0; i < values.length; i++) {
				queryObject.setParameter(i, values[i]);
			}
		}
		
		if (names != null && values != null){
			for (int i = 0; i < values.length; i++) {
				applyNamedParameterToQuery(queryObject,names[i],values[i]);
			}
		}
		
		return queryObject.list();
	}
	
	public int bulkUpdate(String sql){
		return bulkUpdate(sql,null);
	}
	
	public int bulkUpdate(String sql, Object value){
		return bulkUpdate(sql, new Object[]{value});
	}
	
	public int bulkUpdate(String sql, final Object[] values){
		Query queryObject = getCurrentSession().createQuery(sql);
		if (values != null){
			for (int i = 0; i < values.length; i++){
				queryObject.setParameter(i, values[i]);
			}
		}
		return queryObject.executeUpdate();
	}
}

package org.hi9.xxx.model.mysql;

import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.SortedSet;
import java.util.TreeSet;

import javax.persistence.*;
import javax.validation.constraints.Size;

import org.hi9.xxx.bean.SessionConfig;
import org.hi9.xxx.model.comparator.RoleComparator;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Sort;
import org.hibernate.annotations.SortType;
import org.hibernate.validator.constraints.NotEmpty;

@Entity
@Table(name="users")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class User {
	@Id
	@GeneratedValue (strategy=GenerationType.AUTO)
	private Integer id;
	
	@Column(name="name")
	@NotEmpty
	@Size(min = 2, max = 6)
	private String name;
	
	@Column(name="passwd")
	private String passwd;
	
	@Column(name="pinyin")
	private String pinyin;
	
	@ManyToMany(targetEntity=org.hi9.xxx.model.mysql.Role.class,
		    fetch=FetchType.EAGER)
    @JoinTable(name="user_roles",
		joinColumns={@JoinColumn(name="userid")},
        inverseJoinColumns={@JoinColumn(name="roleid")})
    @Sort(type = SortType.COMPARATOR, comparator = RoleComparator.class)
	@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
	private SortedSet<Role> roles = new TreeSet<Role>();
	
	@Transient
	private SessionConfig cfg;
	
	//@Transient
	//private List<Function> functions = new LinkedList<Function>();
	
	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPasswd() {
		return passwd;
	}

	public void setPasswd(String passwd) {
		this.passwd = passwd;
	}

	public String getPinyin() {
		return pinyin;
	}

	public void setPinyin(String pinyin) {
		this.pinyin = pinyin;
	}

	public SortedSet<Role> getRoles() {
		return roles;
	}

	public void setRoles(SortedSet<Role> roles) {
		this.roles = roles;
	}

	public List<Function> getFunctions() {
		List<Function> functions = new LinkedList<Function>();
		Iterator<Role> itr = getRoles().iterator();
		while(itr.hasNext()){
			Role r = (Role)itr.next();
			
			Iterator<Function> itf = r.getFunctions().iterator();
	    	while(itf.hasNext()){
	    		Function f = (Function)itf.next();
	    		if (!(functions.contains(f))){
	    			functions.add(f);
	    		}
	    	}
		}
		
		return functions;
	}
	
	public boolean checkActionFunctions(String[] actionFunctions){
		List<Function> functions = getFunctions();
		for (Function f : functions){
			System.out.println("code is " + f.getCode());
			for(String af : actionFunctions){
				if (f.getCode().equals(af)){
					return true;
				}
			}
		}
		
		return false;
	}

	public SessionConfig getCfg() {
		return cfg;
	}

	public void setCfg(SessionConfig cfg) {
		this.cfg = cfg;
	}
}

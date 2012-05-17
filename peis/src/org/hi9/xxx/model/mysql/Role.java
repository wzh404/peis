package org.hi9.xxx.model.mysql;

import java.util.SortedSet;
import java.util.TreeSet;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

import org.hi9.xxx.model.comparator.FunctionComparator;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Sort;
import org.hibernate.annotations.SortType;

@Entity
@Table(name="role")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Role {
	@Id
	@GeneratedValue (strategy=GenerationType.AUTO)
	private Integer id;
	
	@Column(name="name")
	private String name;
	
	@Column(name="code")
	private String code;
	
	@Column(name="descr")
	private String descr;
	
	@ManyToMany(targetEntity=org.hi9.xxx.model.mysql.Function.class,
		    fetch=FetchType.EAGER)
    @JoinTable(name="role_funcs",
		joinColumns={@JoinColumn(name="roleid")},
        inverseJoinColumns={@JoinColumn(name="funcid")})
	@Sort(type = SortType.COMPARATOR, comparator = FunctionComparator.class)
	@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
	private SortedSet<Function> functions = new TreeSet<Function>();

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

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getDescr() {
		return descr;
	}

	public void setDescr(String descr) {
		this.descr = descr;
	}
	
	public SortedSet<Function> getFunctions() {
		return functions;
	}

	public void setFunctions(SortedSet<Function> functions) {
		this.functions = functions;
	}
}

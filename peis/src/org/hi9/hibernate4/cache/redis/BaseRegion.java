/*
 * Hibernate, Relational Persistence for Idiomatic Java
 *
 * Copyright (c) 2010-2011, Red Hat Inc. or third-party contributors as
 * indicated by the @author tags or express copyright attribution
 * statements applied by the authors.  All third-party contributions are
 * distributed under license by Red Hat Inc.
 *
 * This copyrighted material is made available to anyone wishing to use, modify,
 * copy, or redistribute it subject to the terms and conditions of the GNU
 * Lesser General Public License, as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License
 * for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this distribution; if not, write to:
 * Free Software Foundation, Inc.
 * 51 Franklin Street, Fifth Floor
 * Boston, MA  02110-1301  USA
 */
package org.hi9.hibernate4.cache.redis;

//import java.util.Collections;
import java.util.Map;
//import java.util.concurrent.ConcurrentHashMap;

import org.hibernate.cache.CacheException;
import org.hibernate.cache.internal.Timestamper;
import org.hibernate.cache.spi.Region;
import org.springframework.core.serializer.support.DeserializingConverter;
import org.springframework.core.serializer.support.SerializingConverter;

import redis.clients.jedis.Jedis;

/**
 * @author Strong Liu
 */
class BaseRegion implements Region {
	//protected final Map cache = new ConcurrentHashMap();
	protected Jedis cache;
	private final String name;
	private static int timeout = Timestamper.ONE_MS * 60000;  //60s

	BaseRegion(Jedis jedis,String name) {
		this.cache = jedis;
		this.name = name;
	}

	@Override
	public boolean contains(Object key) {
		byte[] k = serializeObject(key);
		return key != null ? cache.exists(k ) : false;
	}

	@Override
	public String getName() {
		return name;
	}

	@Override
	public void destroy() throws CacheException {
		cache.flushAll();
	}

	@Override
	public long getSizeInMemory() {
		return -1;
	}

	@Override
	public long getElementCountInMemory() {
		return cache.dbSize();
	}

	@Override
	public long getElementCountOnDisk() {
		return 0;
	}

	@Override
	public Map toMap() {
		return null;//Collections.unmodifiableMap( cache );
	}

	@Override
	public long nextTimestamp() {
		return Timestamper.next();
	}

	@Override
	public int getTimeout() {
		return timeout;
	}
	
	protected byte[] serializeObject(Object obj){
		SerializingConverter sc = new SerializingConverter();
		return sc.convert(obj);
 	}
	
	protected Object deserializeObject(byte[] b){
 		DeserializingConverter dc = new DeserializingConverter();
		return dc.convert(b);
	}

}



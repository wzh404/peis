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

import org.jboss.logging.Logger;

import org.hibernate.cache.CacheException;
import org.hibernate.cache.spi.GeneralDataRegion;
import org.hibernate.internal.CoreMessageLogger;

import redis.clients.jedis.Jedis;

/**
 * @author Strong Liu
 */
class BaseGeneralDataRegion extends BaseRegion implements GeneralDataRegion {
	private static final CoreMessageLogger LOG = Logger.getMessageLogger(
			CoreMessageLogger.class, BaseGeneralDataRegion.class.getName()
	);

	BaseGeneralDataRegion(Jedis jedis,String name) {
		super(jedis, name );
	}

	@Override
	public Object get(Object key) throws CacheException {
		LOG.infof( "Cache[%s] lookup : key[%s]",getName(), key );
		if ( key == null ) {
			return null;
		}
		byte[] k = serializeObject(key);
		byte[] result = cache.get( k );
		if ( result != null ) {
			LOG.infof( "Cache[%s] hit: %s",getName(), key );
			Object o = deserializeObject(result);
			return o;
		}
		
		return result;
	}

	@Override
	public void put(Object key, Object value) throws CacheException {
		LOG.infof( "Caching[%s] : [%s] -> [%s]",getName(), key, value );
		if ( key == null || value == null ) {
			LOG.debug( "Key or Value is null" );
			return;
		}
		byte[] k = serializeObject(key);
		byte[] v = serializeObject(value);
		cache.set( k, v );
	}

	@Override
	public void evict(Object key) throws CacheException {
		LOG.debugf( "Evicting[%s]: %s",getName(), key );
		if ( key == null ) {
			LOG.debug( "Key is null" );
			return;
		}
		byte[] k = serializeObject(key);
		cache.del( k );
	}

	@Override
	public void evictAll() throws CacheException {
		LOG.debugf( "evict cache[%s]", getName() );
		cache.flushAll();
	}
}

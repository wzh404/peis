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

import java.util.Properties;

import org.jboss.logging.Logger;

import org.hibernate.cache.CacheException;
import org.hibernate.cache.internal.Timestamper;
import org.hibernate.cache.spi.CacheDataDescription;
import org.hibernate.cache.spi.CollectionRegion;
import org.hibernate.cache.spi.EntityRegion;
import org.hibernate.cache.spi.NaturalIdRegion;
import org.hibernate.cache.spi.QueryResultsRegion;
import org.hibernate.cache.spi.RegionFactory;
import org.hibernate.cache.spi.TimestampsRegion;
import org.hibernate.cache.spi.access.AccessType;
import org.hibernate.cfg.Settings;
import org.hibernate.internal.CoreMessageLogger;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;

/**
 * @author Strong Liu
 */
public class RedisCacheRegionFactory implements RegionFactory {
	/**
	 * 
	 */
	private static final long serialVersionUID = 3691738043450045944L;
	private static final CoreMessageLogger LOG = Logger.getMessageLogger(
			CoreMessageLogger.class, RedisCacheRegionFactory.class.getName()
	);
	private JedisPool pool;
	private Settings settings;
	public RedisCacheRegionFactory() {
		LOG.warn( "CachingRegionFactory should be only used for testing." );
	}

	public RedisCacheRegionFactory(Properties properties) {
		//add here to avoid run into catch
		LOG.warn( "CachingRegionFactory should be only used for testing." );
	}

	@Override
	public void start(Settings settings, Properties properties) throws CacheException {
		this.settings=settings;
		JedisPoolConfig config =  new  JedisPoolConfig();
		config.setMaxActive(100);
		config.setMaxIdle(20);
		config.setMaxWait(1000);
		config.setTestOnBorrow(false);
	 	          
		pool = new JedisPool(config,  "localhost" );
	}

	@Override
	public void stop() {
		
	}

	@Override
	public boolean isMinimalPutsEnabledByDefault() {
		return false;
	}

	@Override
	public AccessType getDefaultAccessType() {
		return AccessType.NONSTRICT_READ_WRITE;
	}

	@Override
	public long nextTimestamp() {
		return Timestamper.next();
	}

	@Override
	public EntityRegion buildEntityRegion(String regionName, Properties properties, CacheDataDescription metadata)
			throws CacheException {
		Jedis jedis = pool.getResource();
		jedis.auth("wangqi");
		return new EntityRegionImpl( regionName, metadata, settings,jedis);
	}

	@Override
	public CollectionRegion buildCollectionRegion(String regionName, Properties properties, CacheDataDescription metadata)
			throws CacheException {
		Jedis jedis = pool.getResource();
		jedis.auth("wangqi");
		return new CollectionRegionImpl( regionName, metadata, settings,jedis );
	}

	@Override
	public QueryResultsRegion buildQueryResultsRegion(String regionName, Properties properties) throws CacheException {
		Jedis jedis = pool.getResource();
		jedis.auth("wangqi");
		return new QueryResultsRegionImpl( regionName,jedis );
	}

	@Override
	public TimestampsRegion buildTimestampsRegion(String regionName, Properties properties) throws CacheException {
		Jedis jedis = pool.getResource();
		jedis.auth("wangqi");
		return new TimestampsRegionImpl( regionName,jedis);
	}

	private static class QueryResultsRegionImpl extends BaseGeneralDataRegion implements QueryResultsRegion {
		QueryResultsRegionImpl(String name,Jedis jedis) {
			super(jedis, name );
		}
	}

	private static class TimestampsRegionImpl extends BaseGeneralDataRegion implements TimestampsRegion {
		TimestampsRegionImpl(String name,Jedis jedis) {
			super( jedis,name );
		}
	}

	@Override
	public NaturalIdRegion buildNaturalIdRegion(String arg0, Properties arg1,
			CacheDataDescription arg2) throws CacheException {
		// TODO Auto-generated method stub
		return null;
	}
}

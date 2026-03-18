---
title: Cache overview
description: In-memory cache with TTL, eviction policies and write strategies.
sidebar:
  order: 1
---

NotLib's cache system consists of two layers:

- **`NotCache<K, V>`** — a standalone in-memory cache with TTL, LRU/FIFO eviction and dirty tracking.
- **`CachedRepository<K, V>`** — wraps `EntityRepository` with a `NotCache` in front and controls _when_ writes hit the database via a `WriteStrategy`.

## Write strategies

The most important decision when setting up a `CachedRepository` is which `WriteStrategy` to use:

| Strategy        | Writes go to…                   | Consistency           | DB load | Best for                    |
| --------------- | ------------------------------- | --------------------- | ------- | --------------------------- |
| `WRITE_THROUGH` | DB + cache immediately          | High                  | Medium  | Profiles, important data    |
| `WRITE_BEHIND`  | Cache first, DB every N seconds | Eventually consistent | Low     | XP, playtime, counters      |
| `READ_THROUGH`  | DB directly, cache invalidated  | High                  | Medium  | Mostly-read, rarely-written |

## Eviction policies

| Policy     | Behaviour                                                       |
| ---------- | --------------------------------------------------------------- |
| `LRU`      | Evicts the least recently accessed entry when the cache is full |
| `FIFO`     | Evicts the oldest inserted entry when the cache is full         |
| `TTL_ONLY` | No size limit; entries are only removed when they expire        |

## Quick start

```java
// Via DatabaseManager (uses defaults: LRU, 10 min TTL, WRITE_THROUGH)
db.registerCached(PlayerProfile.class);

// Custom strategy
db.registerCached(PlayerProfile.class, WriteStrategy.WRITE_BEHIND);

// Full control
db.registerCached(PlayerProfile.class, WriteStrategy.WRITE_BEHIND,
    NotCache.<UUID, PlayerProfile>builder()
        .maxSize(1000)
        .ttlMinutes(30)
        .evictionPolicy(CacheEvictionPolicy.LRU)
        .build());
```

## Accessing the repository

```java
CachedRepository<UUID, PlayerProfile> repo = db.cached(PlayerProfile.class);

// Reads hit cache first; DB is queried only on a cache miss
Optional<PlayerProfile> profile = repo.findById(uuid);

// Writes respect the configured WriteStrategy
repo.upsert(updatedProfile);
```

## Flushing WRITE_BEHIND data

With `WRITE_BEHIND`, dirty entries are flushed automatically on a background timer.
You can also flush manually at any time:

```java
repo.flush();              // synchronous
repo.flushAsync();         // async

// On plugin shutdown, DatabaseManager.close() (or NotPlugin) calls flush() automatically
```

## Cache statistics

```java
CacheStats stats = repo.getCacheStats();
log.info(stats.toString());
// CacheStats{hits=142, misses=8, hitRate=94.7%, evictions=0, expirations=3, size=47/500}
```

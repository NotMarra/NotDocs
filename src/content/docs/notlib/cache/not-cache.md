---
title: NotCache
description: Standalone in-memory cache reference.
sidebar:
  order: 2
---

`NotCache<K, V>` can be used independently of any database — for example to cache
computed values, API responses or any other expensive operation.

## Creating a cache

```java
NotCache<UUID, PlayerProfile> cache = NotCache.<UUID, PlayerProfile>builder()
        .maxSize(500)
        .ttlMinutes(10)
        .evictionPolicy(CacheEvictionPolicy.LRU)
        .cleanupIntervalMillis(60_000)   // background expiry sweep every 60 s
        .build();
```

### Builder options

| Option                        | Default           | Description                                       |
| ----------------------------- | ----------------- | ------------------------------------------------- |
| `maxSize(int)`                | `500`             | Max entries before eviction kicks in              |
| `ttlMillis(long)`             | `300 000` (5 min) | Default entry lifetime                            |
| `ttlSeconds(long)`            | —                 | Convenience alias                                 |
| `ttlMinutes(long)`            | —                 | Convenience alias                                 |
| `evictionPolicy(…)`           | `LRU`             | `LRU`, `FIFO` or `TTL_ONLY`                       |
| `cleanupIntervalMillis(long)` | `60 000`          | Background thread sweep interval; `0` disables it |

## Core operations

```java
// Store
cache.put(uuid, profile);
cache.put(uuid, profile, 60_000L);   // custom TTL for this entry

// Retrieve
Optional<PlayerProfile> hit = cache.get(uuid);

// Load-or-compute — puts the value automatically on a miss
PlayerProfile p = cache.getOrLoad(uuid, id -> db.loadFromDatabase(id));

// Check presence (does not count as an access for LRU)
boolean present = cache.contains(uuid);

// Remove
cache.invalidate(uuid);
cache.invalidateAll();
```

## Dirty tracking

Useful when using `NotCache` independently and you want to know which entries were modified:

```java
cache.update(uuid, modified);    // marks entry dirty
cache.markDirty(uuid);           // mark an existing entry dirty manually

Map<UUID, PlayerProfile> dirty = cache.getDirtyEntries();
// persist dirty entries yourself…
cache.markAllClean();
```

## Lifecycle

```java
// Force an immediate expiry sweep (also runs on background thread automatically)
int removed = cache.evictExpired();

// Statistics snapshot
CacheStats stats = cache.getStats();
double hitRate = stats.hitRate(); // 0.0 – 1.0

// Shutdown background thread gracefully
cache.shutdown();
```

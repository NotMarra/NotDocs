---
title: EntityRepository
description: Full CRUD reference for EntityRepository.
sidebar:
  order: 2
---

`EntityRepository<T>` provides type-safe CRUD operations for a single entity class.
Every method has a synchronous and an async (`*Async`) variant.
Async variants return `CompletableFuture` and run on the configured executor
(Folia-safe when created through `NotPlugin` or `DatabaseManager`).

## Obtaining a repository

```java
// Via DatabaseManager (recommended)
EntityRepository<AuditLog> repo = db.plain(AuditLog.class);

// Standalone (you manage lifecycle)
EntityRepository<AuditLog> repo = new EntityRepository<>(database, AuditLog.class);
```

## Create table

```java
repo.createTable(); // CREATE TABLE IF NOT EXISTS …
```

Call this once when your plugin starts up. `DatabaseManager.registerPlain()` calls it automatically.

## Insert

```java
repo.insert(entity);
repo.insertAsync(entity).thenRun(() -> log.info("saved"));

// Batch insert — single transaction
repo.insertAll(List.of(a, b, c));
repo.insertAllAsync(entities);
```

## Upsert

Inserts the row or updates it if the primary key already exists.
Uses `INSERT OR REPLACE` on SQLite and `INSERT … ON DUPLICATE KEY UPDATE` on MariaDB.

```java
repo.upsert(entity);
repo.upsertAsync(entity);

// Batch upsert — single transaction
repo.upsertAll(entities);
repo.upsertAllAsync(entities);
```

## Find

```java
Optional<PlayerProfile> profile = repo.findById(uuid);
repo.findByIdAsync(uuid).thenAccept(opt -> opt.ifPresent(this::handle));

List<PlayerProfile> all = repo.findAll();
repo.findAllAsync().thenAccept(list -> { … });

boolean exists = repo.exists(uuid);
repo.existsAsync(uuid).thenAccept(e -> { … });
```

## Update

Updates all non-primary-key columns for the matching PK.

```java
repo.update(entity);
repo.updateAsync(entity);
```

## Delete

```java
repo.delete(uuid);
repo.deleteAsync(uuid);
```

## Custom executor

By default async operations run on `ForkJoinPool.commonPool()`.
Override this to use a Folia-safe scheduler:

```java
Executor async = r -> plugin.getServer().getAsyncScheduler().runNow(plugin, $ -> r.run());
EntityRepository<AuditLog> repo = new EntityRepository<>(db, AuditLog.class)
        .withExecutor(async);
```

When you use `DatabaseManager` or `NotPlugin.sqliteDatabase()` this is handled automatically.

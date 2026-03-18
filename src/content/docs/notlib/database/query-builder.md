---
title: QueryBuilder
description: Fluent query builder for filtered, sorted and paginated reads.
sidebar:
  order: 3
---

`QueryBuilder<T>` builds `SELECT` and `DELETE` statements with a fluent API.
Obtain one from `EntityRepository.query()` or `CachedRepository.query()`.

:::caution
Results from `query()` bypass the cache. Call `CachedRepository.cacheAll(list)` after
a bulk query if you want the results to be cached.
:::

## Basic usage

```java
List<PlayerProfile> topPlayers = repo.query()
        .where("level", ">=", 10)
        .orderBy("level", SortOrder.DESC)
        .limit(10)
        .findAll();
```

## WHERE clauses

```java
// AND (default)
.where("level", ">=", 5)
.where("name", "=", "Notch")

// OR
.orWhere("level", "=", 0)

// IN list
.whereIn("uuid", Set.of(uuid1, uuid2, uuid3))
.orWhereIn("uuid", uuids)
```

Supported operators: `=`, `!=`, `<`, `>`, `<=`, `>=`, `LIKE`.

## Sorting & pagination

```java
.orderBy("level", SortOrder.DESC)
.orderBy("name",  SortOrder.ASC)
.limit(20)
.offset(40)   // page 3 at 20 per page
```

## Terminators

| Method        | Returns       | Description          |
| ------------- | ------------- | -------------------- |
| `findAll()`   | `List<T>`     | All matching rows    |
| `findFirst()` | `Optional<T>` | First matching row   |
| `count()`     | `long`        | Row count            |
| `delete()`    | `void`        | Delete matching rows |

Each terminator has an `*Async` variant returning `CompletableFuture`.

```java
repo.query()
    .where("level", ">=", 3)
    .orderBy("level", SortOrder.DESC)
    .findAllAsync()
    .thenAccept(players -> players.forEach(p -> log.info(p.getName())));
```

:::danger
Calling `.delete()` without any `.where()` clause deletes **every row** in the table.
Always double-check that at least one where clause is present before calling delete.
:::

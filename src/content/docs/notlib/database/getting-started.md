---
title: Getting started
description: Setting up a database with NotLib.
sidebar:
  order: 1
---

NotLib's database layer is built on top of **HikariCP** and supports **SQLite** and **MariaDB** out of the box.
The main entry point is `DatabaseManager` which wires a connection pool together with repositories.

## Quick start (SQLite inside NotPlugin)

```java
public class MyPlugin extends NotPlugin {
    public DatabaseManager db;

    @Override
    public void initPlugin() {
        // sqliteDatabase() pre-wires the Folia-safe executor and auto-closes on disable
        db = sqliteDatabase(getDataFolder(), "data").build();
        db.registerCached(PlayerProfile.class);
    }
}
```

## Quick start (MariaDB)

```java
db = mariaDatabase("localhost", "3306", "mydb", "user", "password").build();
db.registerCached(PlayerProfile.class);
```

## Defining an entity

Annotate your class with `@Table` and each persistent field with `@Column`:

```java
@Table(name = "players")
public class PlayerProfile {

    @Column(name = "id", primaryKey = true)
    private UUID uuid;

    @Column(name = "name", length = 32, nullable = false)
    private String name;

    @Column(name = "level")
    private int level;

    public PlayerProfile() {} // required for reflection-based mapping

    public PlayerProfile(UUID uuid, String name, int level) {
        this.uuid  = uuid;
        this.name  = name;
        this.level = level;
    }

    // getters …
}
```

### `@Column` options

| Option          | Type    | Default | Description                    |
| --------------- | ------- | ------- | ------------------------------ |
| `name`          | String  | —       | Column name in SQL             |
| `primaryKey`    | boolean | `false` | Marks this as the PK           |
| `autoIncrement` | boolean | `false` | AUTO_INCREMENT / AUTOINCREMENT |
| `nullable`      | boolean | `true`  | Adds NOT NULL when `false`     |
| `unique`        | boolean | `false` | Adds UNIQUE constraint         |
| `length`        | int     | `255`   | Length for VARCHAR columns     |

## Registering repositories

```java
// Cached repository (recommended) — see Cache section for write strategy details
db.registerCached(PlayerProfile.class);

// Plain repository — no cache, direct DB access
db.registerPlain(AuditLog.class);
```

## Accessing repositories

```java
CachedRepository<UUID, PlayerProfile> profiles = db.cached(PlayerProfile.class);
EntityRepository<AuditLog>            logs     = db.plain(AuditLog.class);
```

## Next steps

- [EntityRepository — CRUD operations](/database/entity-repository/)
- [QueryBuilder — filtered queries](/database/query-builder/)
- [Cache & write strategies](/cache/overview/)

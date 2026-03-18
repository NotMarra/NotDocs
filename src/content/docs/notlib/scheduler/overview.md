---
title: Scheduler
description: Folia-compatible task scheduling in NotLib.
sidebar:
  order: 1
---

`Scheduler` wraps the Paper/Folia scheduling APIs so you don't need to branch your code
for Folia vs. non-Folia environments. Access it from `NotPlugin` via `scheduler()`.

## Global tasks

Run on the global region (not tied to a specific world or entity):

```java
scheduler().global(() -> log.info("Tick!"));

scheduler().globalDelayed(() -> log.info("After 20 ticks"), 20L);

scheduler().globalRepeating(() -> saveAll(), 200L, 200L);  // delay, period (ticks)
```

## Async tasks

```java
scheduler().async(() -> heavyDatabaseOperation());

scheduler().asyncDelayed(() -> sendWebRequest(), 40L, TimeUnit.MILLISECONDS);

scheduler().asyncRepeating(() -> syncStats(), 0L, 30_000L, TimeUnit.MILLISECONDS);

// Cancel all async tasks registered by this plugin
scheduler().asyncCancelTasks();
```

## Region tasks (Folia)

Tied to a specific location's region — required for Folia when accessing world data:

```java
scheduler().region(location, () -> location.getBlock().setType(Material.DIAMOND_BLOCK));

scheduler().regionDelayed(location, () -> spawnParticles(location), 5L);
```

## Entity tasks (Folia)

Tied to a specific entity's region:

```java
scheduler().entity(entity,
        () -> entity.setGlowing(true),   // task
        () -> log.info("entity retired")  // called if entity is removed before task runs
);

scheduler().entityDelayed(entity, () -> entity.remove(), () -> {}, 100L);
```

## When to use which

| Situation                               | Method                       |
| --------------------------------------- | ---------------------------- |
| Plugin-wide operations (stats, cleanup) | `global` / `globalRepeating` |
| Database / network I/O                  | `async` / `asyncRepeating`   |
| Modifying blocks / world data           | `region`                     |
| Moving or modifying entities            | `entity`                     |

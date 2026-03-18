---
title: NotPlugin
description: Base class for all NotLib-powered plugins.
sidebar:
  order: 2
---

`NotPlugin` extends `JavaPlugin` and wires up the entire NotLib stack automatically —
scheduler, config manager, database lifecycle, listeners and command groups.

## Minimal plugin

```java
public class MyPlugin extends NotPlugin {

    @Override
    public void initPlugin() {
        // Called early in onEnable(), before listeners/commands are registered.
        // Set up databases, load configs, register listeners here.
    }

    @Override
    public void onPluginEnable() {
        // Called after everything is registered and ready.
        getLogger().info("MyPlugin enabled!");
    }

    @Override
    public void onPluginDisable() {
        // Called at the start of onDisable().
        // DatabaseManagers registered via sqliteDatabase() are closed automatically afterwards.
    }
}
```

## What NotPlugin sets up for you

| What                       | How to access          | When available           |
| -------------------------- | ---------------------- | ------------------------ |
| Folia-safe async scheduler | `scheduler()`          | `initPlugin()` and later |
| Config file manager        | `getCfm()`             | `initPlugin()` and later |
| Folia async executor       | `foliaAsyncExecutor()` | `initPlugin()` and later |
| Database auto-close        | automatic              | on `onDisable()`         |

## Built-in database factory

The fastest way to create a database — executor and lifecycle are wired automatically:

```java
private DatabaseManager db;

@Override
public void initPlugin() {
    db = sqliteDatabase(getDataFolder(), "data").build();
    db.registerCached(PlayerProfile.class);
}
```

See the [Database](/database/getting-started/) section for full details.

## Registering listeners and commands

```java
@Override
public void initPlugin() {
    addListener(new MyListener(this));
    addCommandGroup(new MyCommandGroup(this));
}
```

Listeners and commands are automatically registered after `initPlugin()` completes —
you don't need to call `Bukkit.getPluginManager().registerEvents()` yourself.

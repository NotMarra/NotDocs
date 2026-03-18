---
title: Config
description: Managing YAML configuration files with NotLib.
sidebar:
  order: 1
---

`ConfigFileManager` (accessible via `getCfm()` in `NotPlugin`) manages all YAML config files —
auto-updating missing keys, preserving comments and watching directories for user-added files.

## Basic config

`config.yml` is loaded automatically by `NotPlugin`. Access it via the standard Bukkit API:

```java
String motd = getConfig().getString("motd", "Welcome!");
```

## Additional config files

Register extra files in `initPlugin()`:

```java
@Override
public void initPlugin() {
    saveDefaultConfig("messages.yml");   // copies from jar if missing
    // then access via:
    FileConfiguration messages = getSubConfig("messages.yml");
    String joinMsg = messages.getString("join", "Welcome!");
}
```

## Auto-update

When `autoUpdate` is enabled (default), missing keys are added from the bundled resource
on every load or reload — without overwriting values the user has already set.

```java
cfm.register("messages.yml", ConfigOptions.builder()
        .autoUpdate(true)
        .preserveComments(true)
        .build());
```

## Reloading

```java
getSubConfig("messages.yml"); // reads current in-memory state

// Force reload from disk + trigger onConfigReload on all Configurables
reloadConfig("messages.yml");
```

## Directory watching

Load every `.yml` file inside a folder, including ones users add themselves:

```java
// in initPlugin():
watchUserDirectory("arenas");
// OR seed with an example file from the jar:
watchUserDirectory("arenas", ConfigOptions.builder()
        .seedFile("arenas/example.yml")
        .build());
```

You can also bundle multiple default files via `watchResourceDirectory`:

```java
// Copies all files from the jar's "languages/" folder on first startup,
// then also loads any extra files users add to the folder.
watchResourceDirectory("languages");
```

## Configurable interface

Implement `Configurable` on any class that needs to react to config reloads:

```java
public class MessageManager implements Configurable {

    private String joinMessage;

    @Override
    public List<String> getConfigPaths() {
        return List.of("messages.yml");
    }

    @Override
    public void onConfigReload(List<String> paths) {
        joinMessage = plugin.getSubConfig("messages.yml")
                .getString("join", "Welcome!");
    }
}
```

Register in `initPlugin()`:

```java
registerConfigurable(new MessageManager());
// onConfigReload is called immediately and on every subsequent reload
```

## ConfigOptions reference

| Option                       | Default | Description                                              |
| ---------------------------- | ------- | -------------------------------------------------------- |
| `autoUpdate(boolean)`        | `true`  | Add missing keys from resource template                  |
| `preserveComments(boolean)`  | `true`  | Keep YAML comments during auto-update                    |
| `copyFromResources(boolean)` | `true`  | Copy file from jar if it doesn't exist on disk           |
| `logAddedKeys(boolean)`      | `true`  | Log each key added during auto-update                    |
| `seedFile(String)`           | `null`  | Resource path of an example file for watched directories |

Convenience factories: `ConfigOptions.defaults()`, `ConfigOptions.userManaged()`, `ConfigOptions.noAutoUpdate()`.

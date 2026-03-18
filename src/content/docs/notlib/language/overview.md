---
title: Language Manager
description: Server-wide localisation with prefix, placeholders and config-driven locale switching.
sidebar:
  order: 1
---

`LanguageManager` loads messages from YAML files in a watched directory,
injects a configurable prefix and resolves placeholders via the [`Text`](/notlib/chat/overview/) system.
The active locale is driven by `config.yml` — no code change needed to switch language.

## Directory layout

```text
plugins/MyPlugin/
  languages/
    en_US.yml   ← default / fallback
    cs_CZ.yml
    de_DE.yml
```

## config.yml

```yaml
language:
  default: "en_US" # change to switch the entire server to another locale
```

On `/reload` the new locale is picked up automatically — no restart required.

## YAML file format

```yaml
# languages/en_US.yml
prefix: "<gray>[<aqua>MyPlugin</aqua>]</gray> "

player:
  join: "%prefix%<green>%player% joined the server!"
  quit: "%prefix%<red>%player% left."
  level_up: "%prefix%<yellow>%player% reached level %level%!"

error:
  no_permission: "%prefix%<red>You don't have permission."
  player_only: "%prefix%<red>Only players can use this command."

economy:
  balance: "%prefix%Your balance: <gold>%amount% coins</gold>"
  paid: "%prefix%You paid <gold>%amount%</gold> to <aqua>%target%</aqua>."
```

`%prefix%` is a special built-in token replaced with the `prefix` key from the same file.
All other `%tokens%` are custom placeholders filled in with `.with()`.

## Setup inside NotPlugin

```java
private LanguageManager lang;

@Override
public void initPlugin() {
    lang = languageManager()            // pre-wired with plugin's CFM
            .defaultLocale("en_US")     // fallback if config key is absent
            .seedFile("languages/en_US.yml")
            .build();
}
```

Standalone (outside `NotPlugin`):

```java
lang = LanguageManager.builder(plugin)
        .directory("languages")
        .defaultLocale("en_US")
        .seedFile("languages/en_US.yml")
        .build();
```

## Sending messages

### Basic

```java
lang.get("error.no_permission").sendTo(player);
```

### With placeholders

```java
lang.get("player.level_up")
    .with("%player%", player.getName())
    .with("%level%", newLevel)
    .sendTo(player);
```

### Built-in player placeholders

`.withPlayer()` registers a set of common placeholders in one call:

```java
lang.get("player.join")
    .withPlayer(player)   // %player%, %player_name%, %player_display%,
                          // %player_x/y/z%, %player_world%,
                          // %player_health%, %player_level%
    .sendTo(player);
```

### Custom placeholders

Any token works — use it in the YAML and call `.with()`:

```java
// YAML: "server.motd: "%prefix%Welcome to <bold>%server_name%</bold>!"
lang.get("server.motd")
    .with("%server_name%", "My Survival SMP")
    .sendTo(player);
```

The value can be a `String`, number, Adventure `Component`, or a `Text` object.

### Sending to multiple players

```java
lang.get("server.restart")
    .with("%time%", "5 minutes")
    .sendToAll(plugin.getServer().getOnlinePlayers());
```

### Broadcast

```java
lang.get("server.announcement")
    .with("%message%", text)
    .broadcast();
```

### Embedding in a larger Text

```java
Text combined = Text.empty()
    .append(lang.get("prefix").build())
    .append(lang.get("player.join").withPlayer(player).build());
player.sendMessage(combined.build());
```

## Reload

Language files and the active locale reload automatically with the rest of the plugin's
configs when using `languageManager()` inside `NotPlugin`. Manual reload:

```java
lang.reload();
```

## Available locales

```java
Set<String> locales = lang.availableLocales();
// → ["en_US", "cs_CZ", "de_DE"]

String active = lang.getDefaultLocale(); // → "en_US"
```

## Fallback chain

When resolving a key:

1. Key found in the **active locale** → used directly
2. Key **missing** → the key string itself is returned and a warning is logged

Missing keys never throw — the worst case is the player sees the raw key name.

## Builder reference

| Option                    | Default        | Description                                                       |
| ------------------------- | -------------- | ----------------------------------------------------------------- |
| `.directory(String)`      | `"languages"`  | Folder relative to plugin data folder                             |
| `.defaultLocale(String)`  | `"en_US"`      | Fallback when `language.default` is absent from config            |
| `.seedFile(String)`       | `null`         | Resource path copied to the directory on first startup            |
| `.configPath(String)`     | `"config.yml"` | Config file containing `language.default`                         |
| `.configFileManager(cfm)` | new instance   | Share an existing CFM (done automatically by `languageManager()`) |

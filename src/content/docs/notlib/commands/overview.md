---
title: Commands
description: Building Brigadier commands with NotLib.
sidebar:
  order: 1
---

NotLib wraps the Paper Brigadier command API with a fluent builder that handles
argument registration, permission checks, help generation and value retrieval.

## Basic command

```java
Command cmd = Command.of("mycommand", "Does something cool")
        .permission("myplugin.mycommand")
        .onExecute(c -> {
            c.getSender().sendMessage("Hello!");
        });
```

## Arguments

Arguments are chained with `.arg(...)`. Each argument type maps to a Brigadier argument:

```java
Command cmd = Command.of("give")
        .arg(new PlayerArg("target")
                .arg(new IntArg("amount")
                        .onExecute(c -> {
                            Player target = c.getPlayerV("target");
                            int amount = c.getIntegerV("target.amount");
                            // …
                        })));
```

### Available argument types

| Class               | Java type             | Description                |
| ------------------- | --------------------- | -------------------------- |
| `StringArg`         | `String`              | Single word                |
| `GreedyStringArg`   | `String`              | Rest of input              |
| `IntArg`            | `Integer`             | Integer number             |
| `LongArg`           | `Long`                | Long number                |
| `FloatArg`          | `Float`               | Float number               |
| `DoubleArg`         | `Double`              | Double number              |
| `BoolArg`           | `Boolean`             | `true` / `false`           |
| `PlayerArg`         | `Player`              | Online player              |
| `PlayersArg`        | `List<Player>`        | Player selector            |
| `EntityArg`         | `Entity`              | Single entity              |
| `EntitiesArg`       | `List<Entity>`        | Entity selector            |
| `PlayerProfilesArg` | `List<PlayerProfile>` | Player profiles (offline)  |
| `LiteralArg`        | —                     | Fixed keyword (subcommand) |

## Retrieving values

Use typed getters on the `Command` instance inside `onExecute`:

```java
.onExecute(c -> {
    String name    = c.getStringV("name");
    Integer level  = c.getIntegerV("level");
    Player target  = c.getPlayerV("target");
    Boolean flag   = c.getBooleanV("flag");
})
```

For nested arguments, use dot-notation paths:

```java
c.getIntegerV("target.amount")   // argument "amount" inside "target"
```

## Literal subcommands

```java
Command admin = Command.of("admin")
        .arg(new LiteralArg("reload")
                .permission("myplugin.admin.reload")
                .onExecute(c -> reload()))
        .arg(new LiteralArg("debug")
                .onExecute(c -> toggleDebug()));
```

## Help generation

```java
// Full tree
c.getSender().sendMessage(cmd.getHelp().build());

// Filtered to specific subcommands
c.getSender().sendMessage(cmd.getHelpFor(List.of("reload")).build());
```

## Registering in NotPlugin

```java
@Override
public void initPlugin() {
    addCommandGroup(new MyCommandGroup(this));
}
```

```java
public class MyCommandGroup extends CommandGroup {
    public MyCommandGroup(NotPlugin plugin) { super(plugin); }

    @Override
    public String getId() { return "mycommands"; }

    @Override
    public List<Command> getCommands() {
        return List.of(
            Command.of("mycommand").onExecute(c -> { … })
        );
    }
}
```

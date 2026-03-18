---
title: Text
description: Fluent Adventure component builder with MiniMessage, legacy color and placeholder support.
sidebar:
  order: 1
---

`Text` is a fluent builder around Adventure's `Component` system. It handles
**MiniMessage tags**, **legacy `&` color codes**, **placeholders**, click/hover events
and sends — all in one chainable API.

## Creating a Text

```java
// From a MiniMessage string (most common)
Text t = Text.of("<green>Hello <bold>world</bold>!");

// From a plain string + color
Text t = Text.of("Hello!", Colors.GREEN.get());

// From a raw Adventure Component
Text t = Text.of(someComponent);

// Empty (append to it later)
Text t = Text.empty();

// Newline
Text t = Text.newline();

// Bold shortcut
Text t = Text.ofBold("ALERT", Colors.RED.get());

// From legacy & codes
Text t = Text.ofLegacy("&aGreen &lbold &rtext");
```

## Appending content

All `append` methods return `this` for chaining.

```java
Text t = Text.empty()
    .append("<gray>Prefix</gray> ")   // MiniMessage string
    .append(player.name())            // Adventure Component
    .append(otherText)                // another Text
    .appendBold(" [VIP]", Colors.GOLD.get())
    .nl()                             // newline
    .appendLegacy("&eLegacy support too");
```

### Bulk appending

```java
text.appendMany("line 1", "line 2", "line 3");
text.appendMany(componentA, componentB);
text.appendMany(textA, textB);

text.appendListString(List.of("a", "b", "c"));
text.appendListString(List.of("a", "b"), Colors.AQUA.get());
text.appendListComponent(components);
text.appendListMessage(texts);
```

## Placeholders

Replace tokens in the base string with any value:

```java
Text.of("Hello, %player%! You are level %level%.")
    .replace("%player%", player.getName())
    .replace("%level%", 42)
    .replace("%rank%", Text.ofBold("Elite", Colors.GOLD.get()))  // can be a Text
    .sendTo(player);
```

The value can be a `String`, `Number`, `Component`, or `Text` — anything else uses `toString()`.

## Entity context

Bind a sender or target entity for built-in `%target_*%` placeholder resolution:

```java
Text.of("%target_name% is at %target_x%, %target_y%, %target_z%")
    .withTargetEntity(targetPlayer)
    .sendTo(sender);
```

Built-in target placeholders: `%target_name%`, `%target_x%`, `%target_y%`, `%target_z%`.

## Click events

```java
Text.of("Click me!")
    .click(audience -> audience.sendMessage(Component.text("Clicked!")))  // callback
    .clickOpenUrl("https://example.com")
    .clickCopyToClipboard("some-value");

// Callback with limited uses
text.clickWithOptions(3, Duration.ofMinutes(5), audience -> handle(audience));

// Infinite uses (default callback is single-use)
text.clickInfinite(audience -> handle(audience));
```

## Hover events

```java
Text.of("Hover over me")
    .hover("This is the tooltip")
    .hover(Text.of("<red>Colored tooltip"))
    .hoverEntity(someEntity);
```

## Building and sending

```java
// Build to Adventure Component
Component component = text.build();

// Build to MiniMessage string
String raw = text.buildString();

// Send directly
text.sendTo(player);
text.sendTo(audience);
```

## Legacy color conversion

`Text.of()` automatically converts legacy `&` codes mixed with MiniMessage:

| Input               | Result               |
| ------------------- | -------------------- |
| `&aGreen`           | `<green>Green`       |
| `&lBold`            | `<b>Bold`            |
| `&c&lRed bold`      | `<red><b>Red bold`   |
| `&#FF5500Hex`       | `<color:#FF5500>Hex` |
| `&x&F&F&5&5&0&0Hex` | `<color:#FF5500>Hex` |

Gradients are also converted from the legacy `{#from:middle:to}` format.

## Static utilities

```java
// Convert string to Component directly (skips Text wrapper)
Component c = Text.toComponent("<yellow>Hello");
Component c = Text.toComponentBold("Bold", Colors.RED.get());
Component c = Text.toComponentWithLegacy("&aLegacy");

// Convert any value to Text
Text t = Text.from(someObject); // handles String, Component, Text, or toString()
```

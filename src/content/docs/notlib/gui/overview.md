---
title: GUI
description: Building inventory GUIs with the NotLib GUI system.
sidebar:
  order: 1
---

NotLib's GUI system lets you build Bukkit inventory interfaces with a fluent API —
pattern layouts, nested containers, click handlers and animations.

## Creating a GUI

```java
GUI gui = GUI.create("My Shop")
        .rows(3);

gui.addButton(Material.DIAMOND, "Buy Diamond", 4,
        (event, container) -> {
            Player p = (Player) event.getWhoClicked();
            p.sendMessage("Purchased!");
        });

gui.open(player);
```

## Pattern layout

Define the inventory layout using a character grid, then map characters to items:

```java
GUI gui = GUI.create("Main Menu")
        .rows(3)
        .pattern("""
                #########
                #A#B#C###
                #########
                """)
        .emptySlotChars(List.of('#'))
        .onPatternMatch(info -> switch (info.ch) {
            case 'A' -> gui.createItem(Material.APPLE).name("Apples");
            case 'B' -> gui.createItem(Material.BREAD).name("Bread");
            case 'C' -> gui.createItem(Material.COOKED_BEEF).name("Steak");
            default  -> null;
        });
```

`GUIPatternMatchInfo` fields available inside the lambda:

| Field    | Type   | Description                                        |
| -------- | ------ | -------------------------------------------------- |
| `ch`     | `char` | The character at this position                     |
| `x`, `y` | `int`  | Grid coordinates                                   |
| `slot`   | `int`  | Absolute inventory slot                            |
| `count`  | `int`  | How many times this character has appeared so far  |
| `total`  | `int`  | Total occurrences of this character in the pattern |

## Items and buttons

```java
// Decorative item (no click handler)
gui.addItem(gui.createItem(Material.GRAY_STAINED_GLASS_PANE).name(" "), slot);

// Button with click handler
gui.addButton(Material.EMERALD, "Confirm", slot, (event, container) -> {
    event.setCancelled(true);
    handleConfirm((Player) event.getWhoClicked());
});
```

## Inventory types

Default is a double-chest (6 rows). Switch to other types:

```java
GUI.create("Furnace Menu").type(InventoryType.FURNACE);
GUI.create("Small Chest").rows(3);   // CHEST with 3 rows
```

## Open / close events

```java
gui.onOpen(event  -> log.info(event.getPlayer().getName() + " opened the GUI"));
gui.onClose(event -> log.info(event.getPlayer().getName() + " closed the GUI"));
```

## Containers

Containers are sub-regions of the GUI with their own item grid:

```java
GUIContainer sidebar = gui.createContainer(0, 0, 1, 6);  // x, y, width, height
sidebar.addItem(borderItem, 0, 0);
```

## Animations

```java
// Pulse animation on an item — runs on a Folia region scheduler automatically
gui.aPulse(40L, 10L);       // durationTicks, frames
gui.aBounce(60L, 8L);
gui.aInfinite(20L, 5L);
gui.aProgress(100L, 20L);

// Cancel all
gui.cancelAllAnimations();
```

Available animations: `aPulse`, `aBounce`, `aBackAndForth`, `easeInOut`, `aElastic`, `aInfinite`, `aProgress`, `aStep`.

## Refreshing

Call `refresh()` to redraw all items after state changes without reopening the inventory:

```java
gui.refresh();
```

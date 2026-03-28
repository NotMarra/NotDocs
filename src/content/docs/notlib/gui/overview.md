---
title: GUI
description: Building inventory GUIs with the NotLib GUI system.
sidebar:
  order: 1
---

NotLib's GUI system lets you build Bukkit inventory interfaces with a fluent API —
pattern layouts, nested containers, click handlers, player heads, custom textures,
and animations.

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

| Field    | Type                      | Description                                                                  |
| -------- | ------------------------- | ---------------------------------------------------------------------------- |
| `ch`     | `char`                    | The character at this position                                               |
| `x`, `y` | `int`                     | Grid coordinates                                                             |
| `slot`   | `int`                     | Absolute inventory slot                                                      |
| `count`  | `int`                     | How many times this character has appeared so far                            |
| `total`  | `int`                     | Total occurrences of this character in the pattern                           |
| `totals` | `Map<Character, Integer>` | Occurrence counts for every character in the pattern (useful for pagination) |

## Items and buttons

### Display name and lore

Item display names and lore lines no longer show with Minecraft's default italic.
Italic is stripped automatically on every `GUIItem.build()` call. If you
intentionally want the vanilla italic back, call `.keepItalic()`:

```java
// Normal — no italic (default)
gui.createItem(Material.DIAMOND).name("&bShiny Diamond").lore("Worth a lot");

// Opt back into vanilla italic
gui.createItem(Material.DIAMOND).name("Italic name").keepItalic();
```

Both legacy `&` colour codes and MiniMessage `<tag>` syntax are supported in
name and lore strings.

### Lore helpers

Multiple lore-setting methods are available depending on what you have at hand:

```java
GUIItem item = gui.createItem(Material.BOOK);

item.lore("Single line string");
item.lore(Text.of("Single &acoloured&r line"));
item.lore(someComponent);

// Typed list variants — no casting to List<Object> needed
item.loreStrings(List.of("Line one", "Line two"));
item.loreTexts(List.of(Text.of("&aGreen"), Text.of("&cRed")));
item.loreComponents(existingComponentList);
```

### Decorative items and buttons

```java
// Decorative item (no click handler)
gui.addItem(gui.createItem(Material.GRAY_STAINED_GLASS_PANE).name(" "), slot);

// Button — canPickUp is automatically set to false
gui.addButton(Material.EMERALD, "Confirm", slot, (event, container) -> {
    handleConfirm((Player) event.getWhoClicked());
});

// onClick is an alias for action()
gui.createItem(Material.EMERALD)
   .name("Confirm")
   .onClick((event, container) -> handleConfirm((Player) event.getWhoClicked()));
```

## Player heads and custom textures

Four approaches are available, from simplest to most flexible.

### Player head by player reference

```java
// By OfflinePlayer — most reliable, no network lookup
GUIItem head = GUIItem.playerHead(gui, player);

// Equivalent long form
GUIItem head = gui.createItem(Material.PLAYER_HEAD).skullOwner(player);
```

### Player head by username

```java
// Warning: may block the thread if the player has never joined before
GUIItem head = GUIItem.playerHead(gui, "Notch");
```

### Custom texture by hash

The hash is the trailing segment of a `textures.minecraft.net` URL.
For `http://textures.minecraft.net/texture/abc123` pass `"abc123"`.

```java
GUIItem head = GUIItem.customHead(gui, "abc123...");

// Equivalent long form
GUIItem head = gui.createItem(Material.PLAYER_HEAD).skullTexture("abc123...");
```

### Custom texture by base64 Value string

Use the full "Value" string from sites like
[minecraft-heads.com](https://minecraft-heads.com) (under "Other → For Developers").

```java
GUIItem head = GUIItem.customHeadBase64(gui, "eyJ0ZXh0dXJlcy...");

// Equivalent long form
GUIItem head = gui.createItem(Material.PLAYER_HEAD).skullTextureBase64("eyJ0ZXh0dXJlcy...");
```

### Full SkullMeta control

When none of the helpers above are sufficient, use the low-level callback.
It takes priority over all other skull helpers.

```java
gui.createItem(Material.PLAYER_HEAD)
   .onSkullMeta((item, skullMeta) -> {
       // mutate skullMeta however you need, then return it
       return skullMeta;
   });
```

All skull helpers automatically switch the material to `PLAYER_HEAD`.

## Inventory types

Default is a double-chest (6 rows × 9 columns). Switch to other types:

```java
GUI.create("Furnace Menu").type(InventoryType.FURNACE);
GUI.create("Hopper Menu").type(InventoryType.HOPPER);
GUI.create("Small Chest").rows(3);   // single CHEST with 3 rows
```

Use the constants in `GUISlotIDs` to reference slots by name instead of raw integers:

```java
GUI gui = GUI.create("Anvil").type(InventoryType.ANVIL);
gui.addButton(Material.PAPER, "Input", GUISlotIDs.AnvilSlots.LEFT, handler);
```

## Open / close events

```java
gui.onOpen(event  -> log.info(event.getPlayer().getName() + " opened the GUI"));
gui.onClose(event -> log.info(event.getPlayer().getName() + " closed the GUI"));
```

## Containers

Containers are sub-regions of the GUI with their own local coordinate grid.
Items are positioned relative to the container's origin, not the inventory.

```java
// createContainer(x, y, width, height)
GUIContainer sidebar = gui.createContainer(0, 0, 1, 6);
sidebar.addItem(borderItem, 0, 0);
```

### Building items inside a container

Use `container.item(material)` to get a `GUIItem` builder that is already
associated with the container, then add it explicitly:

```java
GUIContainer panel = gui.createContainer(1, 1, 7, 4);

panel.addItem(
    panel.item(Material.DIAMOND)
         .name("&bGem")
         .lore("Rare drop"),
    3  // local slot inside the container
);
```

You can also use the button shortcuts directly on a container:

```java
panel.addButton(Material.ARROW, "Back", 0, 0, (event, c) -> gui.open(player));
```

### Slot wrapping

By default, items that fall outside the inventory bounds are wrapped modulo
the inventory size. Disable this if you want out-of-bounds items discarded:

```java
GUIContainer c = gui.createContainer(7, 0, 4, 1).notWrapped();
```

## Animations

Animations produce a `float` progress value (typically 0–1) on every tick,
which you use to update item state. Call `start(Consumer<Float>)` to begin:

```java
gui.aPulse(40L, 10L).start(progress -> {
    int amount = Math.max(1, Math.round(progress * 64));
    myItem.amount(amount);
    // gui.refresh() is called automatically after each frame
});
```

All animation factory methods register the animation automatically.
`gui.refresh()` is called at the end of every frame so you don't have to.

| Method          | Effect                                          |
| --------------- | ----------------------------------------------- |
| `aPulse`        | Sine-wave oscillation between min and max value |
| `aBounce`       | Absolute-sine bounce                            |
| `aBackAndForth` | Linear ping-pong between 0 → 1 → 0              |
| `easeInOut`     | Cubic ease-in / ease-out                        |
| `aElastic`      | Elastic spring overshoot                        |
| `aInfinite`     | Continuous linear loop (never stops)            |
| `aProgress`     | Plain linear 0 → 1                              |
| `aStep`         | Discrete stepped jumps                          |

Make an animation loop indefinitely by calling `.inf()` on the returned instance:

```java
gui.aProgress(100L, 20L).inf().start(progress -> { /* … */ });
```

Cancel all running animations when you no longer need them:

```java
gui.cancelAllAnimations();
```

## Refreshing

Call `refresh()` to redraw all items after state changes without closing the inventory:

```java
gui.refresh();
```

## GUISlotIDs reference

`GUISlotIDs` contains named constants for every vanilla inventory type so you
never have to remember raw slot numbers.

```java
// Brewing Stand
GUISlotIDs.BrewingSlots.INGREDIENT   // 3
GUISlotIDs.BrewingSlots.LEFT         // 0

// Hopper (5-slot row)
GUISlotIDs.HopperSlots.FIRST         // 0
GUISlotIDs.HopperSlots.LAST          // 4

// Large chest (6-row double-chest)
GUISlotIDs.ChestLargeSlots.TOP_LEFT     // 0
GUISlotIDs.ChestLargeSlots.BOTTOM_RIGHT // 53

// Player inventory (when a chest is open)
GUISlotIDs.PlayerSlots.HELMET        // 39
GUISlotIDs.PlayerSlots.HOTBAR_FIRST  // 0
```

Available inner classes: `BrewingSlots`, `AnvilSlots`, `BeaconSlots`,
`CartographyTableSlots`, `BlastFurnaceSlots`, `EnchantingTableSlots`,
`FurnaceSlots`, `GrindstoneSlots`, `HopperSlots`, `LoomSlots`,
`SmithingTableSlots`, `SmokerSlots`, `StonecutterSlots`, `PlayerSlots`,
`ChestSmallSlots`, `ShulkerBoxSlots`, `ChestLargeSlots`, `DispenserSlots`,
`DropperSlots`, `CraftingTableSlots`.

---
title: Installation
description: How to add NotLib to your Paper/Folia plugin project.
sidebar:
  order: 1
---

NotLib requires **Java 21** and **Paper 1.21+** (Folia is also supported).

## Maven

```xml
<repositories>
    <repository>
        <id>jitpack.io</id>
        <url>https://jitpack.io</url>
    </repository>
</repositories>

<dependencies>
    <dependency>
        <groupId>com.github.NotMarra</groupId>
        <artifactId>NotLib</artifactId>
        <version>Tag</version>
    </dependency>
</dependencies>
```

## Gradle (Kotlin DSL)

```kotlin
repositories {
    maven('https://jitpack.io')
}

dependencies {
    implementation("com.github.NotMarra:NotLib:Tag")
}
```

## plugin.yml

Add NotLib as a dependency so Bukkit loads it before your plugin:

```yaml
depend:
  - NotLib
```

## Next steps

- [Create your first plugin with NotPlugin](/notlib/getting-started/notplugin/)
- [Set up a database](/notlib/database/getting-started/)

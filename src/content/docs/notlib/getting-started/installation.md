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
    <id>notmarra-repo</id>
    <url>https://repo.notmarra.dev/releases</url>
  </repository>
</repositories>

<dependencies>
  <dependency>
    <groupId>dev.notmarra</groupId>
    <artifactId>notlib</artifactId>
    <version>VERSION</version>
    <scope>provided</scope>
  </dependency>
</dependencies>
```

## Gradle (Kotlin DSL)

```kotlin
repositories {
    maven("https://repo.notmarra.dev/releases")
}

dependencies {
    compileOnly("dev.notmarra:notlib:VERSION")
}
```

## plugin.yml

Add NotLib as a dependency so Bukkit loads it before your plugin:

```yaml
depend:
  - NotLib
```

## Next steps

- [Create your first plugin with NotPlugin](/getting-started/notplugin/)
- [Set up a database](/database/getting-started/)

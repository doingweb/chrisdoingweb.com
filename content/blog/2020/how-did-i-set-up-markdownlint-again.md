---
title: How Did I Set Up Markdownlint Again?
subtitle: A quick way to gather up those files from all of your repositories.
date: 2020-10-08T12:19:46-07:00
tags:
  - notes
---

When starting a new project, there's always a number of configurations to set up. Of course, you could maintain templates to generate these things using some tool, but if you're like me and aren't starting a new project every other day, you might just ask yourself "Hey what did I do for this in the past? I think I'll just copy it from there."

<!--more-->

Here's what I do to grab my other Markdownlint configs for easy copying/comparison:

```console
$ find . -name ".markdownlint.json"
./chords-parser/.markdownlint.json
./chrisdoingweb.com/.markdownlint.json
./pi-recipe/.markdownlint.json
./chorda/.markdownlint.json
```

If you have your stuff set up right, you can even cmd+click to open those files right from your terminal!

Depending on what you're looking for, it may also be handy to exclude the files that _aren't_ yours. Here's an example with ESLint configs:

```console
$ find . -name ".eslintrc*" -not -path "*/node_modules/*"
./chords-parser/.eslintrc.js
./bookish-octo-succotash/tests/unit/.eslintrc.js
./bookish-octo-succotash/.eslintrc.js
./pantry/.eslintrc.js
./watney-plugin-nest/.eslintrc
./watney-plugin-example/.eslintrc
./watney-app/.eslintrc
./watney-plugin-spotify/.eslintrc
./watney-plugin-hue/.eslintrc
./watney/.eslintrc
./watney-plugin-dash-button/.eslintrc
./songbook/.eslintrc.js
./songbook/.cache/.eslintrc.json
./chorda/.eslintrc.js
```

# Thinreports Editor [![Join the chat at https://gitter.im/thinreports/thinreports-editor](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/thinreports/thinreports-editor?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[Thinreports](http://www.thinreports.org/) is an open source report generation tool for Ruby.

  * Thinreports Editor (GUI Designer)
  * Thinreports Generator (Report Generator for Ruby)

## Features

Features of Generator is [here](http://www.thinreports.org/features/generator/).

### Easy to use

Less special training, possible to create by drag&drop.

### Multi-platform

Currently supported platforms are Windows, Mac and Linux.

### I18n Support

Currently supported locales are Japanese and English.
Please [contribute to translate](https://github.com/thinreports/thinreports-editor/blob/master/doc/TRANSLATION.md)!

## Supported Platforms

 * macOS 10.12+
 * Windows 10+
 * Ubuntu 16.04+

## Getting Started

  * [Installation Guide](http://www.thinreports.org/documentation/getting-started/installation.html)
  * [Quick Start Guide](http://www.thinreports.org/documentation/getting-started/quickstart.html)
  * [Examples](https://github.com/thinreports/thinreports-examples)
  * [Discussion Group](https://groups.google.com/forum/#!forum/thinreports)

## Contributing

### Report bug, post your suggestion

If you find bugs or improvements for the Editor, please report it [here](https://github.com/thinreports/thinreports-editor/issues/new).

### Translating

See [doc/TRANSLATION.md](https://github.com/thinreports/thinreports-editor/blob/master/doc/TRANSLATION.md).

### Sending a Pull Request

  1. Fork it
  2. Clone your forked repository (**Note:** [How to clone the source of the Editor](#how-to-clone-the-source-of-the-editor))
  3. Create your feature branch: `git checkout -b my-new-feature`
  4. Fix. See [Developing](#developing) about how to develop.
  5. Commit your changes: `git commit -am 'Fixed some bugs'`
  6. Push to the branch: `git push origin my-new-feature`
  7. Create new Pull Request

## Development

### Requirements

  * [Java](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) 6+ (JDK)
  * [Python](https://wiki.python.org/moin/BeginnersGuide/Download) 2.7+

### Tasks

```
Install dependencies.
$ npm install

Launch Editor on development.
$ npm start

Compile javascript, css and html templates.
$ npm run compile

Build package for macOS, Windows, Ubuntu(linux).
$ npm run build

Run compilation and building on production.
$ npm run release
```

## License

Thinreports Editor is licensed under the [GPLv3](https://github.com/thinreports/thinreports-editor/blob/master/GPLv3).
Please see [LICENSE](https://github.com/thinreports/thinreports-editor/blob/master/LICENSE) for further details.

## Copyright

&copy; 2010-2015 [Matsukei Co.,Ltd](http://www.matsukei.co.jp).

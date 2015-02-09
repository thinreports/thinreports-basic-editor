# Thinreports Editor [![Join the chat at https://gitter.im/thinreports/thinreports-editor](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/thinreports/thinreports-editor?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[Thinreports](http://www.thinreports.org/) is an open source report generating tool for Ruby.

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

  * Windows XP/7/8/8.1
  * Mac OS X 10.7+
  * Linux (Ubuntu 14.04+)

## Getting Started

  * [Installation Guide](http://www.thinreports.org/documentation/getting-started/installation.html)
  * [Quick Start Guide](http://www.thinreports.org/documentation/getting-started/quickstart.html)
  * [Examples](https://github.com/thinreports/thinreports-examples)
  * [Discussion Group](https://groups.google.com/forum/#!forum/thinreports)
  * [![Join the chat at https://gitter.im/thinreports/thinreports-editor](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/thinreports/thinreports-editor?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Contributing

### Report bug, post your suggestion

If you find bugs or improvements for the Editor, please report it [here](https://github.com/thinreports/thinreports-editor/issues/new).

### Translating

See [doc/TRANSLATION.md](https://github.com/thinreports/thinreports-editor/blob/master/doc/TRANSLATION.md).

### Sending a Pull Request

  1. Fork it
  2. Clone your forked repository (**Note:** [How to clone the source of the Editor](#how-to-clone-the-source-of-the-Editor))
  3. Create your feature branch: `git checkout -b my-new-feature`
  4. Fix. See [Developing](#developing) about how to develop.
  5. Commit your changes: `git commit -am 'Fixed some bugs'`
  6. Push to the branch: `git push origin my-new-feature`
  7. Create new Pull Request

## Developing

### Requirements

  * Chrome Browser
  * Git
  * [Java](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) 6+ (JDK)
  * [Python](https://wiki.python.org/moin/BeginnersGuide/Download) 2.7+
  * [Ruby](https://www.ruby-lang.org/ja/) 2.0+ and [Rake](https://rubygems.org/gems/rake)

### References for developing

  * [Google Closure Library](https://developers.google.com/closure/library/)
  * [Closure Library API Documentation](http://docs.closure-library.googlecode.com/git/index.html)
  * [Finding Your Way around the Closure Library](https://developers.google.com/closure/library/docs/introduction)
  * [Getting Started with the Closure Library](https://developers.google.com/closure/library/docs/gettingstarted)
  * [Annotating JavaScript for the Closure Compiler](https://developers.google.com/closure/compiler/docs/js-for-compiler)

### Basic Development Flow

  1. Fix your feature
  2. Rebuild script dependency as needed (See [How to rebuild script dependency](#how-to-rebuild-script-dependency))
  3. Check operation of your fixes (See [How to launch development version of the Editor](#how-to-launch-development-version-of-the-editor))
  4. Build production version of the Editor (See [How to build production version of the Editor](#how-to-build-production-version-of-the-editor))
  5. Check compilation error (See [How to build production version of the Editor](#how-to-build-production-version-of-the-editor))
  6. Check operation of your fixes (See [How to launch production of the Editor](#how-to-launch-production-of-the-editor))

### How to clone the source of the Editor

    $ git clone https://github.com/thinreports/thinreports-editor.git
    $ cd thinreports-editor/
    $ git submodule update --init

### How to launch development version of the Editor

See [Step5: Launch your App - ChromeApp Reference](https://developer.chrome.com/apps/first_app#five) to learn how to launch ChromeApp. Then, specify `thinreports-editor/src` to lanuch.

### How to rebuild script dependency

If you edited `goog.require()` or `goog.provide()`, you have to run the following command in order to rebuild the dependency. See [Finding Your Way around the Closure Library](https://developers.google.com/closure/library/docs/introduction) for learning the Closure Library Namespace.

```
$ cd thinreports-editor
$ rake dev:calcdeps
```

Thereby, script list in `thinreports-editor/src/app.html` will be rebuilt.

### How to build production version of the Editor

Run thw following command:

```
$ cd thinreports-editor
$ rake build
```

This command executes the following processing:

  1. Delete `thinreports-editor/package` directory if exists
  2. Create `thinreports-editor/package` directory
  3. Copy `src/{app.html,app.js,background.js,manifest.js,locales}` to package directory
  4. Create `package/assets` directory to copy `src/assets/{fonts,iconfs}` to `package/assets` directory
  5. Compile `src/assets/*.css` to create `src/assets/style.css`
  6. Append compiled script to `package/app.js`
  7. Rebuild script list in `package/app.html`

See [thinreports-editor/Rakefile](https://github.com/thinreports/thinreports-editor/blob/master/Rakefile) for further details.

### How to launch production of the Editor

See [How to lanuch development version of the Editor](#how-to-launch-development-version-of-the-editor),
however you need to specify `thinreports-editor/package` directory as app folder for launching production version of the Editor.

Then, **you must be sure that there are no syntax errors or warnings** to see the `thinreports-editor/dev/tmp/javascript-compile.log`.

**Note:** Currentry the following errors will be logged in the log file, but you can ignore that.

```
/path/to/thinreports-editor/src/lib/closure-library/closure/goog/fx/dom.js:209: WARNING - Parse error. Non-JSDoc comment has annotations. Did you mean to start it with '/**'?
  /*
^

/path/to/thinreports-editor/src/lib/closure-library/closure/goog/fx/dom.js:216: WARNING - Parse error. Non-JSDoc comment has annotations. Did you mean to start it with '/**'?
  /*
^

0 error(s), 2 warning(s)
```

### Guidelines

  * JavaScript Annotation required. Syntax and Examples of Annotation is [here](https://developers.google.com/closure/compiler/docs/js-for-compiler)

### Development Tasks

You can see the following task list by running `rake -T`.

```
rake dev:build_template  # Compile template of the specification sheet to JavaScript
rake dev:calcdeps        # Calculates core JavaScript dependencies
rake dev:check           # Check structure and syntax of scripts by testing compilation
rake package:build       # Build a release package
rake package:cleanup     # Clean up package
```

## License

Thinreports Editor is licensed under the [GPLv3](https://github.com/thinreports/thinreports-editor/blob/master/GPLv3).
Please see [LICENSE](https://github.com/thinreports/thinreports-editor/blob/master/LICENSE) for further details.

## Copyright

&copy; 2010-2015 Thinreports.org, sponsored by [Matsukei Corp](http://www.matsukei.co.jp).

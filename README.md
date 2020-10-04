# Thinreports Editor

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
Please [contribute to translate](https://github.com/thinreports/thinreports-editor/blob/master/TRANSLATION.md)!

## Supported Platforms

We tested the following platform:

 * macOS 10.15
 * Windows 10
 * Ubuntu 18.04, 20.04

## Supported Layout versions

Support a layout file that created/modified with 0.9.0+ Editor.

## Getting Started

  * [Installation Guide](http://www.thinreports.org/documentation/getting-started/installation.html)
  * [Quick Start Guide](http://www.thinreports.org/documentation/getting-started/quickstart.html)
  * [Examples](https://github.com/thinreports/thinreports-examples)
  * [Discussion Group](https://groups.google.com/forum/#!forum/thinreports)

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/thinreports/thinreports-editor.

### Translating for your language

See [TRANSLATION.md](https://github.com/thinreports/thinreports-editor/blob/master/TRANSLATION.md).

## Development

### Requirements

  * JDK 6+
  * Python 2.7
  * Node.js

### Getting Started

Install dependencies:
```
$ npm install
```

Compile javascript, css and templates:
```
$ npm run compile
```

Launch Editor on development:
```
$ npm start
```

### Other Tasks

Watch and compile:
```
$ npm run watch
```

Build package for macOS, Windows, Ubuntu(linux):
```
$ npm run build
```

Run compilation and building on production:
```
$ npm run release
```

### Compiling using Docker Container

Or if you can use docker, you can compile script and css:

```
$ docker build -t thinreports-editor:latest .
$ docker run --rm -v $PWD:/src:cached thinreports-editor:latest
Compiling JavaScript with SIMPLE_OPTIMIZATIONS...
```

And, launch electron on development:

```
$ npm start
```

## Releasing Editor

This steps are for releasing a new version of Editor.

### 1. Update to the new version

The following two files need to be updated.

- app/editor/version.js
- app/package.json

### 2. Update documents

- CHANGELOG.md (required)
- README.md (if needed)

### 3. Push them to `build/release-x.x.x` branch and test the built packages for each platform

Pushing to `build/*` branch runs a job to build the package. Make sure that the built packages for each platform work properly. You can download the packages from the artifact of the build. For more information, see [Build workflow](.github/workflows/build.yml).

### 4. Create pullrequest

If there is no problem, create a pullrequest.

### 5. Merge pullrequest and push tag

Pushing a tag runs a job to build and release package. Check the followings:

- Correct version and content of the release
- All package files are attached to the release

## License

Thinreports Editor is licensed under the [GPLv3](https://github.com/thinreports/thinreports-editor/blob/master/GPLv3).
Please see [LICENSE](https://github.com/thinreports/thinreports-editor/blob/master/LICENSE) for further details.

## Copyright

&copy; 2010-2015 [Matsukei Co.,Ltd](http://www.matsukei.co.jp).

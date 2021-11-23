# Basic Editor

[![[basic-editor] Test](https://github.com/thinreports/thinreports-editor/actions/workflows/basic-editor-test.yml/badge.svg)](https://github.com/thinreports/thinreports-editor/actions/workflows/basic-editor-test.yml)

A editor for editing a [Basic Format](https://github.com/thinreports/thinreports/blob/main/getting-started/basic-format.md) template.

## Prerequisites

### Supported Platforms

 * macOS 10.15+
 * Windows 10
 * Ubuntu 18.04+

## Installation

Please download the package from [the Releases](https://github.com/thinreports/thinreports-editor/releases) and install it.

## Development

### Requirements

  * JDK 6+
  * Python 2.7
  * Node.js

### Launching the development version app

Install dependencies:
```
npm install
```

Compile javascript, css and templates:
```
npm run compile
```

Launch Editor on development:
```
npm start
```

### Tips

Watch and compile:
```
npm run watch
```

Build package for macOS, Windows, Ubuntu(linux):
```
npm run build
```

Run compilation and building the production version app:
```
npm run release
```

### Compiling using Docker Container

Or if you can use docker, you can compile script and css:

```
docker build -t thinreports-editor:latest .
docker run --rm -v $PWD:/src:cached thinreports-editor:latest
Compiling JavaScript with SIMPLE_OPTIMIZATIONS...
```

And, launch electron on development:

```
npm start
```

## Releasing

This steps are for releasing a new version of Editor.

### 1. Update to the new version

The following two files need to be updated.

- app/editor/version.js
- app/package.json

### 2. Update documents

- CHANGELOG.md (required)
- README.md (if needed)

### 3. Push them to `basic-editor-build/release-x.x.x` branch and test the built packages for each platform

Pushing to `basic-editor-build/*` branch runs a job to build the package. Make sure that the built packages for each platform work properly. You can download the packages from the artifact of the build. For more information.

### 4. Create pull request

If there is no problem, create a pull request.

### 5. Merge pull request and push tag

Pushing a tag runs a job to build and release package. Check the followings:

- Correct version and content of the release
- All package files are attached to the release

## License

Thinreports Editor is licensed under the [GPLv3](https://github.com/thinreports/thinreports-editor/blob/master/GPLv3).
Please see [LICENSE](https://github.com/thinreports/thinreports-editor/blob/master/LICENSE) for further details.

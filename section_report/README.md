# SectionReport

A section-report format is a new template file format that is proposed at [the feature concept by Thinreports community](https://github.com/thinreports/thinreports/issues/7).

## Original Format is Not Supported

This editor only supports the section-report format file.

## Getting Started

### Installing

Download the package for your environment from the latest release of the version `v1.0.0-sectionreport.*` on the [releases page](https://github.com/misoca/thinreports-editor/releases).

#### Linux

After downloading the AppImage, you may need to grant execution permission as follows:

```
$ chmod +x *.AppImage
```

#### macOS

This app is not signed. You need to authorize as a third-party app at first.

## Examples

See [misoca/thinreports-generator examples](https://github.com/misoca/thinreports-generator/blob/section-report/README_FOR_SECTION_REPORT.md#examples).

## Implementation Status

Here is the current implementation status based on [the feature concept by Thinreports community](https://github.com/thinreports/thinreports/issues/7)

### Not Implemented

- changing the paper size and the margins
  - Default paper size is A4 and the page margins are 0
- save file as
- resizing an item by dragging and dropping
- selecting multiple items
- changing properties of multiple items at once
- aligning item positions and arranging item sizes
- i18n
   - Supports Japanese only
- changing color with the color palette
- shortcut keys
   - move, delete, copy and paste item
   - save file
- property value validation
   - validating the uniqueness of ID
   - validating the format of input values
- text-block `reference-id` attribute
- moving and resizing sections by dragging and dropping
- moving and resizing stack-view-rows by dragging and dropping

### Additional Features

- stack-view item
  - See [StackView](https://github.com/misoca/thinreports-generator/blob/section-report/test/features/section_report_stack_view/README.md) for details
- object tree pane
  - List the objects such as sections, stack-views and items in the current template as a tree structure
  - Current selected object is highlighted. You can also change the selection on the object tree pane
- A template file contains the schema-version attribute, which means the version of the format
- Schema validation based on the JSON Schema defined in [schema.json](src/store/lib/layout-schema/schema.json) when saving a file

See also [Additional Features for misoca/thinreports-generator](https://github.com/misoca/thinreports-generator/blob/section-report/README_FOR_SECTION_REPORT.md#additional-features).

### Changes for the line-height calculation

The line-height calculation method in the original editor has a problem that the result depends on the environment such as display resolution.
Therefore, the calculation method in this editor has been changed as follows:

- The original editor
  - `line-height-ratio = (height calculated from the drawn text) * line-height`
- This editor
  - `line-height-ratio = font-size * line-height`

## Development

### Prerequisites

- Node.js `>= 14.0`
- npm `>= 6.0`

### Setting up

```
$ cd section_report/
$ npm install
```

### Launching the app for development

```
$ npm run electron:serve
```

Or if you want to develop in a browser:

```
$ npm run serve
```

Then, open http://localhost:8080 in your browser.

### Running unit tests

```
$ npm run test:units
```

### Running lint

```
$ npm run lint
```

Or if you don't want auto-correct:

```
$ npm run test:lint
```

### Building the app for production

```
$ npm run build
```

### Building the package for production

```
$ npm run electron:build
```

See `npx vue-cli-service help` for other available commands.

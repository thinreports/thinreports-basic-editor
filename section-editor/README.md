# Section Editor

[![[Test] Test](https://github.com/thinreports/thinreports-editor/actions/workflows/section-editor-test.yml/badge.svg?branch=master)](https://github.com/thinreports/thinreports-editor/actions/workflows/section-editor-test.yml)

An editor for editing NEW section-format templates. However, this is currentry under development.

## Current Status

Under development

## Getting Started

There is currently no production version package available. If you want to use the Section Report Editor, you will need to build and run the development version.

### Prerequisites

- Node.js >= 14.0
- npm >= 6.0

### Launching the development version editor

```
cd section-editor/
npm ci
npm run electron:serve
```

## Specifications and Examples

Each example includes a description of the specifications, a Ruby code, a template file, and an output PDF file.

- [Basic Usage](https://github.com/thinreports/thinreports-generator/tree/master/test/features/section_report_basic/README.md): a concept and basic usages of the section report format
- [Multiple Groups](https://github.com/thinreports/thinreports-generator/tree/master/test/features/section_report_multiple_groups/README.md): specifications of a `groups` parameter
- [Section Auto Stretch](https://github.com/thinreports/thinreports-generator/tree/master/test/features/section_report_section_auto_stretch/README.md): auto strech specifications of sections
- [Section Bottom Margin](https://github.com/thinreports/thinreports-generator/tree/master/test/features/section_report_section_bottom_margin/README.md): bottom margin specifications of sections
- [Section Parameters](https://github.com/thinreports/thinreports-generator/tree/master/test/features/section_report_section_parameters/README.md): parameter specifications of sections
- [Item Follow Stretch](https://github.com/thinreports/thinreports-generator/tree/master/test/features/section_report_item_follow_stretch/README.md): specifications of how the containing item is stretched by sections or stack-view-rows
- [Item Parameters](https://github.com/thinreports/thinreports-generator/tree/master/test/features/section_report_item_parameters/README.md): parameter specifications of items (rectangles etc.)
- [StackView](https://github.com/thinreports/thinreports-generator/tree/master/test/features/section_report_stack_view/README.md): specifications of the stack-view tool, which we added independently
- [StackViewRow Auto Stretch](https://github.com/thinreports/thinreports-generator/tree/master/test/features/section_report_stack_view_row_auto_stretch/README.md): auto stretch specifications of stack-view-rows (same as sections)
- [StackViewRow Bottom Margin](https://github.com/thinreports/thinreports-generator/tree/master/test/features/section_report_stack_view_row_bottom_margin/README.md): bottom margin specifications of stack-view-rows (same as sections)
- [StackViewRow Parameters](https://github.com/thinreports/thinreports-generator/tree/master/test/features/section_report_stack_view_row_parameters/README.md): parameter specifications of stack-view-rows
- [StackView with Floating Item](https://github.com/thinreports/thinreports-generator/tree/master/test/features/section_report_stack_view_with_floating_item/README.md): how to place items outside of stack-view-rows and its specifications
- [Nonexistent Id](https://github.com/thinreports/thinreports-generator/tree/master/test/features/section_report_nonexistent_id/README.md): specifications when a non-existent section or item is specified as a parameter
- [TextBlock Vertical Align](https://github.com/thinreports/thinreports-generator/tree/master/test/features/section_report_text_block_vertical_align/README.md): vertical alignment specifications when a text-block has a `overflow: expand` attribute

## Developing

See `npx vue-cli-service help` for other available commands.

### Running tests

```
npm run test:unit
```

### Running lint

```
npm run lint
```

Or if you don't want auto-correct:

```
npm run test:lint
```

### Building the app for production

```
npm run build
```

### Building the package for production

```
npm run electron:build
```

## Related Issues and pull requests

- [Issue: New Report Type: Section Report (Official proposal)](https://github.com/thinreports/thinreports/issues/7)
- [Issue: Implement "New Report Type: Section Report"](https://github.com/thinreports/thinreports/issues/12)
- [Pull request: Add a new editor for the sectoin-report format](https://github.com/thinreports/thinreports-editor/pull/87)

import BigNumber from 'bignumber.js';
import _cloneDeep from 'lodash.clonedeep';
import { RectItem, LineItem, TextItem, TextBlockItem, ImageBlockItem, ImageItem, StackViewItem, BoundingBox, StackViewRow, StackViewItemBounds, BoundingPoints } from '@/types';

export const round = (value: number, digits = 2) => new BigNumber(value).decimalPlaces(digits, BigNumber.ROUND_HALF_UP).toNumber();

export const roundBoundingBox = (boundingBox: BoundingBox): BoundingBox => {
  return {
    x: round(boundingBox.x),
    y: round(boundingBox.y),
    width: round(boundingBox.width),
    height: round(boundingBox.height)
  };
};

export const roundBoundingPoints = (boundingPoints: BoundingPoints): BoundingPoints => {
  return {
    x1: round(boundingPoints.x1),
    y1: round(boundingPoints.y1),
    x2: round(boundingPoints.x2),
    y2: round(boundingPoints.y2)
  };
};

export const roundRectItem = (item: RectItem): RectItem => {
  return {
    ..._cloneDeep(item),
    ...roundBoundingBox(item)
  };
};

export const roundLineItem = (item: LineItem): LineItem => {
  return {
    ..._cloneDeep(item),
    x1: round(item.x1),
    y1: round(item.y1),
    x2: round(item.x2),
    y2: round(item.y2)
  };
};

export const roundTextItem = (item: TextItem): TextItem => {
  const newItem = {
    ..._cloneDeep(item),
    ...roundBoundingBox(item)
  };

  if (newItem.style.letterSpacing !== '') {
    newItem.style.letterSpacing = round(newItem.style.letterSpacing, 1);
  }

  return newItem;
};

export const roundTextBlockItem = (item: TextBlockItem): TextBlockItem => {
  const newItem = {
    ..._cloneDeep(item),
    ...roundBoundingBox(item)
  };

  if (newItem.style.letterSpacing !== '') {
    newItem.style.letterSpacing = round(newItem.style.letterSpacing, 1);
  }

  return newItem;
};

export const roundImageBlockItem = (item: ImageBlockItem): ImageBlockItem => {
  return {
    ..._cloneDeep(item),
    ...roundBoundingBox(item)
  };
};

export const roundImageItem = (item: ImageItem): ImageItem => {
  return {
    ..._cloneDeep(item),
    ...roundBoundingBox(item)
  };
};

export const roundStackViewItem = (item: StackViewItem): StackViewItem => {
  const roundedBounds: StackViewItemBounds = {
    x: round(item.x),
    y: round(item.y),
    width: round(item.width)
  };
  return {
    ..._cloneDeep(item),
    ...roundedBounds
  };
};

export const roundStackViewRow = (row: StackViewRow): StackViewRow => {
  return {
    ..._cloneDeep(row),
    height: round(row.height)
  };
};

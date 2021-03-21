import { calcPlus, calcMinus, calcDiv } from './strict-calculator';
import { BoundingPoints, BoundingBox, Coords, EllipseItemBounds } from '@/types';

export class BoundsTransformer {
  bounds: BoundingPoints;

  static fromBBox (bBox: BoundingBox) {
    return new BoundsTransformer({
      x1: bBox.x,
      y1: bBox.y,
      x2: calcPlus(bBox.x, bBox.width),
      y2: calcPlus(bBox.y, bBox.height)
    });
  }

  constructor (bounds: BoundingPoints) {
    this.bounds = bounds;
  }

  relativeFrom (coords: Coords): BoundsTransformer {
    return new BoundsTransformer({
      x1: calcMinus(this.bounds.x1, coords.x),
      y1: calcMinus(this.bounds.y1, coords.y),
      x2: calcMinus(this.bounds.x2, coords.x),
      y2: calcMinus(this.bounds.y2, coords.y)
    });
  }

  expand (coords: Coords): BoundsTransformer {
    return new BoundsTransformer({
      x1: calcPlus(this.bounds.x1, coords.x),
      y1: calcPlus(this.bounds.y1, coords.y),
      x2: calcPlus(this.bounds.x2, coords.x),
      y2: calcPlus(this.bounds.y2, coords.y)
    });
  }

  toBPoints (): BoundingPoints {
    return { ...this.bounds };
  }

  toBBox (): BoundingBox {
    return {
      x: Math.min(this.bounds.x1, this.bounds.x2),
      y: Math.min(this.bounds.y1, this.bounds.y2),
      width: Math.abs(calcMinus(this.bounds.x2, this.bounds.x1)),
      height: Math.abs(calcMinus(this.bounds.y2, this.bounds.y1))
    };
  }
}

export const convertBPointsToEllipseItemBounds = (bPoints: BoundingPoints): EllipseItemBounds => {
  const bBox = new BoundsTransformer(bPoints).toBBox();
  const rx = calcDiv(bBox.width, 2);
  const ry = calcDiv(bBox.height, 2);

  return {
    cx: calcPlus(bBox.x, rx),
    cy: calcPlus(bBox.y, ry),
    rx,
    ry
  };
};

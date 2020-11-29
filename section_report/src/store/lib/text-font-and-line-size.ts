import { calcMul } from '../../lib/strict-calculator';
import { round } from '@/lib/round-float-values';
import { FontAndLineSize } from '@/types';

// TODO: Move implementation to TextItemBuilder

const NORMAL_LINE_HEIGHT_RATIO = 1.1;

export const computeTextLineHeight = ({ fontSize, lineHeightRatio }: Omit<FontAndLineSize, 'lineHeight'>): FontAndLineSize['lineHeight'] => {
  const computedRatio = lineHeightRatio === '' ? NORMAL_LINE_HEIGHT_RATIO : lineHeightRatio;
  return round(calcMul(fontSize, computedRatio));
};

export const computeTextFontAndLineSize = ({ fontSize, lineHeightRatio }: Omit<FontAndLineSize, 'lineHeight'>): FontAndLineSize => {
  const computedFontSize = round(fontSize, 1);
  const computedLineHeightRatio = lineHeightRatio !== '' ? round(lineHeightRatio) : '';

  return {
    fontSize: computedFontSize,
    lineHeightRatio: computedLineHeightRatio,
    lineHeight: computeTextLineHeight({
      fontSize: computedFontSize,
      lineHeightRatio: computedLineHeightRatio
    })
  };
};

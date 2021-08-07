# Canvas Coordinate System

Editor の Report デザインの表示・操作は SVG によって実現されており、その中には複数の座標系が存在する。ここでは、その座標系がどのように構成されているかを説明する。

## 座標系の構造

![](images/canvas-coordinate-system.svg)
([Google図形描画](https://docs.google.com/drawings/d/1FbyK6-qXtgvXg33EHN0Gleu_aycb9qZP38OzqjumhrE/edit))

各セクションに StackView が含まれる場合は、その StackView 及び StackViewRow の座標系も作成されることになる。

## 座標系の分類と呼称

座標系の分類・呼称を定義する。

### Root Coordinates

SVGドキュメントの座標系。「座標系の構造」の SVG(赤枠短径)。

### Report Coordinates

レポートの座標系。「座標系の構造」の Report Canvas(紫枠短径)。

### Canvas (Local) Coordinates

四角形等の各図形を描画するキャンバスの座標系。「座標系の構造」の Section Canvas 及び StackView。


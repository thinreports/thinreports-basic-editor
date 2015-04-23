## 0.8.0

Editor 0.8.0 Released. It has ChromeApp version and DesktopApp version.
DesktopApp version will abolished in the next major version (1.0.0).
Therefore, **ChromeApp version is recommended, DesktopApp version is deprecated**.

### ChromeApp

* New design for ChromeApp version #22
* Split the button for exporting document into per filetype
* Change official name from ThinReports to Thinreports #19
* Improvement of combobox selection operation #37
* Windowsのテーマをクラシックに設定するとテキストツールが正常に表示されない #11
* Thinreport Editor auto close when right click #10
* レイアウト定義書におけるページ番号ツールのカウント対象が一覧表の場合、表示されない
* Does not resize the outline after updating content of the text in Property #42

#### DesktopApp

**[DEPRECATION] DesktopApp ver is deprecated.  Please use ChromeApp ver instead.**

* Change official name from ThinReports to Thinreports #19
* Improvement of combobox selection operation #37
* レイアウト定義書におけるページ番号ツールのカウント対象が一覧表の場合、表示されない
* Does not resize the outline after updating content of the text in Property #42

## 0.7.7.2

### Bug fixes

* When paper type is "user", paper orientation is not applied #9
* The format of the PageNumber tool is not copied #8
* 用紙のサイズでuserを使用して作成したtlfが使用出来ません #7

## 0.7.7.1

### Features

* Linux (32bit/64bit) version released

### Bug fixes

* Crash in OSX 10.8+
* 表の各セクションに対する高さ、表示のプロパティを入力すると予期せぬエラーが発生する

## 0.7.7

### Features

* ページ番号ツール [Katsuya Hidaka]
* New "Word-wrap" property of TextBlock [Katsuya Hidaka]
* Windows8/8.1 Official Support [Katsuya Hidaka]
* グリッドの表示 [Masaki Ozawa / Minoru Maeda]
* 静的テキストの編集をプロパティから編集可能へ [asane oosawa / Katsuya Hidaka]
* デフォルトの単位（px/mm）を設定可能へ [asane oosawa / Katsuya Hidaka]
* 選択範囲にオブジェクトの一部が含まれているとき選択状態に [asane oosawa / Minoru Maeda]
* B4/B5 の ISO サイズを追加 [Takumi FUJISE / Minoru Maeda / Katsuya Hidaka]
* ツールバーの拡大縮小率メニューに 400 を追加 [asane oosawa / Minoru Maeda]
* 複数選択した際に選択されている線を分かりやすく改善 [asane oosawa / Minoru Maeda]
* Mac 版でオブジェクトが選択しづらい [Katsuya Hidaka]
* キャンパスと背景の境界が分かりづらい [Katsuya Hidaka]
* テキスト編集ダイアログのフォントを monospace へ [Katsuya Hidaka]
* 各ライブラリのアップデート（Qt/Closure Tools） [Minoru Maeda / Katsuya Hidaka]
* その他 14 件の細かい改善 [Minoru Maeda / Katsuya Hidaka]

### Bug fixes

* テキスト値プロパティ編集時にスペースを押下するとテキストが選択状態になってしまう [Katsuya Hidaka / Minoru Maeda]
* 一覧表内に静的画像を埋め込もうとするとエラーが発生する [Minoru Maeda]
* その他 8 件の細かいバグ修正 [Minoru Maeda / Katsuya Hidaka]

## 0.7.6

### Features

* 十字キーによる移動を 5 間隔へ（現在 11 の状態から移動すると 15 へ） [Minoru Maeda]
* 右（又は下）に拡張可能なスペースが無い場合でも拡張可能へ [Minoru Maeda]

### Bug fixes

* Fix fails to boot because missing the translation file [Katsuya Hidaka]

## 0.7.5

### Features

* tlf ファイルへのガイドの保存 [Tadashi Oh-Ya / Minoru Maeda]
* UIの国際化(i18n) [Katsuya Hidaka]
* テキストブロックのオーバフロープロパティ [Katsuya Hidaka]
* Macにおける図形削除 fn+delete の問題 [Katsuya Hidaka]
* 一覧表ツールのセクション高の操作性を改善 [Minoru Maeda]
* 設定情報を各ユーザの home ディレクトリへ保存する [Katsuya Hidaka]
* List のデフォルトIDを default へ [Katsuya Hidaka]
* レイアウトファイルとエディタの互換性に関するチェック [Katsuya Hidaka]

### Bug fixes

* タイトルに日本語が含まれるとき、エクスポートした定義の印刷レイアウトが崩れる [Katsuya Hidaka]
* Listが選択状態の場合、HTMLレイアウト定義に余計な図形が表示されてしまう [Minoru Maeda]

## 0.7.0

### Features

* 位置や幅等の値をmm単位で指定可能へ
* 動的画像埋め込み機能の実装
* 通知機能
* Mac/Ubuntu版のリリース
* ヘルプメニューの改善
* Tblock + F2キーでID編集
* レイアウト定義書のエクスポート
* 最後に開いたパスをPlatformのLocalStorageに保存する
* テキストブロックへの行間/文字間隔/配置をサポート
* リリース用Coreの準備（Compilation ）
* Platform/Core(published)を統合し、パッケージ化を考慮した構造へ
* ファイルのI/O時のエンコーディングをUTF-8へ
* PXD形式の出力フォーマット廃止
* 色の内部値をRGB6桁に固定する

### Bug fixes

* タイトル名を "ThinReportsEditor" で統一
* Mac版で、Settings(LocalStorage)の保存先が正しくない
* Mac版でCopy/Cut/Pasteキー操作が動作しない
* プロパティに不正な値を入力すると0が設定される場合がある
* Comboboxで候補の選択をEnterできない
* Combobox/SelectUIで無効状態でもフォーカスが入ってしまう
* Tblockが複数行の場合、ツールバーのフォント関連機能が使用できない
* IDが指定されていないオブジェクトで、表示プロパティが機能していない

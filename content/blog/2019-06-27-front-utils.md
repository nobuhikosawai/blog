---
title: フロントエンド開発におけるちょっと便利スクリプト(Scaffolding）
date: '2019-06-27'
---

最近フロントエンドを開発する機会が多くて、その中でこれまであったほうがいいけどやる機会のなかった便利スクリプト的なもの触ったり、コマンドを用意する機会があったので、備忘録としてメモしておく。

## Scaffolding
ディレクトリの構成にもよるのだけど、現在開発しているプロジェクトではcomponent (UIのみを担うstatelessなcomponent)を1つのでディレクトリで管理している。
Reactのcomponentを開発するのに必要になるものは大体決まっていて、component本体(jsx)、css、storybook、testになる。これらを1つのディレクトリでまとめて管理する方法である。
大体1つのディレクトリの中身は以下のようになる。
```
- some-component
  - index.tsx
  - some-component.tsx
  - som-component.css
  - some-component.stories.tsx
  （あとはテストとか）
```
これのメリットは2つあって、

1. 必要なものが近くにあるので、ファイル間の移動が楽
2. 書く場所が決まっているのでscaffoldingが楽

である。

なので、scaffoldingをきちんとやらないと本来のメリットが受けられないのだが、こういうの開発してると後回しにしがちである。今回はこれを作成したのでメモとして残しておく。
何を使って実現してもいいのだと思うが、今回はこれを[Schematics](https://angular.io/guide/schematics)を使って作成した。

SchematicsはAngular製のtemplateベースのscaffoldエンジンである。 Schematics自体の活用については以下のような良い記事が沢山すでにあるので説明はこれらの記事に任せることにする。

- [Schematicsを作ってみよう](https://qiita.com/puku0x/items/462a038133e7233dfaed)
- [実践！Schematics](https://qiita.com/Quramy/items/a06d62132007807062df)

特徴として、

- テンプレートで指定された形式で、必要なパスにファイルを出力できる
-	ejs (erb)形式でテンプレートの記入ができる
- dasherize（ケバブケース化）, classify（CamelCase化）などの文字列変換の関数が充実してる（ファイル名も変換できる）
- テストも書きやすい

などがある。Angular製といえでも実際にはAngular以外でも活用することができるのでこれを採用した。

### 使用例

上記の記事を見ればほぼ分かるが、実際の利用例は以下の通り。

```sh
$ yarn build:schematics // 初回だけtranspile
$ yarn gen:component --path=./src/path/to/your/pages --name=component-name
```

と実行すると、以下のようなファイルが生成される。

```
src/path/to/your/pages
└── components
    └── your-component
        ├── index.tsx
        ├── your-component.css
        ├── your-component.stories.tsx
        └── your-component.tsx
```

それぞれのファイルの中身は以下の通り。

```ts:title=index.tsx
export { default, Props } from './your-component';
```

```ts:title=your-component.tsx
import React from 'react';

export interface Props {
}

const YourComponent: React.FC<Props> = () => {
  return (
    <div>
    </div>
  );
}

export default YourComponent;
```

```ts:title=your-component.stories.tsx
import React from 'react';
import { storiesOf } from '@storybook/react';
import YourComponent, { Props } from './your-component';

const stories = storiesOf('components/YourComponent', module);

const props: Props = {
};

stories.add('YourComponent', () => <YourComponent {...props} />);
```

`your-component.css`はファイルのみ


### コード例

実際に作ったものはこれ。もともとSchematics自体は完全に独立した自分用のscaffoldエンジンとして作成できるが、今回はプロジェクトで使いたいものだったので、プロジェクトと独立したscaffoldではなく、プロジェクトのlib以下に配置し、npm scriptとして利用できるようにしている。

ディレクトリの構成は以下の通り。

```
lib/schematics
├── collection.json
├── src
│   └── component
│       ├── files
│       │   ├── __name@dasherize__.css
│       │   ├── __name@dasherize__.stories.tsx
│       │   ├── __name@dasherize__.tsx
│       │   └── index.tsx
│       └── index.ts
└── tsconfig.json
```

それぞれのファイルの中身は以下の通り。

```ts:title=src/component/index.ts
import { strings } from '@angular-devkit/core';
import {
  Rule,
  SchematicsException,
  apply,
  branchAndMerge,
  mergeWith,
  template,
  url,
  move,
} from '@angular-devkit/schematics';

import { join } from 'path';
import { dasherize } from '@angular-devkit/core/src/utils/strings';

interface Options {
  name: string;
  path: string;
}

export default function(options: Options): Rule {
  return () => {
    const { name, path } = options;
    if (!name) {
      throw new SchematicsException('Option (name) is required.');
    }

    const fullPath = join(`${path}`, 'components', dasherize(name));

    const templateSource = apply(url('./files'), [
      template({
        ...strings,
        ...options,
      }),
      move(fullPath),
    ]);

    return branchAndMerge(mergeWith(templateSource));
  };
}
```

また、テンプレートとしては以下のようなファイルを用意する。

```ts:title=src/component/files/index.tsx
export { default, Props } from './<%= dasherize(name) %>';
```

```ts:title=src/component/files/__name@dasherize__.tsx
import React from 'react';

export interface Props {
}

const <%= classify(name) %>: React.FC<Props> = () => {
  return (
    <div>
    </div>
  );
}

export default <%= classify(name) %>;
```

```ts:title=src/component/files/__name@dasherize__.stories.tsx
import React from 'react';
import { storiesOf } from '@storybook/react';
import <%= classify(name) %>, { Props } from './<%= dasherize(name) %>';

const stories = storiesOf('components/<%= classify(name) %>', module);

const props: Props = {
};

stories.add('<%= classify(name) %>', () => <<%= classify(name) %> {...props} />);
```

`src/component/files/__name@dasherize__.css`は空にしてファイルだけおいている。


```js:title=collection.json
{
  "$schema": "../../node_modules/@angular-devkit/schematics/collection-schema.json",
  "schematics": {
    "component": {
      "description": "A component schematic for the project.",
      "factory": "./built/component/index"
    }
  }
}
```

実際に使用するにはtsをtranspileしてから実行。以下のようなscriptを登録しておくと便利

```js
"scripts": {
    "build:schematics": "tsc -p ./lib/schematics && cp -r ./lib/schematics/src/component/files ./lib/schematics/built/component",
    "gen:component": "schematics .:component --dry-run=false",
}
```

buildの方法がめっちゃ雑なのは一旦ご愛嬌で。。。

### まとめ

Reactのプロジェクトにおいて、Schematicsを用いたscaffoldingの方法を紹介した。
プロジェクトのメンテナビリティの担保と、DXの登録にはこういうscript用意しておくのが非常に大事。
これでファイルの置き場所に悩んだり、構成に悩むこともないので、管理しやすい。

ちょっと長くなってしまったので、残りは後編へ。SVGとw3colorのscriptについてメモを残しておく。


# wikicaljp

ウィキペディアの日付に関するページ(https://ja.wikipedia.org/wiki/{m}月{d}日)から記念日・年中行事、誕生日の項目を取得してオブジェクトの配列形式で返します。

## 使用方法

下記のような感じでgetContents()関数に、年、月を指定してを指定して呼び出し後、getAnniversary()またはgetBirthday()でそれぞれの情報を取得します。

```Javascript
const jmatenki = require('wikicaljp');

async function main() {
    const wiki = wikicaljp();
    await wiki.getContents(2, 20);
    let anniv = wiki.getAnniversary();
    let birth = wiki.getBirthday();
    console.dir(anniv, {depth:null, maxArrayLength:null});
    console.dir(birth, {depth:null, maxArrayLength:null});
}

main();
```

getAnniversary()関数の返値で、下記のようなオブジェクトの配列形式の記念日・年中行事が取得できます。

```Javascript
[
  { name: '世界社会正義の日', area: '世界' },
  { name: '旅券の日', area: '日本' },
  { name: 'アレルギーの日', area: '日本' },
  { name: '交通事故死ゼロを目指す日', area: '日本' },
  { name: '歌舞伎の日', area: '日本' },
  { name: '愛媛県政発足記念日', area: '日本' }
]
```

getBirthday()関数の返値で、下記のようなオブジェクトの配列形式の誕生日が取得できます。

```Javascript
[
  { name: 'シャルル＝オーギュスト・ド・ベリオ', year: '1802年', title: 'ヴァイオリニスト、作曲家' },
  { name: 'ルートヴィッヒ・ボルツマン', year: '1844年', title: '物理学者' },
  { name: '曾禰荒助', year: '1849年（嘉永2年1月28日）', title: '政治家' },
  { name: 'ニコライ・ハルトマン', year: '1882年', title: '哲学者' },
  { name: 'エリー・ナーデルマン', year: '1882年', title: '彫刻家' },
  { name: '志賀直哉', year: '1883年', title: '小説家' },
  ：
]
```

## 注意事項

* 勝手にサイトをスクレイピングしているので、HTMLのレイアウトが変更になった場合は正常に動作しなくなると思われます。
* ウィキペディアのページで微妙に文書構造が異なる場合があり、うまく切り出せないケースもあるようです。
* ウィキペディアの日本語ページのみの対応です。

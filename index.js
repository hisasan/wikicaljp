const axios = require('axios');
const { JSDOM } = require('jsdom');

// 指定項目の<li>エレメントを取得
// 以下のような構造になっているので、<li>部分を全て取得する
// liは入れ子になっているケースもあるようなのでセレクタでul>liのようにはしない
// <h2>
//   <span id='title'></span>
// </h2>
//  :
// <ul>
//   <li>取得する1</li>
//   <li>取得する2</li>
// </ul>
// <ul>
//  :
// ここ以降は次のパラグラフ
// <h2>
function getSpecLI(dom, title) {
    if (!dom) {
        throw Error('You must be call getContents() before calling this function.');
    }
    let elem = dom.window.document.getElementById(title);
    elem = elem && elem.parentElement;
    while (elem && elem.tagName != 'UL') {
        elem = elem.nextElementSibling;
    }
    if (!elem) {
        throw Error(`Specified title "${title}" element was not found`);
    }
    let lilist = [];
    while (elem && elem.tagName != 'H2') {
        lilist = lilist.concat(Array.from(elem && elem.querySelectorAll('li') || []));
        elem = elem.nextElementSibling;
    }
    return lilist;
}

// 以下のような（）をうまく分割
//  'テストの日（ 中国）'
//  'テストの日（ 台湾（中国））'
//  '藪（やぶ）入り（ 日本）'
//  '植樹節（中国語版）（ 中国・ 中華民国）'
function matchSP(s) {
    const pat1 = s.match(/[（(]\s(.+)[）)]/);
    const pat2 = s.match(/[（(]\s([^）)]+)[）)]/);
    if (pat1 && pat1[1].match(/[）)].*[（(]/)) {
        return pat2;
    }
    return pat1;
}

// 公開オブジェクト
function wikicaljp() {
    if (!(this instanceof wikicaljp)) {
        return new wikicaljp();
     }
}

// 取得したページの記念日・年中行事一覧をオブジェクトで取得
wikicaljp.prototype.getAnniversary = function() {
    // 記念日・年中行事の<li>エレメントを取得
    const lilist = getSpecLI(this.dom, '記念日・年中行事');
    let list = [];
    for (let i = 0; i < lilist.length; i++) {
        // HTMLタグを削除して(XXX版)とか、[n]とかの注記を削除
        const name = lilist[i].textContent.replace(/<("[^"]*"|'[^']*'|[^'">])*>|&nbsp;/g, '').replace(/（.+版）|\[.+\]/g, '').split(/\n|※/)[0].trim();
        // XXの日（補足）  のような形式を  補足のXXの日  のように変換する
        const pat = matchSP(name);
        if (pat && pat.length > 1) {
            const item = name.slice(0, pat.index).trim();
            list.push({name:item, area:pat[1].trim()});
        } else {
            list.push({name});
        }
    }
    return list;
}

// 取得したページの誕生日一覧をオブジェクトで取得
wikicaljp.prototype.getBirthday = function() {
    // 誕生日の<li>エレメントを取得
    const lilist = getSpecLI(this.dom, '誕生日');
    let list = [];
    for (let i = 0; i < lilist.length; i++) {
        // HTMLタグを削除して、"年 - 名前以降"を分割
        const line = lilist[i].textContent.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '').split('-');
        const year = line.shift().trim();
        if (line.length > 0) {
            // 最後の(+XXXX年)を削除して、”名前、職業"を分割
            const item = line.join('-').split(/\n|※/)[0].replace(/[（(][＋\+].+[）)]/g, '').split('、');
            const obj  = {name:item.shift().trim(), year};
            if (item.length > 0) {
                obj.title = item.join('、').trim();
            }
            list.push(obj);
        }
    }
    return list;
}

// ウィキペディアの指定月日のページを取得
wikicaljp.prototype.getContents = async function(month, day) {
    const url      = 'https://ja.wikipedia.org/wiki/' + encodeURIComponent(`${month}月${day}日`);
    const response = await axios.get(url);
    this.dom       = new JSDOM(response.data);
    return response;
}

module.exports = wikicaljp;

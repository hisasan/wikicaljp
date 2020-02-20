const wikicaljp = require('./');

// 使用法
// node example.js <月> <日>
async function main() {
    const today = new Date();
    let month, day;
    if (process.argv.length > 3) {
        month = process.argv[2];
        day   = process.argv[3];
    } else {
        month = today.getMonth() + 1;
        day   = today.getDate();
    }

    try {
        const wiki = wikicaljp();
        await wiki.getContents(month, day);
        let anniv = wiki.getAnniversary();
        let birth = wiki.getBirthday();

        console.dir(anniv, {depth:null, maxArrayLength:null});
        console.dir(birth, {depth:null, maxArrayLength:null});
    } catch (e) {
        console.log(e);
    }
}

main();

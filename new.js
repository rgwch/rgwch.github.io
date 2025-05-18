const fs = require('fs')
const path = require('path')

const date = new Date().toISOString().split('T')[0]
const fileName = `${date}-${process.argv[2]}.md`
const template = fs.readFileSync("template.txt", 'utf8');
const processed = template.replace("TITLE", process.argv[2]).replace("DATE", date)
console.log(process.argv.join(", "))
console.log(processed)
fs.writeFile(path.join(__dirname, "_drafts", fileName), processed, (err) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('File created successfully');
})

function twodigits(n) {
    return n < 10 ? '0' + n : n;
}
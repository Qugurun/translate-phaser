// CSV To JSON
// by Qugurun

const fs = require('fs');
const path = require('path');

const csvDir = path.join(__dirname, 'translate');
const outputDir = path.join(__dirname, 'public', 'assets', 'locale');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

function parseCSVLine(line, headers) {

    const values = line.split(',');
    const obj = {};
    headers.forEach((header, i) => {
        obj[header] = values[i] || '';
    });
    return obj;
}

fs.readdirSync(csvDir).forEach(file => {
    if (file.endsWith('.csv')) {
        const filePath = path.join(csvDir, file);
        const lines = fs.readFileSync(filePath, 'utf-8').split(/\r?\n/).filter(Boolean);
        if (lines.length < 2) return;
        const headers = lines[0].split(',');
        const localesDict = {};
        for (let i = 1; i < lines.length; i++) {
            const row = parseCSVLine(lines[i], headers);
            const key = row['key'];
            for (const locale of headers) {
                if (locale === 'key') continue;
                if (!localesDict[locale]) localesDict[locale] = {};
                localesDict[locale][key] = row[locale] || '';
            }
        }
        for (const [locale, translations] of Object.entries(localesDict)) {
            const outFile = path.join(outputDir, `${locale}.json`);
            fs.writeFileSync(outFile, JSON.stringify(translations, null, 4), 'utf-8');
            console.log(`Written: ${outFile}`);
        }
    }
});
const fs = require('fs');
const path = require('path');

module.exports = function expressMiddleware(app) {
    app.post('/api/update-tokens', (req, res) => {
        parseBody(req)
            .then(({ changes }) => {
                if (!Array.isArray(changes) || changes.length === 0) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: 'No changes provided' }));
                }

                const brandThemePath = path.resolve(__dirname, '..', 'src', 'app', 'layout', 'service', 'brand-theme.ts');
                const tailwindPath = path.resolve(__dirname, '..', 'src', 'assets', 'tailwind.css');

                let brandTheme = fs.readFileSync(brandThemePath, 'utf-8');
                let tailwind = fs.readFileSync(tailwindPath, 'utf-8');

                for (const { palette, shade, hex } of changes) {
                    brandTheme = replaceBrandToken(brandTheme, palette, shade, hex);
                    tailwind = replaceTailwindToken(tailwind, palette, shade, hex);
                }

                fs.writeFileSync(brandThemePath, brandTheme);
                fs.writeFileSync(tailwindPath, tailwind);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, count: changes.length }));
            })
            .catch((err) => {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message }));
            });
    });
};

function parseBody(req) {
    if (req.body && typeof req.body === 'object') {
        return Promise.resolve(req.body);
    }
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', (chunk) => (body += chunk));
        req.on('end', () => {
            try {
                resolve(JSON.parse(body));
            } catch (e) {
                reject(e);
            }
        });
        req.on('error', reject);
    });
}

function replaceBrandToken(source, palette, shade, hex) {
    const lines = source.split('\n');
    const paletteRegex = new RegExp(`^\\s+${palette}\\s*:`);

    for (let i = 0; i < lines.length; i++) {
        if (paletteRegex.test(lines[i])) {
            const shadeRegex = new RegExp(`((?<![0-9])${shade}:\\s*')#[0-9a-fA-F]{3,8}(')`);
            lines[i] = lines[i].replace(shadeRegex, `$1${hex}$2`);
            break;
        }
    }

    return lines.join('\n');
}

function replaceTailwindToken(source, palette, shade, hex) {
    const regex = new RegExp(`(--color-${palette}-${shade}:\\s*)#[0-9a-fA-F]{3,8}`);
    return source.replace(regex, `$1${hex}`);
}

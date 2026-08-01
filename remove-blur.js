import fs from 'fs';
import path from 'path';

function walk(dir) {
  fs.readdirSync(dir).forEach(f => {
    const fp = path.join(dir, f);
    if (fs.statSync(fp).isDirectory()) {
      walk(fp);
    } else if (fp.endsWith('.jsx') || fp.endsWith('.css')) {
      let c = fs.readFileSync(fp, 'utf8');
      c = c.replace(/ backdrop-blur-xl/g, '');
      c = c.replace(/ backdrop-blur-md/g, '');
      c = c.replace(/ backdrop-blur-lg/g, '');
      c = c.replace(/ backdrop-blur-sm/g, '');
      c = c.replace(/backdrop-blur-xl /g, '');
      c = c.replace(/backdrop-blur-md /g, '');
      c = c.replace(/backdrop-blur-lg /g, '');
      c = c.replace(/backdrop-blur-sm /g, '');
      fs.writeFileSync(fp, c);
    }
  });
}

walk('src');
console.log('Done - all backdrop-blur removed');

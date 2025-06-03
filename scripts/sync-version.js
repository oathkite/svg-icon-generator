const fs = require('fs');
const path = require('path');

// package.jsonを読み込む
const packageJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8')
);

// version.tsの内容を生成
const versionContent = `// バージョン情報をエクスポート
// package.jsonから直接インポートするとビルドエラーになるため、
// ここでバージョンを定義します
export const APP_VERSION = "${packageJson.version}";`;

// version.tsに書き込む
fs.writeFileSync(
  path.join(__dirname, '../lib/version.ts'),
  versionContent,
  'utf8'
);

console.log(`✅ バージョン ${packageJson.version} を同期しました`);
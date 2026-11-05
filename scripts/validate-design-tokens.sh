#!/usr/bin/env bash
# Gate de qualidade dos design tokens recebidos do cicd-create-tokens.
# Roda no CI (PR) e antes de cada deploy. Sem a pasta (antes do primeiro sync), não faz nada.
set -euo pipefail

DIR="${1:-design-tokens}"
if [ ! -d "$DIR" ]; then
  echo "Pasta $DIR ainda não existe (nenhum sync feito). Nada a validar."
  exit 0
fi

if [ ! -f "$DIR/tokens.json" ] || [ ! -f "$DIR/tokens.css" ]; then
  echo "::error::Esperado $DIR/tokens.json e $DIR/tokens.css"
  exit 1
fi
node - "$DIR" <<'EOF'
const fs = require('node:fs');
const dir = process.argv[2];
const { version, tokens } = JSON.parse(fs.readFileSync(`${dir}/tokens.json`, 'utf8'));
const css = fs.readFileSync(`${dir}/tokens.css`, 'utf8');
const names = Object.keys(tokens ?? {});
if (!version || names.length === 0) throw new Error('tokens.json sem versão ou sem tokens');
for (const name of names) {
  if (!/^#[0-9A-F]{6}$/i.test(tokens[name])) throw new Error(`Cor inválida em ${name}`);
  if (!css.includes(`--${name}:`)) throw new Error(`--${name} ausente em tokens.css`);
}
console.log(`OK: v${version}, ${names.length} tokens (JSON e CSS consistentes)`);
EOF

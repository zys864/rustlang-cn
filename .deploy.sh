#!/usr/bin/env sh

cp CNAME docs/.vuepress/dist

git clone https://github.com/davisp/ghp-import.git &&
./ghp-import/ghp_import.py -n -p -f -m "Documentation upload" -b master -r https://"$rustlangcn"@github.com/rustlang-cn/rustlang-cn.github.io.git docs/.vuepress/dist &&
echo "Uploaded documentation"

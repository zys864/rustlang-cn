#!/bin/bash -eu

echo "Documentation uploading."

cp CNAME docs/.vuepress/dist
/tmp/ghp-import/ghp_import.py -n -p -f -m "Update documentation." -b master -r https://$rustlangcn@github.com/rustlang-cn/rustlang-cn.github.io.git docs/.vuepress/dist

echo "Documentation uploaded."

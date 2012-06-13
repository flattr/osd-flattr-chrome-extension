#!/bin/sh

latest_tag=$(git describe --tags)
output_file=osd-flattr-chrome-extension-$latest_tag.zip
zip $output_file manifest.json background.js contentscript.js favicon.ico icon_48.png icon_128.png intent.html intent.js util.js

echo $output_file built

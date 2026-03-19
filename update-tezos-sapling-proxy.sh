if [ -d "tezos-sapling-proxy" ]; then
  cd tezos-sapling-proxy
  git pull
else
  git clone https://github.com/madfish-solutions/tezos-sapling-proxy.git
  cd tezos-sapling-proxy
fi
yarn
yarn build

if [ ! -d "../src/assets/sapling-proxy" ]; then
  mkdir -p ../src/assets/sapling-proxy
fi

htmlOutput="../src/assets/sapling-proxy/index.html"

# node ../create-proxy-html.js
cat << EOF > $htmlOutput
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>tezos-sapling-proxy</title>
EOF

for asset in dist/assets/*.js; do
  cat << EOF >> $htmlOutput
    <script type="module" crossorigin>
      $(cat $asset)
    </script>
EOF
done

cat << EOF >> $htmlOutput
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
EOF

#cd ..
#npm install -g react-native-asset
#react-native-asset

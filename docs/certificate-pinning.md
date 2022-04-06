# Certificate pinning information

Certificate pinning allows the prevention of MitM attacks.

Steps to create a new certificate hash:
1. Open url in Safari
2. Press on the `Lock` icon near domain name
3. Press `Show Certificate` button
4. Drag the certificate `icon` and drop it on the `Desktop`
5. Run command
```
cat certificate-name.cer |
    openssl x509 -inform der -noout -outform pem -pubkey |
    openssl pkey -pubin -inform pem -outform der |
    openssl dgst -sha256 -binary |
    openssl enc -base64 
```
6. Update these files with new hash value from command above (search by url)
`android/app/src/debug/res/xml/network_security_config.xml`
`android/app/src/main/res/xml/network_security_config.xml`
`ios/TempleWallet/Debug-Info.plist`
`ios/TempleWallet/Info.plist`

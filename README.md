
![application screenshot](./docs/assets/readmeScreenshot.png)

# 📝 About

Temple Wallet -  is a non-custodial crypto wallet for interacting with the Tezos ecosystem.

Temple provides the ability to interact with web-based decentralized applications (so-called "dApps") right from your mobile phone (iOS, Android).

Other important features include:
- Exploring various Tezos-based assets
- Multiple accounts
- Send/Receive FA1.2 / FA2  tokens
- Delegation to bakers
- Light/Dark mode switching

## ▶️ Installation

To run application from source code locally - please follow [environment setup instructions](https://reactnative.dev/docs/environment-setup).

Clone repository
```
git clone https://github.com/madfish-solutions/templewallet-mobile.git && cd templewallet-mobile
```

Install dependencies
```
yarn
yarn ios:pods
```

To start app run
```
# Android application
yarn android

# iOS application
yarn ios
```

If you want to contribute your code, before making a pull request - ensure, that code passes all pipeline checks. You can manually to check it before a pull request running commands
```
yarn ts
yarn lint
yarn test
```

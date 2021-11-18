
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


## 💻 Installation on computers with M1 silicone chip

If you running application on MacBook with M1 silicone chip, you'll need install Rosetta:

```
softwareupdate --install-rosetta
```

After successfully installed Rosetta - you have to open terminal app using Rosetta (right mouse click on app - 'Get Info' - checkbox 'run with Rosetta') and run these commands:

```bash
yarn ios:pods
```

or
```
sudo arch -x86_64 gem install ffi

arch -x86_64 pod install
```

After that, you need to open with Rosetta Xcode application, [add excluded architectures](https://khushwanttanwar.medium.com/xcode-12-compilation-errors-while-running-with-ios-14-simulators-5731c91326e9) in build settings on specified target, choose device where to launch build: emulator or real connected device 

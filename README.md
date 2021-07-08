
# About

Temple Wallet -  is a non-custodial crypto wallet for interacting with the Tezos ecosystem.

Temple provides the ability to interact with web-based decentralized applications (so-called "dApps") right from your mobile phone (iOS, Android).

Other important features include:
- Exploring various Tezos-based assets
- Multiple accounts
- Send/Receive FA1.2 / FA2  tokens
- Delegation to bakers
- Light/Dark mode switching

## Installation

To install application from source code locally - please follow [environment setup instructions](https://reactnative.dev/docs/environment-setup).

If you running your application on MacBook with M1 silicone chip, you'll need install Rosetta:

```bash
softwareupdate — install-rosetta
```

After successfully installed Rosetta - you have to open terminal app using Rosetta (right mouse click on app - 'Get Info' - checkbox 'run with Rosetta') and run these commands:

```bash
npm run ios:pods
```
or
```bash
sudo arch -x86_64 gem install ffi

arch -x86_64 pod install
```

Then you'll need to [add excluded architectures](https://khushwanttanwar.medium.com/xcode-12-compilation-errors-while-running-with-ios-14-simulators-5731c91326e9) in build settings on specified target

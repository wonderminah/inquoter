# 프로젝트 생성

## `expo init reminote`

```shell
➜  Projects expo init reminote
WARNING: The legacy expo-cli does not support Node +17. Migrate to the new local Expo CLI: https://blog.expo.dev/the-new-expo-cli-f4250d8e3421.
┌───────────────────────────────────────────────────────────────────────────┐
│                                                                           │
│   The global expo-cli package has been deprecated.                        │
│                                                                           │
│   The new Expo CLI is now bundled in your project in the expo package.    │
│   Learn more: https://blog.expo.dev/the-new-expo-cli-f4250d8e3421.        │
│                                                                           │
│   To use the local CLI instead (recommended in SDK 46 and higher), run:   │
│   › npx expo <command>                                                    │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘

Migrate to using:
› npx create-expo-app --template

✖ Choose a template: › minimal             bare and minimal, just the essentials to get you started
➜  Projects npx create-expo-app reminote --template blank
Creating an Expo project using the blank template.

✔ Downloaded and extracted project files.
> npm install
npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported

added 659 packages, and audited 660 packages in 47s

69 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities

✅ Your project is ready!

To run your project, navigate to the directory and run one of the following npm commands.

- cd reminote
- npm run android
- npm run ios
- npm run web
```

## `npm run ios`

```
➜  reminote git:(main) ✗ cd ..
➜  Projects cd reminote
➜  reminote git:(main) ✗ npm run ios

> reminote@1.0.0 ios
> expo start --ios

Starting project at /Users/minah.kim/Projects/reminote
Starting Metro Bundler
› Opening exp://192.168.100.75:8081 on iPhone 16 Pro
Downloading the Expo Go app [================================================================] 100% 0.0s

▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
█ ▄▄▄▄▄ █ ▀▀▄ ▀ █▄█ ▄▄▄▄▄ █
█ █   █ ███ ▄▄ ▄▄ █ █   █ █
█ █▄▄▄█ █ ▄▄ █ ▀█▄█ █▄▄▄█ █
█▄▄▄▄▄▄▄█ █ ▀ █ █▄█▄▄▄▄▄▄▄█
█▄ ▄█▀▄▄█   ███  █▄ ▄▄██  █
█▀ ▀  █▄▄█▀█▄█▄▀▄██▀▄█▄▄█▄█
█▄██ ▀▄▄▀█▄█▄ ▀  █  ███▀ ▀█
█▄▄ ▀▄▀▄  ██▀ █▄   ▄█ ▄█▀▄█
█▄▄▄█▄█▄█ ▀ █▄▀ █ ▄▄▄  ▀█ █
█ ▄▄▄▄▄ █▀ ▀▄█▄▄█ █▄█ ██▀▄█
█ █   █ ██ ▀ ██ ▄▄▄▄   ▀ ██
█ █▄▄▄█ █ █▀▄▄▄▄ ▀▀█ ▄██▄▄█
█▄▄▄▄▄▄▄█▄▄▄███▄▄▄▄█▄▄███▄█

› Metro waiting on exp://192.168.100.75:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Using Expo Go
› Press s │ switch to development build

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press j │ open debugger
› Press r │ reload app
› Press m │ toggle menu
› shift+m │ more tools
› Press o │ open project code in your editor

› Press ? │ show all commands

Logs for your project will appear below. Press Ctrl+C to exit.
› Opening the iOS simulator, this might take a moment.
iOS Bundled 5405ms index.js (671 modules)
iOS Bundled 44ms index.js (1 module)
```

아래와 같이 시뮬레이터가 구동된다.

![image-20250731025527937](./README/image-20250731025527937.png)

```
my-app/
├── src/
│   ├── components/        # 재사용 가능한 컴포넌트
│   ├── screens/           # 페이지 단위 컴포넌트 (예: HomeScreen.js)
│   ├── navigation/        # React Navigation 설정
│   ├── hooks/             # 커스텀 훅
│   └── utils/             # 유틸 함수
├── assets/                # 이미지, 폰트 등 정적 자산
├── node_modules/          # 설치된 npm 패키지
├── .expo/                 # Expo 관련 내부 설정 (로컬에서만 사용됨)
├── .gitignore             # Git에서 무시할 파일 목록
├── app.json               # Expo 앱 설정 (앱 이름, 아이콘, 스플래시 등)
├── app.config.js (선택)    # app.json 대신 JS로 동적 설정할 때 사용
├── babel.config.js        # Babel 설정
├── package.json           # 의존성, 스크립트, 메타정보
├── App.js                 # 앱의 진입점 컴포넌트
└── README.md              # 프로젝트 설명
```


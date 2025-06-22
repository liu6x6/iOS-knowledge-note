

* npm run dev: run the app in dev mode (will refresh when you make code changes)
* npm run build: build the production version of the app into dist/
* npm run build:browser: build a version of the app for web browsers into dist-browser/
* npm run start: start the production version of the app
* npm run clean: remove all caches and node modules and reinstall everything
* npx electron-builder build --publish never: package the app for your platform (into release/). Note that for macOS this requires code signing environment variables to be set.

# repo
```
git clone https://github.com/appium/appium-inspector
```
then just ```run npm i```

# for elector-chrome-driver 
* download the chromedriver-v13.0.0-darwin-x64.zip 
* download the electron-chromedriver-13.0.0.tgz
* unzip the electron-chromedriver-13.0.0.tgz
* cd to  electron-chromedriver and ```npm i ```
* cd to appium-inspactor 
* npm install $electron-chromedrive_path



# for elector issue
* need use proxy for electron
```
export some virable on .zshrc
export ELECTRON_GET_USE_PROXY=1 # 值为1或true
export GLOBAL_AGENT_HTTP_PROXY=$HTTP_PROXY
export GLOBAL_AGENT_HTTPS_PROXY=$HTTP_PROXY
```



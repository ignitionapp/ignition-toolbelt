# Ignition Toolbelt

Ignition Toolbelt is a Chrome Extension that streamlines Ignitioneers' daily operations.

## About

- [Introduction](https://ignitionapp.atlassian.net/wiki/spaces/ENG/pages/3270508551/2024-4-18+Ignition+Toolbelt+-+Making+Ignitioneers+life+easier):
  Introduction to the project.
- [Chrome Extension (MV3) Boilerplate with React 18 and Webpack 5](https://github.com/lxieyang/chrome-extension-boilerplate-react):
  This project is based on this boilerplate.

## Development

It's only required when you need to develop the extension. If you only need to use the extension, you can install it
from the Introducion page above.

### 1. Clone the repository

```sh
git clone git@github.com:ignitionapp/ignition-toolbelt.git;
cd ignition-toolbelt;
```

### 2. Node.js version (Optional)

```sh
brew install asdf;
echo '. /opt/homebrew/opt/asdf/libexec/asdf.sh' >> ~/.zshrc;
source ~/.zshrc;

# Use asdf to install the current node version as specified in .tool-versions file
asdf plugin add nodejs;
asdf install nodejs;

# This should print the current version (currently 20.11.0)
asdf current nodejs;
# => nodejs  20.11.0  /Users/foo/...
```

### 3. Install dependencies and run the app

```sh
yarn install;
yarn start;
```

### 4. Load the extension in Chrome

In Chrome browser, click the `Window` menu, then `Extensions`. Click the `Load unpacked` button and select the `build`
directory.


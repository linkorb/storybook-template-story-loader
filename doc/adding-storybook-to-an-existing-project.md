# Adding Storybook to an existing project

## Ensure your project has a package.json file

If not, add the following minimum package.json file:

```json
{
  "dependencies": {
  },
  "devDependencies": {
  }
}
```

## Install storybook-template-story-loader into your project:

Use the `-D` flag to install as a `devDependecy` because Storybook is usually only used in development mode:

    # Install basic dependencies:
    npm install -D babel-core babel-preset-env
    npm install -D @storybook/html@4.0.0-alpha.16
    npm install -D @storybook/addon-options@4.0.0-alpha.16
    npm install -D @storybook/addon-actions@4.0.0-alpha.16
    npm install -D @storybook/addon-viewport@4.0.0-alpha.16
    npm install -D @storybook/addon-storysource@4.0.0-alpha.16
    npm install -D @storybook/addon-links@4.0.0-alpha.16
    npm install -D @storybook/addon-knobs@4.0.0-alpha.16
    npm install -D @storybook/storybook-deployer # publish to gh-pages
    npm install -D twig
    npm install -D skyorion427/custom-twig-loader # for loading twig files
    npm install -D moment # peer dependency

    # Install this package
    npm install -D @linkorb/storybook-template-story-loader

## Create a `.storybook` directory in the root of your project

    mkdir .storybook

## Create `.storybook/config.js`:

```js
import { configure, storiesOf } from '@storybook/html';
import { AddStories, setConfigs } from '@linkorb/storybook-template-story-loader';
import welcome from './introduction.md';

storiesOf("welcome", module)
    .add("introduction", () => welcome)

const manifest = require('../public/build/manifest.json');

const options = {
  name: 'Coupon',
  manifest,
};

setConfigs(options);

const loadStories = () => {
  const templateData = require.context('../templates', true, /\.json$/);
  const templateTwigs = require.context('../templates', true, /\.twig$/);

  AddStories(templateTwigs, templateData, 'twig');
}

configure(loadStories, module);
```

## Create `.storybook/addons.js`:

```js
import '@storybook/addon-actions/register';
import '@storybook/addon-links/register';
import '@storybook/addon-notes/register';
import '@storybook/addon-viewport/register';
import '@storybook/addon-knobs/register';
import '@storybook/addon-storysource/register';
import '@storybook/addon-options/register';
import '@storybook/addon-backgrounds/register';
```

## Create `.storybook/introduction.md`

```markdown
# This is the StoryBook for project X
```

## Create `.storybook/webpack.config.js

```js
const path = require("path");
const globImporter = require('node-sass-glob-importer');

const marked = require("marked");
const renderer = new marked.Renderer();

module.exports = {
  plugins: [
    // your custom plugins
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        loaders: [
          "style-loader",
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              importer: globImporter()
            }
          }
        ],
        include: path.resolve(__dirname, "../assets")
      },
      {
        test: /\.twig$/,
        loader: "twig-loader",
        include: path.resolve(__dirname, "../templates"),
        query: {
          partialDirs: [
            path.join(__dirname, '../templates')
          ]
        }
      },
      {
        test: /\.md$/,
        loader: "markdown-loader",
        options: {
            pedantic: true,
            renderer
        }
      }
    ],
  },
};
```

## Add scripts to your main package.json

Add the following to your package.json's "script" section:

```json
"scripts": {
    "storybook": "start-storybook -s ./public -p 6006",
    "storybook-static": "build-storybook -c .storybook -o dist/storybook"
}
```

## Start storybook:

    npm run storybook

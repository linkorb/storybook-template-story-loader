# storybook-template-story-loader

This addon for storybook allows to load multiple templates. \
It supports twig, handlebar, html, markdown templates.

## Getting Started

To install addon:
```
npm install -D storybook-template-story-loader
```
or
```
yarn add -D storybook-template-story-loader
```

### Storybook configuration for templates

Set the addon in the place you configure storybook like this:
```
import { AddStories, setConfigs } from 'storybook-template-story-loader';

const manifest = require('../public/build/manifest.json'); // twig manifest file

const options = {
  name: 'storybook name',
  manifest,
};

setConfigs(options);

const loadStories = () => {
  const templateData = require.context('../templates', true, /\.json$/);
  const templateTwigs = require.context('../templates', true, /\.twig$/);

  AddStories(templateTwigs, templateData, 'twig');
}
```

For handlebar template:
```
const loadStories = () => {
  const templateData = require.context('../src', true, /\.json$/);
  const templateHtml = require.context('../src', true, /\.html$/);
  const templateHandlebars = require.context('../src', true, /\.handlebars$/);

  AddStories(templateHtml);
  AddStories(templateHandlebars, templateData, 'handlebar');
}

const options = {
  name: 'storybook name',
};

setConfigs(options);

configure(loadStories, module);
```

### Global Options

You can pass configuration object to set options.
```
import { AddStories, setConfigs } from 'storybook-template-story-loader';

const options = {
  ...
};

setConfigs(options);
```

#### options
| Key | Description | Type | Default |
| - | - | - | - |
| name | name to display in the top left corner | String | '' |
| url | URL for name in top left corner to link to | String | '#' |
| goFullScreen | show story component as full screen | Boolean | false |
| showStoriesPanel | display panel that shows a list of stories | Boolean | true |
| showAddonPanel | display panel that shows addon configurations | Boolean | true |
| showSearchBox | display floating search box to search through stories | String | false |
| addonPanelInRight | show addon panel as a vertical panel on the right | String | false |
| sortStoriesByKind | sorts stories | String | false |
| hierarchySeparator | regex for finding the hierarchy separator | String | null |
| hierarchyRootSeparator | regex for finding the hierarchy root separator | String | null |
| sidebarAnimations | sidebar tree animations | String | true |
| selectedAddonPanel | id to select an addon panel | String | undefined |
| enableShortcuts | The order of addons in the "Addon panel" is the same as you import them in 'addons.js'. The first panel will be opened by default as you run Storybook | String | true |
| manifest | manifest object for twig template | String | {} |


## Adding stories

To add stories:
```
import { AddStories } from 'storybook-template-story-loader';

AddStories(templates, data, type);
```
#### Templates and data
```
const templates = require.context('../src', true, /\.html$/);
const data = require.context('../src', true, /\.json$/);
```
#### Types
supported types are `handlebar`, `twig`, `html`, `md`.
## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details


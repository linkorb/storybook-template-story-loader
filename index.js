// import { twigFunctions } from '../.storybook/helpers/TwigFunctions';
import { addDecorator, storiesOf } from '@storybook/html';
import pathParse from 'path-parse';
import { setOptions } from '@storybook/addon-options';
import { withBackgrounds } from '@storybook/addon-backgrounds';
import { withNotes } from '@storybook/addon-notes';
import { withKnobs } from '@storybook/addon-knobs';
const Twig = require('twig');
const showdown = require('showdown');
import {
  asset,
  path,
  csrf_token,
} from './twigFunctions';

const configuration = () => {
  const converter = new showdown.Converter();

  Twig.extendFilter('markdown', function (value) {
      return converter.makeHtml(value);
  });

  Twig.extendFunction('asset', function (value) {
    return asset(value);
  });
  
  Twig.extendFunction('path', function (value, data) {
    return path(value, data);
  });

  Twig.extendFunction('csrf_token', function (value) {
    return csrf_token(value);
  });

  addDecorator(
    withBackgrounds([
      { name: 'white', value: '#fff', default: true },
      { name: 'checkers', value: 'repeat top left/100px url("https://www.casita.com/assets/images/360677iEC67ACD627FBBDDF.png")' },
      { name: 'grey', value: '#e0e0e0' },
      { name: 'black', value: '#000' },
    ])
  );
  
  addDecorator(withNotes);
  addDecorator(withKnobs);
}

export const setConfigs = (options) => {
  const {
    name = '',
    url = '#',
    goFullScreen = false,
    showStoriesPanel = true,
    showAddonPanel = true,
    showSearchBox = false,
    addonPanelInRight = false,
    sortStoriesByKind = false,
    hierarchySeparator = null,
    hierarchyRootSeparator = null,
    sidebarAnimations = true,
    selectedAddonPanel = undefined,
    enableShortcuts = true,
  } = options;
  
  setOptions({
    /**
     * name to display in the top left corner
     * @type {String}
     */
    name,
    /**
     * URL for name in top left corner to link to
     * @type {String}
     */
    url,
    /**
     * show story component as full screen
     * @type {Boolean}
     */
    goFullScreen,
    /**
     * display panel that shows a list of stories
     * @type {Boolean}
     */
    showStoriesPanel,
    /**
     * display panel that shows addon configurations
     * @type {Boolean}
     */
    showAddonPanel,
    /**
     * display floating search box to search through stories
     * @type {Boolean}
     */
    showSearchBox,
    /**
     * show addon panel as a vertical panel on the right
     * @type {Boolean}
     */
    addonPanelInRight,
    /**
     * sorts stories
     * @type {Boolean}
     */
    sortStoriesByKind,
    /**
     * regex for finding the hierarchy separator
     * @example:
     *   null - turn off hierarchy
     *   /\// - split by `/`
     *   /\./ - split by `.`
     *   /\/|\./ - split by `/` or `.`
     * @type {Regex}
     */
    hierarchySeparator,
    /**
     * regex for finding the hierarchy root separator
     * @example:
     *   null - turn off multiple hierarchy roots
     *   /\|/ - split by `|`
     * @type {Regex}
     */
    hierarchyRootSeparator,
    /**
     * sidebar tree animations
     * @type {Boolean}
     */
    sidebarAnimations,
    /**
     * id to select an addon panel
     * @type {String}
     */
    selectedAddonPanel, // The order of addons in the "Addon panel" is the same as you import them in 'addons.js'. The first panel will be opened by default as you run Storybook
    /**
     * enable/disable shortcuts
     * @type {Boolean}
     */
    enableShortcuts, // true by default
  });
}

export const AddStories = (templateFiles, templateData) => {
  configuration();

  templateFiles.keys().forEach(pathName => {
    let dir = pathParse(pathName).dir.split('/').pop();
    const name = pathParse(pathName).name;

    if (!templateData) {
      storiesOf(dir, module)
        .add(name, () => templateFiles(pathName));
      return;
    }

    const extPos = pathName.lastIndexOf('.');
    const jsonFilename = pathName.substr(0, extPos < 0 ? path.length : extPos) + ".json";
    let data = [];

    if (templateData.keys().indexOf(jsonFilename) >=  0) {
      data = templateData(jsonFilename);
    }
    // Import any files specified in the root `@import` property
    if (data['@import']) {
      Object.keys(data['@import']).forEach(function(key) {
        const pathName = data['@import'][key];
        const subData = {};
        subData[key] = templateData('./' + pathName);
        data = Object.assign({}, subData, data);
      });

      const template = templateFiles(pathName);
      const html = template(data);

      if (dir === '.') dir = 'root';
      storiesOf(dir, module)
        .add(name, () => html);
    }
  });
}

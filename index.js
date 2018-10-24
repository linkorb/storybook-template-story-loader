// import { twigFunctions } from '../.storybook/helpers/TwigFunctions';
import { addDecorator, storiesOf } from '@storybook/html';
import pathParse from 'path-parse';
import { setOptions } from '@storybook/addon-options';
import { withBackgrounds } from '@storybook/addon-backgrounds';
import { withNotes } from '@storybook/addon-notes';
import { withKnobs } from '@storybook/addon-knobs';

export const configuration = () => {

  setOptions({
    /**
     * name to display in the top left corner
     * @type {String}
     */
    name: 'Plaza UI',
    /**
     * URL for name in top left corner to link to
     * @type {String}
     */
    url: '#',
    /**
     * show story component as full screen
     * @type {Boolean}
     */
    goFullScreen: false,
    /**
     * display panel that shows a list of stories
     * @type {Boolean}
     */
    showStoriesPanel: true,
    /**
     * display panel that shows addon configurations
     * @type {Boolean}
     */
    showAddonPanel: true,
    /**
     * display floating search box to search through stories
     * @type {Boolean}
     */
    showSearchBox: false,
    /**
     * show addon panel as a vertical panel on the right
     * @type {Boolean}
     */
    addonPanelInRight: false,
    /**
     * sorts stories
     * @type {Boolean}
     */
    sortStoriesByKind: false,
    /**
     * regex for finding the hierarchy separator
     * @example:
     *   null - turn off hierarchy
     *   /\// - split by `/`
     *   /\./ - split by `.`
     *   /\/|\./ - split by `/` or `.`
     * @type {Regex}
     */
    hierarchySeparator: null,
    /**
     * regex for finding the hierarchy root separator
     * @example:
     *   null - turn off multiple hierarchy roots
     *   /\|/ - split by `|`
     * @type {Regex}
     */
    hierarchyRootSeparator: null,
    /**
     * sidebar tree animations
     * @type {Boolean}
     */
    sidebarAnimations: true,
    /**
     * id to select an addon panel
     * @type {String}
     */
    selectedAddonPanel: undefined, // The order of addons in the "Addon panel" is the same as you import them in 'addons.js'. The first panel will be opened by default as you run Storybook
    /**
     * enable/disable shortcuts
     * @type {Boolean}
     */
    enableShortcuts: true, // true by default
  });

  const Twig = require('twig');

  var showdown = require('showdown');

  var converter = new showdown.Converter();

  Twig.extendFilter('markdown', function (value) {
      return converter.makeHtml(value);
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

  setOptions({
  /**
   * name to display in the top left corner
   * @type {String}
   */
  name: 'Plaza UI',
  /**
   * URL for name in top left corner to link to
   * @type {String}
   */
  url: '#',
  /**
   * show story component as full screen
   * @type {Boolean}
   */
  goFullScreen: false,
  /**
   * display panel that shows a list of stories
   * @type {Boolean}
   */
  showStoriesPanel: true,
  /**
   * display panel that shows addon configurations
   * @type {Boolean}
   */
  showAddonPanel: true,
  /**
   * display floating search box to search through stories
   * @type {Boolean}
   */
  showSearchBox: false,
  /**
   * show addon panel as a vertical panel on the right
   * @type {Boolean}
   */
  addonPanelInRight: false,
  /**
   * sorts stories
   * @type {Boolean}
   */
  sortStoriesByKind: false,
  /**
   * regex for finding the hierarchy separator
   * @example:
   *   null - turn off hierarchy
   *   /\// - split by `/`
   *   /\./ - split by `.`
   *   /\/|\./ - split by `/` or `.`
   * @type {Regex}
   */
  hierarchySeparator: null,
  /**
   * regex for finding the hierarchy root separator
   * @example:
   *   null - turn off multiple hierarchy roots
   *   /\|/ - split by `|`
   * @type {Regex}
   */
  hierarchyRootSeparator: null,
  /**
   * sidebar tree animations
   * @type {Boolean}
   */
  sidebarAnimations: true,
  /**
   * id to select an addon panel
   * @type {String}
   */
  selectedAddonPanel: undefined, // The order of addons in the "Addon panel" is the same as you import them in 'addons.js'. The first panel will be opened by default as you run Storybook
  /**
   * enable/disable shortcuts
   * @type {Boolean}
   */
  enableShortcuts: true, // true by default
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

      Object.keys(data).map(key => {
        Object.keys(twigFunctions).map(name => {
          if (key === name) {
            data[key] = twigFunctions[name];
          }
        })
      });

      const template = templateFiles(pathName);
      const html = template(data);

      if (dir === '.') dir = 'root';
      storiesOf(dir, module)
        .add(name, () => html);
    }
  });
}

export const asset = value => {
  const manifest = require('../../public/build/manifest.json');
  const assetUrl = manifest[value];
  
  if (assetUrl)
    return assetUrl;
  return value;
}

export const path = (value, data) => {
  const storyIndex = value.substring(value.lastIndexOf('_') + 1);
  const pathName = value.substring(0, value.lastIndexOf('_'));
  const storyName = pathName.substring(pathName.lastIndexOf('_') + 1);

  if (storyName && storyIndex) {
    return `?selectedKind=${storyName}&selectedStory=${storyIndex}.html`;
  }
  return '#';
}

export const csrf_token = value => {
  return value + "token";
}

export const twigFunctions = {
  "asset": asset,
  "path": path,
  "csrf_token": csrf_token,
}
const { resolve } = require('path');

module.exports = {
  base: '/',
  title: 'HSRP Components',
  description:
    'Re-usable Vue.js components for EPA HSRP and other government web apps, based upon the U.S. Web Design System.',
  themeConfig: {
    nav: [
      { text: 'Documentation', link: '/components/alert.html' },
      { text: 'Github', link: 'https://github.com/Eastern-Research-Group/hsrp-components' },
    ],
    sidebar: [
      {
        title: 'Introduction',
        collapsable: false,
        children: ['introduction/guide'],
      },
      {
        title: 'Components',
        collapsable: false,
        children: [
          'components/alert',
          'components/button',
          'components/checkbox',
          'components/checkbox-radio-group',
          'components/loader',
          'components/modal',
          'components/table',
          'components/text-input',
        ],
      },
    ],
  },
  configureWebpack: {
    resolve: {
      alias: {
        'hsrp-components': resolve(__dirname, '../../src'),
      },
    },
  },
};

const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */

// Configuration par défaut de Metro
const defaultConfig = getDefaultConfig(__dirname);

// Configuration personnalisée
const config = {
    resolver: {
      ...defaultConfig.resolver,
      // Ajout de l'alias @src
      alias: {
        ...defaultConfig.resolver.alias,
        '@src': path.resolve(__dirname, 'src'),
      },
      extraNodeModules: new Proxy(
        {},
        {
          get: (target, name) => {
            if (name.startsWith('@src/')) {
              // Remplacer @src par le chemin réel vers le dossier src
              return path.resolve(__dirname, name.replace('@src/', 'src/'));
            }
            return path.join(process.cwd(), `node_modules/${name}`);
          },
        },
      ),
    },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);

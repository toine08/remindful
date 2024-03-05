const { getDefaultConfig } = require('metro-config');

module.exports = (async () => {
  const defaultConfig = await getDefaultConfig();

  const { resolver } = defaultConfig;

  return {
    ...defaultConfig,
    resolver: {
      ...resolver,
      sourceExts: [...resolver.sourceExts, 'jsx', 'js', 'ts', 'tsx'],
    },
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
    },
  };
})();
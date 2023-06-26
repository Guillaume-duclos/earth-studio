import vitePluginString from 'vite-plugin-string';

export default {
  plugins: [vitePluginString()],
  build: {
    target: 'esnext', //browsers can handle the latest ES features
  },
};

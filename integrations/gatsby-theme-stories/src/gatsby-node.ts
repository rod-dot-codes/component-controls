import fs from 'fs';
import { BuildProps } from '@component-controls/core';
import { getCSSFilePath } from '@component-controls/core/node-utils';
import {
  buildBundle,
  webpackConfig,
} from '@component-controls/base-integration/webpack-build';
import {
  CreatePagesArgs,
  CreateWebpackConfigArgs,
  PluginCallback,
  Page,
} from 'gatsby';
import { getRoutes } from '@component-controls/routes';

const miniCss = (): string => {
  try {
    return require.resolve('gatsby/node_modules/mini-css-extract-plugin');
  } catch {
    return require.resolve('mini-css-extract-plugin');
  }
};
export const createPagesStatefully = async (
  { actions, store: gatsbyStore }: CreatePagesArgs,
  options: BuildProps,
  doneCb: PluginCallback,
): Promise<void> => {
  const { createPage, deletePage } = actions;

  const createGatsbyPage: CreatePagesArgs['actions']['createPage'] = props => {
    gatsbyStore.getState().pages.forEach((page: Page) => {
      if (page.path === props.path && page.component === props.component) {
        deletePage({
          path: page.path,
          component: props.component,
        });
      }
    });
    createPage(props);
  };
  await buildBundle({
    options: {
      ...options,
      loaders: {
        ...options?.loaders,
        'mini-css-extract-plugin': {
          module: miniCss(),
        },
      },
    },
    onEndBuild: ({ store }) => {
      const routes = getRoutes(store);
      routes.forEach(({ path, ...route }) => {
        createGatsbyPage({
          path,
          component: require.resolve(`../src/templates/DocPage.tsx`),
          context: route,
        });
      });
      const cssBundle = getCSSFilePath(store.config);
      if (fs.existsSync(cssBundle)) {
        const styles = fs.readFileSync(cssBundle, 'utf8');
        process.env.GATSBY_CC_CSS = JSON.stringify(styles);
      }
    },
  });
  doneCb(null, null);
};

export const onCreateWebpackConfig = (
  { actions }: CreateWebpackConfigArgs,
  options: BuildProps,
): void => {
  //inject store bundle name
  actions.setWebpackConfig(webpackConfig({ options }));
};

import type { StorybookConfig } from '@storybook/angular';

const basePath = process.env['STORYBOOK_BASE_PATH'] || '/';

const config: StorybookConfig = {
    stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    addons: ['@storybook/addon-a11y', '@storybook/addon-docs', '@storybook/addon-onboarding'],
    framework: '@storybook/angular',
    staticDirs: ['../public'],
    managerHead: (head) => `${head}\n<base href="${basePath}">`,
    previewHead: (head) => `${head}\n<base href="${basePath}">`,
    webpackFinal: async (config) => {
        if (basePath !== '/') {
            config.output = config.output || {};
            config.output.publicPath = basePath;
        }
        return config;
    }
};
export default config;

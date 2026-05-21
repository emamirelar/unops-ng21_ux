import {
  Rule,
  SchematicContext,
  Tree,
  chain,
  SchematicsException,
} from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

interface Schema {
  project?: string;
  darkMode?: boolean;
}

const PEER_DEPS: Record<string, string> = {
  primeng: '^21.0.4',
  '@primeuix/themes': '^2.0.0',
  primeicons: '^7.0.0',
  '@tailwindcss/postcss': '^4.0.0',
  'tailwindcss': '^4.0.0',
};

const STYLES_ENTRIES = [
  'node_modules/@unopsitg/ux/assets/styles.scss',
  'src/tailwind.css',
  'node_modules/primeicons/primeicons.css',
  'src/styles.scss',
];

const ASSETS_ENTRY = {
  glob: '**/*',
  input: 'node_modules/@unopsitg/ux/assets/opp',
  output: 'assets/opp',
};

export function ngAdd(options: Schema): Rule {
  return chain([
    addPeerDependencies(),
    createPostcssConfig(),
    createTailwindWrapper(),
    patchAngularJson(options),
    patchAppConfig(options),
    createCursorRule(),
    installDependencies(),
  ]);
}

function addPeerDependencies(): Rule {
  return (tree: Tree) => {
    const pkgPath = '/package.json';
    const buffer = tree.read(pkgPath);
    if (!buffer) {
      throw new SchematicsException('Could not find package.json');
    }

    const pkg = JSON.parse(buffer.toString('utf-8'));
    if (!pkg.dependencies) {
      pkg.dependencies = {};
    }

    for (const [name, version] of Object.entries(PEER_DEPS)) {
      if (!pkg.dependencies[name] && !pkg.devDependencies?.[name]) {
        pkg.dependencies[name] = version;
      }
    }

    tree.overwrite(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
    return tree;
  };
}

function createPostcssConfig(): Rule {
  return (tree: Tree) => {
    const path = '/.postcssrc.json';
    if (tree.exists(path)) {
      return tree;
    }
    tree.create(
      path,
      JSON.stringify({ plugins: { '@tailwindcss/postcss': {} } }, null, 2) + '\n'
    );
    return tree;
  };
}

function createTailwindWrapper(): Rule {
  return (tree: Tree) => {
    const path = '/src/tailwind.css';
    if (tree.exists(path)) {
      return tree;
    }
    tree.create(
      path,
      [
        '@import "../node_modules/@unopsitg/ux/assets/tailwind.css";',
        '@source "../node_modules/@unopsitg/ux/fesm2022";',
        '',
      ].join('\n')
    );
    return tree;
  };
}

function patchAngularJson(options: Schema): Rule {
  return (tree: Tree) => {
    const angularJsonPath = '/angular.json';
    const buffer = tree.read(angularJsonPath);
    if (!buffer) {
      throw new SchematicsException('Could not find angular.json');
    }

    const workspace = JSON.parse(buffer.toString('utf-8'));
    const projectName =
      options.project || workspace.defaultProject || Object.keys(workspace.projects)[0];
    const project = workspace.projects[projectName];

    if (!project) {
      throw new SchematicsException(`Project "${projectName}" not found in angular.json`);
    }

    const buildTarget = project.architect?.build || project.targets?.build;
    if (!buildTarget) {
      throw new SchematicsException(`No build target found for project "${projectName}"`);
    }

    const buildOptions = buildTarget.options || (buildTarget.options = {});

    // Patch styles
    const styles: string[] = buildOptions.styles || [];
    const desiredStyles = STYLES_ENTRIES.filter((s) => !styles.includes(s));
    if (desiredStyles.length > 0) {
      const srcStylesIdx = styles.indexOf('src/styles.scss');
      if (srcStylesIdx >= 0) {
        // Insert library styles before src/styles.scss
        const before = desiredStyles.filter((s) => s !== 'src/styles.scss');
        styles.splice(srcStylesIdx, 0, ...before);
      } else {
        styles.push(...desiredStyles);
      }
      buildOptions.styles = styles;
    }

    // Patch assets
    const assets: (string | object)[] = buildOptions.assets || [];
    const hasOppAsset = assets.some(
      (a) => typeof a === 'object' && (a as any).input === ASSETS_ENTRY.input
    );
    if (!hasOppAsset) {
      assets.push(ASSETS_ENTRY);
      buildOptions.assets = assets;
    }

    tree.overwrite(angularJsonPath, JSON.stringify(workspace, null, 2) + '\n');
    return tree;
  };
}

function patchAppConfig(options: Schema): Rule {
  return (tree: Tree) => {
    const configPath = '/src/app/app.config.ts';
    if (!tree.exists(configPath)) {
      // Try alternate path
      const altPath = '/src/app.config.ts';
      if (!tree.exists(altPath)) {
        return tree;
      }
      return patchConfigFile(tree, altPath, options);
    }
    return patchConfigFile(tree, configPath, options);
  };
}

function patchConfigFile(tree: Tree, path: string, options: Schema): Tree {
  const content = tree.read(path)!.toString('utf-8');

  if (content.includes('@unopsitg/ux')) {
    return tree;
  }

  const darkMode = options.darkMode !== false;

  const importBlock = [
    "import { providePrimeNG } from 'primeng/config';",
    "import { BrandSoft, TOPBAR_PROFILE_MENU_CONFIG, LayoutService } from '@unopsitg/ux';",
  ].join('\n');

  const providerBlock = `    providePrimeNG({ theme: { preset: BrandSoft, options: { darkModeSelector: '.app-dark' } } }),`;

  // Insert imports at the top (after existing imports)
  const lastImportIdx = content.lastIndexOf('\nimport ');
  let result: string;

  if (lastImportIdx >= 0) {
    const endOfImportLine = content.indexOf('\n', lastImportIdx + 1);
    result =
      content.slice(0, endOfImportLine + 1) +
      importBlock +
      '\n' +
      content.slice(endOfImportLine + 1);
  } else {
    result = importBlock + '\n\n' + content;
  }

  // Insert provider into providers array
  const providersMatch = result.match(/providers\s*:\s*\[/);
  if (providersMatch && providersMatch.index != null) {
    const insertPos = providersMatch.index + providersMatch[0].length;
    result =
      result.slice(0, insertPos) + '\n' + providerBlock + '\n' + result.slice(insertPos);
  }

  tree.overwrite(path, result);
  return tree;
}

function createCursorRule(): Rule {
  return (tree: Tree) => {
    const rulePath = '/.cursor/rules/unopsitg-ux.mdc';
    if (tree.exists(rulePath)) {
      return tree;
    }

    const content = `---
description: Integration rules for @unopsitg/ux library
globs: ["**/*.{ts,html,scss,css,json}"]
alwaysApply: false
---

# @unopsitg/ux Integration

This project uses the @unopsitg/ux Angular library for its layout shell, brand theme, and shared components.

## Critical Integration Invariants

1. **PostCSS config must be JSON format** — use \`.postcssrc.json\`, never \`.mjs\`. Angular 21 esbuild silently ignores \`.mjs\` configs.
2. **Never put \`@source\` directives in \`.scss\` files** — Sass copies them as inert text. Use \`src/tailwind.css\` (a plain CSS file) for Tailwind directives.
3. **The \`src/tailwind.css\` wrapper** resolves \`@source\` paths from the project root where Angular runs PostCSS. Do not reference the library's \`assets/tailwind.css\` directly in \`angular.json\`.
4. **Shell utilities** (\`.hidden\`, \`.animate-scalein\`, \`.animate-fadeout\`) are shipped as real CSS in the library. Do not redefine them.

## Available Injection Tokens

| Token | Purpose | Shape |
|-------|---------|-------|
| \`MENU_MODEL\` | Sidebar menu tree | \`MenuItem[]\` |
| \`SIDEBAR_LOGO\` | Expanded/compact logo URLs | \`{ expanded, compact, alt }\` |
| \`TOPBAR_MOBILE_LOGO\` | Mobile header logos | \`{ light, dark }\` |
| \`TOPBAR_PROFILE_MENU_CONFIG\` | Profile dropdown items | \`{ items: { id, label, icon, command?, separator? }[] }\` |

## Theme

- \`LayoutService.layoutConfig()\` holds the active theme state.
- \`LayoutService.toggleDarkMode()\` synchronizes \`.app-dark\` on \`<html>\`.
- Use an \`APP_INITIALIZER\` to call \`toggleDarkMode()\` at startup to avoid a flash of wrong theme.

## Full Documentation

See \`node_modules/@unopsitg/ux/README.md\` for complete setup and configuration.
`;

    tree.create(rulePath, content);
    return tree;
  };
}

function installDependencies(): Rule {
  return (_tree: Tree, context: SchematicContext) => {
    context.addTask(new NodePackageInstallTask());
  };
}

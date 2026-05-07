import { useCallback, useMemo } from 'react';
import clsx from 'clsx';
import { $t, updatePreset, updateSurfacePalette } from '@primeuix/themes';
import { brandPresets } from '../../tokens/brand-theme';
import { useLayout } from '../../hooks/useLayout';

type PresetKey = keyof typeof brandPresets;

interface SurfacePalette {
  name: string;
  palette: Record<string, string>;
}

const surfaces: SurfacePalette[] = [
  {
    name: 'gray',
    palette: {
      0: '#ffffff', 50: '#e5e6e6', 100: '#d5d6d7', 200: '#c6c7c8',
      300: '#b6b8b9', 400: '#a7a8aa', 500: '#97999b', 600: '#808284',
      700: '#6a6b6d', 800: '#535455', 900: '#3c3d3e', 950: '#262627',
    },
  },
  {
    name: 'darkblue',
    palette: {
      0: '#ffffff', 50: '#D0EEFF', 100: '#B7E2F9', 200: '#73abc7',
      300: '#73abc7', 400: '#4d94b8', 500: '#267da9', 600: '#00669a',
      700: '#005783', 800: '#00476c', 900: '#00293e', 950: '#001a27',
    },
  },
];

const primaryColorNames = [
  'red', 'orange', 'yellow', 'lemon', 'lime', 'babygreen',
  'green', 'olive', 'teal', 'ocean', 'blue', 'darkblue',
  'midnight', 'cherry',
];

const themeOptions = [
  { name: 'Light', value: false },
  { name: 'Dark', value: true },
];

const cardStyleOptions = [
  { name: 'Transparent', value: 'transparent' },
  { name: 'Filled', value: 'filled' },
];

const menuThemeOptionsLight = [
  { name: 'Light', value: 'light' },
  { name: 'Dark', value: 'dark' },
  { name: 'Primary', value: 'primary' },
];

const menuThemeOptionsDark = [
  { name: 'Dark', value: 'dark' },
  { name: 'Primary', value: 'primary' },
];

export interface ConfiguratorProps {
  simple?: boolean;
  location?: 'app' | 'landing';
}

export function Configurator({ simple = false, location = 'app' }: ConfiguratorProps) {
  const {
    layoutConfig,
    layoutState,
    isDarkTheme,
    setLayoutConfig,
    setLayoutState,
    changeMenuMode,
  } = useLayout();

  const presetKeys = Object.keys(brandPresets) as PresetKey[];
  const menuThemeOptions = isDarkTheme ? menuThemeOptionsDark : menuThemeOptionsLight;

  const primaryColors = useMemo(() => {
    const presetPalette =
      brandPresets[layoutConfig.preset as PresetKey]?.primitive ?? {};
    const colors: Array<{ name: string; palette?: Record<string, string> }> = [
      { name: 'noir', palette: {} },
    ];
    primaryColorNames.forEach((name) => {
      const pal = (presetPalette as Record<string, unknown>)[name] as
        | Record<string, string>
        | undefined;
      if (pal) colors.push({ name, palette: pal });
    });
    return colors;
  }, [layoutConfig.preset]);

  const getPresetExt = useCallback(() => {
    const color = primaryColors.find((c) => c.name === layoutConfig.primary);
    if (!color || color.name === 'noir') {
      return {
        semantic: {
          primary: {
            50: '{surface.50}', 100: '{surface.100}', 200: '{surface.200}',
            300: '{surface.300}', 400: '{surface.400}', 500: '{surface.500}',
            600: '{surface.600}', 700: '{surface.700}', 800: '{surface.800}',
            900: '{surface.900}', 950: '{surface.950}',
          },
          colorScheme: {
            light: {
              primary: { color: '{primary.950}', contrastColor: '#ffffff', hoverColor: '{primary.800}', activeColor: '{primary.700}' },
              highlight: { background: '{primary.950}', focusBackground: '{primary.700}', color: '#ffffff', focusColor: '#ffffff' },
            },
            dark: {
              primary: { color: '{primary.50}', contrastColor: '{primary.950}', hoverColor: '{primary.200}', activeColor: '{primary.300}' },
              highlight: { background: '{primary.50}', focusBackground: '{primary.300}', color: '{primary.950}', focusColor: '{primary.950}' },
            },
          },
        },
      };
    }
    return {
      semantic: {
        primary: color.palette,
        colorScheme: {
          light: {
            primary: { color: '{primary.500}', contrastColor: '#ffffff', hoverColor: '{primary.600}', activeColor: '{primary.700}' },
            highlight: { background: '{primary.50}', focusBackground: '{primary.100}', color: '{primary.700}', focusColor: '{primary.800}' },
          },
          dark: {
            primary: { color: '{primary.400}', contrastColor: '{surface.900}', hoverColor: '{primary.300}', activeColor: '{primary.200}' },
            highlight: { background: 'color-mix(in srgb, {primary.400}, transparent 84%)', focusBackground: 'color-mix(in srgb, {primary.400}, transparent 76%)', color: 'rgba(255,255,255,.87)', focusColor: 'rgba(255,255,255,.87)' },
          },
        },
      },
    };
  }, [primaryColors, layoutConfig.primary]);

  const updateColors = useCallback(
    (type: 'primary' | 'surface', color: { name: string; palette?: Record<string, string> }) => {
      if (type === 'primary') {
        setLayoutConfig({ primary: color.name });
        updatePreset(getPresetExt());
      } else {
        setLayoutConfig({ surface: color.name });
        if (color.palette) updateSurfacePalette(color.palette);
      }
    },
    [setLayoutConfig, getPresetExt],
  );

  const onPresetChange = useCallback(
    (presetName: string) => {
      setLayoutConfig({ preset: presetName });
      const preset = brandPresets[presetName as PresetKey];
      const surfacePalette = surfaces.find((s) => s.name === layoutConfig.surface)?.palette;
      $t().preset(preset).preset(getPresetExt()).surfacePalette(surfacePalette).use({ useDefaultOptions: true });
    },
    [setLayoutConfig, layoutConfig.surface, getPresetExt],
  );

  const setMenuMode = useCallback(
    (mode: string) => {
      const isRail = mode === 'rail';
      const actualMode = isRail ? 'static' : mode;
      changeMenuMode(actualMode);
      if (isRail) {
        setLayoutState({ sidebarPinned: false });
      }
    },
    [changeMenuMode, setLayoutState],
  );

  const menuMode = useMemo(() => {
    const mode = layoutConfig.menuMode;
    const pinned = layoutState.sidebarPinned;
    return mode === 'static' && !pinned ? 'rail' : mode;
  }, [layoutConfig.menuMode, layoutState.sidebarPinned]);

  if (!layoutState.configSidebarVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999]" onClick={() => setLayoutState({ configSidebarVisible: false })}>
      <div
        className="absolute right-0 top-0 h-full w-80 bg-surface-0 dark:bg-surface-900 border-l border-surface shadow-xl overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Settings</h2>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-emphasis transition-colors"
            onClick={() => setLayoutState({ configSidebarVisible: false })}
          >
            <i className="pi pi-times" />
          </button>
        </div>

        <div className="flex flex-col gap-6">
          {/* Primary colors */}
          <div>
            <span className="text-lg text-muted-color font-semibold">Primary</span>
            <div className="pt-2 flex gap-2 flex-wrap">
              {primaryColors.map((pc) => (
                <button
                  key={pc.name}
                  type="button"
                  title={pc.name}
                  onClick={() => updateColors('primary', pc)}
                  className="w-6 h-6 cursor-pointer hover:shadow-lg rounded duration-150 flex items-center justify-center"
                  style={{
                    backgroundColor:
                      pc.name === 'noir'
                        ? 'var(--text-color)'
                        : pc.palette?.['500'] ?? '#666',
                  }}
                >
                  {pc.name === layoutConfig.primary && (
                    <i className="pi pi-check text-white text-xs" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Surface colors */}
          <div>
            <span className="text-lg text-muted-color font-semibold">Surface</span>
            <div className="pt-2 flex gap-2 flex-wrap">
              {surfaces.map((s) => (
                <button
                  key={s.name}
                  type="button"
                  title={s.name}
                  onClick={() => updateColors('surface', s)}
                  className="w-6 h-6 cursor-pointer hover:shadow-lg rounded duration-150 flex items-center justify-center"
                  style={{ backgroundColor: s.palette['500'] }}
                >
                  {(layoutConfig.surface
                    ? layoutConfig.surface === s.name
                    : isDarkTheme
                      ? s.name === 'darkblue'
                      : s.name === 'gray') && (
                    <i className="pi pi-check text-white text-xs" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Presets */}
          <div>
            <span className="text-lg text-muted-color font-semibold">Presets</span>
            <div className="pt-2 flex gap-2">
              {presetKeys.map((key) => (
                <button
                  key={key}
                  className={clsx(
                    'px-3 py-1.5 rounded-lg border text-sm transition-colors',
                    layoutConfig.preset === key
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'border-surface hover:bg-emphasis',
                  )}
                  onClick={() => onPresetChange(key)}
                >
                  {key}
                </button>
              ))}
            </div>
          </div>

          {/* Color Scheme */}
          <div>
            <span className="text-lg text-muted-color font-semibold">Color Scheme</span>
            <div className="pt-2 flex gap-2">
              {themeOptions.map((opt) => (
                <button
                  key={opt.name}
                  className={clsx(
                    'px-3 py-1.5 rounded-lg border text-sm transition-colors',
                    isDarkTheme === opt.value
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'border-surface hover:bg-emphasis',
                  )}
                  onClick={() => setLayoutConfig({ darkTheme: opt.value })}
                >
                  {opt.name}
                </button>
              ))}
            </div>
          </div>

          {/* Card Style */}
          {!simple && location === 'app' && (
            <div>
              <span className="text-lg text-muted-color font-semibold">Card Style</span>
              <div className="pt-2 flex gap-2">
                {cardStyleOptions.map((opt) => (
                  <button
                    key={opt.value}
                    className={clsx(
                      'px-3 py-1.5 rounded-lg border text-sm transition-colors',
                      layoutConfig.cardStyle === opt.value
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'border-surface hover:bg-emphasis',
                    )}
                    onClick={() => setLayoutConfig({ cardStyle: opt.value })}
                  >
                    {opt.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Menu Theme */}
          {!simple && location === 'app' && (
            <div>
              <span className="text-lg text-muted-color font-semibold">Menu Theme</span>
              <div className="pt-2 flex gap-2">
                {menuThemeOptions.map((opt) => (
                  <button
                    key={opt.value}
                    className={clsx(
                      'px-3 py-1.5 rounded-lg border text-sm transition-colors',
                      layoutConfig.menuTheme === opt.value
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'border-surface hover:bg-emphasis',
                    )}
                    onClick={() => setLayoutConfig({ menuTheme: opt.value })}
                  >
                    {opt.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Menu Type */}
          {!simple && location === 'app' && (
            <div>
              <span className="text-lg text-muted-color font-semibold">Menu Type</span>
              <div className="pt-2 flex flex-wrap flex-col gap-3">
                {[
                  ['static', 'rail'],
                  ['overlay', 'slim'],
                  ['compact', 'reveal'],
                  ['drawer', 'horizontal'],
                ].map(([a, b]) => (
                  <div key={a} className="flex">
                    {[a, b].map((mode) => (
                      <label key={mode} className="flex items-center gap-2 w-6/12 cursor-pointer">
                        <input
                          type="radio"
                          name="menuMode"
                          value={mode}
                          checked={menuMode === mode}
                          onChange={() => setMenuMode(mode)}
                          className="accent-primary-600"
                        />
                        <span className="capitalize">{mode}</span>
                      </label>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

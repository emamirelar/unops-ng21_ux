import { definePreset } from '@primeuix/themes';
import SoftBase from '@primeuix/themes/aura';
import CrispBase from '@primeuix/themes/lara';
import ContrastBase from '@primeuix/themes/nora';

/**
 * Brand theme presets built on top of PrimeUIX base presets.
 *
 * Upstream mapping (for PrimeNG docs, changelogs, and debugging):
 *   Soft     <- @primeuix/themes/aura
 *   Crisp    <- @primeuix/themes/lara
 *   Contrast <- @primeuix/themes/nora
 */

export const brandPrimitives = {
    deepsea: { 50: '#F1F5F9', 100: '#E2E8F0', 200: '#CBD5E1', 300: '#94A3B8', 400: '#64748B', 500: '#475569', 600: '#334155', 700: '#1E293B', 800: '#0F172A', 900: '#0A101D', 950: '#03080c' },
    gray: { 50: '#f0f3f4', 100: '#ECF0F5', 200: '#d8dadf', 300: '#b9bac1', 400: '#858c99', 500: '#808393', 600: '#808284', 700: '#6a6b6d', 800: '#535455', 900: '#3c3d3e', 950: '#262627' },
    red: { 50: '#f6cac6', 100: '#f0a9a4', 200: '#eb8982', 300: '#e56960', 400: '#e0493e', 500: '#da291c', 600: '#b92318', 700: '#991d14', 800: '#78170f', 900: '#57100b', 950: '#370a07' },
    orange: { 50: '#f9d6c3', 100: '#f6be9f', 200: '#f2a57a', 300: '#ef8d56', 400: '#eb7432', 500: '#e85c0e', 600: '#c54e0c', 700: '#a2400a', 800: '#803308', 900: '#5d2506', 950: '#3a1704' },
    yellow: { 50: '#fff0c5', 100: '#ffe7a1', 200: '#ffdd7e', 300: '#ffd45b', 400: '#ffcb38', 500: '#ffc215', 600: '#d9a512', 700: '#b3880f', 800: '#8c6b0c', 900: '#664e08', 950: '#403105' },
    lemon: { 50: '#fdfad0', 100: '#fcf7b4', 200: '#fbf398', 300: '#faf07c', 400: '#f9ed60', 500: '#f8ea44', 600: '#d3c73a', 700: '#aea430', 800: '#888125', 900: '#635e1b', 950: '#3e3b11' },
    lime: { 50: '#f0f5bf', 100: '#e7ef99', 200: '#dfe873', 300: '#d6e24d', 400: '#cddc26', 500: '#c4d600', 600: '#a7b600', 700: '#899600', 800: '#6c7600', 900: '#4e5600', 950: '#313600' },
    babygreen: { 50: '#e5f2cf', 100: '#d5e9b1', 200: '#c5e194', 300: '#b6d977', 400: '#a6d15a', 500: '#96c93d', 600: '#80ab34', 700: '#698d2b', 800: '#536f22', 900: '#3c5018', 950: '#26320f' },
    green: { 50: '#d2e7cd', 100: '#b7d9af', 200: '#9dca92', 300: '#82bc74', 400: '#67ad56', 500: '#4c9f38', 600: '#418730', 700: '#356f27', 800: '#2a571f', 900: '#1e4016', 950: '#13280e' },
    olive: { 50: '#d1e0d5', 100: '#b5cdbc', 200: '#99baa3', 300: '#7da889', 400: '#619570', 500: '#458257', 600: '#3b6f4a', 700: '#305b3d', 800: '#264830', 900: '#1c3423', 950: '#112116' },
    teal: { 50: '#bfeae5', 100: '#99ddd5', 200: '#73d0c6', 300: '#4dc3b6', 400: '#26b6a7', 500: '#00a997', 600: '#009080', 700: '#00766a', 800: '#005d53', 900: '#00443c', 950: '#002a26' },
    ocean: { 50: '#d3f0f7', 100: '#b8e7f3', 200: '#9edeee', 300: '#83d5e9', 400: '#69cce5', 500: '#4ec3e0', 600: '#42a6be', 700: '#37899d', 800: '#2b6b7b', 900: '#1f4e5a', 950: '#143138' },
    blue: { 50: '#DEEFFF', 100: '#C9E8FF', 150: '#99D3ED', 200: '#73c3e6', 300: '#4db3df', 400: '#26a2d8', 500: '#0092d1', 600: '#007cb2', 700: '#006692', 800: '#005073', 900: '#003a54', 950: '#002534' },
    darkblue: { 50: '#D0EEFF', 100: '#B7E2F9', 200: '#73abc7', 300: '#4d94b8', 400: '#267da9', 500: '#00669a', 600: '#005783', 700: '#00476c', 800: '#003855', 900: '#00293e', 950: '#001a27' },
    midnight: { 50: '#bfd2dd', 100: '#99b6c8', 200: '#739bb4', 300: '#4d809f', 400: '#26648b', 500: '#004976', 600: '#003e64', 700: '#003353', 800: '#002841', 850: '#001E31', 900: '#001d2f', 950: '#00121e' },
    cherry: { 50: '#e6c7d9', 100: '#d6a5c2', 200: '#c783ab', 300: '#b86294', 400: '#a8407d', 500: '#991e66', 600: '#821a57', 700: '#6b1547', 800: '#541138', 900: '#3d0c29', 950: '#26081a' }
} as const;

const brandOverrides = {
    primitive: {
        ...brandPrimitives,
        slate: brandPrimitives.gray,
        zinc: brandPrimitives.deepsea,
        neutral: brandPrimitives.gray,
        stone: brandPrimitives.gray,
        emerald: brandPrimitives.green,
        amber: brandPrimitives.yellow,
        cyan: brandPrimitives.ocean,
        sky: brandPrimitives.blue,
        indigo: brandPrimitives.darkblue,
        violet: brandPrimitives.midnight,
        purple: brandPrimitives.cherry,
        fuchsia: brandPrimitives.cherry,
        pink: brandPrimitives.cherry,
        rose: brandPrimitives.red
    },
    semantic: {
        fontFamily: '"Noto Sans", sans-serif',
        primary: {
            50: '{darkblue.50}',
            100: '{darkblue.100}',
            200: '{darkblue.200}',
            300: '{darkblue.300}',
            400: '{darkblue.400}',
            500: '{darkblue.500}',
            600: '{darkblue.600}',
            700: '{darkblue.700}',
            800: '{darkblue.800}',
            900: '{darkblue.900}',
            950: '{darkblue.950}'
        },
        colorScheme: {
            light: {
                surface: {
                    0: '#ffffff',
                    50: '{deepsea.50}',
                    100: '{deepsea.100}',
                    200: '{deepsea.200}',
                    300: '{deepsea.300}',
                    400: '{deepsea.400}',
                    500: '{deepsea.500}',
                    600: '{deepsea.600}',
                    700: '{deepsea.700}',
                    800: '{deepsea.800}',
                    900: '{deepsea.900}',
                    950: '{deepsea.950}'
                }
            },
            dark: {
                surface: {
                    0: '#ffffff',
                    50: '{darkblue.50}',
                    100: '{darkblue.100}',
                    200: '{darkblue.200}',
                    300: '{darkblue.200}',
                    400: '{darkblue.300}',
                    500: '{darkblue.400}',
                    600: '{darkblue.500}',
                    700: '{darkblue.600}',
                    800: '{darkblue.700}',
                    900: '{darkblue.900}',
                    950: '{darkblue.950}'
                }
            }
        }
    },
    components: {
        button: {
            colorScheme: {
                light: {
                    root: {
                        primary: {
                            background: '{primary.600}',
                            borderColor: '{primary.600}'
                        }
                    }
                }
            }
        },
        tag: {
            colorScheme: {
                light: {
                    secondary: { color: '{surface.800}' },
                    success: { color: '{green.800}' },
                    info: { color: '{blue.800}' },
                    warn: { color: '{orange.800}' }
                },
                dark: {
                    secondary: { color: '{surface.100}' },
                    info: { color: '{blue.100}' },
                    warn: { color: '{orange.100}' }
                }
            }
        }
    }
};

export const BrandSoft = definePreset(SoftBase, brandOverrides);
export const BrandCrisp = definePreset(CrispBase, brandOverrides);
export const BrandContrast = definePreset(ContrastBase, brandOverrides);

export const brandPresets = {
    Soft: BrandSoft,
    Crisp: BrandCrisp,
    Contrast: BrandContrast
} as const;

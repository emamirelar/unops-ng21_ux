import { LayoutService } from '@/app/layout/service/layout.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { booleanAttribute, Component, computed, inject, Input, model, OnInit, PLATFORM_ID, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { $t, updatePreset, updateSurfacePalette } from '@primeuix/themes';
import { brandPresets } from '@/app/layout/service/brand-theme';
import { PrimeNG } from 'primeng/config';
import { DrawerModule } from 'primeng/drawer';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

const presets = brandPresets;

declare type KeyOfType<T> = keyof T extends infer U ? U : never;

declare type SurfacesType = {
    name?: string;
    palette?: {
        0?: string;
        50?: string;
        100?: string;
        200?: string;
        300?: string;
        400?: string;
        500?: string;
        600?: string;
        700?: string;
        800?: string;
        900?: string;
        950?: string;
    };
};

@Component({
    selector: 'app-configurator',
    standalone: true,
    imports: [CommonModule, FormsModule, SelectButtonModule, DrawerModule, ToggleSwitchModule, RadioButtonModule],
    template: `
        <p-drawer [visible]="visible()" (onHide)="onDrawerHide()" position="right" [transitionOptions]="'.3s cubic-bezier(0, 0, 0.2, 1)'" styleClass="layout-config-sidebar w-80" header="Settings">
            <div class="flex flex-col gap-6">
                <div>
                    <span class="text-lg text-muted-color font-semibold">Primary</span>
                    <div class="pt-2 flex gap-2 flex-wrap">
                        @for (primaryColor of primaryColors(); track primaryColor.name) {
                            <button
                                type="button"
                                [title]="primaryColor.name"
                                (click)="updateColors($event, 'primary', primaryColor)"
                                class="w-6 h-6 cursor-pointer hover:shadow-lg rounded duration-150 flex items-center justify-center"
                                [style]="{
                                    'background-color': primaryColor?.name === 'noir' ? 'var(--text-color)' : primaryColor?.palette?.['500']
                                }"
                            >
                                <i *ngIf="primaryColor.name === selectedPrimaryColor()" class="pi pi-check text-white"></i>
                            </button>
                        }
                    </div>
                </div>

                <div>
                    <span class="text-lg text-muted-color font-semibold">Surface</span>
                    <div class="pt-2 flex gap-2 flex-wrap">
                        @for (surface of surfaces; track surface.name) {
                            <button
                                type="button"
                                [title]="surface.name"
                                (click)="updateColors($event, 'surface', surface)"
                                class="w-6 h-6 cursor-pointer hover:shadow-lg rounded duration-150 flex items-center justify-center"
                                [style]="{
                                    'background-color': surface?.palette?.['500']
                                }"
                            >
                                <i *ngIf="selectedSurfaceColor() ? selectedSurfaceColor() === surface.name : darkTheme() ? surface.name === 'darkblue' : surface.name === 'gray'" class="pi pi-check text-white"></i>
                            </button>
                        }
                    </div>
                </div>
                <div>
                    <div class="flex flex-col gap-2">
                        <span class="text-lg text-muted-color font-semibold">Presets</span>
                        <p-selectbutton [options]="presets" [ngModel]="selectedPreset()" (ngModelChange)="onPresetChange($event)" [allowEmpty]="false"></p-selectbutton>
                    </div>
                </div>
                <div>
                    <div class="flex flex-col gap-2">
                        <span class="text-lg text-muted-color font-semibold">Color Scheme</span>
                        <p-selectbutton [ngModel]="darkTheme()" (ngModelChange)="toggleDarkMode()" [options]="themeOptions" optionLabel="name" optionValue="value" [allowEmpty]="false"></p-selectbutton>
                    </div>
                </div>
                <div *ngIf="!simple && location === 'app'" class="flex flex-col gap-2">
                    <span class="text-lg text-muted-color font-semibold">Card Style</span>
                    <p-selectbutton [ngModel]="cardStyle()" (ngModelChange)="onCardStyleChange($event)" [options]="cardStyleOptions" optionLabel="name" optionValue="value" [allowEmpty]="false" [allowEmpty]="false" />
                </div>

                <div *ngIf="!simple && location === 'app'" class="flex flex-col gap-2">
                    <span class="text-lg text-muted-color font-semibold">Menu Theme</span>
                    <p-selectbutton [ngModel]="menuTheme()" (ngModelChange)="onMenuThemeChange($event)" [options]="menuThemeOptions" optionLabel="name" optionValue="value" [allowEmpty]="false" [allowEmpty]="false" />
                </div>

                <div *ngIf="!simple && location === 'app'">
                    <div class="flex flex-col gap-2">
                        <span class="text-lg text-muted-color font-semibold">Menu Type</span>
                        <div class="flex flex-wrap flex-col gap-3">
                            <div class="flex">
                                <div class="flex items-center gap-2 w-6/12">
                                    <p-radiobutton name="menuMode" value="static" [(ngModel)]="menuMode" (ngModelChange)="setMenuMode('static')" inputId="static"></p-radiobutton>
                                    <label for="static">Static</label>
                                </div>

                                <div class="flex items-center gap-2 w-6/12">
                                    <p-radiobutton name="menuMode" value="overlay" [(ngModel)]="menuMode" (ngModelChange)="setMenuMode('overlay')" inputId="overlay"></p-radiobutton>
                                    <label for="overlay">Overlay</label>
                                </div>
                            </div>
                            <div class="flex">
                                <div class="flex items-center gap-2 w-6/12">
                                    <p-radiobutton name="menuMode" value="slim" [(ngModel)]="menuMode" (ngModelChange)="setMenuMode('slim')" inputId="slim"></p-radiobutton>
                                    <label for="slim">Slim</label>
                                </div>
                                <div class="flex items-center gap-2 w-6/12">
                                    <p-radiobutton name="menuMode" value="compact" [(ngModel)]="menuMode" (ngModelChange)="setMenuMode('compact')" inputId="compact"></p-radiobutton>
                                    <label for="compact">Compact</label>
                                </div>
                            </div>
                            <div class="flex">
                                <div class="flex items-center gap-2 w-6/12">
                                    <p-radiobutton name="menuMode" value="reveal" [(ngModel)]="menuMode" (ngModelChange)="setMenuMode('reveal')" inputId="reveal"></p-radiobutton>
                                    <label for="reveal">Reveal</label>
                                </div>
                                <div class="flex items-center gap-2 w-6/12">
                                    <p-radiobutton name="menuMode" value="drawer" [(ngModel)]="menuMode" (ngModelChange)="setMenuMode('drawer')" inputId="drawer"></p-radiobutton>
                                    <label for="drawer">Drawer</label>
                                </div>
                            </div>
                            <div class="flex">
                                <div class="flex items-center gap-2 w-6/12">
                                    <p-radiobutton name="menuMode" value="horizontal" [(ngModel)]="menuMode" (ngModelChange)="setMenuMode('horizontal')" inputId="horizontal"></p-radiobutton>
                                    <label for="horizontal">Horizontal</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </p-drawer>
    `
})
export class AppConfigurator implements OnInit {
    @Input({ transform: booleanAttribute }) simple: boolean = false;

    @Input() location: string = 'app';

    router = inject(Router);

    config: PrimeNG = inject(PrimeNG);

    layoutService: LayoutService = inject(LayoutService);

    platformId = inject(PLATFORM_ID);

    primeng = inject(PrimeNG);

    presets = Object.keys(presets);

    themeOptions = [
        { name: 'Light', value: false },
        { name: 'Dark', value: true }
    ];

    menuThemeOptions: { name: string; value: string }[] = [];

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.onPresetChange(this.layoutService.layoutConfig().preset);
        }
        this.updateMenuThemeOptions();
    }

    updateMenuThemeOptions() {
        if (this.darkTheme()) {
            this.menuThemeOptions = [
                { name: 'Dark', value: 'dark' },
                { name: 'Primary', value: 'primary' }
            ];
        } else {
            this.menuThemeOptions = [
                { name: 'Light', value: 'light' },
                { name: 'Dark', value: 'dark' },
                { name: 'Primary', value: 'primary' }
            ];
        }
    }

    surfaces: SurfacesType[] = [
        {
            name: 'gray',
            palette: {
                0: '#ffffff',
                50: '#e5e6e6',
                100: '#d5d6d7',
                200: '#c6c7c8',
                300: '#b6b8b9',
                400: '#a7a8aa',
                500: '#97999b',
                600: '#808284',
                700: '#6a6b6d',
                800: '#535455',
                900: '#3c3d3e',
                950: '#262627'
            }
        },
        {
            name: 'darkblue',
            palette: {
                0: '#ffffff',
                50: '#D0EEFF',
                100: '#B7E2F9',
                200: '#73abc7',
                300: '#73abc7',
                400: '#4d94b8',
                500: '#267da9',
                600: '#00669a',
                700: '#005783',
                800: '#00476c',
                900: '#00293e',
                950: '#001a27'
            }
        }
    ];

    selectedPrimaryColor = computed(() => {
        return this.layoutService.layoutConfig().primary;
    });

    selectedSurfaceColor = computed(() => this.layoutService.layoutConfig().surface);

    selectedPreset = computed(() => this.layoutService.layoutConfig().preset);

    menuMode = model(this.layoutService.layoutConfig().menuMode);

    cardStyle = model(this.layoutService.layoutConfig().cardStyle);

    visible: Signal<boolean> = computed(() => this.layoutService.layoutState().configSidebarVisible);

    darkTheme = computed(() => this.layoutService.layoutConfig().darkTheme);

    selectedSurface = computed(() => this.layoutService.layoutConfig().surface);

    cardStyleOptions = [
        { name: 'Transparent', value: 'transparent' },
        { name: 'Filled', value: 'filled' }
    ];

    primaryColors = computed<SurfacesType[]>(() => {
        const presetPalette = presets[this.layoutService.layoutConfig().preset as KeyOfType<typeof presets>].primitive;
        const colors = ['red', 'orange', 'yellow', 'lemon', 'lime', 'babygreen', 'green', 'olive', 'teal', 'ocean', 'blue', 'darkblue', 'midnight', 'cherry'];
        const palettes: SurfacesType[] = [{ name: 'noir', palette: {} }];

        colors.forEach((color) => {
            palettes.push({
                name: color,
                palette: presetPalette?.[color as KeyOfType<typeof presetPalette>] as SurfacesType['palette']
            });
        });

        return palettes;
    });

    menuTheme = computed(() => this.layoutService.layoutConfig().menuTheme);

    getPresetExt() {
        const color: SurfacesType = this.primaryColors().find((c) => c.name === this.selectedPrimaryColor()) || {};

        if (color.name === 'noir') {
            return {
                semantic: {
                    primary: {
                        50: '{surface.50}',
                        100: '{surface.100}',
                        200: '{surface.200}',
                        300: '{surface.300}',
                        400: '{surface.400}',
                        500: '{surface.500}',
                        600: '{surface.600}',
                        700: '{surface.700}',
                        800: '{surface.800}',
                        900: '{surface.900}',
                        950: '{surface.950}'
                    },
                    colorScheme: {
                        light: {
                            primary: {
                                color: '{primary.950}',
                                contrastColor: '#ffffff',
                                hoverColor: '{primary.800}',
                                activeColor: '{primary.700}'
                            },
                            highlight: {
                                background: '{primary.950}',
                                focusBackground: '{primary.700}',
                                color: '#ffffff',
                                focusColor: '#ffffff'
                            }
                        },
                        dark: {
                            primary: {
                                color: '{primary.50}',
                                contrastColor: '{primary.950}',
                                hoverColor: '{primary.200}',
                                activeColor: '{primary.300}'
                            },
                            highlight: {
                                background: '{primary.50}',
                                focusBackground: '{primary.300}',
                                color: '{primary.950}',
                                focusColor: '{primary.950}'
                            }
                        }
                    }
                }
            };
        } else {
            return {
                semantic: {
                    primary: color.palette,
                    colorScheme: {
                        light: {
                            primary: {
                                color: '{primary.500}',
                                contrastColor: '#ffffff',
                                hoverColor: '{primary.600}',
                                activeColor: '{primary.700}'
                            },
                            highlight: {
                                background: '{primary.50}',
                                focusBackground: '{primary.100}',
                                color: '{primary.700}',
                                focusColor: '{primary.800}'
                            }
                        },
                        dark: {
                            primary: {
                                color: '{primary.400}',
                                contrastColor: '{surface.900}',
                                hoverColor: '{primary.300}',
                                activeColor: '{primary.200}'
                            },
                            highlight: {
                                background: 'color-mix(in srgb, {primary.400}, transparent 84%)',
                                focusBackground: 'color-mix(in srgb, {primary.400}, transparent 76%)',
                                color: 'rgba(255,255,255,.87)',
                                focusColor: 'rgba(255,255,255,.87)'
                            }
                        }
                    }
                }
            };
        }
    }

    updateColors(event: any, type: string, color: any) {
        if (type === 'primary') {
            this.layoutService.layoutConfig.update((state) => ({
                ...state,
                primary: color.name
            }));
        } else if (type === 'surface') {
            this.layoutService.layoutConfig.update((state) => ({
                ...state,
                surface: color.name
            }));
        }
        this.applyTheme(type, color);

        event.stopPropagation();
    }

    applyTheme(type: string, color: any) {
        if (type === 'primary') {
            updatePreset(this.getPresetExt());
        } else if (type === 'surface') {
            updateSurfacePalette(color.palette);
        }
    }

    onPresetChange(event: any) {
        this.layoutService.layoutConfig.update((state) => ({
            ...state,
            preset: event
        }));
        const preset = presets[event as KeyOfType<typeof presets>];
        const surfacePalette = this.surfaces.find((s) => s.name === this.selectedSurfaceColor())?.palette;
        $t().preset(preset).preset(this.getPresetExt()).surfacePalette(surfacePalette).use({ useDefaultOptions: true });
    }

    onDrawerHide() {
        this.layoutService.layoutState.update((prev) => ({ ...prev, configSidebarVisible: false }));
    }

    onCardStyleChange(value: string) {
        this.layoutService.layoutConfig.update((state) => ({
            ...state,
            cardStyle: value
        }));
    }

    onMenuThemeChange(value: string) {
        this.layoutService.layoutConfig.update((state) => ({
            ...state,
            menuTheme: value
        }));
    }

    setMenuMode(mode: string) {
        this.layoutService.layoutConfig.update((state) => ({
            ...state,
            menuMode: mode
        }));

        if (this.menuMode() === 'static') {
            this.layoutService.layoutState.update((state) => ({
                ...state,
                staticMenuDesktopInactive: false
            }));
        }
    }

    toggleDarkMode() {
        this.executeDarkModeToggle();
    }

    executeDarkModeToggle() {
        this.layoutService.layoutConfig.update((state) => ({
            ...state,
            darkTheme: !state.darkTheme
        }));
        if (this.darkTheme()) {
            this.setMenuTheme('dark');
        }
        this.updateMenuThemeOptions();
    }

    toggleConfigSidebar() {
        this.layoutService.layoutState.update((val) => ({ ...val, configSidebarVisible: !val.configSidebarVisible }));
    }

    setMenuTheme(theme: string) {
        this.layoutService.layoutConfig.update((state) => ({
            ...state,
            menuTheme: theme
        }));
    }
}

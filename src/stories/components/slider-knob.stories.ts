import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { action } from 'storybook/actions';
import { SliderModule } from 'primeng/slider';
import { KnobModule } from 'primeng/knob';
import { RatingModule } from 'primeng/rating';
import { ColorPickerModule } from 'primeng/colorpicker';

const meta: Meta = {
    title: 'Components/FormInputs/RangeInput',
    decorators: [
        moduleMetadata({
            imports: [CommonModule, FormsModule, SliderModule, KnobModule, RatingModule, ColorPickerModule]
        })
    ],
    parameters: {
        docs: {
            description: {
                component:
                    'Continuous value inputs: `p-slider` (including range), circular `p-knob`, star `p-rating`, and `p-colorpicker` for choosing colors. Useful for volumes, scores, weights, and theme accents.'
            }
        }
    }
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
    render: () => ({
        props: {
            value: 35,
            onChange: action('onChange'),
            onSlideEnd: action('onSlideEnd')
        },
        template: `
      <p-slider [(ngModel)]="value" [style]="{ width: '320px' }" (onChange)="onChange($event)" (onSlideEnd)="onSlideEnd($event)" />
      <p style="margin-top:0.75rem; font-size:0.875rem;">Value: {{ value }}</p>
    `
    })
};

export const AllVariants: Story = {
    render: () => ({
        props: {
            slide: 30,
            knob: 65,
            rating: 4,
            color: '#6366f1',
            onSliderChange: action('sliderOnChange'),
            onKnobChange: action('knobOnChange'),
            onRate: action('onRate'),
            onColorChange: action('onChange')
        },
        template: `
      <div style="display:flex; flex-direction:column; gap: 2rem; max-width: 360px;">
        <div>
          <div style="font-size:0.75rem; margin-bottom:0.35rem; opacity:0.8;">Slider</div>
          <p-slider [(ngModel)]="slide" (onChange)="onSliderChange($event)" />
        </div>
        <div>
          <div style="font-size:0.75rem; margin-bottom:0.35rem; opacity:0.8;">Knob</div>
          <p-knob [(ngModel)]="knob" [size]="120" (onChange)="onKnobChange($event)" />
        </div>
        <div>
          <div style="font-size:0.75rem; margin-bottom:0.35rem; opacity:0.8;">Rating</div>
          <p-rating [(ngModel)]="rating" (onRate)="onRate($event)" />
        </div>
        <div>
          <div style="font-size:0.75rem; margin-bottom:0.35rem; opacity:0.8;">ColorPicker</div>
          <p-colorpicker [(ngModel)]="color" [inline]="true" (onChange)="onColorChange($event)" />
        </div>
      </div>
    `
    })
};

export const Disabled: Story = {
    render: () => ({
        props: {
            slide: 50,
            knob: 40,
            rating: 2,
            color: '#94a3b8',
            onChange: action('onChange'),
            onRate: action('onRate')
        },
        template: `
      <div style="display:flex; flex-direction:column; gap: 1.5rem;">
        <p-slider [(ngModel)]="slide" [disabled]="true" />
        <p-knob [(ngModel)]="knob" [readonly]="true" />
        <p-rating [(ngModel)]="rating" [readonly]="true" (onRate)="onRate($event)" />
        <p-colorpicker [(ngModel)]="color" [disabled]="true" (onChange)="onChange($event)" />
      </div>
    `
    })
};

export const SliderRange: Story = {
    render: () => ({
        props: {
            values: [20, 70] as number[],
            onChange: action('onChange'),
            onSlideEnd: action('onSlideEnd')
        },
        template: `
      <p-slider [(ngModel)]="values" [range]="true" [style]="{ width: '360px' }" (onChange)="onChange($event)" (onSlideEnd)="onSlideEnd($event)" />
      <p style="margin-top:0.75rem; font-size:0.875rem;">Range: {{ values?.[0] }} – {{ values?.[1] }}</p>
    `
    })
};

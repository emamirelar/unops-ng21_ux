import type { Meta, StoryObj } from '@storybook/angular';
import { TestimonialCardWidget } from '@/app/pages/landing/components/testimonialcardwidget';

/** Shape expected by `TestimonialCardWidget` template (`message`, `name`, `title`, `avatar`). */
interface TestimonialCardData {
    message: string;
    name: string;
    title: string;
    avatar: string;
}

interface TestimonialCardStoryArgs {
    testimonial: TestimonialCardData;
    className: string;
}

const meta: Meta<TestimonialCardStoryArgs> = {
    title: 'Blocks/Landing/TestimonialCard',
    component: TestimonialCardWidget,
    parameters: {
        docs: {
            description: {
                component:
                    'Single testimonial card: quoted message, circular avatar, author name, and subtitle; optional extra classes on the card container.'
            }
        }
    },
    args: {
        testimonial: {
            message:
                'The platform cut our reporting time in half and gave leadership a clear, live view of operations. Support has been outstanding from day one.',
            name: 'Alex Morgan',
            title: 'Director of Programs, North Region',
            avatar: '/demo/images/avatar/amyelsner.png'
        },
        className: ''
    },
    argTypes: {
        testimonial: {
            control: 'object',
            description: 'Testimonial payload: `message` (quote body), `name`, `title` (role/company line), and `avatar` (image URL).'
        },
        className: {
            control: 'text',
            description: 'Optional CSS class string applied to the card via ngClass.'
        }
    }
};

export default meta;
type Story = StoryObj<TestimonialCardStoryArgs>;

export const Default: Story = {};

export const WithCustomClass: Story = {
    args: {
        className: 'shadow-[0px_14px_14px_0px_rgba(0,0,0,0.03)] bg-surface-50 dark:bg-surface-900'
    }
};

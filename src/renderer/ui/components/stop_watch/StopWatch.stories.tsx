import { ComponentProps } from 'react';
import type { Story } from '@storybook/react';
import StopWatch from './StopWatch';
export default {
  title: 'StopWatch',
  component: StopWatch,
};
const Template: Story<ComponentProps<typeof StopWatch>> = (args) => (
  <StopWatch {...args} />
);
export const FirstStory = Template;
FirstStory.args = {};

import { ComponentProps } from 'react';
import type { Story } from '@storybook/react';
import Digit from './Digit';
export default {
  title: 'Digit',
  component: Digit,
};
const Template: Story<ComponentProps<typeof Digit>> = (args) => (
  <Digit {...args} />
);
export const FirstStory = Template;
FirstStory.args = {};

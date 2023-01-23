import { ComponentProps } from 'react';
import type { Story } from '@storybook/react';
import MainButton from './MainButton';
export default {
  title: 'MainButton',
  component: MainButton,
};
const Template: Story<ComponentProps<typeof MainButton>> = (args) => (
  <MainButton {...args} />
);
export const FirstStory = Template;
FirstStory.args = { state: 'loading' };

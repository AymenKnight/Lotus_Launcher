import { ComponentProps } from 'react';
import type { Story } from '@storybook/react';
import AppContainer from './AppContainer';
export default {
  title: 'AppContainer',
  component: AppContainer,
};
const Template: Story<ComponentProps<typeof AppContainer>> = (args) => (
  <AppContainer {...args} />
);
export const FirstStory = Template;
FirstStory.args = {};

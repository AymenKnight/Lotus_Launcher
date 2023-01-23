import { ComponentProps } from 'react';
import type { Story } from '@storybook/react';
import MainLogo from './MainLogo';
export default {
  title: 'MainLogo',
  component: MainLogo,
};
const Template: Story<ComponentProps<typeof MainLogo>> = (args) => (
  <MainLogo {...args} />
);
export const FirstStory = Template;
FirstStory.args = {};

import { ComponentProps } from 'react';
import type { Story } from '@storybook/react';
import ServicesStatus from './ServicesStatus';
export default {
  title: 'ServicesStatus',
  component: ServicesStatus,
};
const Template: Story<ComponentProps<typeof ServicesStatus>> = (args) => (
  <ServicesStatus {...args} />
);
export const FirstStory = Template;
FirstStory.args = {
  name: 'Clinicord services',
  state: 'started',
};

import { ComponentProps } from 'react';
import type { Story } from '@storybook/react';
import IpDisplay from './IpDisplay';
export default {
  title: 'IpDisplay',
  component: IpDisplay,
};
const Template: Story<ComponentProps<typeof IpDisplay>> = (args) => (
  <IpDisplay {...args} />
);
export const FirstStory = Template;
FirstStory.args = { ipAdr: '192.168.2.323' };

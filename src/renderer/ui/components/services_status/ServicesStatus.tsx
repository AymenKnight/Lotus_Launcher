import LoadingSpinner from '@components/loading_spinner';
import Check from 'toSvg/check_mark.svg?icon';
import Stopped from 'toSvg/x_mark.svg?icon';
import './style/index.scss';
import { color } from '@assets/styles/color';
interface ServicesStatusProps {
  name: string;
  state: 'running' | 'stopped' | 'loading';
}
export default function ServicesStatus({ name, state }: ServicesStatusProps) {
  return (
    <div className="services-status">
      <div
        className="loading-wrapper"
        css={{
          border: `  2px solid ${
            state == 'loading'
              ? color.warm_orange
              : state == 'running'
              ? color.good_green
              : color.silver_gray
          };`,
        }}
      >
        {state == 'loading' ? (
          <LoadingSpinner />
        ) : state == 'running' ? (
          <Check width={14} height={14} />
        ) : (
          <Stopped width={10} height={10} />
        )}
      </div>
      <div className="span-containers">
        <span>{name}</span>
        <span>- {state}</span>
      </div>
    </div>
  );
}

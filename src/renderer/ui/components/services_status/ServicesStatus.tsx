import LoadingSpinner from '@components/loading_spinner';
import Check from 'toSvg/check_mark.svg?icon';
import Stopped from 'toSvg/x_mark.svg?icon';
import './style/index.scss';
import { color } from '@assets/styles/color';
import { DBServerState } from '@stores/dbServerStore';
interface ServicesStatusProps {
  name: string;
  state: Pick<DBServerState,"serverState">["serverState"];
}
export default function ServicesStatus({ name, state }: ServicesStatusProps) {
  return (
    <div className="services-status">
      <div
        className="loading-wrapper"
        css={{
          border: `  2px solid ${
            state == 'stoping' || state == 'starting'
              ? color.warm_orange
              : state == 'started'
              ? color.good_green
              : color.silver_gray
          };`,
        }}
      >
        {state != 'stopped' && state != 'started'&& state!="error" ? (
          <LoadingSpinner
            borderColor={'transparent'}
            borderTopColor={color.warm_orange}
          />
        ) : state == 'started' ? (
          <Check width={14} height={14} />
        ) : (
          state == 'error' && <Stopped width={10} height={10} />
        )}
      </div>
      <div className="span-containers">
        <span>{name}</span>
        <span>- {state}</span>
      </div>
    </div>
  );
}

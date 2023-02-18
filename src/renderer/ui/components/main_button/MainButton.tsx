import Power from 'toSvg/power.svg?icon';
import './style/index.scss';
import { color } from '@assets/styles/color';
import TextButton from '@components/buttons/text_button';
import LoadingSpinner from '@components/loading_spinner';
import StopWatch from '@components/stop_watch';
import { DBServerState } from '@stores/dbServerStore';

interface MainButtonProps {
  onPress?: () => void;
  state: Pick<DBServerState,"serverState">["serverState"];
}
export default function MainButton({ onPress, state }: MainButtonProps) {
  return (
    <div className="main-button">
      <div
        className="button-border"
        css={{
          border: `5px solid ${
            state == 'started' ? color.good_green : color.coldBlack
          }`,
        }}
      >
        {state != 'started' && state != 'stopped'&& state!="error" ? (
          <div className="loading-container">
            <LoadingSpinner
              width={80}
              height={80}
              borderColor={color.white}
              borderTopColor={color.hot_purple}
              borderWidth={10}
            />
          </div>
        ) : (
          <TextButton
            backgroundColor={
              state == 'started' ? color.cold_blue : color.silver_gray
            }
            afterBgColor={state == 'started' ? color.hot_red : color.good_green}
            radius={'100%'}
            width={150}
            height={150}
            onPress={onPress}
          >
            <Power width={80} height={80} />
          </TextButton>
        )}
      </div>
      <span
        css={{
          color:
            state == 'started'
              ? color.good_green
              : state == 'stoping'
              ? color.hot_red
              : state == 'stopped'
              ?color.silver_gray: color.warm_orange,
        }}
      >
        {state == 'started'
          ? 'Server is running'
          : state == 'stopped'
          ? 'Click to start'
          
          : state == 'stoping'
          ? 'Stopping please wait'
          : state=="error"?'Error please restart'
          : 'Starting please wait'}
      </span>

      {state == 'started' && <StopWatch />}
    </div>
  );
}

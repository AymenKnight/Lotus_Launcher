import Power from 'toSvg/power.svg?icon';
import './style/index.scss';
import { color } from '@assets/styles/color';
import TextButton from '@components/buttons/text_button';
import LoadingSpinner from '@components/loading_spinner';
import ReactStopwatch from 'react-stopwatch';

interface MainButtonProps {
  onPress?: () => void;
  state: 'started' | 'stopped' | 'start' | 'shutdown' | 'loading';
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
        {state == 'loading' ? (
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
              state == 'started'
                ? color.cold_blue
                : state == 'stopped'
                ? color.silver_gray
                : state == 'start'
                ? color.good_green
                : color.hot_red
            }
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
              : state == 'stopped'
              ? color.silver_gray
              : state == 'start'
              ? color.cold_blue
              : state == 'shutdown'
              ? color.hot_red
              : color.warm_orange,
        }}
      >
        {state == 'started'
          ? 'Started'
          : state == 'stopped'
          ? 'Stopped'
          : state == 'start'
          ? 'Click to start'
          : state == 'shutdown'
          ? 'Restart'
          : 'Starting please wait'}
      </span>

      {state == 'started' && (
        <ReactStopwatch
          seconds={0}
          minutes={0}
          hours={0}
          onChange={({
            hours,
            minutes,
            seconds,
          }: {
            hours: number;
            minutes: number;
            seconds: number;
          }) => {
            // do something
          }}
          onCallback={() => console.log('Finish')}
          render={({ formatted }: { formatted: string }) => {
            return <span>{formatted}</span>;
          }}
        />
      )}
    </div>
  );
}

import { useStopwatch } from 'react-timer-hook';
import './style/index.scss';
import Digit from './components/digit';
interface StopWatchProps {}
export default function StopWatch({}: StopWatchProps) {
  const { hours, minutes, seconds } = useStopwatch({ autoStart: true });

  return (
    <div className="stop-watch">
      <Digit value={hours} />
      <span className="colon">:</span>
      <Digit value={minutes} />
      <span className="colon">:</span>
      <Digit value={seconds} />
    </div>
  );
}

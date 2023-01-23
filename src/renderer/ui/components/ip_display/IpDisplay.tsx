import SquareIconButton from '@components/buttons/square_icon_button/SquareIconButton';
import threeDots from 'toSvg/threedots.svg?icon';
import './style/index.scss';
interface IpDisplayProps {
  ipAdr: string;
}
export default function IpDisplay({ ipAdr }: IpDisplayProps) {
  return (
    <div className="ip-display">
      <span>{ipAdr}</span>
      <SquareIconButton Icon={threeDots} tip="menu" onPress={() => {}} />
    </div>
  );
}

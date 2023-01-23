import { color } from '@assets/styles/color';
import './style/index.scss';

interface LoadingSpinnerProps {
  width?: number;
  height?: number;
  borderWidth?: number;
  borderColor?: string;
  borderTopColor?: string;
}
export default function LoadingSpinner({
  width = 10,
  height = 10,
  borderWidth = 2,
  borderColor = color.white,
  borderTopColor = color.cold_red,
}: LoadingSpinnerProps) {
  return (
    <div
      className="loading-container"
      css={{
        width: width,
        height: height,
        border: `${borderWidth}px solid ${borderColor}`,
        borderTopColor: borderTopColor,
      }}
    ></div>
  );
}

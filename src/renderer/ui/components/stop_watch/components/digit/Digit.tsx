import './style/index.scss';
interface DigitProps {
  value: number;
}
export default function Digit({ value }: DigitProps) {
  const leftDigit = value >= 10 ? value.toString()[0] : '0';
  const rightDigit = value >= 10 ? value.toString()[1] : value.toString();
  return (
    <span className="digit">
      {leftDigit}
      {rightDigit}
    </span>
  );
}

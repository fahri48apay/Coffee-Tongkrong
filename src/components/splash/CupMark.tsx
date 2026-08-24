// Logo mark cangkir — port cupSVG dari board splash/demo (paritas vektor).
import Svg, { Ellipse, Path, Rect } from "react-native-svg";
import { theme } from "../../theme/theme";

export function CupMark({ size = 58 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 58 58">
      <Rect x={10} y={20} width={30} height={26} rx={7} fill={theme.color.textPrimary} />
      <Path
        d="M40 25 h4 a7 7 0 010 14 h-4"
        fill="none"
        stroke={theme.color.textPrimary}
        strokeWidth={4}
      />
      <Path d="M14 20 c0-5 22-5 22 0" fill={theme.color.caramel} />
      <Rect x={14} y={26} width={22} height={4} rx={2} fill={theme.color.caramel} opacity={0.55} />
      <Ellipse cx={41} cy={47} rx={16} ry={3} fill={theme.color.caramel} opacity={0.3} />
    </Svg>
  );
}

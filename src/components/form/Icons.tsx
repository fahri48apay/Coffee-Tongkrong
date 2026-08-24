// Ikon garis kecil — port path SVG dari login.html (stroke mengikuti warna).
import Svg, { Circle, Path, Rect } from "react-native-svg";

const base = {
  fill: "none",
  stroke: "currentColor" as const,
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function MailIcon({ size = 20, color }: { size?: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" {...base} stroke={color}>
      <Rect x={3.5} y={5.5} width={17} height={13} rx={2.5} />
      <Path d="m4.5 7 7.5 5.5L19.5 7" />
    </Svg>
  );
}

export function LockIcon({ size = 20, color }: { size?: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" {...base} stroke={color}>
      <Rect x={4.5} y={10.5} width={15} height={9.5} rx={2.5} />
      <Path d="M8 10.5V8a4 4 0 1 1 8 0v2.5" />
      <Circle cx={12} cy={15.2} r={1.4} fill={color} stroke="none" />
    </Svg>
  );
}

export function EyeIcon({ size = 21, color }: { size?: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" {...base} stroke={color}>
      <Path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12Z" />
      <Circle cx={12} cy={12} r={2.6} />
    </Svg>
  );
}

export function EyeOffIcon({ size = 21, color }: { size?: number; color: string }) {
  // variasi mata tertutup — garis mata + hash sederhana (fungsi sama dgn login.html)
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" {...base} stroke={color}>
      <Path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12Z" opacity={0.45} />
      <Path d="M4 20 20 4" />
    </Svg>
  );
}

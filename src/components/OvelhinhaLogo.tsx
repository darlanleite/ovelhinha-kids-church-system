interface OvelhinhaLogoProps {
  size?: number;
  white?: boolean;
}

const OvelhinhaLogo = ({ size = 32, white = false }: OvelhinhaLogoProps) => {
  const woolColor = white ? 'white' : '#F0EDE8';
  const legColor = white ? 'rgba(255,255,255,0.7)' : '#D9D4CC';
  const faceColor = white ? 'rgba(255,255,255,0.25)' : '#5B8CFF';
  const eyeColor = white ? '#5B8CFF' : 'white';
  const noseColor = white ? 'rgba(255,255,255,0.15)' : '#3D6FE8';

  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none">
      {/* Corpo da lã */}
      <circle cx="22" cy="26" r="13" fill={woolColor} />
      <circle cx="34" cy="26" r="11" fill={woolColor} />
      <circle cx="28" cy="20" r="11" fill={woolColor} />
      <circle cx="18" cy="22" r="9" fill={woolColor} />
      <circle cx="36" cy="22" r="9" fill={woolColor} />
      {/* Rosto */}
      <ellipse cx="28" cy="31" rx="9" ry="8" fill={faceColor} />
      {/* Olhos */}
      <circle cx="25" cy="30" r="1.5" fill={eyeColor} />
      <circle cx="31" cy="30" r="1.5" fill={eyeColor} />
      {/* Nariz/boca */}
      <ellipse cx="28" cy="33.5" rx="2" ry="1.2" fill={noseColor} />
      {/* Pulseira */}
      <rect x="38" y="34" width="12" height="5" rx="2.5" fill="#FFB347" />
      <circle cx="44" cy="36.5" r="1.5" fill="#FF8C00" opacity="0.7" />
      {/* Perninhas */}
      <rect x="22" y="38" width="4" height="8" rx="2" fill={legColor} />
      <rect x="30" y="38" width="4" height="8" rx="2" fill={legColor} />
    </svg>
  );
};

export default OvelhinhaLogo;

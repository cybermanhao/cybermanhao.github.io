import type { FC, CSSProperties } from 'react';

interface GlitchTextProps {
  text: string;
  speed?: number;
  enableShadows?: boolean;
  className?: string;
}

interface CustomCSSProperties extends CSSProperties {
  '--after-duration': string;
  '--before-duration': string;
  '--after-shadow': string;
  '--before-shadow': string;
}

const GlitchText: FC<GlitchTextProps> = ({
  text,
  speed = 1,
  enableShadows = true,
  className = ''
}) => {
  const inlineStyles: CustomCSSProperties = {
    '--after-duration': `${speed * 3}s`,
    '--before-duration': `${speed * 2}s`,
    '--after-shadow': enableShadows ? '-5px 0 oklch(0.65 0.28 328)' : 'none',
    '--before-shadow': enableShadows ? '5px 0 oklch(0.82 0.15 192)' : 'none'
  };

  const combinedClasses = `glitch-text relative inline-block select-none ${className}`;

  return (
    <div style={inlineStyles} data-text={text} className={combinedClasses}>
      {text}
    </div>
  );
};

export default GlitchText;

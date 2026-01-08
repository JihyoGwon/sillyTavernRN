import { useColorScheme } from 'react-native';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: 'background' | 'text'
) {
  const colorScheme = useColorScheme();
  const theme = colorScheme ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  }

  // 기본 테마 색상
  const colors = {
    light: {
      background: '#ffffff',
      text: '#11181C',
    },
    dark: {
      background: '#151718',
      text: '#ECEDEE',
    },
  };

  return colors[theme][colorName];
}


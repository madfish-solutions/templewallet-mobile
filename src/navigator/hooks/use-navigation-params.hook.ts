import { useRoute } from '@react-navigation/native';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const useNavigationParams = (key: string) => useRoute().params?.[key] ?? '';

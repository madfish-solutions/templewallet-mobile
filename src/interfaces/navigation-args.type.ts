import { ParamListBase } from '@react-navigation/native';

export type NavigationArgsType<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList
> = undefined extends ParamList[RouteName]
  ? [RouteName] | [RouteName, ParamList[RouteName]]
  : [RouteName, ParamList[RouteName]];

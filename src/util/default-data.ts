import { Status, User } from '../../shared/types';

export const statuses: Status[] = [{
  added: 100,
  color: '#1db954',
  type: 'spotify',
  updated: 100,
  icon: '🔄',
  priority: 1,
  public: true,
  save: true,
  text: 'Loading...',
}];

export const user: User = {
  bio: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.",
  name: "Loading...",
  profile_image: "data:image/svg+xml,%3Csvg width='200px' height='200px' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='xMidYMid' class='lds-dual-ring' style='background: rgb(234, 234, 234);'%3E%3Ccircle cx='50' cy='50' ng-attr-r='%7B%7Bconfig.radius%7D%7D' ng-attr-stroke-width='%7B%7Bconfig.width%7D%7D' ng-attr-stroke='%7B%7Bconfig.stroke%7D%7D' ng-attr-stroke-dasharray='%7B%7Bconfig.dasharray%7D%7D' fill='none' stroke-linecap='round' r='40' stroke-width='4' stroke='%231d0e0b' stroke-dasharray='62.83185307179586 62.83185307179586' transform='rotate(119.923 50 50)'%3E%3CanimateTransform attributeName='transform' type='rotate' calcMode='linear' values='0 50 50;360 50 50' keyTimes='0;1' dur='1s' begin='0s' repeatCount='indefinite'%3E%3C/animateTransform%3E%3C/circle%3E%3C/svg%3E",
};

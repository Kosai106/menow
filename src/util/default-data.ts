import { Status, User } from '../../shared/types';

export const statuses: Status[] = [{
  added: 100,
  color: '#1db954',
  type: 'spotify',
  updated: 100,
  icon: '🎧',
  link: 'https://open.spotify.com/user/leolabs/playlist/6zCmLKwSeeRb6OLdZ2Xf3i',
  link_text: 'Cinematic Work',
  priority: 1,
  public: true,
  save: true,
  text: 'Listening to Music',
}, {
  added: 100,
  color: '#26477d',
  type: 'coworking',
  updated: 100,
  icon: '⛪️',
  link: 'https://aachen.digital',
  link_text: 'At digitalHub Aachen',
  priority: 1,
  public: true,
  save: true,
  text: 'Co-Working',
}, {
  added: 100,
  color: '#006FC5',
  type: 'coding',
  updated: 100,
  icon: '🚀',
  link_text: 'In Visual Studio Code',
  priority: 1,
  public: true,
  save: true,
  text: 'Programming',
}];

export const user: User = {
  bio: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.",
  name: "Loading...",
  profile_image: "",
};

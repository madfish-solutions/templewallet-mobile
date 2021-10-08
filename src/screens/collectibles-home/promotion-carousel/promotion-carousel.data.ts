import { blue, orange } from '../../../config/styles';

export interface PromotionCarouselItemInterface {
  backgroundColor: string;
  emojisArray: string[];
}

export const promotionCarouselData: PromotionCarouselItemInterface[] = [
  {
    backgroundColor: blue,
    emojisArray: [
      'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/144/apple/118/japanese-ogre_1f479.png',
      'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/144/apple/118/pile-of-poo_1f4a9.png',
      'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/144/apple/118/alien-monster_1f47e.png',
      'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/144/apple/118/lion-face_1f981.png'
    ]
  },
  {
    backgroundColor: orange,
    emojisArray: [
      'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/144/apple/118/smiling-face-with-horns_1f608.png',
      'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/144/apple/118/tropical-fish_1f420.png',
      'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/144/apple/118/see-no-evil-monkey_1f648.png',
      'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/144/apple/118/robot-face_1f916.png'
    ]
  },
  {
    backgroundColor: 'green',
    emojisArray: [
      'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/144/apple/118/clown-face_1f921.png',
      'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/144/apple/118/face-with-open-mouth-vomiting_1f92e.png',
      'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/144/apple/118/dragon-face_1f432.png',
      'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/144/apple/118/brain_1f9e0.png'
    ]
  },
  {
    backgroundColor: 'red',
    emojisArray: [
      'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/144/apple/118/chicken_1f414.png',
      'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/144/apple/118/extraterrestrial-alien_1f47d.png',
      'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/144/apple/118/ghost_1f47b.png',
      'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/144/apple/118/serious-face-with-symbols-covering-mouth_1f92c.png'
    ]
  }
];

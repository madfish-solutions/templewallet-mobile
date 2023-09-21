import { OrderStatus, StableDiffusionOrder } from 'src/apis/stable-diffusion/types';

// TODO: Remove this later or use for tests
export const HISTORY_MOCK_DATA: StableDiffusionOrder[] = [
  {
    id: '1',
    createdAt: new Date().toISOString(),
    accountPkh: 'accountPkh',
    positivePrompt: 'car wash street',
    negativePrompt: 'sun sky road',
    status: OrderStatus.Ready,
    variants: [
      'https://stable-diffusion-variants.nyc3.cdn.digitaloceanspaces.com/DO00AUALVDUP87GM27FX/0-0457af3e-d665-47a4-9c72-53655ff27dea.png',
      'broken-uri',
      'broken-uri'
    ],
    width: 150,
    height: 150,
    panorama: 'no'
  },
  {
    id: '2',
    createdAt: new Date().toISOString(),
    accountPkh: 'accountPkh',
    positivePrompt: 'car wash street',
    negativePrompt: 'sun sky road',
    status: OrderStatus.Ready,
    variants: [
      'https://stable-diffusion-variants.nyc3.cdn.digitaloceanspaces.com/DO00AUALVDUP87GM27FX/0-522489ad-d5c6-4827-bedc-1ef84dacf3ce.png',
      'broken-uri',
      'broken-uri'
    ],
    width: 150,
    height: 150,
    panorama: 'no'
  },
  {
    id: '3',
    createdAt: new Date().toISOString(),
    accountPkh: 'accountPkh',
    positivePrompt: 'car wash street',
    negativePrompt: 'sun sky road',
    status: OrderStatus.Ready,
    variants: [
      'https://stable-diffusion-variants.nyc3.cdn.digitaloceanspaces.com/DO00AUALVDUP87GM27FX/0-5a4f4aa6-1c1c-4153-a6ad-10c852084be0.png',
      'broken-uri',
      'broken-uri'
    ],
    width: 150,
    height: 150,
    panorama: 'no'
  },
  {
    id: '4',
    createdAt: new Date().toISOString(),
    accountPkh: 'accountPkh',
    positivePrompt: 'car wash street',
    negativePrompt: 'sun sky road',
    status: OrderStatus.Ready,
    variants: [
      'https://stable-diffusion-variants.nyc3.cdn.digitaloceanspaces.com/DO00AUALVDUP87GM27FX/0-88912c14-7396-4d5f-89a6-4851cfeb86e6.png',
      'broken-uri',
      'broken-uri'
    ],
    width: 150,
    height: 150,
    panorama: 'no'
  },
  {
    id: '5',
    createdAt: new Date().toISOString(),
    accountPkh: 'accountPkh',
    positivePrompt: 'car wash street',
    negativePrompt: 'sun sky road',
    status: OrderStatus.Ready,
    variants: [
      'https://stable-diffusion-variants.nyc3.cdn.digitaloceanspaces.com/DO00AUALVDUP87GM27FX/cce7c081-b246-4867-abbc-33e5d04177dc.jpg',
      'broken-uri',
      'broken-uri'
    ],
    width: 150,
    height: 150,
    panorama: 'no'
  },
  {
    id: '6',
    createdAt: new Date().toISOString(),
    accountPkh: 'accountPkh',
    positivePrompt: 'car wash street',
    negativePrompt: 'sun sky road',
    status: OrderStatus.Ready,
    variants: [
      'https://stable-diffusion-variants.nyc3.cdn.digitaloceanspaces.com/DO00AUALVDUP87GM27FX/0-8af95bcc-fa0c-4a92-8e33-bc087a1d8144.png',
      'broken-uri',
      'broken-uri'
    ],
    width: 150,
    height: 150,
    panorama: 'no'
  },
  {
    id: '7',
    createdAt: new Date().toISOString(),
    accountPkh: 'accountPkh',
    positivePrompt: 'car wash street',
    negativePrompt: 'sun sky road',
    status: OrderStatus.Ready,
    variants: ['broken-uri', 'broken-uri', 'broken-uri'],
    width: 150,
    height: 150,
    panorama: 'no'
  },
  {
    id: '8',
    createdAt: new Date().toISOString(),
    accountPkh: 'accountPkh',
    positivePrompt: 'car wash street',
    negativePrompt: 'sun sky road',
    status: OrderStatus.Ready,
    variants: ['broken-uri', 'broken-uri', 'broken-uri'],
    width: 150,
    height: 150,
    panorama: 'no'
  },
  {
    id: '9',
    createdAt: new Date().toISOString(),
    accountPkh: 'accountPkh',
    positivePrompt: 'car wash street',
    negativePrompt: 'sun sky road',
    status: OrderStatus.Ready,
    variants: [
      'https://stable-diffusion-variants.nyc3.cdn.digitaloceanspaces.com/DO00AUALVDUP87GM27FX/0-e3222b30-64dc-4777-ad48-ccba6f31f2c6.png',
      'broken-uri',
      'broken-uri'
    ],
    width: 150,
    height: 150,
    panorama: 'no'
  },
  {
    id: '10',
    createdAt: new Date().toISOString(),
    accountPkh: 'accountPkh',
    positivePrompt: 'car wash street',
    negativePrompt: 'sun sky road',
    status: OrderStatus.Ready,
    variants: ['broken-uri', 'broken-uri', 'broken-uri'],
    width: 150,
    height: 150,
    panorama: 'no'
  },
  {
    id: '11',
    createdAt: new Date().toISOString(),
    accountPkh: 'accountPkh',
    positivePrompt: 'car wash street',
    negativePrompt: 'sun sky road',
    status: OrderStatus.Ready,
    variants: [
      'https://stable-diffusion-variants.nyc3.cdn.digitaloceanspaces.com/DO00AUALVDUP87GM27FX/1-6a69fb72-6606-4007-8dce-231df93d75c1.png',
      'broken-uri',
      'broken-uri'
    ],
    width: 150,
    height: 150,
    panorama: 'no'
  },
  {
    id: '12',
    createdAt: new Date().toISOString(),
    accountPkh: 'accountPkh',
    positivePrompt: 'car wash street',
    negativePrompt: 'sun sky road',
    status: OrderStatus.Ready,
    variants: ['broken-uri', 'broken-uri', 'broken-uri'],
    width: 150,
    height: 150,
    panorama: 'no'
  },
  {
    id: '13',
    createdAt: new Date().toISOString(),
    accountPkh: 'accountPkh',
    positivePrompt: 'car wash street',
    negativePrompt: 'sun sky road',
    status: OrderStatus.Ready,
    variants: ['broken-uri', 'broken-uri', 'broken-uri'],
    width: 150,
    height: 150,
    panorama: 'no'
  },
  {
    id: '14',
    createdAt: new Date().toISOString(),
    accountPkh: 'accountPkh',
    positivePrompt: 'car wash street',
    negativePrompt: 'sun sky road',
    status: OrderStatus.Ready,
    variants: [
      'https://stable-diffusion-variants.nyc3.cdn.digitaloceanspaces.com/DO00AUALVDUP87GM27FX/3-8af95bcc-fa0c-4a92-8e33-bc087a1d8144.png',
      'broken-uri',
      'broken-uri'
    ],
    width: 150,
    height: 150,
    panorama: 'no'
  },
  {
    id: '15',
    createdAt: new Date().toISOString(),
    accountPkh: 'accountPkh',
    positivePrompt: 'car wash street',
    negativePrompt: 'sun sky road',
    status: OrderStatus.Ready,
    variants: ['broken-uri', 'broken-uri', 'broken-uri'],
    width: 150,
    height: 150,
    panorama: 'no'
  },
  {
    id: '16',
    createdAt: new Date().toISOString(),
    accountPkh: 'accountPkh',
    positivePrompt: 'car wash street',
    negativePrompt: 'sun sky road',
    status: OrderStatus.Ready,
    variants: ['broken-uri', 'broken-uri', 'broken-uri'],
    width: 150,
    height: 150,
    panorama: 'no'
  },
  {
    id: '17',
    createdAt: new Date().toISOString(),
    accountPkh: 'accountPkh',
    positivePrompt: 'car wash street',
    negativePrompt: 'sun sky road',
    status: OrderStatus.Ready,
    variants: [
      'https://stable-diffusion-variants.nyc3.cdn.digitaloceanspaces.com/DO00AUALVDUP87GM27FX/e9fb13f5-75de-43b1-b5b3-dec53808cedc.jpg',
      'broken-uri',
      'broken-uri'
    ],
    width: 150,
    height: 150,
    panorama: 'no'
  },
  {
    id: '18',
    createdAt: new Date().toISOString(),
    accountPkh: 'accountPkh',
    positivePrompt: 'car wash street',
    negativePrompt: 'sun sky road',
    status: OrderStatus.Ready,
    variants: ['broken-uri', 'broken-uri', 'broken-uri'],
    width: 150,
    height: 150,
    panorama: 'no'
  },
  {
    id: '19',
    createdAt: new Date().toISOString(),
    accountPkh: 'accountPkh',
    positivePrompt: 'car wash street',
    negativePrompt: 'sun sky road',
    status: OrderStatus.Ready,
    variants: ['broken-uri', 'broken-uri', 'broken-uri'],
    width: 150,
    height: 150,
    panorama: 'no'
  },
  {
    id: '20',
    createdAt: new Date().toISOString(),
    accountPkh: 'accountPkh',
    positivePrompt: 'car wash street',
    negativePrompt: 'sun sky road',
    status: OrderStatus.Ready,
    variants: ['broken-uri', 'broken-uri', 'broken-uri'],
    width: 150,
    height: 150,
    panorama: 'no'
  }
];

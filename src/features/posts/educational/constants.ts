export const UI_CONSTANTS = {
  IMAGE_HEIGHT: 360,
  SUCCESS_NOTIFICATION_DURATION: 3000,
  RETRY_DELAY: 1000,
} as const;

export const MESSAGES = {
  SOCIAL: {
    WHATSAPP_DEFAULT: 'Check out this post!',
    INSTAGRAM_WEB_LIMITATION:
      'Please download the image and share it on Instagram manually. Instagram does not support direct web sharing.',
    FACEBOOK_IMAGE_NOT_READY:
      'Image not ready yet. Please wait for the image to load.',
  },
} as const;

export const FILE_CONSTANTS = {
  DEFAULT_FILENAME: 'educational_post.png',
  IMAGE_TYPE: 'image/png',
  MIME_TYPE: 'image/png',
} as const;

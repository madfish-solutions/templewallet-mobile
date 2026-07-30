import DiscordIcon from './assets/discord.svg';
import GithubIcon from './assets/github.svg';
import RedditIcon from './assets/reddit.svg';
import TelegramIcon from './assets/telegram.svg';
import TwitterIcon from './assets/twitter.svg';
import WebIcon from './assets/web.svg';
import YouTubeIcon from './assets/youtube.svg';
import { SocialIconNameEnum } from './social-icon-name-enum';

export const socialIconNameMap = {
  [SocialIconNameEnum.Discord]: DiscordIcon,
  [SocialIconNameEnum.Telegram]: TelegramIcon,
  [SocialIconNameEnum.Twitter]: TwitterIcon,
  [SocialIconNameEnum.YouTube]: YouTubeIcon,
  [SocialIconNameEnum.Reddit]: RedditIcon,
  [SocialIconNameEnum.Web]: WebIcon,
  [SocialIconNameEnum.Github]: GithubIcon
};

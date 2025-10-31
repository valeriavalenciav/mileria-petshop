import { Flex, Link } from '@chakra-ui/react';
import { FacebookIcon, InstagramIcon, TikTokIcon } from '@src/components/shared/icons';

export const SocialMedia = () => {
  return (
    <Flex>
      <Link href="https://www.facebook.com/profile.php?id=61581807565147" isExternal mx={2}>
        <FacebookIcon w={6} h={6} color="gray.600" />
      </Link>
      <Link href="https://www.instagram.com/mileriapetshop/" isExternal mx={2}>
        <InstagramIcon w={6} h={6} color="gray.600" />
      </Link>
      <Link href="https://www.tiktok.com" isExternal mx={2}>
        <TikTokIcon w={6} h={6} color="gray.600" />
      </Link>
    </Flex>
  );
};

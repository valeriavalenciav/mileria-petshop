import { ChakraProvider } from '@chakra-ui/react';
import { ContentfulLivePreviewProvider } from '@contentful/live-preview/react';
import localFont from '@next/font/local';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { appWithTranslation } from 'next-i18next';
import { useState } from 'react';

import { Layout } from '@src/components/templates/layout';
import { CartContext, CartItem } from '@src/lib/cart';
import { theme } from '@src/theme';

const spaceGrotesk = localFont({
  src: [
    {
      path: './utils/fonts/space-grotesk-v13-latin-300.woff',
      weight: '300',
      style: 'normal',
    },
    {
      path: './utils/fonts/space-grotesk-v13-latin-300.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: './utils/fonts/space-grotesk-v13-latin-regular.woff',
      weight: '400',
      style: 'normal',
    },
    {
      path: './utils/fonts/space-grotesk-v13-latin-regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './utils/fonts/space-grotesk-v13-latin-500.woff',
      weight: '500',
      style: 'normal',
    },
    {
      path: './utils/fonts/space-grotesk-v13-latin-500.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './utils/fonts/space-grotesk-v13-latin-600.woff',
      weight: '600',
      style: 'normal',
    },
    {
      path: './utils/fonts/space-grotesk-v13-latin-600.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: './utils/fonts/space-grotesk-v13-latin-700.woff',
      weight: '700',
      style: 'normal',
    },
    {
      path: './utils/fonts/space-grotesk-v13-latin-700.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
});

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: CartItem) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id);
      if (existingItem) {
        return prevItems.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i,
        );
      }
      return [...prevItems, item];
    });
  };

  const removeItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const updateItemQuantity = (id: string, quantity: number) => {
    setItems(prevItems =>
      prevItems.map(item => (item.id === id ? { ...item, quantity } : item)),
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <ContentfulLivePreviewProvider
      locale={router.locale || 'en-US'}
      enableInspectorMode={pageProps.previewActive}
      enableLiveUpdates={pageProps.previewActive}>
      <ChakraProvider
        theme={{
          ...theme,
          fonts: {
            heading: `${spaceGrotesk.style.fontFamily}, ${theme.fonts.heading}`,
            body: `${spaceGrotesk.style.fontFamily}, ${theme.fonts.body}`,
          },
        }}>
        <CartContext.Provider value={{ items, addItem, removeItem, updateItemQuantity, clearCart }}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </CartContext.Provider>
      </ChakraProvider>
    </ContentfulLivePreviewProvider>
  );
};

export default appWithTranslation(App);

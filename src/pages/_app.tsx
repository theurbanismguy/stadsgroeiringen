import type { AppProps } from 'next/app';
import '@/styles/globals.css'; // Ensure correct import path

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

// frontend/pages/_document.js
import Document, { Html, Head, Main, NextScript } from 'next/document';
import siteConfig from '../config';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en" className="scroll-smooth">
        <Head>
          <meta charSet="UTF-8" />
          <meta name="description" content={siteConfig.description} />
          <meta name="theme-color" content={siteConfig.themeColor} />
          <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
            rel="stylesheet"
          />
          <link rel="preload" as="image" href="/logo.png" />
        </Head>
        <body className="bg-surface-muted text-ink">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
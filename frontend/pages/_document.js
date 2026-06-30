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
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
          <link rel="apple-touch-icon" sizes="180x180" href="/favicon-180.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
            rel="stylesheet"
          />
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
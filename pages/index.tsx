import { Web3ReactProvider } from '@web3-react/core';
import Web3 from 'web3';

import Converter from '@components/Converter';
import Head from 'next/head';

function getLibrary(provider: any) {
  return new Web3(provider);
}

export default function Home() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Head>
        <title>Web3 Wallet Connect</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Converter />
    </Web3ReactProvider>
  );
}

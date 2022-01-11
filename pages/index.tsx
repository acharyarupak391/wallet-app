import { Web3ReactProvider } from '@web3-react/core';
import Web3 from 'web3';

import Converter from '@components/Converter';

function getLibrary(provider: any) {
  return new Web3(provider);
}

export default function Home() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Converter />
    </Web3ReactProvider>
  );
}

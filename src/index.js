import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { mainnet, bsc } from 'wagmi/chains'
import { InjectedConnector } from '@wagmi/core/connectors/injected'
import { WalletConnectConnector } from '@wagmi/core/connectors/walletConnect'
import { publicProvider } from '@wagmi/core/providers/public'

const chains = [mainnet,bsc]
const projectId = 'ae64d2d938316ce3350fea4c10f6cc79'

const { publicClient,webSocketPublicClient } = configureChains(chains, [w3mProvider({ projectId })])
const wagmiConfig = createConfig({
  connectors: [
    new InjectedConnector({ chains }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: projectId,
      },
    }),
  ],
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,webSocketPublicClient
})
const ethereumClient = new EthereumClient(wagmiConfig, chains)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>

    <WagmiConfig config={wagmiConfig}>
      <App ethereumClient={w3mProvider} />
    </WagmiConfig>

    <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
  </>

);



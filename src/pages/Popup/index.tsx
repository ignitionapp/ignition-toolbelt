import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import { createRoot } from 'react-dom/client';

import { Popup } from './Popup';
import './index.css';

const containerEl = document.getElementById('app-container');
const root = createRoot(containerEl!);

root.render(
  <ChakraProvider>
    <Popup />
  </ChakraProvider>
);

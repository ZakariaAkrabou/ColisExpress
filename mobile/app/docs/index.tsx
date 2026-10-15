import React from 'react';
import DocsPage from './docs_page';
import { INITIAL_COLIS } from '../../services/mockData';

export default function DocsScreen() {
  return <DocsPage colisList={INITIAL_COLIS} />;
}

export { DocsPage };

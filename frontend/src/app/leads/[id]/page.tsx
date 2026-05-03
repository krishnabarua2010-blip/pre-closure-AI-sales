export async function generateStaticParams() {
  return [{ id: 'default' }];
}

import ClientPage from './ClientPage';

export default function Page() {
  return <ClientPage />;
}

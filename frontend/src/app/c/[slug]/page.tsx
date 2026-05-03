export async function generateStaticParams() {
  return [{ slug: 'default' }];
}

import ClientPage from './ClientPage';

export default function Page() {
  return <ClientPage />;
}

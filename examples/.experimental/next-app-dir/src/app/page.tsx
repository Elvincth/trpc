import { Suspense } from 'react';
import { api } from 'trpc-api';
import { ClientGreeting } from './ClientGreeting';
import { ServerGreeting } from './ServerGreeting';
import { ServerInvoker } from './ServerInvoker';

export default async function Home() {
  const promise = new Promise(async (resolve) => {
    await new Promise((r) => setTimeout(r, 1000)); // wait for demo purposes
    resolve(api.greeting.query({ text: 'streamed server data' }));
  });

  return (
    <main
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '1.1rem',
      }}
    >
      <div
        style={{
          width: '24rem',
          padding: '1rem',
          background: '#e5e5e5',
          borderRadius: '0.5rem',
        }}
      >
        <div>
          <Suspense fallback={<>Loading client...</>}>
            <ClientGreeting />
          </Suspense>
        </div>

        <div>
          <Suspense fallback={<>Loading Server (fetched)...</>}>
            {/* @ts-expect-error RSC + TS not friends yet */}
            <ServerGreeting />
          </Suspense>
        </div>
        <div>
          <Suspense fallback={<>Loading stream (fetched)...</>}>
            {/** @ts-expect-error - Async Server Component */}
            <StreamedSC promise={promise} />
          </Suspense>
        </div>

        <div>
          <Suspense fallback={<>Loading Server (invoked)...</>}>
            {/* @ts-expect-error RSC + TS not friends yet */}
            <ServerInvoker />
          </Suspense>
        </div>

        <form
          action={async () => {
            'use server';
            api.greeting.revalidate();
          }}
        >
          <button type="submit">Revalidate</button>
        </form>
      </div>
    </main>
  );
}

async function StreamedSC(props: { promise: Promise<string> }) {
  const data = await props.promise;

  return <div>{data}</div>;
}

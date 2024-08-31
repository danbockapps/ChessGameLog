
export default async function Home() {
  const data = await fetch('https://lichess.org/api/player').then(res => res.json());

  return (
    <main>
      {JSON.stringify(data)}
    </main>
  );
}

// app/page.js
'use client'

import { useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch('/api/greet', {
      method: 'POST',
      body: JSON.stringify({ name: 'Next.js' }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    setMessage(data.message);
  }

  return (
    <main>
      <form onSubmit={handleSubmit}>
        <button type="submit">Say Hello</button>
      </form>
      <p>{message}</p>
    </main>
  );
}

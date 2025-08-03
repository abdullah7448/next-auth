export async function POST(request) {
    const body = await request.json();
    const name = body.name || 'Guest';
  
    return Response.json({ message: `Hello, ${name}!` });
  }
  
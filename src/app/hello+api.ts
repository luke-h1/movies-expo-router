export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  if (!name) {
    return Response.json({ error: "Name is required" }, { status: 400 });
  }
  return Response.json({ message: `Hello, ${name}!` });
}

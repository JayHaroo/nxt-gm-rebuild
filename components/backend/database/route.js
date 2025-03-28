import { MongoClient } from "mongodb";

export async function POST(req) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return new Response(JSON.stringify({ message: "Missing email or password" }), { status: 400 });
  }

  const client = new MongoClient(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    const database = client.db("nxtgm");
    const collection = database.collection("accounts");

    const user = await collection.findOne({ email });

    if (!user || user.password !== password) {
      return new Response(JSON.stringify({ message: "Invalid email or password" }), { status: 401 });
    }

    return new Response(JSON.stringify({ message: "Login successful", name: user.name }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Something went wrong!" }), { status: 500 });
  } finally {
    await client.close();
  }
}

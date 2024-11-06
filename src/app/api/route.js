import { Mistral } from '@mistralai/mistralai';

const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

export async function POST(req) {
  try {
    const { message } = await req.json();

    if (!message || message.trim() === "") {
      throw new Error("Message cannot be empty.");
    }

    const chatResponse = await client.chat.complete({
      model: 'mistral-large-latest',
      messages: [{ role: 'user', content: message }],
    });

    if (!chatResponse || !chatResponse.choices || !chatResponse.choices[0]) {
      throw new Error("Invalid response structure from the Mistral API.");
    }

    const botMessage = chatResponse.choices[0].message.content;

    return new Response(
      JSON.stringify({ text: botMessage }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("API error occurred:", error);
    return new Response(
      JSON.stringify({ text: `Error: ${error.message}` }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
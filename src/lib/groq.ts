import Groq from 'groq-sdk';

let groqClient: Groq | null = null;

function getClient(): Groq {
  if (!groqClient) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error('GROQ_API_KEY environment variable is not set');
    }
    groqClient = new Groq({ apiKey });
  }
  return groqClient;
}

export interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function groqChat(
  messages: GroqMessage[],
  options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    jsonMode?: boolean;
  }
): Promise<string> {
  const client = getClient();
  const model = options?.model ?? 'llama-3.3-70b-versatile';
  const temperature = options?.temperature ?? 0.7;
  const maxTokens = options?.maxTokens ?? 8192;

  const completion = await client.chat.completions.create({
    model,
    messages,
    temperature,
    max_tokens: maxTokens,
    response_format: options?.jsonMode
      ? { type: 'json_object' }
      : undefined,
  });

  return completion.choices[0]?.message?.content ?? '';
}

export async function groqChatStream(
  messages: GroqMessage[],
  onChunk: (chunk: string) => void,
  options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }
): Promise<string> {
  const client = getClient();
  const model = options?.model ?? 'llama-3.3-70b-versatile';
  const temperature = options?.temperature ?? 0.7;
  const maxTokens = options?.maxTokens ?? 8192;

  const stream = await client.chat.completions.create({
    model,
    messages,
    temperature,
    max_tokens: maxTokens,
    stream: true,
  });

  let full = '';
  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content ?? '';
    full += content;
    onChunk(content);
  }
  return full;
}

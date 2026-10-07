const GROQ_API_URL = "https://api.groq.com/openai/v1";

// Try models in order so a temporary model failure does not stop the request.
const CHAT_MODELS = [
    "llama-3.3-70b-versatile",
    "llama3-70b-8192",
    "llama3-8b-8192",
    "gemma2-9b-it"
];

export async function transcribeAudio(
    audioBlob: Blob,
    apiKey: string
): Promise<string> {
    const formData = new FormData();
    formData.append("file", audioBlob, "audio.webm");
    formData.append("model", "whisper-large-v3");

    const response = await fetch(`${GROQ_API_URL}/audio/transcriptions`, {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}` },
        body: formData
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Whisper API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.text;
}

export interface ChatMessage {
    role: "system" | "user" | "assistant" | "tool";
    content: string | null;
    name?: string;
    tool_calls?: ToolCall[];
    tool_call_id?: string;
}

export interface ToolCall {
    id: string;
    type: "function";
    function: {
        name: string;
        arguments: string;
    };
}

export async function getGroqChatCompletion(
    messages: ChatMessage[],
    apiKey: string,
    tools: any[]
): Promise<any> {
    let lastError = "";

    for (const model of CHAT_MODELS) {
        try {
            const body: any = {
                model,
                messages,
                temperature: 0.1,
                max_tokens: 1024
            };

            if (tools && tools.length > 0) {
                body.tools = tools;
                body.tool_choice = "auto";
            }

            const response = await fetch(`${GROQ_API_URL}/chat/completions`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                return response.json();
            }

            const errText = await response.text();
            lastError = `${model}: ${response.status} - ${errText}`;
            continue;
        } catch (err: any) {
            lastError = `${model}: ${err.message}`;
            continue;
        }
    }

    throw new Error(`All models failed. Last error: ${lastError}`);
}

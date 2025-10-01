import { useState } from 'react';

interface OpenAIModel {
  id: string;
}

function App() {
  const [apiKey, setApiKey] = useState('');
  const [models, setModels] = useState<string[]>([]);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [files, setFiles] = useState<File[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [status, setStatus] = useState<'idle' | 'processing' | 'done'>('idle');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [prompt, setPrompt] = useState(`You are an expert stock photography metadata analyst. Analyze the provided image and generate a commercially optimized Title, Description, and Keywords for Adobe Stock.
Constraints:
- Title: up to 140 characters (ideally 70-120), natural and descriptive. Must clearly state the subject, action, and key details. Should not be just a keyword list.
- Description: up to 160 characters, concise and SEO-friendly. Reinforce the main concepts of the image.
- Keywords: between 27 and 40 unique, high-quality terms.
  - Order matters: put the most important and relevant words in the first 10 keywords (they carry extra weight).
  - Include a mix of:
    - Direct content (objects, people, actions, colors, location)
    - Specific details (indoor/outdoor, time of day, quantity of people, mood)
    - Abstract concepts (success, leadership, growth, happiness, etc.)
  - No duplicates, no irrelevant or generic terms, no brand names.
  - Use single words or short phrases (not long sentences).
Output Format:
Return the result in a valid JSON object with the following keys:
- "title"
- "description"
- "keywords" (as a JSON array of 27-40 items in priority order, most important first)`);

  const handleVerifyApiKey = async () => {
    if (!apiKey) {
      setError('Please enter an API key.');
      return;
    }
    setIsVerifying(true);
    setError(null);
    setModels([]);

    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to verify API key.');
      }

      const fetchedModels = data.data
        .map((model: OpenAIModel) => model.id)
        .sort();
      setModels(fetchedModels);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="bg-neutral-900 text-gray-200 min-h-screen">
      <div className="flex flex-col">
        <header className="border-b border-neutral-700 p-4 sticky top-0 bg-neutral-900/80 backdrop-blur-sm z-10">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-purple-500"
              >
                <path d="M9.5 2.5c0 .28.22.5.5.5h4c.28 0 .5-.22.5-.5v-2c0-.28-.22-.5-.5-.5h-4c-.28 0-.5.22-.5.5v2Z" />
                <path d="M3.5 2.5c0 .28.22.5.5.5h4c.28 0 .5-.22.5-.5v-2c0-.28-.22-.5-.5-.5h-4c-.28 0-.5.22-.5.5v2Z" />
                <path d="M15.5 2.5c0 .28.22.5.5.5h4c.28 0 .5-.22.5-.5v-2c0-.28-.22-.5-.5-.5h-4c-.28 0-.5.22-.5.5v2Z" />
                <path d="M9 12v8" />
                <path d="M9 7V6c0-1.1.9-2 2-2h2c1.1 0 2 .9 2 2v1" />
                <path d="M3 10v1c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-1" />
                <path d="M3 15h18" />
              </svg>
              <h1 className="text-2xl font-bold">AI Metadata Injector</h1>
            </div>
          </div>
        </header>
        <main className="flex-grow container mx-auto p-4 md:p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-6">
              <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4 text-gray-200">
                  1. Configuration
                </h2>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="api-key-input"
                      className="block text-sm font-medium text-gray-400 mb-2"
                    >
                      API Key
                    </label>
                    <input
                      type="password"
                      id="api-key-input"
                      placeholder="Enter your API key"
                      className="w-full bg-neutral-700 border border-neutral-600 rounded-md px-3 py-2 text-gray-200 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 transition"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      disabled={isVerifying}
                    />
                  </div>
                  <button
                    id="verify-key-btn"
                    onClick={handleVerifyApiKey}
                    disabled={isVerifying || !apiKey.trim()}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isVerifying
                      ? 'Verifying...'
                      : 'Verify Key & Load Models'}
                  </button>
                  {error && (
                    <p className="text-sm text-red-500 mt-2">{error}</p>
                  )}
                </div>
              </div>
              <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4 text-gray-200">
                  2. AI Settings
                </h2>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="model-select"
                      className="block text-sm font-medium text-gray-400 mb-2"
                    >
                      Model
                    </label>
                    <select
                      id="model-select"
                      disabled={models.length === 0 || isVerifying}
                      className="w-full bg-neutral-700 border border-neutral-600 rounded-md px-3 py-2 text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                    >
                      {models.length === 0 ? (
                        <option>Verify API key to load models</option>
                      ) : (
                        models.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="prompt-input"
                      className="block text-sm font-medium text-gray-400 mb-2"
                    >
                      Prompt
                    </label>
                    <textarea
                      id="prompt-input"
                      disabled
                      className="w-full bg-neutral-700 border border-neutral-600 rounded-md px-3 py-2 text-gray-200 h-48 resize-none disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                      defaultValue={prompt}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4 text-gray-200">
                  3. Image Processing
                </h2>
                <div className="space-y-4">
                  <div
                    id="file-dropzone"
                    className="border-2 border-dashed border-neutral-600 rounded-lg p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:border-purple-500 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-500"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" x2="12" y1="3" y2="15" />
                    </svg>
                    <p className="mt-4 text-gray-400">
                      Drag &amp; drop your images here, or click to select
                      files
                    </p>
                  </div>
                  <div
                    id="image-list-container"
                    className="space-y-2 max-h-96 min-h-[6rem] overflow-y-auto p-2 border border-neutral-700 rounded-md bg-neutral-900/50 flex items-center justify-center"
                  >
                    <p className="text-gray-500 text-center">
                      No images uploaded yet.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <button
                      id="start-btn"
                      disabled
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Start Processing
                    </button>
                    <button
                      id="download-btn"
                      disabled
                      className="flex-1 bg-neutral-600 hover:bg-neutral-700 text-white font-semibold py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Download All as ZIP
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;

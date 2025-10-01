export default {
      async fetch(request) {
        const html = `
    <!DOCTYPE html>
    <html lang="en" class="dark">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>AI Metadata Injector</title>
      <link rel="stylesheet" href="/styles.css">
    </head>
    <body class="bg-background text-foreground">
      <div class="min-h-screen flex flex-col">
        <header class="border-b p-4 sticky top-0 bg-background/95 backdrop-blur-sm z-10">
          <div class="container mx-auto flex items-center justify-between">
            <div class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M9.5 2.5c0 .28.22.5.5.5h4c.28 0 .5-.22.5-.5v-2c0-.28-.22-.5-.5-.5h-4c-.28 0-.5.22-.5.5v2Z"/><path d="M3.5 2.5c0 .28.22.5.5.5h4c.28 0 .5-.22.5-.5v-2c0-.28-.22-.5-.5-.5h-4c-.28 0-.5.22-.5.5v2Z"/><path d="M15.5 2.5c0 .28.22.5.5.5h4c.28 0 .5-.22.5-.5v-2c0-.28-.22-.5-.5-.5h-4c-.28 0-.5.22-.5.5v2Z"/><path d="M9 12v8"/><path d="M9 7V6c0-1.1.9-2 2-2h2c1.1 0 2 .9 2 2v1"/><path d="M3 10v1c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-1"/><path d="M3 15h18"/></svg>
              <h1 class="text-2xl font-bold">AI Metadata Injector</h1>
            </div>
          </div>
        </header>
    
        <main class="flex-grow container mx-auto p-4 md:p-8">
          <div class="grid md:grid-cols-2 gap-8">
            
            <!-- Left Column: Settings -->
            <div class="flex flex-col gap-6">
              <div class="bg-card border rounded-lg p-6 shadow-sm">
                <h2 class="text-lg font-semibold mb-4 text-card-foreground">1. Configuration</h2>
                <div class="space-y-4">
                  <div>
                    <label for="api-key-input" class="block text-sm font-medium text-muted-foreground mb-2">API Key</label>
                    <input type="password" id="api-key-input" placeholder="Enter your API key" class="w-full bg-input border border-border rounded-md px-3 py-2 text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition">
                  </div>
                  <button id="verify-key-btn" class="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-4 rounded-md transition-colors">
                    Verify Key &amp; Load Models
                  </button>
                </div>
              </div>
    
              <div class="bg-card border rounded-lg p-6 shadow-sm">
                <h2 class="text-lg font-semibold mb-4 text-card-foreground">2. AI Settings</h2>
                <div class="space-y-4">
                  <div>
                    <label for="model-select" class="block text-sm font-medium text-muted-foreground mb-2">Model</label>
                    <select id="model-select" disabled class="w-full bg-input border border-border rounded-md px-3 py-2 text-foreground disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                      <option>Verify API key to load models</option>
                    </select>
                  </div>
                  <div>
                    <label for="prompt-input" class="block text-sm font-medium text-muted-foreground mb-2">Prompt</label>
                    <textarea id="prompt-input" disabled class="w-full bg-input border border-border rounded-md px-3 py-2 text-foreground h-32 resize-none disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">You are an expert stock photography metadata analyst. Analyze the provided image and generate a commercially optimized Title, Description, and Keywords for Adobe Stock.
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
- "keywords" (as a JSON array of 27-40 items in priority order, most important first)</textarea>
                  </div>
                </div>
              </div>
            </div>
    
            <!-- Right Column: Image Processing -->
            <div class="flex flex-col gap-6">
              <div class="bg-card border rounded-lg p-6 shadow-sm">
                <h2 class="text-lg font-semibold mb-4 text-card-foreground">3. Image Processing</h2>
                <div class="space-y-4">
                  <div id="file-dropzone" class="border-2 border-dashed border-border rounded-lg p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                    <p class="mt-4 text-muted-foreground">Drag &amp; drop your images here, or click to select files</p>
                  </div>
                  <div id="image-list-container" class="space-y-2 max-h-96 min-h-[6rem] overflow-y-auto p-2 border border-border rounded-md bg-background/50 flex items-center justify-center">
                    <p class="text-muted-foreground text-center">No images uploaded yet.</p>
                  </div>
                  <div class="flex gap-4">
                    <button id="start-btn" disabled class="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                      Start Processing
                    </button>
                    <button id="download-btn" disabled class="flex-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                      Download All as ZIP
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <script src="/client.js" defer></script>
    </body>
    </html>
        `;
    
        return new Response(html, {
          headers: {
            'Content-Type': 'text/html',
          },
        });
      },
    };

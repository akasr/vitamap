// app/chat/lib/chat/image-generation.ts
export async function generateImage(prompt: string): Promise<string> {
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to generate image');
      }
  
      const data = await response.json();
      return data.imageUrl;
    } catch (error) {
      console.error('Image generation error:', error);
      throw error;
    }
  }
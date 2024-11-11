export async function POST({ request }) {
    try {
      const { repoUrl } = await request.json();
  
      if (!import.meta.env.OPENAI_API_KEY) {
        return new Response(JSON.stringify({ 
          error: 'OpenAI API key is not configured' 
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
  
      // Fetch repository files
      const { fetchRepositoryFiles } = await import('../../utils/githubAPI.js');
      const files = await fetchRepositoryFiles(repoUrl);
      
      // Parse GitHub URL to get owner and repo
      const urlParts = new URL(repoUrl);
      const [, owner, repo] = urlParts.pathname.split('/');
  
      // Add owner and repo to each file object
      const filesWithContext = files.map(file => ({
        ...file,
        owner,
        repo
      }));
      
      // Perform analysis using OpenAI
      const OpenAIAnalyzer = await import('../../utils/openAIAnalyzer.js');
      const analysis = await OpenAIAnalyzer.default.analyzeCode(filesWithContext, owner, repo);
  
      return new Response(JSON.stringify(analysis), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Analysis error:', error);
      
      return new Response(JSON.stringify({ 
        error: error.message,
        details: error.stack || 'Unknown error'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  }
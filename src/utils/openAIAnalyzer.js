import OpenAI from 'openai';
import { fetchFileContent } from './githubAPI.js';

const openai = new OpenAI({
  apiKey: import.meta.env.OPENAI_API_KEY,
});

async function analyzeCode(files, owner, repo) {
  try {
    const filesContent = await prepareFilesContent(files);
    return await getAIAnalysis(filesContent);
  } catch (error) {
    console.error('Error analyzing code:', error);
    throw error;
  }
}

async function prepareFilesContent(files) {
  const filesContent = [];
  
  for (const file of files) {
    const content = await fetchFileContent(file.owner, file.repo, file.path);
    filesContent.push({
      name: file.path,
      content: content,
      language: getLanguageFromPath(file.path)
    });
  }
  
  return filesContent;
}

async function getAIAnalysis(filesContent) {
  const systemPrompt = `You are an AI recruiter assistant analyzing student projects. Create 5 key insights about the candidate's technical abilities, skills, and potential. Each insight should be backed by specific evidence from their code. Focus on what would interest technical recruiters. Be specific and concrete about technical abilities demonstrated.`;

  const userPrompt = `Analyze these files and return a JSON object with 5 key insights about the candidate's abilities. Each insight should highlight specific technical skills and reference concrete evidence from the code. Return ONLY a JSON response with this exact structure:
{
  "skillLevel": "Beginner|Intermediate|Advanced|Expert",
  "insights": [
    {
      "insight": "Clear, recruiter-friendly insight about technical ability",
      "evidence": {
        "description": "Detailed explanation of the evidence",
        "location": "Specific file or section reference",
        "technicalDetails": "Technical specifics that back this insight"
      }
    }
  ]
}

Here are the files to analyze:\n\n${filesContent.map(file => 
  `File: ${file.name}\nContent:\n${file.content}\n---\n`
).join('\n')}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.5,
      max_tokens: 4000,
      response_format: { type: "json_object" }
    });

    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to analyze code: ' + error.message);
  }
}

function getLanguageFromPath(filepath) {
  const extension = filepath.split('.').pop().toLowerCase();
  const languageMap = {
    js: 'javascript',
    ts: 'typescript',
    py: 'python',
    java: 'java',
    rb: 'ruby',
    php: 'php',
    go: 'go',
    rs: 'rust',
    cpp: 'cpp',
    cs: 'csharp'
  };
  
  return languageMap[extension] || extension;
}

export default {
  analyzeCode
};
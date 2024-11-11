const GITHUB_API_URL = 'https://api.github.com';

export async function fetchRepositoryFiles(repoUrl) {
  const { owner, repo } = parseGitHubUrl(repoUrl);
  
  // Get repository contents
  const response = await fetch(`${GITHUB_API_URL}/repos/${owner}/${repo}/git/trees/main?recursive=1`, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': `Bearer ${import.meta.env.GITHUB_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch repository contents');
  }

  const data = await response.json();
  return filterRelevantFiles(data.tree);
}

export async function fetchFileContent(owner, repo, path) {
  const response = await fetch(`${GITHUB_API_URL}/repos/${owner}/${repo}/contents/${path}`, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': `Bearer ${import.meta.env.GITHUB_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch file content: ${path}`);
  }

  const data = await response.json();
  return Buffer.from(data.content, 'base64').toString('utf-8');
}

function parseGitHubUrl(url) {
  try {
    const urlObj = new URL(url);
    const [, owner, repo] = urlObj.pathname.split('/');
    return { owner, repo };
  } catch (error) {
    throw new Error('Invalid GitHub repository URL');
  }
}

function filterRelevantFiles(files) {
  const relevantExtensions = [
    '.js', '.ts', '.jsx', '.tsx',
    '.py', '.java', '.cpp', '.cs',
    '.go', '.rb', '.php', '.swift',
    '.kt', '.rs'
  ];

  return files.filter(file => {
    const ext = getFileExtension(file.path);
    return (
      relevantExtensions.includes(ext) &&
      !file.path.includes('node_modules') &&
      !file.path.includes('vendor') &&
      !file.path.includes('test') &&
      !file.path.includes('__pycache__')
    );
  });
}

function getFileExtension(filename) {
  return '.' + filename.split('.').pop().toLowerCase();
}
const GITHUB_TOKEN = process.env.GH_TOKEN;
const GITHUB_REPO = process.env.GH_REPO;

// Only throw error if trying to use GitHub functions, not on module load
const checkGitHubConfig = () => {
  if (!GITHUB_TOKEN || !GITHUB_REPO) {
    console.error('GitHub configuration missing:', { GITHUB_TOKEN: !!GITHUB_TOKEN, GITHUB_REPO: !!GITHUB_REPO });
    throw new Error('GitHub token and repo are required. Please check your .env.local file.');
  }
};

// Lazy initialization of owner/repo
let owner: string;
let repo: string;

const getOwnerRepo = () => {
  if (!owner || !repo) {
    checkGitHubConfig();
    [owner, repo] = GITHUB_REPO!.split('/');
  }
  return { owner, repo };
};

export interface GitHubFile {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
  _links: {
    self: string;
    git: string;
    html: string;
  };
}

export interface UploadedFile {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  download_url: string;
}

// Get all files in the projects images directory
export const getProjectImages = async (): Promise<GitHubFile[]> => {
  try {
    const { owner, repo } = getOwnerRepo();
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/public/images/projects`,
      {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    if (response.status === 404) {
      return []; // Directory doesn't exist yet
    }

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const files: GitHubFile[] = await response.json();
    return files.filter(file => file.type === 'file' && /\.(jpg|jpeg|png|webp|gif)$/i.test(file.name));
  } catch (error) {
    console.error('Error fetching project images:', error);
    return [];
  }
};

// Upload a file to GitHub
export const uploadFileToGitHub = async (
  file: File,
  fileName: string,
  _onProgress?: (progress: number) => void
): Promise<UploadedFile> => {
  try {
    const { owner, repo } = getOwnerRepo();
    // First, check if file already exists
    const existingFiles = await getProjectImages();
    const existingFile = existingFiles.find(f => f.name === fileName);

    // Convert file to base64 using Node.js Buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Content = buffer.toString('base64');

    const filePath = `public/images/projects/${fileName}`;

    const body = {
      message: `Add project image: ${fileName}`,
      content: base64Content,
      ...(existingFile && { sha: existingFile.sha }), // Include SHA if updating existing file
    };

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to upload file: ${error.message}`);
    }

    const result = await response.json();

    return {
      name: result.content.name,
      path: result.content.path,
      sha: result.content.sha,
      size: result.content.size,
      url: result.content.url,
      download_url: result.content.download_url,
    };
  } catch (error) {
    console.error('Error uploading file to GitHub:', error);
    throw error;
  }
};

// Delete a file from GitHub
export const deleteFileFromGitHub = async (fileName: string): Promise<void> => {
  try {
    const { owner, repo } = getOwnerRepo();
    const existingFiles = await getProjectImages();
    const fileToDelete = existingFiles.find(f => f.name === fileName);

    if (!fileToDelete) {
      throw new Error('File not found');
    }

    const filePath = `public/images/projects/${fileName}`;

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Delete project image: ${fileName}`,
          sha: fileToDelete.sha,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  } catch (error) {
    console.error('Error deleting file from GitHub:', error);
    throw error;
  }
};

// Get raw GitHub URL for a file
export const getRawGitHubUrl = (fileName: string): string => {
  const { owner, repo } = getOwnerRepo();
  return `https://raw.githubusercontent.com/${owner}/${repo}/main/public/images/projects/${fileName}`;
};

// Validate file before upload
export const validateFile = (file: File): { valid: boolean; error?: string } => {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only JPG, PNG, WebP, and GIF files are allowed' };
  }

  // Check file size (5MB max)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 5MB' };
  }

  return { valid: true };
};
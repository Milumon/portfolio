import { NextRequest, NextResponse } from 'next/server';
import { getProjectImages, uploadFileToGitHub, deleteFileFromGitHub, getRawGitHubUrl, validateFile } from '@/lib/services/github-api';

export async function GET() {
  try {
    const images = await getProjectImages();
    return NextResponse.json({ images });
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('Upload request received');

    const formData = await request.formData();
    const file = formData.get('file') as File;

    console.log('File received:', file?.name, file?.size, file?.type);

    if (!file) {
      console.log('No file provided');
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      console.log('File validation failed:', validation.error);
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    console.log('Uploading to GitHub...');

    // Upload to GitHub
    const result = await uploadFileToGitHub(file, file.name);

    console.log('Upload successful:', result);

    return NextResponse.json({
      success: true,
      file: result,
      url: getRawGitHubUrl(file.name)
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload file' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('fileName');

    if (!fileName) {
      return NextResponse.json(
        { error: 'File name is required' },
        { status: 400 }
      );
    }

    await deleteFileFromGitHub(fileName);

    return NextResponse.json({
      success: true,
      message: `File ${fileName} deleted successfully`
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}
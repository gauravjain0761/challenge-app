import {HTTP_METHOD} from '@/utils/constants/api';
import * as upload from '@/validation/schemas/upload.schema';
import {apiCall} from '@/services/api/client';
import axios from 'axios';

export const generateUploadUrl = async (
  data: upload.GenerateUploadUrlRequest,
  token?: string,
): Promise<upload.GenerateUploadUrlResponse> => {
  return apiCall<upload.GenerateUploadUrlResponse>({
    url: `${process.env.EXPO_PUBLIC_BASE_URL}/upload/generate-upload-url`,
    method: HTTP_METHOD.POST,
    data: data,
    headers: token ? {Authorization: `Bearer ${token}`} : {},
  });
};

export const uploadToAzure = async (
  uploadUrl: string,
  fileUri: string,
  contentType: string,
): Promise<void> => {
  try {
    const response = await fetch(fileUri);
    if (!response.ok) {
      throw new Error(
        `Failed to read file: ${response.status} ${response.statusText}`,
      );
    }

    const arrayBuffer = await response.arrayBuffer();

    const uint8Array = new Uint8Array(arrayBuffer);

    await axios.put(uploadUrl, uint8Array, {
      headers: {
        'Content-Type': contentType,
        'x-ms-blob-type': 'BlockBlob',
        'Content-Length': arrayBuffer.byteLength.toString(),
      },
      timeout: 120000,
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      transformRequest: [data => data],
    });
  } catch (error: any) {
    let errorMessage = 'Failed to upload to Azure';

    if (error.response?.status === 401) {
      errorMessage = 'Upload URL expired or invalid. Please try again.';
    } else if (error.response?.status === 403) {
      errorMessage = 'Permission denied. Please check upload permissions.';
    } else if (error.response?.status === 404) {
      errorMessage = 'Upload destination not found.';
    }

    throw {
      status: error.response?.status || 500,
      message: errorMessage,
      details: error.message,
    };
  }
};

export const uploadFileToAzure = async (
  file: {
    uri: string;
    name: string;
    type: string;
  },
  folderName: string = 'userprofile',
  token?: string,
): Promise<string> => {
  try {
    const uploadResponse = await generateUploadUrl(
      {
        folderName,
        fileName: file.name,
        contentType: file.type,
      },
      token,
    );
    console.log('uploadResponse', uploadResponse);

    await uploadToAzure(uploadResponse.uploadUrl, file.uri, file.type);

    return uploadResponse.fileUrl;
  } catch (error: any) {
    throw error;
  }
};

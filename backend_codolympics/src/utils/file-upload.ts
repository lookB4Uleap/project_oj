import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client();

export const generatePresignedURL = async (bucketName: string, keyName: string, expiresInSeconds = 60 * 5) => {
    try {
        // Generate a presigned URL for getting the object
        const command = new PutObjectCommand({
            Bucket: bucketName,        // S3 bucket name
            Key: keyName,              // File name (key) in the bucket
            ACL: 'public-read'
        });
        const url = await getSignedUrl(s3, command, { expiresIn: 6000 });
        console.log('[backend-codolympics] Presigned URL:', url);
        return { url, error: null };
    } catch (error) {
        console.error('Error generating presigned URL:', error);
        return { url: null, error };
    }
};
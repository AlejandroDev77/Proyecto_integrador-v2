import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const S3 = new S3Client({
    region: "auto",
    endpoint: import.meta.env.VITE_R2_ENDPOINT,
    credentials: {
        accessKeyId: import.meta.env.VITE_R2_ACCESS_KEY_ID,
        secretAccessKey: import.meta.env.VITE_R2_SECRET_ACCESS_KEY,
    },
});

export const r2Service = {
    uploadFile: async (file: File, folder: string) => {
        const fileName = `${folder}/${Date.now()}-${file.name}`;
        
        // Convert File to ArrayBuffer to avoid "readableStream.getReader is not a function" error
        const arrayBuffer = await file.arrayBuffer();
        
        const command = new PutObjectCommand({
            Bucket: import.meta.env.VITE_R2_BUCKET,
            Key: fileName,
            Body: new Uint8Array(arrayBuffer),
            ContentType: file.type,
        });

        try {
            await S3.send(command);
            return `${import.meta.env.VITE_R2_PUBLIC_URL}/${fileName}`;
        } catch (error) {
            console.error("Error uploading to R2:", error);
            throw error;
        }
    }
};

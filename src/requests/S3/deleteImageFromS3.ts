import AWS from "aws-sdk";

const getImageFromS3 = async (key: string) => {
    const S3_BUCKET = "olegometer.storage";
    const REGION = process.env.S3_REGION;

    AWS.config.update({
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        region: REGION,
    });

    const s3 = new AWS.S3();

    const params = {
        Bucket: S3_BUCKET,
        Key: key,
    };

    try {
        const data = await s3.deleteObject(params).promise();
    } catch (err) {
        console.error("Error uploading file:", err);
    }
};

export default getImageFromS3;

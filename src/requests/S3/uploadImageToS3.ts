import AWS from "aws-sdk"

const uploadImageToS3 = async (key: string, image: any) => {
    const S3_BUCKET = "olegometer.storage";
    const REGION = process.env.S3_REGION;

    AWS.config.update({
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    });
    const s3 = new AWS.S3({
        params: { Bucket: S3_BUCKET },
        region: REGION,
    });

    const params = {
        Bucket: S3_BUCKET,
        Key: key,
        Body: image,
        ContentType: 'image/jpeg',
    };

    var upload = s3
        .putObject(params)
        .on("httpUploadProgress", (evt) => {
            console.log(
                "Uploading " + parseInt((evt.loaded * 100) / evt.total) + "%"
            );
        })
        .promise();

    await upload.then((err, data) => {
        console.log(err);
        alert("File uploaded successfully.");
    });
};

export default uploadImageToS3

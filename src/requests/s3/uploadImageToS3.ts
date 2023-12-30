import s3Instance, {getS3Params} from '../../s3'

const uploadImageToS3 = async (key: string, image: any) => {
    const params = getS3Params(key, {
        Body: image,
        ContentType: 'image/jpeg',
    });

    await s3Instance.upload(params).promise();
    console.log(`File uploaded successfully ${key}`);
};

export default uploadImageToS3;

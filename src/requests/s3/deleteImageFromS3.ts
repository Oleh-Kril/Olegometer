import s3Instance, {getS3Params} from '../../s3'

const deleteImageFromS3 = async (key: string) => {
    const params = getS3Params(key);

    try {
        await s3Instance.deleteObject(params).promise();
        console.log(`File deleted successfully: ${key}`);
    } catch (err) {
        console.error(`Error deleting file: ${key}`, err);
    }
};

export default deleteImageFromS3;

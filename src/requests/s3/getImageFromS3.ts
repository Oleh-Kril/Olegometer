import s3Instance, {getS3Params} from '../../s3'

const getImageFromS3 = async (key: string) => {
    const params = getS3Params(key)

    const data = await s3Instance.getObject(params).promise()
    console.log('File fetched successfully ', key)
    return data.Body as Buffer
}

export default getImageFromS3

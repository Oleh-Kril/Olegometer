// s3.ts
import AWS from 'aws-sdk'

const REGION = process.env.S3_REGION

AWS.config.update({
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    region: REGION,
})

declare global {
    var _s3Instance: AWS.S3 | undefined
}

class S3Singleton {
    private static _instance: S3Singleton | undefined
    private s3Instance: AWS.S3

    private constructor() {
        this.s3Instance = new AWS.S3()

        if (process.env.NODE_ENV === 'development') {
            // In development mode, use a global variable to preserve the value
            // across module reloads caused by HMR (Hot Module Replacement).
            global._s3Instance = this.s3Instance
        }
    }

    public static get instance(): AWS.S3 {
        if (process.env.NODE_ENV === 'development') {
            if (!global._s3Instance) {
                global._s3Instance = new AWS.S3()
            }
            return global._s3Instance
        }

        if (!this._instance) {
            this._instance = new S3Singleton()
        }
        return this._instance.s3Instance
    }

    public static getParams(key: string, params?: any) {
        return {
            ...params,
            Bucket: 'olegometer.storage',
            Key: key,
        }
    }
}

const s3Instance = S3Singleton.instance

export default s3Instance

export const getS3Params = S3Singleton.getParams

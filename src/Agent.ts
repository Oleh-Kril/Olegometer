import axios, { AxiosError, AxiosResponse } from 'axios'

const axiosInstance = axios.create({
    withCredentials: true,
    baseURL: 'https://olegometerapi-production.up.railway.app',
})

axiosInstance.interceptors.response.use(
    async (response) => response,
    (error: AxiosError) => {
        console.log((error as any).response.data.message)

        const errorMessage = Array.isArray((error as any).response.data.message)
            ? (error as any).response.data.message[0]
            : (error as any).response.data.message

        return Promise.reject({message: errorMessage})
    },
)

const responseBody = <T> (response: AxiosResponse<T>) => response.data

const Agent = {
    get: async <T> (url: string, params?: object) => {
        return axiosInstance.get<T>(url, { ...params })
            .then(responseBody)
    },

    post: async <T> (url: string, body: object = {}, headers?: object) => {
        return axiosInstance.post<T>(url, body, headers)
            .then(responseBody)
    },

    put: async <T> (url: string, body: object) => {
        return axiosInstance.put<T>(url, body)
            .then(responseBody)
    },

    patch: async <T> (url: string, body: object) => {
        return axiosInstance.patch<T>(url, body)
            .then(responseBody)
    },

    delete: async <T>(url: string) => {
        return axiosInstance.delete<T>(url)
            .then(responseBody)
    },
}

export default Agent

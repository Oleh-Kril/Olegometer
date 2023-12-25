import axios, { AxiosError, AxiosResponse } from 'axios'

axios.interceptors.response.use(
    async (response) => response,
    ({ message }: AxiosError) => {
        window.alert(message)

        return Promise.reject(message)
    },
)

const responseBody = <T> (response: AxiosResponse<T>) => response.data

const Agent = {
    get: async <T> (url: string, params?: object) => {
        return axios.get<T>(url, { ...params })
            .then(responseBody)
    },

    post: async <T> (url: string, body: object, headers?: object) => {
        return axios.post<T>(url, body, headers)
            .then(responseBody)
    },

    put: async <T> (url: string, body: object) => {
        return axios.put<T>(url, body)
            .then(responseBody)
    },

    patch: async <T> (url: string, body: object) => {
        return axios.patch<T>(url, body)
            .then(responseBody)
    },

    delete: async <T>(url: string) => {
        return axios.delete<T>(url)
            .then(responseBody)
    },
}

export default Agent

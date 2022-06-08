import axios, { AxiosResponse } from "axios";
import { request } from "http";
import { IActivitiy } from "../models/activitiy";

// Setting API bas url
axios.defaults.baseURL = 'http://localhost:5000/api';

// Getting response body
const responseBody = (response: AxiosResponse) => response.data;

// Set timeout to simulate waitting for data from a server
const sleep = (ms: number) => (response: AxiosResponse) =>
    new Promise<AxiosResponse>(resolve => setTimeout(() => resolve(response), ms));

// Setting up CRUD requests .then(sleep(1000)) is added to simulate real situation delay
const requests = {
    get: (url: string) => axios.get(url).then(sleep(1000)).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(sleep(1000)).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(sleep(1000)).then(responseBody),
    delete: (url: string) => axios.delete(url).then(sleep(1000)).then(responseBody)
};

// Setting CRUD requests for our Activities
const Activities = {
    list: (): Promise<IActivitiy[]> => requests.get('/activities'),
    details: (id: string) => requests.get(`/activities/${id}`),
    create: (activity: IActivitiy) => requests.post(`/activities`, activity),
    update: (activity: IActivitiy) => requests.put(`/activities/${activity.id}`, activity),
    delete: (id: string) => requests.delete(`/activities/${id}`)
};

// Returning our request response for Activites
export default {
    Activities
}
import { useState, useCallback } from "react";
import axios from "axios";
import { toast } from 'react-toastify';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/",
    withCredentials: true
});

const useApi = () => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errMsg, setErrMsg] = useState(null);

    const get = useCallback(async (url) => {
        setIsLoading(true);
        try {
            const res = await api.get(url);
            setData(res.data);
            return res.data;
        } catch (err) {
            setIsError(true);
            if (err.response?.data?.status == 'FAILED') {
                setErrMsg(err.response.data.message);
            }else{
                setErrMsg('Failed to logout');
            }
            toast.error(errMsg);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const post = useCallback(async (url, body) => {
        setIsLoading(true);
        try {
            const res = await api.post(url, body);
            console.log(res)
            setData(res.data);
            return res.data;
        } catch (err) {
            console.log(err)
            setIsError(true);
            if (err.response?.data?.status == 'FAILED') {
                setErrMsg(err.response?.data?.message || 'Error occured');
            }else{
                setErrMsg("Something went wrong!");
            }
            toast.error(errMsg);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const put = useCallback(async (url, body) => {
        setIsLoading(true);
        try {
            const res = await api.put(url, body);
            setData(res.data);
            return res.data;
        } catch (err) {
            setIsError(true);
            if (err.response.data.status == 'FAILED') {
                setErrMsg(err.response.data.message);
            }else{
                setErrMsg("Something went wrong!");
            }
            toast.error(errMsg);

        } finally {
            setIsLoading(false);
        }
    }, []);

    const remove = useCallback(async (url) => {
        setIsLoading(true);
        try {
            const res = await api.delete(url);
            setData(res.data);
            return res.data;
        } catch (err) {
            setIsError(true);
            if (err.response?.data?.status == 'FAILED') {
                setErrMsg(err.response?.data?.message);
            }else{
                setErrMsg('Something went wrong!');
            }
            toast.error(errMsg);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { data, isLoading, isError, errMsg, get, post, put, remove };
};

export default useApi;
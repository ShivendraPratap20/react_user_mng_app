import { useState, useEffect } from "react";
import { api } from "../../hooks/userApi";
import { toast } from "react-toastify";

export default function useAuth() {
  const [authorized, setAuthorized] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const verifyAuth = async () => {
   
    try {
      setLoading(true);
      const res = await api.get("/auth");
      if(res.data?.authorize && res.data?.data != undefined){
        setUserData(res.data.data);
        setAuthorized(true);
      }
    } catch (error) {
      setError(true);
      toast.error("Authentication failed!");
    }finally{
      setLoading(false);
    }
  };
  useEffect(() => {
    verifyAuth();
  }, []);

  return { verifyAuth, authorized, userData, loading, error };
}
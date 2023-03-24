import axios from "axios";
import { useState } from "react";

// hook for components to make requests, throw errors if necessary
export default ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async () => {
    try {
      setErrors(null);
      // method === 'post', 'get', etc..
      const response = await axios[method](url, body);
      
      if (onSuccess) {
        onSuccess(response.data);
      }
      
      return response.data;
    } catch (err) {
      setErrors(
        <div className="alert alert-danger">
          <h4>Uh oh...</h4>
          <ul className="my-0">
            {err.response.data.errors.map(err => <li key={err.message}>{err.message}</li>)}
          </ul>
        </div>
      );
    }
  };
   
  return { doRequest, errors };
}
import axios from "axios";
import { useState } from "react";

export default ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async () => {
    setErrors(null);
    let error = false;
    const response = await axios[method](url, body).catch((err) => {
      console.log("error time");
      setErrors(
        <div className="alert alert-danger">
          <h4>Ooops...</h4>
          <ul className="my-0">
            {err.response.data.errors.map((err) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      );
      error = true;
    });
    if (!error) {
      if (onSuccess) {
        onSuccess(response.data);
      }
      console.log("not error time");
      return response.data;
    }
  };

  return { doRequest, errors };
};

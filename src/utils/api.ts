import {QueryClient} from "@tanstack/react-query" ;

export const apiClient = new QueryClient();
export const backendUrl:string = "http://localhost:5000";

interface RequestParams{
    url:string;
    configuration:RequestInit 
}
export const sendRequest = async ({ url, configuration }: RequestParams): Promise<any> => {
  try {
    console.log("Making API request to:", url);
    console.log("Configuration:", configuration);

    const response = await fetch(url, {
      ...configuration,
      credentials: "include", 
    });

    const contentType = response.headers.get("content-type") || "";

    let data;
    if (contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    console.log("Response received:", response.status, data);

    if (!response.ok) {
      const message = typeof data === "object" && data.message ? data.message : data;
      throw new Error(message || "Request failed");
    }

    return { statusCode: response.status, data };
  } catch (error: any) {
    console.error("API Request Error:", error);
    throw new Error(error.message);
  }
};

export const getAllData = async (url: string, configuration?: RequestInit): Promise<any> => {
  try {
    const response = await fetch(url, {
      ...configuration,
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(`${data.message}`);
    }
    return data;
  } catch (error: any) {
    throw new Error(`${error.message}`);
  }
};




// export const googleAuth = async (code) => {
//   const response = await fetch(`${backendUrl}/auth/google?code=${code}`);
//   if (!response.ok) {
//     throw new Error("Network response was not ok " + response.statusText);
//   }
//   return response.json();
// }

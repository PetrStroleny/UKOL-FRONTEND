export const GENERAL_ERROR_MESSAGE = "Něco se nepovedlo, zkuste to prosím později";

export const API_URL = "http://localhost:8000";

export async function getData(url: string, activeUserToken: string) {
    const headers: any = {"Content-Type": "application/json", "Authorization" : `bearer ${activeUserToken}`};

    const response = await fetch(`${API_URL}/${url}`, {
        method: 'GET',
        headers: headers,
    });

    if (response.ok) {
        return await response.json();
    }

    throw response.status;
}

export async function postData(url: string, data: any, activeUserToken: string, method = "POST"): Promise<Response> {
    const headers: any = {"Content-Type": "application/json", "Authorization" : `bearer ${activeUserToken}`};

    const response = await fetch(`${API_URL}/${url}`, {
        method,
        headers,
        body: JSON.stringify(data)
    });
    
    if (response.ok) {
        return response;
    }

    throw response;
}
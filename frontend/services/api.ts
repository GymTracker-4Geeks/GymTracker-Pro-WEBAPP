const BASE_URL: string = process.env.NEXT_PUBLIC_FLASK_API_URL || '/api'

const getHeaders = (): Record<string, string> => {
    const token = localStorage.getItem('access_token')
    return {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}`})
    }
}

const handleResponse = async <T>(res: Response): Promise<T> => {
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Request failed')
    return data as T
}

export const GET = async <T>(endpoint: string, signal?: AbortSignal): Promise<T> => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        headers: getHeaders(),
        signal,
    })
    return handleResponse<T>(res)
}

export const POST = async <T, U = unknown>(endpoint: string, body: U): Promise<T> => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(body),
    })
    return handleResponse<T>(res)
}

export const PUT = async <T, U = unknown>(endpoint: string, body: U): Promise<T> => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(body)
    });
    return handleResponse<T>(res);
};

export const PATCH = async <T, U = unknown>(endpoint: string, body?: U): Promise<T> => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(res);
};

export const DELETE = async <T>(endpoint: string): Promise<T> => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    return handleResponse<T>(res);
};
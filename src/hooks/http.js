import { useReducer, useCallback } from "react";

const initState = {
    loading: false,
    error: null,
    data: null,
    extra: null,
    identifier: null
};

const httpReducer = (httpState, action) => {
    switch (action.type) {
        case "SEND": return { loading: true, error: null };
        case "RESPONSE": return { ...httpState, loading: false, data: action.responseData, identifier: action.identifier, extra: action.extra };
        case "ERROR": return { error: action.message, loading: true };
        case "CLEAR": return initState;
        default: throw new Error()
    }
}

const useHttp = () => {
    const [httpState, dispatchHttp] = useReducer(httpReducer, initState);

    const clear = useCallback(() => dispatchHttp({ type: "CLEAR" }), [dispatchHttp]);

    const sendRequest = useCallback((url, method, body, extra, identifier) => {
        dispatchHttp({ type: "SEND" });
        fetch(url, {
            method: method,
            body: body,
            headers: { "Content-Type": "application/json" }
        }).then(response => {
            return response.json()
        }).then(responseData => {
            dispatchHttp({ type: "RESPONSE", responseData, extra, identifier });
        }).catch(err => {
            dispatchHttp({ type: "ERROR", message: err.message })
        })
    }, [])

    return {
        loading: httpState.loading,
        error: httpState.error,
        data: httpState.data,
        sendRequest,
        extra: httpState.extra,
        identifier: httpState.identifier,
        clear
    }
}

export default useHttp;

const backendCommonClient = {
    parseResponseJSON: (response) => {
        return new Promise((resolve) =>
            response.json().then((json) => {
                resolve({
                    status: response.status,
                    ok: response.ok,
                    token: response.headers.get('x-access-token'),
                    refreshToken: response.headers.get('x-refresh-token'),
                    json
                });
            })
        );
    },
    makeRESTCall: (endpoint, options) => {
        options = {
            ...options,
            headers: {
                ...options.headers,
                // 'x-refresh-token': utilityFunctions.getRefreshTokenFromCookie(),
                // 'x-api-key': config.APPLICATION.APIGATEWAY_KEY
            },
            credentials: 'include',
            mode: 'cors',
            redirect: 'follow'
        }; // Don't forget to specify this if you need cookies

        return new Promise((resolve, reject) => {
            fetch(endpoint, options)
                .then(backendCommonClient.parseResponseJSON)
                .then((response) => {
                    // if the response had token header then it will be added in the response
                    // for simplifying the access to the token later in the view files.
                    // Thus the token is accessible as data.token instead of the going through the
                    // entire header.
                    // eg. signin.js calls authenticateUser and expects token in the data.
                    if (response.token !== undefined) {
                        response.json = {
                            ...response.json,
                            token: response.token
                        };
                    }
                    
                    if (response.ok) {
                        return resolve(response.json);
                    }
                    //console.log(response.status);
                    //console.log(response.json);
                    if (response.status === 498) {
                        throw Error(
                            JSON.stringify({
                                status: response.status,
                                message: 'Something went wrong'
                            })
                        );
                    }
                    return reject(response.json);
                })
                .catch((error) => {
                    let err = {};
                    if (typeof error.message === 'string') {
                        err = { message: error.message };
                        if (error.status === undefined) {
                            err = { ...err, status: 500 };
                        }
                    } else {
                        err = JSON.parse(error.message);
                    }

                    reject({
                        error: err.message,
                        status: err.status
                    });
                });
        });
    }
};

export default backendCommonClient;

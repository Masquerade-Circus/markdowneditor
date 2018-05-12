let loc = window.location;

let Api = {
    baseUrl: loc.origin || loc.protocol + '//' + loc.hostname + (loc.port ? (':' + loc.port) : ''),
    request(method, ...args) {
        let data = undefined;
        if (typeof args[args.length - 1] === 'object') {
            data = args.pop();
        }

        return m.request({
            method: method,
            url: `${Api.baseUrl}/${args.join('/')}`,
            data: data,
            body: data
        })
            .catch(error => {
                COMPONENT.Notification.open({
                    color: 'danger',
                    content: error.message
                });
                throw error;
            });
    },
};

'get|post|put|delete'.split('|').forEach(method => {
    Api[method] = (...args) => {
        args.unshift(method);
        return Api.request.apply(Api, args);
    };
});

export default Api;
let Api = {
    get(args) {
        return m.request({
            method: "GET",
            url: `/${args.join('/')}`
        });
    }
};

export default Api;
const getResponseMethod = (method: string): number | null => {
    switch (method) {
        case 'GET':
            return 200;
        case 'POST':
            return 201;
        case 'PUT':
        case 'PATCH':
            return 200;
        case 'DELETE':
            return 204;
        default:
            return null;
    }
};

export default getResponseMethod;
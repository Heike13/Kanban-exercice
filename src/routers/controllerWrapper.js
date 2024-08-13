// Desc: Wrapper for controller methods to catch errors and send a 500 status code with a JSON response.
export function controllerWrapper(controllerMethod) {
    return async (req, res, next) => {
        try {
            await controllerMethod(req, res, next);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Unexpected server error' });
        }
    };
}

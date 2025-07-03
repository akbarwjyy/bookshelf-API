const hapi = require('@hapi/hapi');
const routes = require('./routes');

const init = async () => {
    const server = hapi.server({
        port: 9000,
        host: 'localhost',
    });

    server.route(routes);

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
}

init();
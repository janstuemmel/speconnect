const createServer = require('./');

const connect = require('connect');

describe('speconnect tests', () => {


  it('should start/stop connect server with callback', done => {

    // given
    const app = connect();

    // when
    createServer(app, (err, server) => {

      // then
      server.close(done);
    });
  });


  it('should start/stop connect server with promise', async () => {

    // given
    const app = connect();

    // when
    const test = await createServer(app);

    // then
    expect(test).toMatchObject({
      port: expect.any(Number),
      address: '127.0.0.1'
    });

    // after
    await test.close();
  });


  it('should get OK', async () => {

    // given
    const app = connect();
    app.use((req, res) => res.end('OK'));
    test = await createServer(app);

    // when
    const res = await test.get('/foo');

    // then
    expect(res.data).toBe('OK');

    // after
    await test.close();
  });

});

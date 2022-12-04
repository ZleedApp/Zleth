import bcrypt from 'bcrypt';
import crypto from 'crypto';

module.exports = {
  addEndpoint: (app: any, mongoose: any) => {
    app.post('/v1/auth/register', async (req: any, res: any) => {

    });
  }
};
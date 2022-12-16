import jwt              from 'jsonwebtoken';
import schemas          from '../../models';

interface JwtPayload {
  uuid: string;
  username: string;
  email: string;
}

module.exports = {
  addEndpoint: (app: any, mongoose: any) => {
    const User = mongoose.model('User');

    app.get('/v1/user/@me', async (req: any, res: any) => {
      const jwtToken   = req.headers.authorization.split(' ')[1];
      const jwtDecoded = jwt.verify(jwtToken, process.env.JWT_SECRET!) as JwtPayload;

      const user = await User.findOne({ uuid: jwtDecoded.uuid });

      if(!user) return res.status(404).json({
        status: 0,
        message: 'User not found!',
        messageCode: 'USER_NOT_FOUND',
      });

      res.json({
        status: 1,
        message: 'Successfully found the user.',
        messageCode: 'USER_FOUND',
        data: {
          uuid: user.uuid,
          username: user.username,
          email: user.email,
          streamData: user.streamData,
          streamKey: user.streamKey,
          createdAt: new Date(user.createdAt).getTime() * 1000,
          lastSignIn: new Date(user.lastSignIn).getTime() * 1000,
        }
      });
    });

    app.get('/v1/user/:username', async (req: any, res: any) => {
      const user = await User.findOne({ username: req.params.username });

      if(!user) return res.status(404).json({
        status: 0,
        message: 'User not found!',
        messageCode: 'USER_NOT_FOUND',
      });

      res.json({
        status: 1,
        message: 'Successfully found the user.',
        messageCode: 'USER_FOUND',
        data: {
          uuid: user.uuid,
          username: user.username,
          streamData: user.streamData,
          createdAt: new Date(user.createdAt).getTime() * 1000,
          lastSignIn: new Date(user.lastSignIn).getTime() * 1000,
        }
      });
    });
  }
}
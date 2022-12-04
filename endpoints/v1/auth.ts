import bcrypt           from 'bcrypt';
import crypto           from 'crypto';
import jwt              from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

module.exports = {
  addEndpoint: (app: any, mongoose: any) => {
    const User = mongoose.model('User', {
      uuid: {
        type: String,
        required: true,
        unique: true
      },
      username: {
        type: String,
        required: true
      },
      password: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true,
        trim: true,
        index: {
          unique: true
        }
      },
      streamData: {
        streamTitle: String,
        streamDescription: String,
        streamCategory: String,
        streamLanguage: String,
        streamTags: [String],
        streamThumbnail: String,
      },
      streamKey: String,
      createdAt: Date,
      lastSignIn: Date,
    });

    app.post('/v1/auth/register', async (req: any, res: any) => {
      const requestBody = req.body;

      if(!checkRequestBody(requestBody, 'register')) checkRequestBody(requestBody, 'register');

      const passwordSalt  = await bcrypt.genSalt(5);
      const passwordHash  = await bcrypt.hash(req.body.password, passwordSalt);

      const streamKey     = crypto.randomBytes(20).toString('hex');
      const userUUID      = uuidv4();

      const newUser = new User({
        uuid: userUUID,
        username: requestBody.username,
        password: passwordHash,
        email: requestBody.email,
        streamData: {
          streamTitle: '',
          streamDescription: '',
          streamCategory: '',
          streamLanguage: '',
          streamTags: [],
          streamThumbnail: '',
        },
        streamKey: streamKey,
        createdAt: new Date(),
        lastSignIn: new Date(),
      });

      const jwtToken   = jwt.sign({ id: userUUID, username: requestBody.username, email: requestBody.email }, process.env.JWT_SECRET!, { algorithm: 'HS512', expiresIn: '30d' });
      const expiryDate = new Date().setDate(new Date().getDate() + 30);

      newUser.save()
        .then((user: any) => {
          res.status(200).json({
            status: 'success',
            message: 'User created successfully!',
            messageCode: 'USER_CREATED',
            data: {
              jwtToken: jwtToken,
              expiryDate: expiryDate,
            }
        });
      })
      .catch((err: any) => {
        if(err.code === 11000) {
          res.status(400).json({
            status: 'error',
            message: 'User already exists!',
            messageCode: 'USER_ALREADY_EXISTS',
          });
        } else {
          res.status(500).json({
            status: 'error',
            message: 'Internal server error!',
            messageCode: 'INTERNAL_SERVER_ERROR',
          });
        }
      });
    });

    const checkRequestBody = (requestBody: any, endPoint: String) => {
      if(!requestBody.username && endPoint !== 'login') {
        return {
          status: 0,
          message: 'Username is required.',
          messageCode: 'USERNAME_REQUIRED',
          data: null
        };
      } else if(!requestBody.email) {
        return {
          status: 0,
          message: 'Email is required.',
          messageCode: 'EMAIL_REQUIRED',
          data: null
        };
      } else if(!requestBody.password) {
        return {
          status: 0,
          message: 'Password is required.',
          messageCode: 'PASSWORD_REQUIRED',
          data: null
        };
      } else {
        return true;
      }
    };
  }
};
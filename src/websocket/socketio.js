const { Server } = require('socket.io');
const auth = require('../middlewares/auth');

const { someOneFollowYou, acceptFollow } = require('../services/follow.service');
const { createFollowNotification, triggerFollowNotification, createAcceptFollowNotification } = require('../services/notification.service');
const SocketRoom = require('../models/socketId.model');

const socketio = (httpServer) => {
  return new Promise((resolve) => {
    const io = new Server(httpServer, {
      cors: {
        origin: '*',
      },
      // transports: ["websocket"],
    });

    const wrap = (middleware) => async (socket, next) => {
      await middleware(socket.request, {}, next);
    };

    io.use(wrap(auth()));

    io.on('connection', async (socket) => {
      let { id: userId } = socket.request.user;

      //Join user into their room
      socket.join(`${userId}`);

      console.log(`New user connected ${JSON.stringify(socket.request.user)}`);

      socket.on('disconnect', async () => {
        console.log(`User ${userId} with socket ${socket.id} is disconnected`);

        socket.leave(`${userId}`);

        await SocketRoom.deleteOne({
          ownerId: userId,
          socketId: socket.id,
        });
      });

      socket.on('connect_error', (err) => {
        console.error(err);
      });

      //Duy code here

      //Khai code here
      socket.on('follow', async (arg) => {
        try {
          const { userId: followerId } = arg;

          let profile = await someOneFollowYou({ followerId, ownerId: userId });

          //tao noti
          let noti = await createFollowNotification({
            receiveFollowRequestUserId: profile.receiveFollowRequestUser.ownerId,
            sendRequestFollowProfileId: profile.ownerUser._id,
          });

          //notificationCount here

          // socket.emit('receive-follow', profile, noti);
          // FE uncomment below line
          io.to(`${followerId}`).emit('receive-follow', profile, noti);
        } catch (err) {
          socket.emit('on-error', { err: err });
        }
      });

      socket.on('accept-follow', async (arg) => {
        try {
          const { userId: followerId, isAccepted } = arg;
          let profile = await acceptFollow({ followerId, ownerId: socket.request.user.id, isAccepted });

          let noti = await triggerFollowNotification({ followerId, ownerId: socket.request.user.id, isAccepted });

          if (noti) {
            noti.followNotification.isTrigger = isAccepted ? 'accept' : 'decline';

            await noti.save();
          }

          // tạo noti cho người gửi follow và emit
          const acceptNoti = await createAcceptFollowNotification({followerId, userId})


          // io.emit('unicast-accept-follow', profile);

          //FE uncomment below line
          io.to(`${followerId}`).emit('unicast-accept-follow', profile);
        } catch (err) {
          console.log(err);
          socket.emit('on-error', { err: err });
        }
      });
    });
    resolve('Socket is connected');
  });
};

module.exports = socketio;

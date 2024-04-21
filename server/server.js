const io = require("socket.io")(5000, {
    cors: {
        origin: "*"
    }
});

const rooms = new Map()

const roomsPeople = new Map()

setInterval(() => {
    console.log(rooms, roomsPeople);
}, 5000)

io.on('connection', (socket) => {
    console.log('a user connected ' + new Date());

    socket.on('check-room', ({ room }, cb) => {
        if (rooms.has(room) && rooms.get(room).length >= 2) {
            console.log('checking the room and it is full');
            cb(0)
        } else {
            console.log('checking the room and it is available');
            cb(1)
        }
    })

    socket.on('join-room', ({ room }) => {
        if (rooms.has(room) && rooms.get(room).length >= 2) {
            console.log('cannot add more people to the room');
            return
        }
        if (rooms.has(room) && rooms.get(room).length == 1) {
            console.log('adding the second person to the room');
            rooms.get(room).push(socket.id)
            socket.emit('player', 2)

        } else if (!rooms.has(room) || rooms.get(room).length == 0) {
            console.log('adding the first person to the room');
            rooms.set(room, [])
            rooms.get(room).push(socket.id)
            socket.emit('player', 1)
        }
        roomsPeople.set(socket.id, room)
        console.log(`joining room (${room})`);
        socket.join(room)
    })

    socket.on('move', ({ values, room }) => {
        if (!rooms.get(room).includes(socket.id)) return
        console.log('someone made a move...');
        io.sockets.in(room).emit('move', values)
    })

    socket.on('reset', ({ room }) => {
        if (!rooms.get(room).includes(socket.id)) return
        console.log('reset...');
        io.sockets.in(room).emit('reset', {})
    })

    socket.on('disconnect', () => {
        const disconnectedId = socket.id;
        if (disconnectedId) {
            const theRoom = roomsPeople.get(disconnectedId)
            if (theRoom) {
                const index = rooms.get(theRoom).indexOf(disconnectedId);
                rooms.get(roomsPeople.get(disconnectedId)).splice(index, 1);
                roomsPeople.delete(disconnectedId)
                console.log('a user disconnect!');
            }
        }

    });

});

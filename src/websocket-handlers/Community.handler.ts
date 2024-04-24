import { Server, Socket } from 'socket.io';

import { CommunityService } from '../services/Community.service';

export const CommunityHandler = function (io: Server) {
    io.on('connection', (socket: Socket) => {
        console.log(`New client connected: ${socket.id}`);

        socket.on('getCommunities', async () => {
            const result = await CommunityService.getAllCommunities();

            socket.emit('allCommunities', result);
        });

        // Listen for 'createCommunity' events from the client
        socket.on('createCommunity', async (data) => {
            const { name, description } = data;

            await CommunityService.createNewCommunity(name, description);

            // const result = await CommunityService.getAllCommunities();

            // Emit a 'communityCreated' event back to the client with the result
            // socket.emit('createCommunity', result);
        });

        // Define a new WebSocket event listener for 'getLargestCommunities'
        socket.on('getLargestCommunities', async () => {
            const result = await CommunityService.topLargestCommunities();

            // Emit a 'largestCommunities' event with the results
            socket.emit('largestCommunities', result);
        });

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
};

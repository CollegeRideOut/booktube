import { router, clientProcedure, adminProcedure } from '../init';
import { z } from 'zod';
import { videoRepo } from '../repo/videoRepo';
import { TRPCError } from '@trpc/server';
import { Bucket } from 'sst/node/bucket';

const routerName = 'videoRoute';

export const videoRouter = router({
  //client based routes

  createNewVideo: adminProcedure
    .input(
      z.object({
        id: z.string(),
        tagIds: z.array(z.string()),
      }),
    )
    .mutation(async (opts) => {
      try {
        const streamInfo = opts.input;

        // save steam the files should be upoaded manuelly with the id passed
        await videoRepo.createVideo(streamInfo.id, streamInfo.tagIds);
        return { ok: 'saved' };
      } catch (error) {
        console.log(
          `There was an error in ${routerName} - createNewVideo, `,
          error,
        );
        throw error;
      }
    }),

  getLoVi: clientProcedure
    .input(z.object({ cursor: z.number() }))
    .query(async (opts) => {
    
      try {
      const cursor = opts.input.cursor
        const videos = await videoRepo.randomVideos(cursor);
        videos.forEach((v) => {
          v.path = `http://${process.env.VIDEO_DISTRIBUTION_DOMAIN}/${v.path}.m3u8`;
        });

        return videos;
      } catch (error) {
        console.log(`Error in ${routerName} - getLoVi:`, error);
        throw error;
      }
    }),

  getVideo: clientProcedure.input(z.string()).query(async (opts) => {
    try {
      const id = opts.input;
      const videos = await videoRepo.getVideoById(id);
      if (videos.length === 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'video does not exist',
        });
      }

      const video = videos[0];

      if (video.id != id) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'video id does not match',
        });
      }

      return video;
    } catch (error) {
      console.log(`Error in ${routerName} - getVideo:`, error);
      throw error;
    }
  }),
});

import { Bucket } from 'sst/node/bucket';
import { clientProcedure, router } from '../init';
import { libraryRepo } from '../repo/libraryRepo';

export const libraryRoute = router({
  getLibrary: clientProcedure.query(async (opts) => {
    const userId = opts.ctx.user!.id;
    try {
      const library = await libraryRepo.getUserLibrary(userId);

      library.forEach((lib) => {
        lib.book.thumbnail = `https://${Bucket.bookBucket.bucketName}.s3.amazonaws.com/${lib.book.thumbnail}`;
      });
      return library;
    } catch (error) {
      console.log(`error in library route get library ${error}`);
      throw error;
    }
  }),
});

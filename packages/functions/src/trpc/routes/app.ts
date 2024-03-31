import { router } from '../init';
import { authRouter } from './auth';
import { bookRouter } from './bookRoute';
import { audiobookRouter } from './audiobookRoute';
import { videoRouter } from './videoRoute';
import { userRoute } from './userRotue';
import { libraryRoute } from './libraryRoute';
import { genreRoute } from './genreRoute';
import { subsRoute } from './subsRoute';
import { tagRoute } from './tagRoute';
import { chapterProgressRoute } from './chapterProgressRoute';
import { chapterRoute } from './chapterRoute';

export const appRouter = router({
  auth: authRouter,
  user: userRoute,
  book: bookRouter,
  audiobook: audiobookRouter,
  video: videoRouter,
  library: libraryRoute,
  genre: genreRoute,
  subs: subsRoute,
  tags: tagRoute,
  chapterProgress: chapterProgressRoute,
  chapter: chapterRoute,
});

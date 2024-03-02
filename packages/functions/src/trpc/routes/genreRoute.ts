import { Bucket } from 'sst/node/bucket';
import { adminProcedure, clientProcedure, router } from '../init';
import { genreRepo } from '../repo/genreRepo';
import { z } from 'zod';

export const genreRoute = router({
  getGLoLoBo: clientProcedure.query(async (opts) => {
    try {
      const genres = await genreRepo.getGLoLoBo();

      const genresSet: {
        id: string;
        name: string;
        books: {
          id: string;
          name: string;
          author: string;
          content: string;
          thumbnail: string | null;
          price: number | null;
        }[];
      }[] = [];

      genres.forEach((g) => {
        const found = genresSet.find((gl) => {
          return gl.id === g.generes.id;
        });
        if (found) {
          g.books.thumbnail = `https://${Bucket.bookBucket.bucketName}.s3.amazonaws.com/${g.books.thumbnail}`;
          found.books.push(g.books);
        } else {
          g.books.thumbnail = `https://${Bucket.bookBucket.bucketName}.s3.amazonaws.com/${g.books.thumbnail}`;
          genresSet.push({
            id: g.generes.id,
            name: g.generes.name,
            books: [g.books],
          });
        }
      });

      return genresSet;
    } catch (error) {
      console.log(`eeeror in genreRoute GLoLoBo ${error}`);
      throw error;
    }
  }),

  getGenres: clientProcedure.query(async () => {
    try {
      return await genreRepo.getGenres();
    } catch (error) {
      console.log(`error in getGenres GLoLoBo ${error}`);
      throw error;
    }
  }),

  getBooksUnderGenre: clientProcedure.input(z.string()).query(async (opts) => {
    try {
      const id = opts.input;
      const books = await genreRepo.getBooksUnderGenre(id);
      books.forEach((b) => {
        b.thumbnail = `https://${Bucket.bookBucket.bucketName}.s3.amazonaws.com/${b.thumbnail}`;
      });

      return books;
    } catch (error) {
      console.log(`error in the genreRoute getBooksUnderGenre ${error}`);
      throw error;
    }
  }),

  getGenre: clientProcedure.input(z.string()).query(async (opts) => {
    try {
      const id = opts.input;

      const genres = await genreRepo.getGenreInfo(id);
      if (genres.length === 0) {
        throw new Error('genres.lenth was empty');
      }

      const genre = genres[0];

      if (genre.id !== id) {
        throw new Error('internal server error');
      }

      return genre;
    } catch (error) {
      console.log(`error in the genreRoute getBooksUnderGenre ${error}`);
      throw error;
    }
  }),
});

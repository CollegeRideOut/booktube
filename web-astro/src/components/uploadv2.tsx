import { useEffect, useState } from 'preact/hooks';
import { chapters } from '../../../packages/core/src/schema';
import { createAuthTrpc } from '../utils/trpc';

const audioFiles = new Map<string, File>();
const subsFile = new Map<string, File>();
let thumbnailSquare: File | null = null;
let thumbnailLong: File | null = null;
let bookDurationInSeconds = 0;

export default function Uploadv2() {
  const trpc = createAuthTrpc()!;
  const [book, setBook] = useState<{
    title: string;
    summary: string;
    author: string;
    price: number;

    bookDurationInSeconds: number;
    chapters: {
      name: string;
      number: number;
      audiobooks: {
        author: string;
        language: string;
        audioFile: string;
        subs: {
          language: string;
          subsFile: string;
        }[];
      }[];
    }[];
  }>({
    title: '',
    summary: '',
    author: '',
    price: 0,
    chapters: [],

    bookDurationInSeconds: 0,
  });

  const [genres, setGenres] = useState<
    {
      id: string;
      name: string;
    }[]
  >([]);

  useEffect(() => {
    const getGenres = async () => {
      try {
        const g = await trpc.genre.getGenres.query();
        setGenres(g);
      } catch (error) {
        console.log(error);
      }
    };
    getGenres();
    console.log(' i ran ');
  }, []);

  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  return (
    <div>
      <button
        onClick={async () => {
          try {
            console.log({
              ...book,
              bookDurationInSeconds: bookDurationInSeconds,
            });
            //remember to do thing for the long one too
            const urls = await trpc.book.createBook.mutate({
              ...book,
              bookDurationInSeconds: bookDurationInSeconds,
              genres: selectedGenres,
            });

            const thumbnailSquareAws = await fetch(urls.thumbnailSquareUrl, {
              body: thumbnailSquare,
              method: 'PUT',
              headers: {
                'Content-Type': thumbnailSquare!.type,
                'Content-Disposition': `attachment; filename="${thumbnailSquare!.name}"`,
              },
            });
            console.log(thumbnailSquareAws);

            const thumbnailLongAWS = await fetch(urls.thumbnailLongUrl, {
              body: thumbnailLong,
              method: 'PUT',
              headers: {
                'Content-Type': thumbnailLong!.type,
                'Content-Disposition': `attachment; filename="${thumbnailLong!.name}"`,
              },
            });
            console.log(thumbnailSquareAws);

            urls.audioUrl.forEach(async (au) => {
              const file = audioFiles.get(au.key);
              if (file) {
                const audioSended = await fetch(au.url, {
                  body: file,
                  method: 'PUT',
                  headers: {
                    'Content-Type': file!.type,
                    'Content-Disposition': `attachment; filename="${file!.name}"`,
                  },
                });
                console.log(au.key, '-', audioSended);
              }
            });

            urls.subsUrl.forEach(async (subU) => {
              const file = subsFile.get(subU.key);
              if (file) {
                const subsSent = await fetch(subU.url, {
                  body: file,
                  method: 'PUT',
                  headers: {
                    'Content-Type': file!.type,
                    'Content-Disposition': `attachment; filename="${file!.name}"`,
                  },
                });
                console.log(subU.key, '-', subsSent);
              }
            });
          } catch (e) {
            console.log(e);
          }
        }}
      >
        submit
      </button>
      <div class='flex flex-row'>
        <div
          onDragOver={(e) => {
            e.preventDefault();
          }}
          style={{
            width: 200,
            height: 200,
            backgroundColor: 'black',
            color: 'white',
            textAlign: 'center',
          }}
          onDrop={(e) => {
            e.preventDefault();
            if (!e.dataTransfer) {
              console.log('no data tranfers');
              return;
            }

            if (e.dataTransfer.items.length === 0) {
              console.log('no files');
            }

            const file = e.dataTransfer.items[0].getAsFile()!;

            thumbnailSquare = file;
            const cBook = JSON.parse(JSON.stringify(book)) as typeof book;

            setBook(cBook);
          }}
        >
          thumbnialSquare
          {thumbnailSquare === null ? 'no file' : thumbnailSquare.name}{' '}
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
          }}
          style={{
            width: 200,
            height: 200,
            backgroundColor: 'black',
            color: 'white',
            textAlign: 'center',
          }}
          onDrop={(e) => {
            e.preventDefault();
            if (!e.dataTransfer) {
              console.log('no data tranfers');
              return;
            }

            if (e.dataTransfer.items.length === 0) {
              console.log('no files');
            }

            const file = e.dataTransfer.items[0].getAsFile()!;

            thumbnailLong = file;
            const cBook = JSON.parse(JSON.stringify(book)) as typeof book;

            setBook(cBook);
          }}
        >
          thumbnail LONG
          {thumbnailLong === null ? 'no file' : thumbnailLong.name}{' '}
        </div>
        <div>
          <select
            onChange={(e) => {
              const options = [
                ...(e.target as HTMLSelectElement).selectedOptions,
              ];
              const values = options.map((o) => o.value);
              setSelectedGenres(values);
            }}
            multiple
          >
            {genres &&
              genres.map((g) => {
                return <option value={g.id}>{g.name}</option>;
              })}
          </select>
        </div>
        <div>
          <div>
            book title
            <input
              onChange={(e) => {
                const event = e.target as HTMLInputElement;
                const cBook = JSON.parse(JSON.stringify(book)) as typeof book;
                cBook!.title = event.value;
                setBook(cBook);
              }}
              value={book!.title}
              class='bg-gray-200'
            />
          </div>
          <div>
            book author
            <input
              onChange={(e) => {
                const event = e.target as HTMLInputElement;
                const cBook = JSON.parse(JSON.stringify(book)) as typeof book;
                cBook!.author = event.value;
                setBook(cBook);
              }}
              value={book!.author}
              class='bg-gray-200'
            />
          </div>
          <div>
            book price
            <input
              onChange={(e) => {
                const event = e.target as HTMLInputElement;
                const cBook = JSON.parse(JSON.stringify(book)) as typeof book;
                cBook!.price = parseFloat(event.value);
                setBook(cBook);
              }}
              value={book?.price + ''}
              class='bg-gray-200'
            />
          </div>
          <div>
            book summary
            <textarea
              onChange={(e) => {
                const event = e.target as HTMLInputElement;
                const cBook = JSON.parse(JSON.stringify(book)) as typeof book;
                cBook!.summary = event.value;
                setBook(cBook);
              }}
              value={book.summary + ''}
              class='bg-gray-200'
            />
          </div>
        </div>
      </div>

      <div>
        Chapters
        <button
          onClick={() => {
            const cBook = JSON.parse(JSON.stringify(book)) as typeof book;
            cBook.chapters.push({
              name: '',
              number: cBook.chapters.length + 1,
              audiobooks: [],
            });

            setBook(cBook);
          }}
          id='addChapterButton'
        >
          add chapter
        </button>
        {book.chapters.map((c, i) => {
          return (
            <div key={i + ''} style={{ marginLeft: 30 }}>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div>
                  Name:
                  <input
                    value={c.name}
                    onChange={(e) => {
                      const cBook = JSON.parse(
                        JSON.stringify(book),
                      ) as typeof book;
                      const chapterCopy = cBook.chapters[i];
                      const event = e.target as HTMLInputElement;
                      chapterCopy.name = event.value;
                      setBook(cBook);
                    }}
                  />
                </div>
                <div>
                  number:
                  <input
                    value={c.number + ''}
                    onChange={(e) => {
                      const cBook = JSON.parse(
                        JSON.stringify(book),
                      ) as typeof book;
                      const chapterCopy = cBook.chapters[i];
                      const event = e.target as HTMLInputElement;
                      chapterCopy.number = parseInt(event.value);
                      setBook(cBook);
                    }}
                  />
                </div>

                <div>
                  <button
                    onClick={() => {
                      const cBook = JSON.parse(
                        JSON.stringify(book),
                      ) as typeof book;
                      cBook.chapters[i].audiobooks.push({
                        author: '',
                        language: '',
                        audioFile: '',
                        subs: [],
                      });
                      setBook(cBook);
                    }}
                  >
                    addAudioBok
                  </button>
                </div>
              </div>

              {c.audiobooks.map((a, ii) => {
                const foundAudioBok = audioFiles.get(`${i}-${ii}`);
                return (
                  <div
                    key={`${i}-${ii}`}
                    style={{ marginLeft: 50, marginTop: 10 }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <div>
                        Author
                        <input
                          value={a.author}
                          onChange={(e) => {
                            const cBook = JSON.parse(
                              JSON.stringify(book),
                            ) as typeof book;

                            const event = e.target as HTMLInputElement;
                            const chapterAudio =
                              cBook.chapters[i].audiobooks[ii];
                            chapterAudio.author = event.value;
                            setBook(cBook);
                          }}
                        />
                      </div>

                      <div>
                        language
                        <input
                          value={a.language}
                          onChange={(e) => {
                            const cBook = JSON.parse(
                              JSON.stringify(book),
                            ) as typeof book;

                            const event = e.target as HTMLInputElement;
                            const chapterAudio =
                              cBook.chapters[i].audiobooks[ii];
                            chapterAudio.language = event.value;
                            setBook(cBook);
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          width: 200,
                          height: 200,
                          backgroundColor: 'black',
                          color: 'white',
                          textAlign: 'center',
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          if (!e.dataTransfer) {
                            console.log('no data tranfers');
                            return;
                          }

                          if (e.dataTransfer.items.length === 0) {
                            console.log('no files');
                          }

                          const file = e.dataTransfer.items[0].getAsFile()!;

                          //      bookFileUploaded = file;
                          const cBook = JSON.parse(
                            JSON.stringify(book),
                          ) as typeof book;
                          const audioBC = cBook.chapters[i].audiobooks[ii];
                          audioBC.audioFile = `${i}-${ii}`;
                          audioFiles.set(`${i}-${ii}`, file);
                          setBook(cBook);

                          const audio = document.createElement('audio');
                          audio.preload = 'metadata';
                          audio.onloadedmetadata = () => {
                            window.URL.revokeObjectURL(audio.src);
                            var duration = audio.duration;
                            bookDurationInSeconds += duration;
                            console.log(bookDurationInSeconds);
                          };
                          audio.src = URL.createObjectURL(file);
                        }}
                      >
                        {foundAudioBok === undefined
                          ? 'no file'
                          : foundAudioBok.name}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const cBook = JSON.parse(
                          JSON.stringify(book),
                        ) as typeof book;

                        const audioBC = cBook.chapters[i].audiobooks[ii];
                        audioBC.subs.push({
                          language: '',
                          subsFile: '',
                        });

                        setBook(cBook);
                      }}
                    >
                      Add Subs
                    </button>

                    {a.subs.map((s, iii) => {
                      const foundSubs = subsFile.get(`${i}-${ii}-${iii}`);

                      return (
                        <div style={{ marginLeft: 50, marginTop: 10 }}>
                          <div>
                            Language
                            <input
                              value={s.language}
                              onChange={(e) => {
                                const cBook = JSON.parse(
                                  JSON.stringify(book),
                                ) as typeof book;

                                const event = e.target as HTMLInputElement;
                                const sub =
                                  cBook.chapters[i].audiobooks[ii].subs[iii];
                                sub.language = event.value;
                                setBook(cBook);
                              }}
                            />
                          </div>

                          <div
                            style={{
                              width: 200,
                              height: 200,
                              backgroundColor: 'black',
                              color: 'white',
                              textAlign: 'center',
                            }}
                            onDragOver={(e) => {
                              e.preventDefault();
                            }}
                            onDrop={(e) => {
                              e.preventDefault();
                              if (!e.dataTransfer) {
                                console.log('no data tranfers');
                                return;
                              }

                              if (e.dataTransfer.items.length === 0) {
                                console.log('no files');
                              }

                              const file = e.dataTransfer.items[0].getAsFile()!;

                              //      bookFileUploaded = file;
                              const cBook = JSON.parse(
                                JSON.stringify(book),
                              ) as typeof book;
                              const subsC =
                                cBook.chapters[i].audiobooks[ii].subs[iii];
                              subsC.subsFile = `${i}-${ii}-${iii}`;
                              setBook(cBook);
                              subsFile.set(`${i}-${ii}-${iii}`, file);
                            }}
                          >
                            {foundSubs === undefined
                              ? 'no file'
                              : foundSubs.name}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { useEffect, useState } from 'preact/hooks';
import { createAuthTrpc } from '../utils/trpc.ts';

export default function Tabs() {
  const [tab, setTab] = useState(0);
  const trpc = createAuthTrpc()!;
  const [user, setUser] = useState<{
    name: string;
    email: string;
  }>();

  const [passwords, setPasswords] = useState<{
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }>({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [cards, setCards] = useState();
  const [purchaseHistory, setPurhchaseHistory] = useState<
    | {
        book: {
          id: string;
          name: string;
          author: string;
          thumbnail: string;
        };
      }[]
    | null
  >(null);
  useEffect(() => {
    const authorize = async () => {
      try {
        const auth = await trpc.auth.authorizedClient.query();
        if (!auth) {
          window.location.replace('/');
        }
      } catch (error) {
        console.log('error in the profiletabs.tsx authorization');
        window.location.replace('/');
      }
    };
    authorize();
  }, []);

  useEffect(() => {
    if (tab === 0 && !user) {
      fetchUserInfo();
    } else if (tab === 1 && !cards) {
    } else if (tab === 2 && !purchaseHistory) {
      fetchPurchaseHistroy();
    }
  }, [tab]);

  const fetchPurchaseHistroy = async () => {
    try {
      setPurhchaseHistory(await trpc.library.getLibrary.query());
    } catch (error) {
      console.log('error in profiletabs purchaseHistory', error);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const user = await trpc.user.userInfo.query();
      setUser(user);
    } catch (error) {
      console.log(`error in the profiletabs.jsx fetchUserInfo`);
    }
  };

  return (
    <div class='flex flex-col lg:flex-row gap-6 p-6'>
      <nav class='flex flex-col gap-6 w-full lg:w-1/4 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg'>
        <a
          class='text-lg font-semibold hover:text-indigo-500 dark:hover:text-indigo-300'
          onClick={() => {
            setTab(0);
          }}
        >
          Profile
        </a>
        <a
          class='text-lg font-semibold hover:text-indigo-500 dark:hover:text-indigo-300'
          onClick={() => {
            setTab(1);
          }}
        >
          Payment
        </a>
        <a
          class='text-lg font-semibold hover:text-indigo-500 dark:hover:text-indigo-300'
          onClick={() => {
            setTab(2);
          }}
        >
          Purchase History
        </a>
      </nav>

      <section class='flex flex-col gap-6 w-full lg:w-3/4'>
        {tab === 0 && (
          <div
            class='rounded-lg border bg-card text-card-foreground shadow-sm'
            id='settings'
            data-v0-t='card'
          >
            <div class='flex flex-col space-y-1.5 p-6'>
              <h3 class='text-2xl font-semibold whitespace-nowrap leading-none tracking-tight'>
                Settings
              </h3>
            </div>
            <div class='p-6'>
              <form class='grid gap-4'>
                <div class='grid gap-2'>
                  <label
                    class='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                    for='name'
                  >
                    Name
                  </label>
                  <input
                    class='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                    value={user?.name}
                    id='name'
                  />
                </div>
                <div class='grid gap-2'>
                  <label
                    class='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                    for='email'
                  >
                    Email
                  </label>
                  <input
                    class='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                    id='email'
                    value={user?.email}
                    type='email'
                  />
                </div>
                <div class='grid gap-2'>
                  <label
                    class='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                    for='oldpassword'
                  >
                    Old Password
                  </label>
                  <input
                    class='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                    id='oldpassword'
                    value={passwords.oldPassword}
                    onInput={(e) => {
                      const event = e.target as HTMLInputElement;
                      const copyPasswords = { ...passwords };
                      copyPasswords.oldPassword = event.value;
                      setPasswords(copyPasswords);
                    }}
                    type='text'
                  />
                </div>

                <div class='grid gap-2'>
                  <label
                    class='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                    for='newPassword'
                  >
                    New Password
                  </label>
                  <input
                    class='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                    id='newPassword'
                    value={passwords.newPassword}
                    onInput={(e) => {
                      const event = e.target as HTMLInputElement;
                      const copyPasswords = { ...passwords };
                      copyPasswords.newPassword = event.value;
                      setPasswords(copyPasswords);
                    }}
                    type='newPassword'
                  />
                </div>

                <div class='grid gap-2'>
                  <label
                    class='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                    for='confirmPassword'
                  >
                    Confirm Password
                  </label>
                  <input
                    class='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                    value={passwords.confirmPassword}
                    onInput={(e) => {
                      const event = e.target as HTMLInputElement;
                      const copyPasswords = { ...passwords };
                      copyPasswords.confirmPassword = event.value;
                      setPasswords(copyPasswords);
                    }}
                    id='confirmPassword'
                    type='confirmPassword'
                  />
                </div>

                <button
                  class='inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 self-start'
                  onClick={async (e) => {
                    e.preventDefault();
                    try {
                      const a = await trpc.user.updateUserInfo.mutate({
                        ...passwords,
                        name: user!.name,
                        email: user!.email,
                      });
                      console.log(a);
                    } catch (error) {
                      console.log(
                        `Error in profileTabs.tsx update Profile ${error}`,
                      );
                    }
                  }}
                >
                  Update Profile
                </button>
              </form>
            </div>
          </div>
        )}

        {tab === 1 && (
          <div
            class='rounded-lg border bg-card text-card-foreground shadow-sm'
            id='payment'
            data-v0-t='card'
          >
            <div class='flex flex-col space-y-1.5 p-6'>
              <h3 class='text-2xl font-semibold whitespace-nowrap leading-none tracking-tight'>
                Payment
              </h3>
            </div>
            <div class='p-6'>
              <form class='grid gap-4'>
                <div class='grid gap-2'>
                  <label
                    class='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                    for='cardName'
                  >
                    Card Name
                  </label>
                  <input
                    class='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                    id='cardName'
                  />
                </div>
                <div class='grid gap-2'>
                  <label
                    class='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                    for='cardNumber'
                  >
                    Card Number
                  </label>
                  <input
                    class='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                    id='cardNumber'
                  />
                </div>
                <div class='grid gap-2'>
                  <label
                    class='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                    for='expiryDate'
                  >
                    Expiry Date
                  </label>
                  <input
                    class='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                    id='expiryDate'
                  />
                </div>
                <button class='inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 self-start'>
                  Update Payment
                </button>
              </form>
            </div>
          </div>
        )}

        {tab === 2 && (
          <div
            class='rounded-lg border bg-card text-card-foreground shadow-sm'
            id='recommended'
            data-v0-t='card'
          >
            <div class='p-6'>
              <div class='grid gap-4'>
                {purchaseHistory &&
                  purchaseHistory.map((b) => {
                    return (
                      <div class='flex items-center gap-4'>
                        <img
                          src={b.book.thumbnail}
                          alt='Audiobook Cover'
                          width='100'
                          height='100'
                          class='rounded-md object-cover'
                          style='aspect-ratio: 100 / 100; object-fit: cover;'
                        />
                        <div class='grid gap-0.5'>
                          <div class='text-sm text-gray-500 dark:text-gray-400'>
                            Order #:{b.book.id}
                          </div>
                          <div class='font-semibold'>{b.book.name}</div>
                          <div class='text-sm text-gray-500 dark:text-gray-400'>
                            {b.book.author}
                          </div>

                          <div class='text-sm text-gray-500 dark:text-gray-400'>
                            ${b.book.price}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

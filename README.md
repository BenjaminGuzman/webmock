# Web mock

**Mock** web application. You can use it to learn about testing.

To practice performance testing, you can do some tests with version 1, which is intentionally and deliberately developed
with some errors and bad practices, such as:

- Pool size is small
- Backend code may use synchronized code (blocking the event loop)
- Database has some non-indexed tables
- MemoryStore is used to store sessions (memory leak)

And then, you can run the same tests with **version 2** (branch v2) which **lacks of the errors** mentioned above.

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

## Deploy

1. Copy important files

```bash
# copy init files to server (run on local machine)
scp db/db-init.sh user@testing.example.com:~/db/db-init.sh
scp docker-compose.yml .env.prod user@testing.example.com:~ # you should create your own .env.prod, see .env.example 
```

2. Start the application

```bash
# (run on server)
sudo docker compose up -d
```

3. Install nginx and (optionally) create a Let's Encrypt certificate

```bash
# install nginx
sudo dnf install nginx

# configure nginx (make sure you update the config before executing. Run on your local machine)
sed -i "s/testing.example.com/mydomain.com/" testing.example.com.conf && cp testing.example.com.conf mydomain.com.conf # make sure you update the domain name
scp mydomain.com.conf user@mydomain.com:/etc/nginx/conf.d/mydomain.com.conf

# install let's encrypt certificate (run on server)
sudo dnf install epel-release
sudo dnf install certbot python3-certbot-nginx
sudo certbot --nginx -d mydomain.com
```

## Usage

### Special endpoints

These endpoints don't need a request body, and usually they won't return a response body.
So, to check the operation was successfully you may check the response status code. 

- DELETE `/music`: Will clear the music database (users will remain intact)

- DELETE `/users`: Will clear all the users' database (music will remain intact)

- POST `/populate`: Will insert some artists, albums and tracks in the database

## License

GPLv3

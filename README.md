# Web mock

You need to set up version 1 before starting version 2

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
scp -r db/ user@testing.example.com:~/v2/db/
scp docker-compose.yml user@testing.example.com:~/v2
scp backend/users/.env.prod user@testing.example.com:~/v2/backend/users/.env.prod 
```

2. Build and copy frontend

```bash
cd frontend && npm run build && scp -r dist/ user@testing.example.com:/var/www/html && cd ..
```

3. Make NGINX serve the static content

Your configuration should look like this:

```
server {
    // ... your server config ...
    
    root /var/www/html/dist/webmock;
}
```

And you need to notify selinux.

```chcon -R -t httpd_sys_content_t /var/www/html/dist/webmock```

4. Start the application

```bash
# (run on server)
sudo docker compose up -d
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

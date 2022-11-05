# NTOU Classroom Borrowing

## Prerequirements

+ Node.js
+ Docker

## Building Steps

### Install the denpendencies

```shell
$ cd src
src $ npm install
```

### MongoDB setup by docker

```shell
src $ docker pull mongo:latest
src $ docker run --name mongo -v $(pwd)/data:/data/db -d -p 27017:27017 --rm mongo:latest
```

### Run

```
src $ npm start
```

### Check the website

http://localhost:3000

Default account and password is `root`.

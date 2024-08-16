FROM node

ARG REPOSITORY_OWNER
ARG GITHUB_TOKEN
ARG REPOSITORY_NAME
ARG DOT_ENV
ARG EXPOSE_PORT
ARG PROJECT_PATH

ENV GITHUB_REPOSITORY_URL=https://${REPOSITORY_OWNER}:${GITHUB_TOKEN}@github.com/${REPOSITORY_OWNER}/${REPOSITORY_NAME}.git

WORKDIR ${PROJECT_PATH}

RUN git clone ${GITHUB_REPOSITORY_URL} .

RUN npm i &&\
    npm i -g pm2 &&\
    echo ${DOT_ENV} > .env

EXPOSE ${EXPOSE_PORT}

CMD ["npm" , "start"]

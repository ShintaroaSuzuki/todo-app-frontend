FROM node:18.18.1 AS builder
WORKDIR /app
COPY . /app
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL
RUN yarn install --frozen-lockfile
RUN yarn build

FROM nginx:1.24.0
COPY --from=builder /app/build /var/www
COPY ./nginx /etc/nginx/conf.d
CMD ["nginx", "-g", "daemon off;"]
EXPOSE 8080

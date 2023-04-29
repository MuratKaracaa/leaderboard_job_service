# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --production --force
COPY ./dist ./

# Runtime stage
FROM node:18-alpine

ENV NODE_ENV production
ENV DB_HOST_PROD 
ENV DB_USER_PROD 
ENV DB_PASSWORD_PROD 
ENV DB_DATABASE_PROD 
ENV DB_PORT 
ENV REDIS_HOST_PROD 
ENV REDIS_PORT_PROD 

COPY --from=builder /app /app
WORKDIR /app
EXPOSE 5000
CMD [ "node", "main" ]

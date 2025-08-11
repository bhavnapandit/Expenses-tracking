FROM node:20 AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

FROM node:20
WORKDIR /app/api

COPY api/package*.json ./
RUN npm install

COPY api/ ./

COPY --from=frontend-builder /app/frontend/build ./public

ENV PORT=5000
EXPOSE 5000

ENV MONGO_URI=${MONGO_URI}

CMD ["npm", "start"]


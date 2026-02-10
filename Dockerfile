FROM node:18-alpine

# Railway builds from the repo root. This Dockerfile packages only the backend
# (located in ./campus-service-backend) so the service can deploy without
# needing a Railway "root directory" setting.
WORKDIR /usr/src/app

COPY campus-service-backend/package*.json ./
# The backend repo does not commit a lockfile, so `npm ci` fails on Railway.
RUN npm install --omit=dev

COPY campus-service-backend/ ./

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

CMD [ "node", "server.js" ]

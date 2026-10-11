# Image de production : petite, sans outils de développement, sans root.
FROM node:20-alpine

ENV NODE_ENV=production
WORKDIR /app

# 1) Dépendances d'abord : cette couche est réutilisée tant que package*.json ne change pas
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# 2) Puis le code
COPY src ./src
COPY public ./public

# L'image officielle node fournit l'utilisateur "node" (uid 1000) : on n'exécute pas en root
USER node

EXPOSE 8080
ENV PORT=8080

CMD ["node", "src/server.js"]

FROM node:20-alpine

WORKDIR /app

# Copia arquivos de dependência e instala
COPY package*.json ./
RUN npm install

# Copia o restante dos arquivos do backend
COPY . .

EXPOSE 3001

CMD ["npm", "start"]

FROM node:20-alpine

WORKDIR /app

# Copia arquivos de dependência e instala
COPY package*.json ./
RUN npm install

# Copia o restante dos arquivos do frontend
COPY . .

EXPOSE 5173

# Executa o Vite aceitando conexões externas ao container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

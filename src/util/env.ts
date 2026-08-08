import 'dotenv/config';

type envTypes = {
    PORT: number,
    DATABASE_URL: string,
    SECRET_KEY: string
}


export const env: envTypes = {
    PORT: Number(process.env.PORT),
    DATABASE_URL: process.env.DATABASE_URL!,
    SECRET_KEY: process.env.SECRET_KEY!
}
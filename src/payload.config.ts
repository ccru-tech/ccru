// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Home } from './globals/Home'
import { Units } from './collections/Units'
import { Products } from './collections/Products'

import { pt } from '@payloadcms/translations/languages/pt'
import { Offers } from './collections/Offers/config'
import { Customers } from './collections/Customers/config'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    timezones: { defaultTimezone: 'America/Sao_Paulo' },
    livePreview: {
      url: 'http://localhost:3000',
      globals: ['home'],
      breakpoints: [
        {
          name: 'mobile',
          height: 667,
          label: 'Mobile',
          width: 375,
        },
      ],
    },
    autoLogin:
      process.env.NODE_ENV === 'development'
        ? {
            email: 'admin@ccru.com',
            password: 'admin',
            prefillOnly: true,
          }
        : false,
  },
  globals: [Home],
  collections: [Offers, Products, Units, Customers, Users],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
  i18n: {
    supportedLanguages: { pt },
    fallbackLanguage: 'pt', // default
  },
})

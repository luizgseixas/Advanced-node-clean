import { DataSource } from 'typeorm'

export const dataSource: DataSource = new DataSource({
  name: 'default',
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'docker',
  password: 'ignite',
  database: 'rentx',
  entities: ['src/infra/postgres/entities/index.ts'],
  migrations: ['./dist/database/migrations/*.js']
})

import {
  BadRequestException,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Render,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { AppService } from './app.service';
import { Client, Pool } from 'pg';
import * as bcrypt from 'bcrypt';

@Controller()
export class AppController {
  private pool: Pool;

  constructor(private readonly appService: AppService) {
    //Handlebars.registerPartial('partial', '{{prefix}}');
    // instantiate the database
    // docker run --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=pass -v ~/projects/webmock/db/employees-init.sh:/docker-entrypoint-initdb.d/employees.init.sh -v ~/projects/webmock/db/employees_data.sql:/employees.sql -d postgres
    // docker exec -ti postgres bash
    this.pool = new Pool({
      user: 'admin',
      host: '127.0.0.1',
      database: 'employees',
      password: 'pass1234',
      min: 10,
    });
  }

  @Post('/register')
  @Render('index')
  async register(@Req() req: Request) {
    // TODO register
    // intentionally do it without connection pooling
    const client = new Client({
      user: 'admin',
      host: '127.0.0.1',
      database: 'employees',
      password: 'pass1234',
    });

    await client.connect();

    const body: {
      email: string;
      password: string;
      passwordConfirmation: string;
    } = req.body;

    if (body.password !== body.passwordConfirmation)
      throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST);

    try {
      await new Promise<void>((resolve, reject) => {
        client.query(
          'INSERT INTO employees.users(email, password) VALUES($1, $2)',
          [body.email, bcrypt.hashSync(body.password, 10)],
          (err, result) => {
            if (err) {
              switch ((err as unknown as { code: string }).code) {
                case '23505':
                  reject(
                    new BadRequestException('Email is already registered'),
                  );
                  break;
                default:
                  console.log(err);
                  reject(new InternalServerErrorException());
              }
            }

            resolve();
          },
        );
      });
    } finally {
      client.end();
    }

    return {
      title: `${body.email} successfully registered. You can now log in`,
    };
  }

  @Post('/login')
  @Render('menu')
  async login(@Req() req: Request) {
    // TODO login
    // do it with connection pooling
    const conn = await this.pool.connect();

    const body: { email: string; password: string } = req.body;

    try {
      await new Promise<void>((resolve, reject) => {
        // table is not indexed so we should expect poor performance
        conn.query(
          'SELECT password FROM employees.users WHERE email=$1',
          [body.email],
          (err, result) => {
            if (err) return reject(new InternalServerErrorException());

            if (result.rowCount != 1)
              return reject(
                new BadRequestException('Invalid email or password'),
              );

            if (bcrypt.compareSync(body.password, result.rows[0].password))
              return resolve();
          },
        );
      });
    } finally {
      conn.release();
    }

    // TODO generate cookie for authentication

    return { email: body.email };
  }

  @Get('/salary')
  @Render('salary-query')
  async querySalary(@Req() req: Request) {
    const queries = req.query;
    let query = 'SELECT * FROM employees.salary';
    const queryParams = [];

    if (Object.keys(queries).length > 0) {
      query += ' WHERE 1=1';

      if (queries.minAmount) {
        query += ` AND amount > $${queryParams.length + 1}`;
        queryParams.push(queries.minAmount);
      }

      if (queries.employeeId) {
        query += ` AND employee_id = $${queryParams.length + 1}`;
        queryParams.push(queries.employeeId);
      }

      if (queries.fromDate) {
        query += ` AND from_date = $${queryParams.length + 1}::date`;
        queryParams.push(queries.fromDate);
      }

      if (queries.toDate) {
        query += ` AND to_date = $${queryParams.length + 1}::date`;
        queryParams.push(queries.toDate);
      }
    }

    query += ' LIMIT 100';

    const conn = await this.pool.connect();

    try {
      const employees = await new Promise<{
        employee_id: number;
        amount: number;
        from_date: Date;
        to_date: Date;
      }>((resolve, reject) => {
        // table is not indexed so we should expect poor performance
        conn.query(query, queryParams, (err, result) => {
          if (err) return reject(new InternalServerErrorException());

          return resolve(
            result.rows as unknown as {
              employee_id: number;
              amount: number;
              from_date: Date;
              to_date: Date;
            },
          );
        });
      });

      return { employees };
    } finally {
      conn.release();
    }

    return new InternalServerErrorException();
  }

  @Get()
  @Render('index')
  root() {
    return { title: 'Welcome to the super mock site!' };
  }
}

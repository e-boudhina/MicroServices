import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'apps/auth/src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TestService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    ){}
  async getUser() {
    //const res = await this.usersRepository.findOneBy({ email: 'elyesboudhina@gmail.com' });
    //console.log(res);
    const res= {
      "id": 7,
      "username": "e-boudhina",
      "email": "elyesboudhina@gmail.com",
      "role":"user"
    } 

    return res;
  }
}

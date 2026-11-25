import { BadRequestException, ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { HashingService } from 'src/auth/hashing/hashing.service';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dot';

@Injectable()
export class PersonService {

  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
    private readonly hashingService: HashingService,
  ) { }

  //CRIAR UMA NOVA PESSOA
  async create(createPersonDto: CreatePersonDto) {

    try {
      const passwordHash = await this.hashingService.hash(createPersonDto.password)
      const newPerson = {
        name: createPersonDto.name,
        passwordHash: passwordHash,
        email: createPersonDto.email
      }

      const person = this.personRepository.create(newPerson)
      return await this.personRepository.save(person)

    } catch (error) {
      if (error instanceof QueryFailedError && (error as any).code === '23505') {
        throw new ConflictException(`Esse Email já está cadastrado`)
      }

      throw error
    }

  }

  // BUSCAR TODAS AS PESSOAS
  async findAll() {
    const people = await this.personRepository.find();
    return people;
  }

  //BUSCAR UMA PESSOA POR ID
  async findOne(id: number) {
    const person = await this.personRepository.findOne({
      where: {
        id,
      },
    });

    if (!person) {
      throw new BadRequestException(`Pessoa com o ID ${id} não encontrada`)
    }

    return person;
  }

  //ATUALIZAR DADOS DE UMA PESSOA
  async update(id: number, updatePersonDto: UpdatePersonDto, tokenPayload: TokenPayloadDto) {

    const personData = {
      name: updatePersonDto.name,
      // passwordHash: updatePersonDto.password
    }

    if(updatePersonDto?.password){
      const passwordHash = await this.hashingService.hash(updatePersonDto.password)

      personData['passwordHash'] = passwordHash
    }

    const person = await this.personRepository.preload({
      id,
      ...personData
    })

    if (!person) {
      throw new BadRequestException(`Pessoa com o ID ${id} não encontrada`)
    }

    if(person.id !== tokenPayload.sub) {
      throw new ForbiddenException('Voçê não é essa pessoa!')
    }

    return this.personRepository.save(person)
  }

  //DELETAR UMA PESSOA
  async remove(id: number, tokenPayload :TokenPayloadDto) {
    const person = await this.personRepository.findOneBy({
      id,
    });

    if(!person) {
      throw new BadRequestException(`Pessoa com o ID ${id} não encontrada`)
    }

    if(person.id !== tokenPayload.sub) {
      throw new ForbiddenException('Voçê não é essa pessoa!')
    }

    return this.personRepository.remove(person)

  }
}

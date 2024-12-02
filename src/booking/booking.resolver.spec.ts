import { Test, TestingModule } from '@nestjs/testing';
import { BookingResolver } from './booking.resolver';
import { BookingService } from './booking.service';
import { CreateBookingInput } from './dto/create-booking.input';

const mockBookingService = {
  create: jest.fn((dto) => {
    return { id: 1, ...dto };
  }),
  findAll: jest.fn(() => [
    {
      id: 1,
      user: 'John Doe',
      date: new Date('2025-12-14'),
      startTime: '14:00',
      endTime: '15:00',
    },
  ]),
  findOne: jest.fn((id) => {
    return {
      id,
      user: 'John Doe',
      date: new Date('2025-12-14'),
      startTime: '14:00',
      endTime: '15:00',
    };
  }),
  remove: jest.fn((id) => `Deletion success, deleted ID ${id}`),
};

describe('BookingResolver', () => {
  let resolver: BookingResolver;
  let service: BookingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingResolver,
        {
          provide: BookingService,
          useValue: mockBookingService,
        },
      ],
    }).compile();

    resolver = module.get<BookingResolver>(BookingResolver);
    service = module.get<BookingService>(BookingService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createBooking', () => {
    it('should create a new booking', async () => {
      const input: CreateBookingInput = {
        user: 'John Doe',
        date: new Date('2025-12-14'),
        startTime: '14:00',
        endTime: '15:00',
      };

      const result = await resolver.createBooking(input);

      expect(service.create).toHaveBeenCalledWith(input);
      expect(result).toEqual({ id: 1, ...input });
    });
  });

  describe('findAll', () => {
    it('should return all bookings', async () => {
      const result = await resolver.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([
        {
          id: 1,
          user: 'John Doe',
          date: new Date('2025-12-14'),
          startTime: '14:00',
          endTime: '15:00',
        },
      ]);
    });
  });

  describe('findOne', () => {
    it('should return a booking by id', async () => {
      const id = '1';
      const result = await resolver.findOne(id);

      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(result).toEqual({
        id: '1',
        user: 'John Doe',
        date: new Date('2025-12-14'),
        startTime: '14:00',
        endTime: '15:00',
      });
    });
  });

  describe('removeBooking', () => {
    it('should remove a booking by id', async () => {
      const id = '1';
      const result = await resolver.removeBooking(id);

      expect(service.remove).toHaveBeenCalledWith(id);
      expect(result).toEqual(`Deletion success, deleted ID 1`);
    });
  });
});

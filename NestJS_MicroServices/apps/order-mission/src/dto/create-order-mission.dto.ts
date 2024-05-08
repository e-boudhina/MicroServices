export class CreateOrderMissionDto {
  id : number;

  destination: string;

  departure_date: Date;

  return_date: Date;

  budget: number;

  status: string;

  materials : number;
}

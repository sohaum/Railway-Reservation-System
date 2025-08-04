export interface TrainClass {
  classType: string;
  seatsAvailable: number;
  ticketPrice: number;
}

export interface Train {
  trainNo: string;
  trainName: string;
  fromCity: string;
  toCity: string;
  trainType: string;
  frequency: string;
  departureDateTime: string;
  destinationDateTime: string;
  totalSeats: number;
  classes: TrainClass[];
}

// Legacy interface for backward compatibility
// export interface LegacyTrain {
//   trainName: string;
//   fromCity: string;
//   toCity: string;
//   seatsAvailable: number;
//   ticketPrices: {
//     economy: number;
//     business: number;
//     firstClass: number;
//   };
// }
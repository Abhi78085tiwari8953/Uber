// const captainModel = require('../models/captain.model');


// module.exports.createCaptain = async ({
//     firstname, lastname, email, password, color, plate, capacity, vehicleType
// }) => {
//     if (!firstname || !email || !password || !color || !plate || !capacity || !vehicleType) {
//         throw new Error('All fields are required');
//     }
//     const captain = captainModel.create({
//         fullname: {
//             firstname,
//             lastname
//         },
//         email,
//         password,
//         vehicle: {
//             color,
//             plate,
//             capacity,
//             vehicleType
//         }
//     })

//     return captain;
// }
const captainModel = require('../models/captain.model');

module.exports.createCaptain = async ({ fullname, email, password, vehicle }) => {
  if (
    !fullname?.firstname ||
    !fullname?.lastname ||
    !email ||
    !password ||
    !vehicle?.color ||
    !vehicle?.plate ||
    !vehicle?.capacity ||
    !vehicle?.vehicleType
  ) {
    throw new Error('All fields are required');
  }

  const captain = await captainModel.create({
    fullname,
    email,
    password,
    vehicle
  });

  return captain;
};

import mongoose from "mongoose";
import * as bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String },
  email: { type: String, required: true },
  password: { type: String, required: true },
  cellphone: { type: String },
  /* address: {type: mongoose.Schema.Types.ObjectId, ref:'adresses', required: true}, */
  address: {
    city: { type: String },
    state: { type: String },
    neighborhood: { type: String },
    street: { type: String },
    number: { type: Number },
    zipcode: { type: Number }

  },
  roles: {
    User: {
      type: Number,
      default: 4000
    },
    Employee: { type: Number },
    Editor: { type: Number },
    Admin: { type: Number }
  },
  refreshToken: { type: String },
  status: { type: Boolean }
});

const users = mongoose.model('users', userSchema);


users.countDocuments({}, (error, count) => {
  if (error) {
    console.error(error);
  } else {
    if (count === 0) {
      const initialUsers = [
        {
          firstName: "JohnUser",
          lastName: "Doe",
          email: "john@user.com",
          password: "classified123",
          cellphone: "(19)9999999999",
          roles: {
            User: 4000,
          },
        },
        {
          firstName: "JohnEmployee",
          lastName: "Doe",
          email: "john@employee.com",
          password: "classified321",
          cellphone: "(19)9999999999",
          roles: {
            User: 4000,
            Employee: 3000,
          },
        },
        {
          firstName: "JohnEditor",
          lastName: "Doe",
          email: "john@editor.com",
          password: "classified1556",
          cellphone: "(19)9999999999",
          roles: {
            User: 4000,
            Employee: 3000,
            Editor: 2000,
          },
        },
        {
          firstName: "JohnAdmin",
          lastName: "Doe",
          email: "john@admin.com",
          password: "classified1985",
          cellphone: "(19)9999999999",
          roles: {
            User: 4000,
            Employee: 3000,
            Editor: 2000,
            Admin: 1000,
          },
        },
      ];

      const saltRounds = 12;

      initialUsers.forEach(async (user) => {
        console.log('user', user, 'senha antes', user.password)
        const passwordHash = await bcrypt.hash(user.password, saltRounds);
        user.password = passwordHash;
        console.log(user.password)

        try {
          users.insertMany(user, (error, docs) => {
            if (error) {
              console.error(error);
            } else {
              console.log(`${docs.length} users were successfully inserted into the database.`);
            }
          });
        } catch (error) {
          console.log(error)
          return error
        }
      });
    }
  }
});




export default users;
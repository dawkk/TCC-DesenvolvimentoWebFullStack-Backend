import users from "../models/user.js"
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import verifyJWT from "../middlewares/verifyJWT.js";
import addresses from "../models/userAddressess.js";

class UserController {

  static listAllUsers = (req, res) => {
    users.find()
      /* .populate('address') */
      .exec((err, users) => {
        if (err) {
          return res.status(400).send({ message: `${err.message} - Id de usuario não encontrado. ` })
        } else {
          return res.status(200).json(users)
        }
      }
      )
  }

  static listUserById = async (req, res) => {
    const id = req.params.id;

    const user = await users.findById(id, '-password')
      .exec((err, users) => {

        if (err) {
          return res.status(400).send({ message: `${err.message} - Id do usuario não encontrado. ` })
        } else {
          return res.status(200).send(users)
        }

      }
      );
  }

  static createUser = async (req, res) => {
    const { firstName, lastName, email, password, cellphone, city, state, neighborhood, street, number, zipcode, additionalInfo } = req.body;

    const findUser = await users.findOne({ email });
    if (findUser) {
      return res.status(422).send({ message: "Por favor, utilize outro e-mail!" });
    }

    try {
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);
      const user = new users({
        firstName,
        lastName,
        cellphone,
        email,
        password: passwordHash
      });

      const savedUser = await user.save();

      const userAddress = new addresses({
        userId: savedUser._id,
        city,
        state,
        neighborhood,
        street,
        number,
        zipcode,
        additionalInfo
      });

      await userAddress.save();
      savedUser.addresses.push(userAddress._id);
      await savedUser.save();

      const objUser = savedUser.toJSON();
      delete objUser.password;

      return res.status(201).send(objUser);
    } catch (err) {
      return res.status(500).send({ message: `${err.message} - Falha ao cadastrar usuario.` });
    }
  }

  static updateUser = (req, res) => {
    const id = req.params.id;
    users.findByIdAndUpdate(id, "-password", { $set: req.body }, (err) => {
      if (!err) {
        return res.status(200).send({ message: 'usuario atualizado com sucesso!' })
      } else {
        return res.status(500).send({ message: err.message })
      }
    })
  }

  static deleteUser = (req, res) => {
    const id = req.params.id;
    users.findByIdAndDelete(id, (err) => {
      if (!err) {
        return res.status(200).send({ message: `usuario ${id} removido com sucesso!` })
      } else {
        return res.status(500).send({ message: err.message })
      }
    })
  }

  static listUserByEmail = (req, res) => {
    const email = req.query.email;
    users.find({ 'email': email }, {}, (err, users) => {
      if (!err) {
        return res.status(200).send(users)
      } else {
        return res.status(500).send({ message: err.message })
      }
    })
  }
  /* --------------------SELF GET AND PUT REQUESTS FOR USER ------------------------- */

  static listSelf = async (req, res) => {
    const id = req.id;
    users.findById(id, '-password')
      .exec((err, user) => {
        if (err) {
          return res.status(400).send({ message: `${err.message} - Id do usuario não encontrado. ` })
        } else {
          if (id !== user._id.toString()) {
            return res.status(403).send({ message: 'Não autorizado.' });
          } else {
            return res.status(200).send(user)
          }
        }
      });
  };

  static updateSelf = async (req, res) => {
    const id = req.id;
    const updatedFields = req.body;

    users.findByIdAndUpdate(id, { $set: updatedFields }, (err) => {
      if (!err) {
        return res.status(200).send({ message: 'usuario atualizado com sucesso!' });
      } else {
        return res.status(500).send({ message: err.message });
      }
    });
  }

  /* --------------------LOGIN------------------------- */

  static loginUser = async (req, res) => {
    const { password, email } = req.body;
    const findUser = await users.findOne({ email: req.body.email }).exec();
    if (!email) {
      return res.status(422).send({ message: "O email é obrigatório!" });
    } if (!password) {
      return res.status(422).send({ message: "A senha é obrigatória!" });
    } if (!findUser) {
      return res.status(401).send({ message: "E-mail não encontrado, por favor utilize outro e-mail!" });
    }
    const passwordMatch = await bcrypt.compare(req.body.password, findUser.password);
    if (!passwordMatch) {
      return res.status(422).json({ message: "Senha inválida" });
    } else {
      try {
        const roles = Object.values(findUser.roles).filter(Boolean);
        const payload = {
          "UserInfo": {
            "id": findUser._id,
            "roles": findUser.roles
          },
        };
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2h' });
        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });
        const id = findUser._id
        findUser.refreshToken = refreshToken;
        const updateUser = await findUser.save();
        updateUser;
        return res.cookie('jwt', accessToken, { httpOnly: true, maxAge: 2 * 60 * 60 * 1000 }).status(200).json({ message: "Autenticação realizada com sucesso!", accessToken, refreshToken, roles, id });

      } catch (err) {
        return res.status(401).json(err.message);
      }
    }
  }

  /* --------------------LOGOUT------------------------- */
  static logoutUser = async (req, res) => {

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);
    const refreshToken = cookies.jwt;

    const findUser = await users.findOne({ refreshToken }).exec();
    if (!findUser) {
      res.clearCookie('jwt', { httpOnly: true, secure: true });
      return res.sendStatus(204);
    }

    findUser.refreshToken = '';
    const result = await findUser.save();
    /*   console.log(result); */
    res.clearCookie('jwt', { httpOnly: true, secure: true });
    res.sendStatus(204).json({ message: "Logout realizado com sucesso!" });;
  }

  /* -------------------------ADDRESS------------------------- */

  static listUserAddress = async (req, res) => {
    const id = req.id;
    try {
      const user = await users.findById(id);
      if (!user) {
        return res.status(404).send({ message: "Usuário não encontrado" });
      }
      const addressIds = user.addresses;
      const addressesAll = await Promise.all(addressIds.map(async (addressId) => {
        const addressEach = await addresses.findById(addressId);
        return addressEach;
      }));
      return res.status(200).send(addressesAll);
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  };

  static listUserAddressById = async (req, res) => {
    const addressId = req.params.id;
    const findAddress = await addresses.findById(addressId)
      .exec((err, address) => {

        if (err) {
          return res.status(400).send({ message: `${err.message} - Id do endereço não encontrado. ` })
        } else {
          return res.status(200).send(address)
        }
      }
      );
  }


  static createUserAddress = async (req, res) => {
    const userId = req.id;
    try {
      const user = await users.findById(userId);
      if (!user) {
        return res.status(404).send({ message: "Usuário não encontrado" });
      }
      const address = new addresses({
        userId: userId,
        city: req.body.city,
        state: req.body.state,
        neighborhood: req.body.neighborhood,
        street: req.body.street,
        number: req.body.number,
        zipcode: req.body.zipcode,
        additionalInfo: req.body.additionalInfo,
        mainAddress: req.body.mainAddress
      });

      await address.save();
      user.addresses.push(address._id);
      await user.save();

      return res.status(200).send(address);
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  }

  static updateUserAddress = async (req, res) => {
    const addressId = req.params.id;
    const loggedUserId = req.id;

    try {
      const address = await addresses.findById(addressId);
      if (!address) {
        return res.status(404).send({ message: 'Endereço não encontrado.' });
      }

      const userId = address.userId;
      if (userId !== loggedUserId) {
        return res.status(403).send({ message: 'Você não tem permissão para atualizar este endereço.' });
      }

      await addresses.findByIdAndUpdate(addressId, { $set: req.body });

      return res.status(200).send({ message: 'Endereço atualizado com sucesso!' });
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  };


  static deleteUserAddress = async (req, res) => {
    const addressId = req.params.id;
    const loggedUserId = req.id;

    try {
      const address = await addresses.findById(addressId);
      if (!address) {
        return res.status(404).send({ message: 'Endereço não encontrado.' });
      }

      const userId = address.userId;
      if (userId !== loggedUserId) {
        return res.status(403).send({ message: 'Você não tem permissão para atualizar este endereço.' });
      }

      const user = await users.findById(loggedUserId);
      const addressIndex = user.addresses.findIndex(addr => addr._id == addressId);
      user.addresses.splice(addressIndex, 1);
      await user.save();

      await addresses.findByIdAndDelete(addressId)
      return res.status(200).send({ message: 'Endereço atualizado com sucesso!' });
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  };

  /* OAUTH */

}

export default UserController;
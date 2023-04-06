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
    let user = new users(req.body);
    const findUser = await users.findOne({ email: req.body.email });
    if (findUser) {
      return res.status(422).send({ message: "Por favor, utilize outro e-mail!" });
    } else {
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(req.body.password, salt);
      user.password = passwordHash;
      user.addresses.push(req.body.address);
      user.save((err) => {
        if (err) {
          return res.status(500).send({ message: `${err.message} - Falha ao cadastrar usuario.` })
        } else {
          const objUser = user.toJSON();
          delete objUser.password;
          return res.status(201).send(objUser);
        }
      })
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
    users.findByIdAndUpdate(id, { $set: req.body }, (err) => {
      if (!err) {
        return res.status(200).send({ message: 'usuario atualizado com sucesso!' })
      } else {
        return res.status(500).send({ message: err.message })
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
          }
        };
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });
        const id = findUser._id
        findUser.refreshToken = refreshToken;
        const updateUser = await findUser.save();
        updateUser;
        console.log(updateUser)

        return res.cookie('jwt', accessToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }).status(200).json({ message: "Autenticação realizada com sucesso!", accessToken, refreshToken, roles, id });

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

    /* ADDRESS */

    static listUserAddress = async (req, res) => {
      const id = req.id;
      try {
        const user = await users.findById(id);
        if (!user) {
          return res.status(404).send({ message: "Usuário não encontrado" });
        }
        const addresses = user.addresses;
        return res.status(200).send(addresses);
      } catch (err) {
        return res.status(500).send({ message: err.message });
      }
    };
  
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
      const id = req.id;
      const addressId = req.params.id;
      const update = req.body;
      const user = await users.findById(id);
      if (!user) {
        return res.status(404).send({ message: 'Usuário não encontrado.' });
      }
      const addressIndex = user.addresses.findIndex(addr => addr._id == addressId);
      if (addressIndex === -1) {
        return res.status(404).send({ message: 'Endereço não encontrado.' });
      }
      const address = user.addresses[addressIndex];
      address.city = update.city || address.city;
      address.state = update.state || address.state;
      address.neighborhood = update.neighborhood || address.neighborhood;
      address.street = update.street || address.street;
      address.number = update.number || address.number;
      address.zipcode = update.zipcode || address.zipcode;
      address.additionalInfo = update.additionalInfo || address.additionalInfo;
      address.mainAddress = update.mainAddress || address.mainAddress;
      await user.save();
      return res.status(200).send(address);
    };
  
    static deleteUserAddress = async (req, res) => {
      const userId = req.id;
      const addressId = req.params.id;
      try {
        const user = await users.findById(userId);
        if (!user) {
          return res.status(404).send({ message: 'Usuário não encontrado.' });
        }
        const addressIndex = user.addresses.findIndex(addr => addr._id == addressId);
        if (addressIndex === -1) {
          return res.status(404).send({ message: 'Endereço não encontrado.' });
        }
        user.addresses.splice(addressIndex, 1);
        await user.save();
    
        return res.status(200).send({ message: 'Endereço removido com sucesso.' });
      } catch (err) {
        return res.status(500).send({ message: err.message });
      }
    };
}

export default UserController;
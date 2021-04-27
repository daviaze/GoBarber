import * as Yup from 'yup'
import jwt from 'jsonwebtoken'

import authConfig from '../../config/auth'
import User from '../models/User'

class SessionController {
    async store(req, res){

        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            password: Yup.string().required()
        });

        if (!(await schema.isValid(req.body))){
            return res.status(400).json({error: "Erro de validação"})
        }

        const { email, password } = req.body;

        const user = await User.findOne({where: {email: email}}) //Verificando se o usuário existe

        if (!user) {
            return res.status(401).json({error: 'Usuário inexistente!'})
        }

        if (!(await user.checkPassword(password))){
            return res.status(401).json({error: 'Senha errada!'})
        }

        const { id, name } = user;

        return res.json({
            user: {
                id,
                name, 
                email,
            },
            token: jwt.sign({ id }, authConfig.secret, {
                expiresIn: authConfig.expiresIn,
            } )
        })
    }
}

export default new SessionController();
import Sequelize, {Model} from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
    static init(sequelize){
        super.init(
            {
                name: Sequelize.STRING,
                email: Sequelize.STRING,
                password: Sequelize.VIRTUAL, //virtual, dado que não será salvo no banco de dados
                password_hash: Sequelize.STRING,
                provider: Sequelize.BOOLEAN,
            },
            {
                sequelize,
            }
        );

        this.addHook('beforeSave', async user => { //antes de ser salvo, será feito feito a criptografia da senha do usuário
            if (user.password){
                user.password_hash = await bcrypt.hash(user.password, 8);
            }

        });

        return this;
    }

    checkPassword(password){
        return bcrypt.compare(password, this.password_hash)
    }
}

export default User;
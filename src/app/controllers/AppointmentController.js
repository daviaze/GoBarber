import * as Yup from 'yup';
import {startOfHour, parseISO, isBefore} from 'date-fns'
import User from './../models/User'
import Appointment from './../models/Appointment'


class AppointmentControoler {
    async store(req, res){

        const schema = Yup.object().shape({
            provider_id: Yup.number().required(),
            date: Yup.date().required()
        
        });

        if (!(await schema.isValid(req.body))){
            return res.status(400).json({error: "Erro de validação"})
        }

        const { provider_id, date} = req.body;

        const isProvider = await User.findOne({
            where: { id: provider_id, provider: true},

        });

        if (!isProvider){
            return res.status(401).json({ error: "Acesso restrito"})
        }

        const hourStart = startOfHour(parseISO(date));

        //checando se a data é no passado
        if (isBefore(hourStart, new Date())){
            return res.status(400).json({ error: "Data inválida para agendamento!"})
        }

        //chegado se tem disponibilidade pra agendamento
        const checkAvailability = await Appointment.findOne({
            where: {
                provider_id: provider_id,
                canceled_at: null,
                date: hourStart,
            }
        });

        if (checkAvailability) {
            return res.status(400).json({ error: "Sem vagas para essa data, marque outra"})
        }

        const appointment = await Appointment.create({
            user_id: req.userId,
            provider_id,
            date,
        });

        return res.json(appointment);
    }
}

export default new AppointmentControoler()
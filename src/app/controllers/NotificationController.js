import Notification from '../schemas/Notification'
import User from './../models/User'

class NotificationController {

    async index(req, res){

        const isProvider = await User.findOne({
            where: { id: req.userId, provider: true},
        });

        if (!isProvider){
            return res.status(401).json({ error: "Só prestadores de serviço podem ler as notificações"})
        }

        const notifications = await Notification.find({
            user: req.userId,
          })
            .sort({ createAt: 'desc' })
            .limit(20);
        
        return res.json(notifications)
    }

    async update(req, res) {
        const notification = await Notification.findByIdAndUpdate(
          req.params.id,
          {
            read: true,
          },
          { new: true }
        );
    
        return res.json(notification);
    }
}

export default new NotificationController();
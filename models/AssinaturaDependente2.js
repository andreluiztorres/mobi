const mongoose = require('mongoose')
const Schema = require('mongoose').Schema;

const AssinaturaDependente5 = mongoose.model('AssinaturaDependente5', {
    assinatura:[
        {type: Schema.Types.ObjectId, ref: 'Assinatura'}
    ],
    usuario:[
        {type: Schema.Types.ObjectId, ref: 'User'}
    ],
    data_criacao: Date,
    data_remocao: {
        type: Date,
        required: function() {
            return this.data_remocao? true : false 
        }
    }
})

module.exports = AssinaturaDependente5
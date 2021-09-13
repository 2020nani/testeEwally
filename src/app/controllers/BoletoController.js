import verificaBoleto from '../../Utils/VerificaBoleto'

class BoletoController {


    async consultarBoleto(req, res) {
        var validaSoNumeros = new RegExp('^[0-9]+$');
        if(!validaSoNumeros.test(req.params.linha_digitavel) || req.params.linha_digitavel.length != 47){
            return res.status(400).json({ error: 'linha digitavel deve conter apenas numeros e 47 digitos' });
        }
        const {boleto, confirmaLinhaDigitavel, amount ,expirationDate} = verificaBoleto(req.params.linha_digitavel)

        return res.json({
            barCode,
            amount,
            expirationDate
        });


    }

}

export default new BoletoController();

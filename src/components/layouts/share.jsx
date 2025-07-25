import { WhatsappShareButton, WhatsappIcon } from 'react-share';
import {FormattedMessage, useIntl} from 'react-intl';

function Share(props) { 
    const intl = useIntl();
    const integrantes = props.integrantes;
    const deudas = props.transactions;
    const total  = props.total;
    const cadaUno = props.cadaUno;

    const text = 
`*${intl.formatMessage({ id: "share.titulo" })}*\n
${integrantes.map((transaction) => (
    `${intl.formatMessage({ id: 'share.puso' }, { valor1: transaction.nombre, valor2: transaction.cuanto })}\n`
)).join('')}
${intl.formatMessage({ id: "general.en_total" })}: *$${total}*
${intl.formatMessage({ id: "general.cada_uno" })}: *$${cadaUno}*\n
${deudas.map((transaction) => (
    `${intl.formatMessage({ id: 'share.debe_pagar' }, { valor1: transaction.from, valor2: transaction.amount, valor3: transaction.to })}\n`
)).join('')}
_${intl.formatMessage({ id: "share.cortesia" })}_`;
    const url = 'https://cuentas-claras-cili.onrender.com/';
      return (
        <>
            <WhatsappShareButton title={text} url={url} separator=":: " className='mb-4'>
                <p className='flex m-auto items-center text-2xl sm:text-xl'><FormattedMessage id="general.enviar_por" defaultMessage="Enviar por:"/> <WhatsappIcon size={40} round className='ml-2' /></p>
            </WhatsappShareButton>
        </>
    )
}

export default Share

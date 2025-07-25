import { useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { HiArrowNarrowRight } from "react-icons/hi";
import {FormattedMessage, useIntl} from 'react-intl';
import Share from "../layouts/share";

export default function Calculador(){

    const intl = useIntl();
    const [integrantes, setintegrantes] = useState([]);
    const [nombre, setNombre] = useState(""); 
    const [cuanto, setCuanto] = useState(0); 
    const [errorCalculo, setErrorCalculo] = useState(false);
    const [calculado, setCalculado] = useState(false);
    const [total, setTotal] = useState(0);
    const [cadaUno, setCadaUno] = useState(0);
    const [transactions, setTransactions] = useState([]);

    const calcular = () => {
        event.preventDefault();
        if(integrantes.length < 2){
            setErrorCalculo(true);
        }else{
            let fullTotal = 0;
            integrantes.map((integrante) => {
                fullTotal = fullTotal + integrante.cuanto;
            });
            let cadaUno = formatNumber(fullTotal/integrantes.length);
            {integrantes.map((person) => (
                person.balance = formatNumber(person.cuanto - cadaUno)
            ))}
            setCadaUno(cadaUno);
            setTotal(fullTotal);
            calculateBalances(integrantes, cadaUno);
            calculateTransactions(integrantes);
            setErrorCalculo(false);
            setCalculado(true);
        }
    }
    
    const calculateBalances = () => {
        const total = integrantes.reduce((sum, person) => sum + person.cuanto, 0);
        const promedio = total / integrantes.length;
        // Calcula el balance para cada persona
        let newArray = [];
        integrantes.map((person) => {
            const diferendo = formatNumber(person.cuanto - promedio);
            newArray.push({
                nombre: person.nombre,
                cuanto: person.cuanto,
                balance: diferendo,
            });
            return newArray;
        });
    };

    const deleteItem = (posicion) => {
        const nuevosDatos = integrantes.filter((item, index) => index !== posicion);
        setintegrantes(nuevosDatos);
        }
    
    function handleSubmit(event) {
        event.preventDefault();
        setintegrantes([...integrantes, {nombre, cuanto}]);
        setErrorCalculo(false);
        setNombre("")
        setCuanto(0);
    }

    const reset = () => {
        setintegrantes([]);
        setTotal(0)
        setCalculado(false);
    }

    const calculateTransactions = (balances) => {
        const creditors = balances.filter((person) => person.balance > 0);
        const debtors = balances.filter((person) => person.balance < 0);
    
        let tempTransactions = [];
    
        debtors.forEach((debtor) => {
          let amountOwed = Math.abs(debtor.balance);
    
          creditors.forEach((creditor) => {
            if (amountOwed > 0 && creditor.balance > 0) {
              const payment = formatNumber(Math.min(amountOwed, creditor.balance));
              tempTransactions.push({
                from: debtor.nombre,
                to: creditor.nombre,
                amount: payment,
              });
              amountOwed -= payment;
              creditor.balance -= payment; // Actualizar localmente para continuar con el cálculo
            }
          });
        });
    
        setTransactions(tempTransactions);
    };

    function formatNumber(num) {
        return num % 1 === 0 ? num.toString() : num.toFixed(2);
    }
    return (
        <form className="mt-14" onSubmit={handleSubmit}>
            {!calculado ?
                <>
                    <h1 id="subTitulo" className="mt-3 mb-5 text-2xl text-center mb-10">
                        <FormattedMessage id="general.pregunta_cuanto" defaultMessage="¿Cuánto puso cada uno/a?"/>
                    </h1>
                    <div className="grid gap-6 mb-6 space-x-4 md:grid-cols-6">
                        <div className="col-span-3 ...">
                            <input type="text" name="nombre" autoComplete="off" placeholder={intl.formatMessage({ id: "general.nombre" })} value={nombre} onChange={(e) => setNombre(e.target.value)} className="bg-white shadow-lg shadow-2xl text-gray-900 text-lg rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-grey dark:focus:ring-gray-100 dark:focus:border-gray-100" required />
                        </div>
                        <div className="col-span-2 ...">
                            <input type="number" min="0" placeholder={intl.formatMessage({ id: "general.cuanto" })} value={cuanto > 0 && cuanto} onChange={(e) => setCuanto(parseInt(e.target.value))} name="cuanto" className="bg-white shadow-lg shadow-2xl text-gray-900 text-lg rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-grey dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        </div>
                        <div>
                            <button type="submit" className="btn btn-dark btn-circle text-2xl">+</button>
                        </div>
                    </div>
                    <div className="grid gap-6 mt-14 mb-6 md:grid-cols-6">
                            {
                            integrantes.map((integrante, index) => (
                                <div key={index} className="flex flex-wrap flex-row items-center justify-between p-4 bg-white shadow-lg shadow-2xl text-gray-900 text-lg rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-grey dark:focus:ring-blue-500 dark:focus:border-blue-500 col-span-2 ...">
                                    <span className="basis-11/12 text-xl">{integrante.nombre}</span>
                                    <span className="basis-1/12 text-red-500 cursor-pointer"><FaRegTrashAlt onClick={(e) => deleteItem(index)} /></span>
                                    <span className="basis-full text-xl mt-2">${integrante.cuanto}</span>
                                </div>
                            ))}
                    </div>
                </>
            :
                <div className="flex flex-wrap flex-col items-center">
                    <div className="w-full block sm:flex flex-row justify-items-center mb-10">
                        {
                        integrantes.map((integrante, index) => (
                            <div key={index} className="flex flex-col sm:flex-row sm:w-auto items-center justify-between m-2 px-4 py-2 bg-white shadow-lg shadow-2xl text-gray-900 text-base rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-grey">
                                <span className="basis-6/12 text-base sm:text-xl">{integrante.nombre}</span>
                                <span className="basis-6/12 text-base sm:text-xl sm:ml-4">${integrante.cuanto}</span>
                            </div>
                        ))}
                    </div>
                    <span className="text-2xl sm:text-4xl"><FormattedMessage id="general.en_total" defaultMessage="En total gastaron"/> ${total}</span>
                    <span className="text-4xl sm:text-4xl mt-6 mb-14">(${cadaUno} <FormattedMessage id="general.cada_uno" defaultMessage="cada uno/a"/>)</span>

                    <span className="text-2xl mb-4 mt-2"><FormattedMessage id="general.saldo" defaultMessage="Ajustes de Saldos"/></span>
                    {transactions.map((transaction, index) => (
                        <div className="grid gap-6 mb-6 mt-4 w-full space-x-2 sm:space-x-4 grid-cols-6" key={`${index}`}>
                            <div className="bg-white shadow-lg shadow-2xl px-4 sm:px-20 text-gray-900 text-center text-base sm:text-3xl rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full py-4 dark:bg-white dark:border-gray-600  dark:text-grey dark:focus:ring-gray-100 dark:focus:border-gray-100 col-span-2 ...">
                                {transaction.from}
                            </div>
                            <div className="flex flex-row items-center justify-center text-gray-900 text-base sm:text-2xl block w-full py-4 col-span-2 ...">
                                ${transaction.amount} <HiArrowNarrowRight className="ml-4" />
                            </div>
                            <div className="bg-white shadow-lg shadow-2xl px-4 sm:px-20 text-gray-900 text-center text-base sm:text-3xl rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full py-4  dark:bg-white dark:border-gray-600  dark:text-grey dark:focus:ring-gray-100 dark:focus:border-gray-100 col-span-2 ...">
                                {transaction.to}
                            </div>
                        </div>
                    ))}
                </div>
            }
            <div className="mt-12 mb-10 text-center">
                {errorCalculo &&
                    <span className="text-base text-red-500">
                        <FormattedMessage id="general.calcular_aviso" defaultMessage="Debe haber al menos 2 participantes."/>
                    </span>
                }
                {calculado ?
                    <>
                        <Share integrantes={integrantes} transactions={transactions} total={total} cadaUno={cadaUno}/>
                        <button type="button" onClick={reset} className="flex items-center m-auto mt-5 justify-center text-white bg-orange-400 hover:bg-orange-600 focus:ring-2 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xl w-auto px-16 py-2.5 text-center dark:bg-orange-400 dark:hover:bg-orange-500 dark:focus:ring-orange-600"><FormattedMessage id="general.calcular_otro" defaultMessage="Hacer otro calculo"/></button>
                    </>
                    :
                    <button type="button" onClick={calcular} className="flex items-center m-auto mt-3 justify-center text-white bg-orange-400 hover:bg-orange-600 focus:ring-2 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xl w-auto px-16 py-2.5 text-center dark:bg-orange-400 dark:hover:bg-orange-500 dark:focus:ring-orange-600"><FormattedMessage id="general.calcular" defaultMessage="Calcular"/></button>
                }
            </div>
        </form>

    )
}
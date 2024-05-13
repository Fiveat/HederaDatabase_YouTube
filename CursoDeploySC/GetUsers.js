const { Client, ContractCallQuery, Hbar, ContractId, PrivateKey, ContractFunctionParameters, } = require("@hashgraph/sdk"); //<- Importamos todas las librerías.




//Función para generar la interacctuación con el usuario por consola
const askQuestion = (question) => {
    //Importamos librería para añadir interacción con la terminal
    const readline = require("readline").createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise(resolve => readline.question(question, ans => {
        readline.close();
        resolve(ans);
    }));
}

//Función para añadir los datos (usuarios) a nuestra Base de Datos (SmartContract)
const getUserFromContract = async () => {
    const client = Client.forTestnet();

    //Podemos preguntar al usuario por sus credenciales con la función "Readline" pero las dejo definidas por código
    //OJOCUIDAO!!!! Este sistema NOOOOO cumple seguridad. Recordemos usar variables externas con el sistema ".env"
    const accountId = "0.0.1317";
    const PrivateKeyHex = "0x6e4485979cfda4a74cd92fea21c38e7f7c833caa32a82ea0e689e9e947d961a3";
    const privateKey = PrivateKey.fromStringED25519(PrivateKeyHex)

    client.setOperator(accountId, privateKey);

    //Definimos la dirección del SmartContract desplegado en el vídeo anterior
    const contractId = "0.0.3990210"; //Recordad que esta dirección será diferente y debeis utilizar vuestro ID de SmartContract desplegado :)

    //Preguntamos por el usuario (en base al ID) que queremos recuperar)
    const userId = await askQuestion("Introduce el ID de usuario a consultar: "); //Especificamos integer ya que así es como hemos definido el "userId" en nuestro código de Remix
    

    const contractIdObj = ContractId.fromString(contractId);


    //Intentamos registrar los valores...
    //¿Habrá suerte? :)
    try {
        //Creamos y configuramos la consulta (query) a ejecutar sobre el contracto
        const query = new ContractCallQuery()
            .setContractId(contractId)
            .setGas(100000)
            .setFunction("getUser", new ContractFunctionParameters().addUint256(parseInt(userId))) //Llamamos a la función "getUser" enviándo el parámetro "UserID"
            .setQueryPayment(new Hbar(2));

        //Ejecutar la consulta (una especie de RUN)
        const result = await query.execute(client);

        //Reordenamos/decodificamos la repsuesta devuelta
        const userName = result.getString(0);
        const userNote = result.getUint256(1); //Aseguraos de que el índice es el correcto.



        console.log(`El nombre de usuario es: ${userName}, su nota es: ${userNote}`);
        //Cerramos el proceso despues de imprimir (console.log) el resultado.
        process.exit(0);
        return {userName,userNote};
    } catch (error) {
        console.error("Error al ejecutar la transacción:", error);
        throw error;
    }

    
};

//Fallo de comando
getUserFromContract().catch(error => {
    console.error("Error:", error);
    process.exit(1)
})
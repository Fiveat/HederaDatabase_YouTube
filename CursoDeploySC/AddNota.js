const {Client, ContractExecuteTransaction, Hbar, ContractId, PrivateKey, ContractFunctionParameters,} = require("@hashgraph/sdk"); //<- Importamos todas las librerías.

//Importamos librería para añadir interacción con la terminal
const readline = require("readline");

//Creamos la interfaz de readline (interactuar con terminal)
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

//Función para generar la interacctuación con el usuario por consola
function askQuestion(query) {
    return new Promise(resolve => rl.question(query,resolve));
}

//Función para añadir los datos (usuarios) a nuestra Base de Datos (SmartContract)
async function addUserToContract() {
    const client = Client.forTestnet();

    //Podemos preguntar al usuario por sus credenciales con la función "Readline" pero las dejo definidas por código
    //OJOCUIDAO!!!! Este sistema NOOOOO cumple seguridad. Recordemos usar variables externas con el sistema ".env"
    const accountId = "0.0.1317";
    const PrivateKeyHex ="0x6e4485979cfda4a74cd92fea21c38e7f7c833caa32a82ea0e689e9e947d961a3";
    const privateKey = PrivateKey.fromStringED25519(PrivateKeyHex)

    client.setOperator(accountId,privateKey);

    //Definimos la dirección del SmartContract desplegado en el vídeo anterior
    const contractId = "0.0.3990210"; //Recordad que esta dirección será diferente y debeis utilizar vuestro ID de SmartContract desplegado :)

    //Empieza la ronda de preguntas con la terminal..
    const userId = await askQuestion("Introduce el ID de usuario (integer): "); //Especificamos integer ya que así es como hemos definido el "userId" en nuestro código de Remix
    const userName =await askQuestion("Introduce el nombre del usuario: ");
    const userNote =await askQuestion("Introduce la nota del usuario (integer): ");

        const contractIdObj = ContractId.fromString(contractId);
        const gas = 100000 //El gas en este caso está aleatorio por ser testnet :)

    //Intentamos registrar los valores...
    //¿Habrá suerte? :)
    try {
        //Preparamos los datos de la función de escritura
        const functionParameters = new ContractFunctionParameters()
            .addUint256(parseInt(userId,10)) //Convertimos el String en decimal (base diez) (De ahí dez..diez..)
            .addString(userName)
            .addUint256(parseInt(userNote,10));

        //Creamos y enviamos la transacción ya habiendo definido los parámetros
        const contractExecTx = await new ContractExecuteTransaction()
            .setContractId(contractIdObj)
            .setGas(gas)
            .setFunction("addUser", functionParameters) //En SQL sería similar a "INSERT INTO DBO.BDD (VAR1,VAR2,...) VALUES (@VAR1, @VAR2, @...)"
            .setMaxTransactionFee(new Hbar(10))
            .execute(client);

        const recipt = await contractExecTx.getReceipt(client); //Esperamos a la respuesta devuelta por la red de Hedera
        console.log(`Estado de la transacción: ${recipt.status.toString()}`);
    } catch (error) {
        console.error("Error al ejecutar la transacción:", error);
    } finally {
        rl.close();
    }

    //Cerramos el proceso con el resultado
    process.exit(0);
}

//Fallo de comando
addUserToContract().catch(error => {
    console.error("Error:", error);
    process.exit(1)
})
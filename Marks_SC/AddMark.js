    const {
        Client,
        ContractExecuteTransaction,
        Hbar,
        ContractId,
        PrivateKey,
        ContractFunctionParameters, // Sigue siendo necesario para pasar parámetros
    } = require("@hashgraph/sdk");
    
    const readline = require("readline");
    
    // Crea una interfaz readline
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    // Función para hacer preguntas al usuario
    function askQuestion(query) {
        return new Promise(resolve => rl.question(query, resolve));
    }
    
    async function setStoredData() {
        const client = Client.forTestnet();
    
        // Solicita al usuario que ingrese las credenciales
        const accountId = await askQuestion("Ingrese su Account ID (ejemplo: 0.0.1234): ");
        const privateKeyHex = await askQuestion("Ingrese su clave privada HEX: ");
        
        // El Contract ID es fijo según la modificación solicitada
        const contractId = "0.0.3637239"; // Asegúrate de actualizar esto al ID correcto de tu contrato
    
        const dataValue = await askQuestion("Ingrese el valor a almacenar (integer): ");
        
        const privateKey = PrivateKey.fromString(privateKeyHex);
        client.setOperator(accountId, privateKey);
    
        const contractIdObj = ContractId.fromString(contractId);
        const gas = 100000; // Ajusta el gas según sea necesario
    
        try {
            // Prepara los parámetros de la función para establecer el valor
            const functionParameters = new ContractFunctionParameters()
                .addUint256(parseInt(dataValue, 10));
    
            // Crea y envía la transacción para llamar a la función set del contrato
            const contractExecTx = await new ContractExecuteTransaction()
                .setContractId(contractIdObj)
                .setGas(gas)
                .setFunction("set", functionParameters) // Usa set con el valor proporcionado
                .setMaxTransactionFee(new Hbar(2)) // Ajusta según sea necesario
                .execute(client);
    
            const receipt = await contractExecTx.getReceipt(client);
            console.log(`Estado de la transacción: ${receipt.status.toString()}`);
        } catch (error) {
            console.error("Error al ejecutar la transacción:", error);
        } finally {
            rl.close();
        }
    }
    
    setStoredData().catch(console.error);
    
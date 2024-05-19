import { Client, ContractCallQuery,Hbar, ContractId, PrivateKey, ContractFunctionParameters} from "@hashgraph/sdk";

async function getUserFromContract(userId) {
    const client = Client.forTestnet();

    //Copiamos y pegamos las credenciales :)
    const accountId = "0.0.1317";
    const PrivateKeyHex = "0x6e4485979cfda4a74cd92fea21c38e7f7c833caa32a82ea0e689e9e947d961a3";
    const privateKey = PrivateKey.fromStringED25519(PrivateKeyHex)

    client.setOperator(accountId, privateKey);

    const contractId = "0.0.3990210";
    const contractIdObj = ContractId.fromString(contractId);
    const gas = 100000;

    //Empieza lo bueno
    try{
        const query = new ContractCallQuery()
            .setContractId(contractId)
            .setGas(gas)
            .setFunction("getUser", new ContractFunctionParameters().addUint256(parseInt(userId)))
            .setQueryPayment(new Hbar(2));

        const result = await query.execute(client);
        const userName = result.getString(0);
        const userNote = result.getUint256(1);

        //¿Os suena todo lo de arriba?
        //...

        console.log(`El nombre de usuario es: ${userName}, su nota es: ${userNote}`);
        return {userName, userNote};

        //¿Os suena, verdad?
    } catch (error) {
        console.error("Error al ejecutar la transacción", error);
        throw error;
    }
}

export {getUserFromContract };